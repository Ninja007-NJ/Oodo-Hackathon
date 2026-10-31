# -*- coding: utf-8 -*-
from odoo import http, _
from odoo.http import request
from odoo.exceptions import AccessError, MissingError
from odoo.addons.portal.controllers.portal import CustomerPortal, pager as portal_pager


class BrightloopCustomerPortal(CustomerPortal):

    def _prepare_home_portal_values(self, counters):
        values = super()._prepare_home_portal_values(counters)
        partner = request.env.user.partner_id
        if 'subscription_count' in counters:
            values['subscription_count'] = request.env['brightloop.subscription'].search_count([
                ('customer_id', 'child_of', [partner.commercial_partner_id.id])
            ]) if partner else 0
        return values

    @http.route(['/plans'], type='http', auth='public', website=True)
    def brightloop_public_plans(self, **kw):
        """Public catalog showing active subscription plans."""
        plans = request.env['brightloop.plan'].sudo().search([('active', '=', True)])
        return request.render('brightloop.website_plans_page', {
            'plans': plans,
            'page_name': 'plans'
        })

    @http.route(['/my/subscriptions', '/my/subscriptions/page/<int:page>'], type='http', auth='user', website=True)
    def portal_my_subscriptions(self, page=1, date_begin=None, date_end=None, sortby=None, **kw):
        """Portal view: list of customer's own subscriptions."""
        partner = request.env.user.partner_id
        Subscription = request.env['brightloop.subscription']

        domain = [('customer_id', 'child_of', [partner.commercial_partner_id.id])]

        sub_count = Subscription.search_count(domain)
        pager = portal_pager(
            url="/my/subscriptions",
            total=sub_count,
            page=page,
            step=10
        )

        subscriptions = Subscription.search(domain, limit=10, offset=pager['offset'], order="id desc")

        return request.render('brightloop.portal_my_subscriptions', {
            'subscriptions': subscriptions,
            'page_name': 'subscription',
            'pager': pager,
            'default_url': '/my/subscriptions',
        })

    @http.route(['/my/subscriptions/<int:sub_id>'], type='http', auth='user', website=True)
    def portal_my_subscription_detail(self, sub_id=None, **kw):
        """Detail view of a specific subscription."""
        partner = request.env.user.partner_id
        try:
            subscription = request.env['brightloop.subscription'].browse(sub_id)
            if not subscription.exists():
                raise MissingError(_("This subscription does not exist."))
            # Security verification: Ensure the subscription belongs to the logged-in customer
            if subscription.customer_id.commercial_partner_id.id != partner.commercial_partner_id.id:
                raise AccessError(_("You are not authorized to access this subscription."))
        except (AccessError, MissingError):
            return request.redirect('/my')

        return request.render('brightloop.portal_subscription_page', {
            'subscription': subscription,
            'page_name': 'subscription_detail',
        })

    @http.route(['/my/subscriptions/<int:sub_id>/request_change'], type='http', auth='user', methods=['POST'], website=True)
    def portal_request_change(self, sub_id=None, request_type='change', message='', **kw):
        """Handle self-service change or cancellation request."""
        partner = request.env.user.partner_id
        subscription = request.env['brightloop.subscription'].browse(sub_id)

        if not subscription.exists() or subscription.customer_id.commercial_partner_id.id != partner.commercial_partner_id.id:
            raise AccessError(_("Unauthorized subscription change request."))

        if request_type == 'cancel' and not subscription.plan_id.closable:
            return request.redirect(f'/my/subscriptions/{sub_id}?error=plan_not_closable')

        # Log request on subscription chatter and schedule activity for staff
        request_label = _("Cancellation Request") if request_type == 'cancel' else _("Plan Change Request")
        log_body = _(
            "<b>Customer Self-Service %s</b><br/>"
            "Requested by: %s (%s)<br/>"
            "Notes: %s",
            request_label, partner.name, partner.email, message or _("No notes provided.")
        )
        subscription.sudo().message_post(body=log_body)

        # Create staff activity
        subscription.sudo().activity_schedule(
            'mail.mail_activity_data_todo',
            summary=f"Customer {request_label} for {subscription.number}",
            note=message or f"Review customer {request_label}",
            user_id=subscription.customer_id.user_id.id or request.env.ref('base.user_admin').id
        )

        return request.redirect(f'/my/subscriptions/{sub_id}?success=request_submitted')
