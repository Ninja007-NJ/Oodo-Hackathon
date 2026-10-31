// PaymentSecurityConsentPage.jsx - Payment Security & User-Controlled Consent Center
import React, { useState } from 'react';
import {
  ShieldCheck,
  CreditCard,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Key,
  Smartphone,
  LogOut,
  Send,
  FileCheck,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function PaymentSecurityConsentPage() {
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [consentStatus, setConsentStatus] = useState('pending'); // 'pending' | 'approved' | 'declined' | 'remind_later'
  const [consentLog, setConsentLog] = useState([
    {
      id: 'cons_01',
      user: 'alex.staff@brightloop.io',
      action: 'Annual Renewal Authorization',
      plan: 'Business Yearly',
      amount: '₹15,000.00',
      timestamp: '2026-10-30 14:22:05',
      status: 'Explicitly Authorized',
    },
  ]);

  const handleConsentAction = (action) => {
    setConsentStatus(action);
    const newLog = {
      id: `cons_${Date.now()}`,
      user: 'billing@acmesoftware.test (Customer)',
      action: action === 'approved' ? 'Upgrade to Pro Plan Approval' : 'Upgrade Kept on Current Plan',
      plan: 'Pro Plan',
      amount: '₹5,500.00/mo',
      timestamp: new Date().toLocaleString(),
      status: action === 'approved' ? 'Explicitly Authorized' : 'Consent Declined / Held',
    };
    setConsentLog([newLog, ...consentLog]);
  };

  return (
    <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-200">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800/80">
          Security &amp; Consent Governance
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">Payment Security &amp; Consent Center</h1>
        <p className="text-xs text-slate-400">
          PCI-DSS compliant tokenization, verified webhooks, session revocation, and explicit user authorization for all renewals and plan upgrades.
        </p>
      </div>

      {/* 1. Core Principle Banner: User-Controlled Renewals */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 space-y-5 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-teal-950 border border-teal-800 text-teal-400 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black text-white">Consent-Based Renewal &amp; Upgrade Policy</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
              Brightloop never executes silent charges or automatic upgrades. When a usage limit or renewal milestone is detected, the customer receives a verified notification with explicit choices: <strong>Approve</strong>, <strong>Change Plan</strong>, <strong>Remind Later</strong>, or <strong>Keep Current Plan</strong>. Actions proceed only after verified consent is logged.
            </p>
          </div>
        </div>

        {/* Live Interactive Consent Simulator */}
        <div className="p-5 rounded-2xl border border-slate-700 bg-slate-950/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-bold text-white">Pending Customer Notification Preview</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Trigger: Approaching 20,000 monthly orders limit</span>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-black text-white">
              Your plan is nearing its order limit. Would you like to upgrade to the Pro Tier?
            </h4>
            <p className="text-xs text-slate-400">
              The Pro Plan costs <strong>₹5,500/month</strong> and increases your limit to 25,000 orders with 24/7 priority support.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={() => handleConsentAction('approved')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs hover:brightness-110 shadow-md cursor-pointer"
            >
              Approve Upgrade (₹5,500/mo)
            </button>
            <button
              onClick={() => handleConsentAction('compare')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 cursor-pointer"
            >
              Compare Plans
            </button>
            <button
              onClick={() => handleConsentAction('remind_later')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 cursor-pointer"
            >
              Remind Me Later
            </button>
            <button
              onClick={() => handleConsentAction('declined')}
              className="px-4 py-2 rounded-xl border border-rose-900/60 bg-rose-950/30 hover:bg-rose-900/50 text-rose-300 font-semibold text-xs cursor-pointer"
            >
              Keep Current Plan
            </button>
          </div>

          {consentStatus !== 'pending' && (
            <div className="mt-2 text-xs font-mono text-emerald-400 flex items-center gap-1.5 pt-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Decision Recorded: State updated to <strong>{consentStatus.toUpperCase()}</strong>. Audit trail updated below.</span>
            </div>
          )}
        </div>
      </section>

      {/* 2. Tokenized Payment Gateway & Masked Methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <CreditCard className="w-4 h-4 text-glow" />
              <span>Tokenized Gateway</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              Zero Raw CVV
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Stored Payment Token</div>
            <div className="font-mono font-bold text-white text-base">•••• •••• •••• 4242</div>
            <div className="flex justify-between text-xs text-slate-500 font-mono">
              <span>Visa Business</span>
              <span>Exp 12/28</span>
            </div>
          </div>

          <div className="text-xs text-slate-400 leading-relaxed">
            Payment credentials are exchanged for cryptographic gateway tokens. Verified webhook signatures prevent duplicate charges.
          </div>
        </div>

        {/* Account Authentication & MFA */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Key className="w-4 h-4 text-glow" />
              <span>Authentication &amp; MFA</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              Active
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <div className="font-bold text-white">Two-Factor Auth (OTP)</div>
                <div className="text-slate-400 text-[10px]">Required for plan upgrades</div>
              </div>
              <button
                onClick={() => setMfaEnabled(!mfaEnabled)}
                className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${mfaEnabled ? 'bg-emerald-500' : 'bg-slate-700'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${mfaEnabled ? 'translate-x-5' : ''}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <div className="font-bold text-white">Password Policy (9+)</div>
                <div className="text-slate-400 text-[10px]">Upper, lower, special</div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Session / Device Management */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Smartphone className="w-4 h-4 text-glow" />
              <span>Device Sessions</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">2 Active</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
              <div>
                <div className="font-bold text-white">Chrome • macOS</div>
                <div className="text-[10px] text-emerald-400">Current Session • Active Now</div>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
              <div>
                <div className="font-bold text-white">Edge • Windows 11</div>
                <div className="text-[10px] text-slate-400">Last active 2 hrs ago</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => alert('All other device sessions revoked successfully.')}
            className="w-full py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/80 text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out All Other Devices</span>
          </button>
        </div>
      </div>

      {/* 3. Consent Authorization Audit Log Table */}
      <div className="rounded-3xl border-2 border-black bg-white text-black p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Audit Compliance</span>
            <h3 className="text-lg font-black text-black">Explicit User Authorization Records</h3>
          </div>
          <span className="text-xs font-mono text-neutral-500">{consentLog.length} Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Authorized User</th>
                <th className="py-2.5 px-3">Action Description</th>
                <th className="py-2.5 px-3">Target Plan</th>
                <th className="py-2.5 px-3">Authorized Amount</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-mono">
              {consentLog.map((log) => (
                <tr key={log.id} className="hover:bg-neutral-50">
                  <td className="py-3 px-3 font-bold text-black">{log.user}</td>
                  <td className="py-3 px-3 font-sans text-neutral-700">{log.action}</td>
                  <td className="py-3 px-3 font-sans font-bold text-black">{log.plan}</td>
                  <td className="py-3 px-3 text-emerald-700 font-bold">{log.amount}</td>
                  <td className="py-3 px-3 text-neutral-500 text-[11px]">{log.timestamp}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
