# -*- coding: utf-8 -*-
{
    'name': 'Brightloop',
    'version': '17.0.1.0.0',
    'summary': 'Subscription Management & Recurring Billing Platform',
    'description': """
Brightloop Subscription Management Platform
===========================================
- Core Role-based Access: Admin, Staff, Customer Portal
- Strict Password Validation Rules (9+ chars, uppercase, lowercase, special character)
- Live Password Rule Checklist on Website Signup
- Password Reset Link Logging for Offline/Local Testing
- Isolated Customer Portal Access Rules
    """,
    'category': 'Sales/Subscription',
    'author': 'Brightloop Team',
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
        'security/security_groups.xml',
        'security/ir.model.access.csv',
        'security/ir_rule.xml',
        'views/signup_templates.xml',
    ],
    'installable': True,
    'application': True,
    'auto_install': False,
    'license': 'LGPL-3',
}
