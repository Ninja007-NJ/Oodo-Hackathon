# -*- coding: utf-8 -*-
import logging
from odoo import models, fields, api, _
from odoo.exceptions import UserError, ValidationError

_logger = logging.getLogger(__name__)


class BrightloopSubscription(models.Model):
    _name = 'brightloop.subscription'
    _description = 'Brightloop Subscription'
    _inherit = ['mail.thread', 'mail.activity.mixin']
    _order = 'number desc, id desc'

    number = fields.Char(
        string='Subscription Number',
        required=True,
        copy=False,
        readonly=True,
        index=True,
        default=lambda self: _('New')
    )
    customer_id = fields.Many2one(
        'res.partner',
        string='Customer',
        required=True,
        index=True,
        tracking=True
    )
    plan_id = fields.Many2one(
        'brightloop.plan',
        string='Subscription Plan',
        required=True,
        tracking=True
    )
    template_id = fields.Many2one(
        'brightloop.quote.template',
        string='Quote Template',
        copy=False
    )
    start_date = fields.Date(
        string='Start Date',
        required=True,
        default=fields.Date.context_today,
        tracking=True
    )
    expiry_date = fields.Date(
        string='Expiry Date',
        index=True,
        tracking=True
    )
    payment_term_id = fields.Many2one(
        'account.payment.term',
        string='Payment Terms'
    )
    state = fields.Selection(
        [
            ('draft', 'Draft'),
            ('quotation', 'Quotation'),
            ('confirmed', 'Confirmed'),
            ('active', 'Active'),
            ('closed', 'Closed'),
        ],
        string='Status',
        required=True,
        default='draft',
        index=True,
        tracking=True
    )
    is_paused = fields.Boolean(
        string='Is Paused',
        default=False,
        tracking=True,
        help='Indicates if active subscription billing is temporarily paused.'
    )
    next_billing_date = fields.Date(
        string='Next Billing Date',
        index=True,
        tracking=True
    )
    is_renewed = fields.Boolean(
        string='Is Renewed',
        default=False,
        copy=False,
        tracking=True
    )
    close_date = fields.Date(
        string='Close Date',
        readonly=True,
        copy=False,
        tracking=True
    )

    line_ids = fields.One2many(
        'brightloop.subscription.line',
        'subscription_id',
        string='Subscription Lines',
        copy=True
    )
    currency_id = fields.Many2one(
        'res.currency',
        string='Currency',
        default=lambda self: self.env.company.currency_id.id
    )

    invoice_ids = fields.One2many(
        'account.move',
        'subscription_id',
        string='Invoices',
        readonly=True
    )
    invoice_count = fields.Integer(
        string='Invoice Count',
        compute='_compute_invoice_count'
    )

    amount_untaxed = fields.Monetary(
        string='Untaxed Amount',
        compute='_compute_amounts',
        store=True,
        currency_field='currency_id'
    )
    amount_tax = fields.Monetary(
        string='Taxes',
        compute='_compute_amounts',
        store=True,
        currency_field='currency_id'
    )
    amount_total = fields.Monetary(
        string='Total Amount',
        compute='_compute_amounts',
        store=True,
        currency_field='currency_id'
    )

    billing_period_ids = fields.One2many(
        'brightloop.billing.period',
        'subscription_id',
        string='Billed Periods'
    )

    @api.model_create_multi
    def create(self, vals_list):
        for vals in vals_list:
            if vals.get('number', _('New')) == _('New'):
                vals['number'] = self.env['ir.sequence'].next_by_code('brightloop.subscription') or _('New')
            # Initialize next_billing_date if activating immediately
            if vals.get('state') == 'active' and not vals.get('next_billing_date'):
                vals['next_billing_date'] = vals.get('start_date') or fields.Date.context_today(self)
        return super(BrightloopSubscription, self).create(vals_list)

    @api.depends('invoice_ids')
    def _compute_invoice_count(self):
        for sub in self:
            sub.invoice_count = len(sub.invoice_ids)

    @api.depends('line_ids.amount', 'line_ids.tax_ids', 'line_ids.qty', 'line_ids.unit_price')
    def _compute_amounts(self):
        for sub in self:
            untaxed = 0.0
            tax_amount = 0.0
            for line in sub.line_ids:
                untaxed += line.amount
                if line.tax_ids:
                    taxes = line.tax_ids.compute_all(
                        line.unit_price,
                        sub.currency_id,
                        line.qty,
                        product=line.product_id,
                        partner=sub.customer_id
                    )
                    tax_amount += sum(t.get('amount', 0.0) for t in taxes.get('taxes', []))
            sub.amount_untaxed = untaxed
            sub.amount_tax = tax_amount
            sub.amount_total = untaxed + tax_amount

    # Lifecycle State Transitions
    def action_to_quotation(self):
        self.ensure_one()
        self.write({'state': 'quotation'})
        self.message_post(body=_("Subscription moved to Quotation."))

    def action_confirm(self):
        self.ensure_one()
        if not self.line_ids:
            raise UserError(_("Cannot confirm a subscription without subscription lines."))
        self.write({'state': 'confirmed'})
        self.message_post(body=_("Quotation accepted and Confirmed."))

    def action_activate(self):
        self.ensure_one()
        vals = {'state': 'active'}
        if not self.next_billing_date:
            vals['next_billing_date'] = self.start_date or fields.Date.context_today(self)
        self.write(vals)
        self.message_post(body=_("Subscription is now Active. Next billing scheduled for %s.", self.next_billing_date))

    def action_pause(self):
        """Pause subscription if plan permits."""
        self.ensure_one()
        if not self.plan_id.pausable:
            raise UserError(_("The plan '%s' does not permit pausing subscriptions.", self.plan_id.name))
        self.write({'is_paused': not self.is_paused})
        msg = _("Subscription has been paused.") if self.is_paused else _("Subscription has been resumed.")
        self.message_post(body=msg)

    def action_close(self):
        """Close subscription if plan permits or user is admin."""
        self.ensure_one()
        is_admin = self.env.user.has_group('brightloop.group_brightloop_manager')
        if not self.plan_id.closable and not is_admin:
            raise UserError(_("The plan '%s' does not permit early closure.", self.plan_id.name))
        today = fields.Date.context_today(self)
        self.write({
            'state': 'closed',
            'close_date': today,
        })
        self.message_post(body=_("Subscription closed on %s.", today))

    def action_renew(self):
        """Renew subscription if plan permits."""
        self.ensure_one()
        if not self.plan_id.renewable:
            raise UserError(_("The plan '%s' is not configured for renewals.", self.plan_id.name))
        self.write({
            'is_renewed': True,
            'state': 'active',
            'close_date': False,
        })
        self.message_post(body=_("Subscription renewed successfully."))

    def action_view_invoices(self):
        self.ensure_one()
        return {
            'type': 'ir.actions.act_window',
            'name': _('Invoices for %s', self.number),
            'res_model': 'account.move',
            'view_mode': 'tree,form',
            'domain': [('subscription_id', '=', self.id)],
            'context': {'default_move_type': 'out_invoice', 'default_subscription_id': self.id},
        }


