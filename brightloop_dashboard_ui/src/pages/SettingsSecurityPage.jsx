// SettingsSecurityPage.jsx - Roles, Permissions, MFA, Sessions & Audit History
import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Key,
  Users,
  Smartphone,
  CheckCircle2,
  Lock,
  LogOut,
  Sliders,
  Database
} from 'lucide-react';

export default function SettingsSecurityPage({ currentRole, setCurrentRole }) {
  const [mfa, setMfa] = useState(true);
  const [sessionTerminated, setSessionTerminated] = useState(false);

  return (
    <main className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-200">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">System Configuration</span>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Account, Roles &amp; Security</h1>
        <p className="text-xs text-slate-400">Manage user roles, MFA policies, active device sessions, and Odoo ERP sync parameters.</p>
      </div>

      {/* Role Management Matrix */}
      <div className="rounded-3xl border-2 border-black bg-white text-black p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-black text-black">Role-Based Access Control (RBAC)</h3>
        <p className="text-xs text-neutral-600">
          Odoo groups enforced on server: Only <strong>Administrator</strong> can configure products, plans, taxes, discounts, and staff accounts. <strong>Staff</strong> manages quotes, billing runs, and payments. <strong>Customer</strong> is restricted to their own portal.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div
            onClick={() => setCurrentRole('admin')}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
              currentRole === 'admin' ? 'border-black bg-neutral-100 shadow-sm' : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100'
            }`}
          >
            <div className="font-bold text-black text-sm">Administrator</div>
            <div className="text-[10px] text-neutral-500 mt-1">Full control over plans, pricing, staff accounts &amp; finance reports.</div>
            {currentRole === 'admin' && <div className="text-[10px] text-emerald-700 font-bold mt-2">● Active Role</div>}
          </div>

          <div
            onClick={() => setCurrentRole('staff')}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
              currentRole === 'staff' ? 'border-black bg-neutral-100 shadow-sm' : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100'
            }`}
          >
            <div className="font-bold text-black text-sm">Staff (Operations)</div>
            <div className="text-[10px] text-neutral-500 mt-1">Quotes, subscriptions, recurring billing runs, counter payments.</div>
            {currentRole === 'staff' && <div className="text-[10px] text-emerald-700 font-bold mt-2">● Active Role</div>}
          </div>

          <div
            onClick={() => setCurrentRole('customer')}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
              currentRole === 'customer' ? 'border-black bg-neutral-100 shadow-sm' : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100'
            }`}
          >
            <div className="font-bold text-black text-sm">Customer (Portal)</div>
            <div className="text-[10px] text-neutral-500 mt-1">Isolated self-service view. Server raises 403 on backend routes.</div>
            {currentRole === 'customer' && <div className="text-[10px] text-emerald-700 font-bold mt-2">● Active Role</div>}
          </div>
        </div>
      </div>

      {/* Security Policies & Device Sessions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 text-xs">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Security Compliance</span>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
              <div>
                <div className="font-bold text-white">Two-Factor Authentication</div>
                <div className="text-slate-400 text-[10px]">Required for plan approvals &amp; refunds</div>
              </div>
              <button
                onClick={() => setMfa(!mfa)}
                className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${mfa ? 'bg-emerald-500' : 'bg-slate-700'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${mfa ? 'translate-x-5' : ''}`} />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
              <div>
                <div className="font-bold text-white">Password Policy (9+ Chars)</div>
                <div className="text-slate-400 text-[10px]">Strict upper, lower, special char rules</div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 text-xs">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Smartphone className="w-4 h-4 text-glow" />
            <span>Active Sessions</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="font-bold text-white">Chrome on macOS (Current)</div>
            <div className="text-emerald-400 text-[10px]">192.168.1.42 • Session Active</div>
          </div>

          <button
            onClick={() => setSessionTerminated(true)}
            className="w-full py-2.5 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 font-bold hover:bg-rose-900 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out All Other Sessions</span>
          </button>
          {sessionTerminated && (
            <div className="text-emerald-400 text-[11px] text-center font-bold">
              ✓ All background sessions successfully revoked.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
