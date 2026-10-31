# -*- coding: utf-8 -*-
{
    'name': 'Brightloop',
    'version': '17.0.1.0.0',
    'summary': 'Subscription Management & Business Recurring Billing Platform',
    'description': """
Brightloop Subscription Management Platform (Core)
==================================================
- Role-based Security: Admin (full), Staff (operations), Customer (isolated portal)
- Enforced Password Complexity & Website Signup Live Checklist (9+ chars, upper, lower, special)
- Subscription Plans with Frequency & Lifecycle Flags (closable, pausable, renewable, auto_close)
- Product Templates & Brand Variants (+560 price extra for Odoo brand)
- Quotation Templates & Subscription State Engine (Draft -> Quotation -> Confirmed -> Active -> Closed)
- Automated Billing Engine (Daily Cron + "Run Billing Now" Wizard with As-Of date)
- SQL Idempotency Lock: `brightloop.billing.period` prevents duplicate billing
- Automatic Single-Best Promotional Discounts & Configured Tax Calculation
- Customer Self-Service Portal (`/my/subscriptions` & `/plans` showcase)
- Compatible with `brightloop_dashboard`
    """,
    'category': 'Sales/Subscription',
    'author': 'Brightloop Team',
    'website': 'https://github.com/Ninja007-NJ/Oodo-Hackathon',
    'depends': [
        'base',
        'mail',
        'account',
        'product',
        'website',
        'auth_signup',
        'portal',
    ],
    'data': [
        'data/ir_sequence_data.xml',
        'security/security_groups.xml',
        'security/ir.model.access.csv',
        'security/ir_rule.xml',
        'views/plan_views.xml',
        'views/discount_views.xml',
        'views/quote_template_views.xml',
        'views/subscription_views.xml',
        'views/billing_wizard_views.xml',
        'views/account_move_views.xml',
        'views/menus.xml',
        'views/signup_templates.xml',
        'views/portal_templates.xml',
        'views/website_templates.xml',
    ],
    'demo': [
        'data/demo_data.xml',
    ],
    'installable': True,
    'application': True,
    'auto_install': False,
    'license': 'LGPL-3',
}