class BrightloopSubscriptionLine(models.Model):
    _name = 'brightloop.subscription.line'
    _description = 'Brightloop Subscription Line'

    subscription_id = fields.Many2one(
        'brightloop.subscription',
        string='Subscription',
        required=True,
        ondelete='cascade',
        index=True
    )
    product_id = fields.Many2one(
        'product.product',
        string='Product',
        required=True
    )
    variant_info = fields.Char(
        string='Variant Info',
        compute='_compute_variant_info',
        store=True,
        help='Display label for product attributes/variants.'
    )
    qty = fields.Float(string='Quantity', default=1.0, required=True)
    unit_price = fields.Float(
        string='Unit Price',
        required=True,
        default=0.0,
        help='Snapshotted unit price at subscription creation.'
    )
    tax_ids = fields.Many2many(
        'account.tax',
        'brightloop_sub_line_tax_rel',
        'line_id',
        'tax_id',
        string='Taxes',
        help='Snapshotted taxes at subscription creation.'
    )
    discount_id = fields.Many2one(
        'brightloop.discount',
        string='Discount'
    )
    amount = fields.Float(
        string='Subtotal',
        compute='_compute_amount',
        store=True
    )

    @api.depends('product_id')
    def _compute_variant_info(self):
        for line in self:
            if line.product_id and line.product_id.product_template_attribute_value_ids:
                line.variant_info = ", ".join(
                    line.product_id.product_template_attribute_value_ids.mapped('name')
                )
            else:
                line.variant_info = False

    @api.onchange('product_id')
    def _onchange_product_id(self):
        """Snapshot price and taxes from product template & variants upon selection."""
        if self.product_id:
            # lst_price automatically factors in attribute price_extra (e.g. Odoo brand +560)
            self.unit_price = self.product_id.lst_price
            self.tax_ids = self.product_id.taxes_id

    @api.depends('qty', 'unit_price', 'discount_id')
    def _compute_amount(self):
        for line in self:
            base = line.qty * line.unit_price
            discount_deduction = 0.0
            if line.discount_id:
                discount_deduction = line.discount_id.compute_discount_amount(base)
            line.amount = max(0.0, base - discount_deduction)


class BrightloopBillingPeriod(models.Model):
    _name = 'brightloop.billing.period'
    _description = 'Brightloop Billing Period (Idempotency Record)'
    _order = 'period_start desc'

    subscription_id = fields.Many2one(
        'brightloop.subscription',
        string='Subscription',
        required=True,
        ondelete='cascade',
        index=True
    )
    period_start = fields.Date(string='Period Start Date', required=True, index=True)
    period_end = fields.Date(string='Period End Date')
    invoice_id = fields.Many2one(
        'account.move',
        string='Generated Invoice',
        ondelete='set null'
    )

    _sql_constraints = [
        (
            'sub_period_unique',
            'unique(subscription_id, period_start)',
            'Duplicate Billing Prevention: A billing period invoice has already been created for this subscription and period start date!'
        )
    ]
