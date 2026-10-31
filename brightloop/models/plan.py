# -*- coding: utf-8 -*-
from odoo import models, fields, api, _
from odoo.exceptions import ValidationError


class BrightloopPlan(models.Model):
    _name = 'brightloop.plan'
    _description = 'Brightloop Subscription Plan'
    _order = 'name'

    name = fields.Char(string='Plan Name', required=True)
    price = fields.Float(string='Price', required=True, default=0.0)
    currency_id = fields.Many2one(
        'res.currency',
        string='Currency',
        default=lambda self: self.env.company.currency_id.id
    )
    billing_period = fields.Selection(
        [
            ('daily', 'Daily'),
            ('weekly', 'Weekly'),
            ('monthly', 'Monthly'),
            ('yearly', 'Yearly'),
        ],
        string='Billing Period',
        required=True,
        default='monthly',
        index=True
    )
    min_qty = fields.Integer(string='Minimum Quantity', default=1, required=True)
    available_from = fields.Date(string='Available From')
    available_to = fields.Date(string='Available To')

    # Behavioral flags
    auto_close = fields.Boolean(
        string='Auto Close on Expiry',
        default=False,
        help='If checked, subscriptions under this plan will automatically close when reaching their expiry date.'
    )
    closable = fields.Boolean(
        string='Closable Early',
        default=True,
        help='If checked, customers and staff are permitted to close or cancel the subscription before expiry.'
    )
    pausable = fields.Boolean(
        string='Pausable',
        default=True,
        help='If checked, the subscription can be temporarily paused.'
    )
    renewable = fields.Boolean(
        string='Renewable',
        default=True,
        help='If checked, the subscription can be renewed upon expiration.'
    )

    active = fields.Boolean(string='Active', default=True)
    description = fields.Text(string='Description / Feature Notes')

    @api.constrains('price')
    def _check_positive_price(self):
        for plan in self:
            if plan.price < 0.0:
                raise ValidationError(_("Plan price cannot be negative."))

    @api.constrains('available_from', 'available_to')
    def _check_validity_dates(self):
        for plan in self:
            if plan.available_from and plan.available_to and plan.available_from > plan.available_to:
                raise ValidationError(_("Available From date cannot be later than Available To date."))
