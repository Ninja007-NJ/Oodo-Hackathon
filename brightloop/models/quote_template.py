# -*- coding: utf-8 -*-
from odoo import models, fields, api, _
from odoo.exceptions import UserError


class BrightloopQuoteTemplate(models.Model):
    _name = 'brightloop.quote.template'
    _description = 'Brightloop Quotation Template'
    _order = 'name'

    name = fields.Char(string='Template Name', required=True)
    plan_id = fields.Many2one('brightloop.plan', string='Default Plan', required=True)
    validity_days = fields.Integer(string='Quotation Validity (Days)', default=30)
    line_ids = fields.One2many(
        'brightloop.quote.template.line',
        'template_id',
        string='Template Lines'
    )
    active = fields.Boolean(string='Active', default=True)

    def action_create_subscription(self, customer_id=None):
        """
        Create a new quotation subscription from this template.
        Copies plan, lines, and sets expiry date based on validity_days.
        """
        self.ensure_one()
        start_date = fields.Date.context_today(self)
        expiry_date = fields.Date.add(start_date, days=self.validity_days) if self.validity_days else False

        subscription_vals = {
            'template_id': self.id,
            'plan_id': self.plan_id.id,
            'customer_id': customer_id or self.env.user.partner_id.id,
            'start_date': start_date,
            'expiry_date': expiry_date,
            'state': 'quotation',
            'line_ids': [
                (0, 0, {
                    'product_id': line.product_id.id,
                    'qty': line.qty,
                    'unit_price': line.product_id.lst_price,
                    'tax_ids': [(6, 0, line.product_id.taxes_id.ids)],
                }) for line in self.line_ids
            ]
        }
        return self.env['brightloop.subscription'].create(subscription_vals)


class BrightloopQuoteTemplateLine(models.Model):
    _name = 'brightloop.quote.template.line'
    _description = 'Brightloop Quotation Template Line'

    template_id = fields.Many2one('brightloop.quote.template', string='Template', required=True, ondelete='cascade')
    product_id = fields.Many2one('product.product', string='Product', required=True)
    qty = fields.Float(string='Quantity', default=1.0, required=True)
