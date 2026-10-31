# -*- coding: utf-8 -*-
import re
import logging
from odoo import http, _
from odoo.http import request
from odoo.exceptions import UserError
from odoo.addons.auth_signup.controllers.main import AuthSignupHome

_logger = logging.getLogger(__name__)


class BrightloopAuthSignup(AuthSignupHome):

    def _validate_brightloop_password(self, password):
        """
        Validate password rules:
        - MORE than 8 characters (so >= 9)
        - At least one uppercase letter [A-Z]
        - At least one lowercase letter [a-z]
        - At least one special character [^a-zA-Z0-9]
        """
        if not password or len(password) <= 8:
            raise UserError(
                _("Password must be more than 8 characters long (minimum 9 characters). "
                  "Passwords with 8 or fewer characters are rejected.")
            )

        if not re.search(r'[A-Z]', password):
            raise UserError(
                _("Password must contain at least one uppercase letter (A-Z).")
            )

        if not re.search(r'[a-z]', password):
            raise UserError(
                _("Password must contain at least one lowercase letter (a-z).")
            )

        if not re.search(r'[^a-zA-Z0-9]', password):
            raise UserError(
                _("Password must contain at least one special character (e.g. !@#$%^&*).")
            )

    def do_signup(self, qcontext):
        """
        Intercept signup to:
        1. Enforce strict email uniqueness
        2. Enforce Brightloop password rules
        3. Prevent granting staff or internal privileges via signup
        """
        email = qcontext.get('login', '').strip().lower()
        password = qcontext.get('password', '')

        # 1. Enforce unique email
        if email:
            existing_user = request.env['res.users'].sudo().search([('login', '=ilike', email)], limit=1)
            if existing_user:
                raise UserError(_("An account with this email address already exists. Please sign in or use password reset."))

        # 2. Enforce password complexity
        self._validate_brightloop_password(password)

        # 3. Proceed with standard signup (creates portal user)
        res = super(BrightloopAuthSignup, self).do_signup(qcontext)

        # 4. Strict safety check: Ensure user was created as portal user and never internal/staff
        created_user = request.env['res.users'].sudo().search([('login', '=', email)], limit=1)
        if created_user:
            staff_group = request.env.ref('brightloop.group_brightloop_user', raise_if_not_found=False)
            internal_group = request.env.ref('base.group_user', raise_if_not_found=False)
            portal_group = request.env.ref('base.group_portal', raise_if_not_found=False)

            # Revoke staff/internal if accidentally inherited
            groups_to_remove = []
            if staff_group and staff_group in created_user.groups_id:
                groups_to_remove.append(staff_group.id)
            if internal_group and internal_group in created_user.groups_id:
                groups_to_remove.append(internal_group.id)

            if groups_to_remove:
                created_user.write({'groups_id': [(3, gid) for gid in groups_to_remove]})

            if portal_group and portal_group not in created_user.groups_id:
                created_user.write({'groups_id': [(4, portal_group.id)]})

            _logger.info("Brightloop portal user registered: %s (ID: %s)", created_user.login, created_user.id)

        return res
