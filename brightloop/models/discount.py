# -*- coding: utf-8 -*-
from odoo import models, fields, api, _
from odoo.exceptions import ValidationError


class BrightloopDiscount(models.Model):
    _name = 'brightloop.discount'
    _description = 'Brightloop Subscription Discount Rule'
    _order = 'name'

    name = fields.Char(string='Discount Name', required=True)
    type = fields.Selection(
        [
            ('fixed', 'Fixed Amount'),
            ('percent', 'Percentage'),
        ],
        string='Discount Type',
        required=True,
        default='percent'
    )
    value = fields.Float(string='Value', required=True, default=0.0)
    min_purchase = fields.Float(string='Minimum Purchase Amount', default=0.0)
    min_qty = fields.Integer(string='Minimum Quantity', default=0)
    start_date = fields.Date(string='Start Date')
    end_date = fields.Date(string='End Date')
    usage_limit = fields.Integer(string='Usage Limit', default=0, help='Maximum times this discount can be applied. 0 = unlimited.')
    used_count = fields.Integer(string='Times Used', default=0, readonly=True)

    scope = fields.Selection(
        [
            ('product', 'Specific Products'),
            ('subscription', 'Whole Subscription'),
        ],
        string='Scope',
        required=True,
        default='subscription'
    )
    product_ids = fields.Many2many(
        'product.product',
        'brightloop_discount_product_rel',
        'discount_id',
        'product_id',
        string='Applicable Products'
    )
    active = fields.Boolean(string='Active', default=True)

    @api.constrains('value')
    def _check_discount_value(self):
        for discount in self:
            if discount.value <= 0:
                raise ValidationError(_("Discount value must be strictly positive."))
            if discount.type == 'percent' and discount.value > 100:
                raise ValidationError(_("Percentage discount cannot exceed 100%."))

    @api.constrains('start_date', 'end_date')
    def _check_dates(self):
        for discount in self:
            if discount.start_date and discount.end_date and discount.start_date > discount.end_date:
                raise ValidationError(_("Discount Start Date cannot be later than End Date."))

    def is_eligible(self, as_of_date, line_qty=1, line_amount=0.0, product=None):
        """
        Evaluate if this discount is currently eligible:
        1. Date range check
        2. Usage limit check
        3. Min quantity check
        4. Min purchase check
        5. Product scope check
        """
        self.ensure_one()
        if not self.active:
            return False

        if self.start_date and as_of_date < self.start_date:
            return False
        if self.end_date and as_of_date > self.end_date:
            return False

        if self.usage_limit > 0 and self.used_count >= self.usage_limit:
            return False

        if self.min_qty > 0 and line_qty < self.min_qty:
            return False

        if self.min_purchase > 0 and line_amount < self.min_purchase:
            return False

        if self.scope == 'product' and product:
            if product.id not in self.product_ids.ids:
                return False

        return True

    def compute_discount_amount(self, base_amount):
        """Calculate the absolute discount deduction for a given base amount."""
        self.ensure_one()
        if self.type == 'percent':
            return (base_amount * self.value) / 100.0
        elif self.type == 'fixed':
            return min(self.value, base_amount)
        return 0.0
