# -*- coding: utf-8 -*-
import re
import logging
from odoo import models, fields, api, _
from odoo.exceptions import ValidationError, AccessError

_logger = logging.getLogger(__name__)


class ResUsers(models.Model):
    _inherit = 'res.users'

    def _check_brightloop_password_policy(self, password):
        """
        Brightloop Password Rules:
        - Must be MORE than 8 characters (length >= 9)
        - Must contain at least one uppercase letter [A-Z]
        - Must contain at least one lowercase letter [a-z]
        - Must contain at least one special character [!@#$%^&*(),.?":{}|<>]
        """
        if not password:
            return

        if len(password) <= 8:
            raise ValidationError(
                _("Password must be more than 8 characters long (minimum 9 characters). "
                  "Passwords with 8 or fewer characters are not accepted.")
            )

        if not re.search(r'[A-Z]', password):
            raise ValidationError(
                _("Password must contain at least one uppercase letter (A-Z).")
            )

        if not re.search(r'[a-z]', password):
            raise ValidationError(
                _("Password must contain at least one lowercase letter (a-z).")
            )

        # Non-alphanumeric or standard punctuation / special characters
        if not re.search(r'[^a-zA-Z0-9]', password):
            raise ValidationError(
                _("Password must contain at least one special character (e.g., !@#$%^&*).")
            )

    def _set_password(self):
        """Validate password against policy on password change."""
        for user in self:
            if user.password:
                self._check_brightloop_password_policy(user.password)
        return super(ResUsers, self)._set_password()

    @api.model_create_multi
    def create(self, vals_list):
        """
        Enforce:
        1. Only Brightloop Admin (group_brightloop_manager) can create internal/staff users.
        2. Password complexity validation upon user creation.
        """
        admin_group = self.env.ref('brightloop.group_brightloop_manager', raise_if_not_found=False)
        staff_group = self.env.ref('brightloop.group_brightloop_user', raise_if_not_found=False)
        internal_group = self.env.ref('base.group_user', raise_if_not_found=False)

        current_user = self.env.user
        is_admin_or_super = current_user._is_admin() or (admin_group and current_user.has_group('brightloop.group_brightloop_manager'))

        for vals in vals_list:
            # Validate password if passed directly during creation
            if vals.get('password'):
                self._check_brightloop_password_policy(vals['password'])

            # Security: If creating a staff/internal user, caller must be an admin
            # Check groups_id in vals if specified
            if not is_admin_or_super:
                groups_id = vals.get('groups_id', [])
                assigned_groups = []
                for command in groups_id:
                    if isinstance(command, (list, tuple)) and len(command) >= 2:
                        if command[0] in (4, 6):  # Link / Replace
                            group_ids = [command[1]] if command[0] == 4 else command[2]
                            assigned_groups.extend(group_ids)

                target_restricted = [g.id for g in [admin_group, staff_group, internal_group] if g]
                if any(gid in target_restricted for gid in assigned_groups):
                    raise AccessError(
                        _("Security Violation: Only Brightloop Administrators are authorized to create or configure internal staff users.")
                    )

        users = super(ResUsers, self).create(vals_list)

        # Log password reset links for local testing without an active SMTP server
        for user in users:
            if user.signup_token:
                reset_url = user.signup_url
                _logger.info("=== [BRIGHTLOOP SIGNUP/RESET TOKEN URL] User: %s | URL: %s ===", user.login, reset_url)

        return users

    def write(self, vals):
        """
        Enforce:
        1. Only Brightloop Admin can promote a user to Staff or Admin.
        2. Password complexity validation on write.
        """
        if vals.get('password'):
            self._check_brightloop_password_policy(vals['password'])

        admin_group = self.env.ref('brightloop.group_brightloop_manager', raise_if_not_found=False)
        staff_group = self.env.ref('brightloop.group_brightloop_user', raise_if_not_found=False)

        if not self.env.user._is_admin() and admin_group and not self.env.user.has_group('brightloop.group_brightloop_manager'):
            # Check if attempting to grant staff or admin group
            if 'groups_id' in vals:
                restricted_groups = [g.id for g in [admin_group, staff_group] if g]
                for command in vals['groups_id']:
                    if isinstance(command, (list, tuple)) and len(command) >= 2:
                        group_ids = [command[1]] if command[0] == 4 else (command[2] if command[0] == 6 else [])
                        if any(gid in restricted_groups for gid in group_ids):
                            raise AccessError(
                                _("Security Violation: Only Brightloop Administrators can modify staff role assignments.")
                            )

        return super(ResUsers, self).write(vals)

    def action_reset_password(self):
        """Override to ensure reset link is surfaced in server log for offline evaluation."""
        res = super(ResUsers, self).action_reset_password()
        for user in self:
            if user.signup_url:
                _logger.info("=== [BRIGHTLOOP PASSWORD RESET URL] For %s: %s ===", user.login, user.signup_url)
        return res
