# -*- coding: utf-8 -*-
import logging
from dateutil.relativedelta import relativedelta
from odoo import models, fields, api, _
from odoo.exceptions import UserError

_logger = logging.getLogger(__name__)


class BrightloopBillingWizard(models.TransientModel):
    _name = 'brightloop.billing.wizard'
    _description = 'Brightloop Run Billing Now Wizard'

    as_of_date = fields.Date(
        string='As Of Date',
        required=True,
        default=fields.Date.context_today,
        help='Evaluate and run recurring billing for all active subscriptions due on or before this date.'
    )

    def action_run_billing(self):
        """Execute recurring billing run as of the specified date."""
        self.ensure_one()
        return self.env['brightloop.subscription'].run_billing_engine(as_of_date=self.as_of_date)


class BrightloopSubscription(models.Model):
    _inherit = 'brightloop.subscription'

    @api.model
    def _cron_recurring_billing(self):
        """Scheduled action: runs daily recurring billing as of today."""
        today = fields.Date.context_today(self)
        _logger.info("Executing Brightloop daily recurring billing cron for %s...", today)
        return self.run_billing_engine(as_of_date=today)

    def _get_next_period_date(self, current_date, billing_period):
        """
        Advance date by plan period:
        - daily: +1 day
        - weekly: +7 days
        - monthly: +1 calendar month (clamped to month end)
        - yearly: +1 calendar year
        """
        if not current_date:
            return False
        if billing_period == 'daily':
            return current_date + relativedelta(days=1)
        elif billing_period == 'weekly':
            return current_date + relativedelta(weeks=1)
        elif billing_period == 'monthly':
            return current_date + relativedelta(months=1)
        elif billing_period == 'yearly':
            return current_date + relativedelta(years=1)
        return current_date + relativedelta(months=1)

    def _find_best_discount_for_line(self, as_of_date, line_qty, line_amount, product):
        """
        Evaluate all active discounts and pick the SINGLE best discount (highest deduction).
        No stacking.
        """
        discounts = self.env['brightloop.discount'].search([('active', '=', True)])
        best_discount = None
        best_deduction = 0.0

        for disc in discounts:
            if disc.is_eligible(as_of_date, line_qty=line_qty, line_amount=line_amount, product=product):
                deduction = disc.compute_discount_amount(line_amount)
                if deduction > best_deduction:
                    best_deduction = deduction
                    best_discount = disc

        return best_discount, best_deduction

    @api.model
    def run_billing_engine(self, as_of_date=None):
        """
        Core Recurring Billing Engine:
        1. Find all active subscriptions with next_billing_date <= as_of_date.
        2. Handle auto-close on expiry if plan has auto_close=True.
        3. Check idempotency: if billing period record already exists, skip!
        4. In an isolated transaction savepoint per subscription:
           - Build customer invoice (account.move out_invoice) with snapshotted prices, taxes, payment terms.
           - Apply best promotional discount automatically.
           - Create billing period idempotency record.
           - Advance next_billing_date.
        5. Return structured result message: 'created N, skipped M (already billed), errors K'.
        """
        if not as_of_date:
            as_of_date = fields.Date.context_today(self)

        created_count = 0
        skipped_count = 0
        error_count = 0
        closed_count = 0
        error_messages = []

        # Find eligible subscriptions
        subscriptions = self.search([
            ('state', '=', 'active'),
            ('is_paused', '=', False),
            ('next_billing_date', '<=', as_of_date),
        ])

        for sub in subscriptions:
            # 1. Check auto-close past expiry
            if sub.expiry_date and sub.expiry_date < as_of_date and sub.plan_id.auto_close:
                sub.write({
                    'state': 'closed',
                    'close_date': as_of_date,
                })
                sub.message_post(body=_("Subscription auto-closed due to plan expiration on %s.", sub.expiry_date))
                closed_count += 1
                continue

            # 2. Check if already billed for this billing period (Idempotency)
            period_start = sub.next_billing_date
            existing_period = self.env['brightloop.billing.period'].search([
                ('subscription_id', '=', sub.id),
                ('period_start', '=', period_start)
            ], limit=1)

            if existing_period:
                skipped_count += 1
                continue

            # 3. Process in an isolated savepoint so one failure does not halt the batch
            try:
                with self.env.cr.savepoint():
                    invoice_lines = []
                    applied_discounts = []

                    for line in sub.line_ids:
                        base_line_amount = line.qty * line.unit_price
                        disc, deduction = self._find_best_discount_for_line(
                            as_of_date,
                            line_qty=line.qty,
                            line_amount=base_line_amount,
                            product=line.product_id
                        )

                        line_name = line.product_id.display_name
                        if line.variant_info:
                            line_name += f" ({line.variant_info})"
                        if disc:
                            line_name += f" [Discount: {disc.name}]"
                            applied_discounts.append(disc)

                        # Unit price after discount deduction per item
                        discount_percentage = (disc.value if disc and disc.type == 'percent' else (deduction / base_line_amount * 100.0 if base_line_amount > 0 and disc else 0.0))

                        invoice_lines.append((0, 0, {
                            'product_id': line.product_id.id,
                            'name': line_name,
                            'quantity': line.qty,
                            'price_unit': line.unit_price,
                            'discount': discount_percentage,
                            'tax_ids': [(6, 0, line.tax_ids.ids)],
                            'brightloop_discount_name': disc.name if disc else False,
                        }))

                    # Create Customer Invoice
                    invoice_vals = {
                        'move_type': 'out_invoice',
                        'partner_id': sub.customer_id.id,
                        'invoice_date': as_of_date,
                        'invoice_payment_term_id': sub.payment_term_id.id if sub.payment_term_id else False,
                        'subscription_id': sub.id,
                        'billing_job': True,
                        'currency_id': sub.currency_id.id,
                        'invoice_line_ids': invoice_lines,
                    }
                    invoice = self.env['account.move'].create(invoice_vals)

                    # Update discount usage counts
                    for disc in set(applied_discounts):
                        disc.used_count += 1

                    # Record billing period idempotency lock
                    next_period = self._get_next_period_date(period_start, sub.plan_id.billing_period)
                    self.env['brightloop.billing.period'].create({
                        'subscription_id': sub.id,
                        'period_start': period_start,
                        'period_end': next_period,
                        'invoice_id': invoice.id,
                    })

                    # Advance subscription next_billing_date
                    sub.write({'next_billing_date': next_period})
                    sub.message_post(body=_(
                        "Recurring billing generated invoice <a href='#' data-oe-model='account.move' data-oe-id='%d'>%s</a>. Next billing date: %s.",
                        invoice.id, invoice.name or _('Draft'), next_period
                    ))

                    created_count += 1

            except Exception as e:
                error_count += 1
                err_msg = f"Subscription {sub.number}: {str(e)}"
                error_messages.append(err_msg)
                _logger.error("Billing error for subscription %s: %s", sub.number, e, exc_info=True)

        summary_message = _("created %d, skipped %d (already billed), errors %d", created_count, skipped_count, error_count)
        if closed_count:
            summary_message += _(" (auto-closed %d expired)", closed_count)
        if error_messages:
            summary_message += f"\nDetails:\n" + "\n".join(error_messages[:5])

        _logger.info("Billing engine run complete: %s", summary_message)

        return {
            'type': 'ir.actions.client',
            'tag': 'display_notification',
            'params': {
                'title': _('Billing Engine Execution'),
                'message': summary_message,
                'type': 'success' if error_count == 0 else 'warning',
                'sticky': False,
            }
        }
