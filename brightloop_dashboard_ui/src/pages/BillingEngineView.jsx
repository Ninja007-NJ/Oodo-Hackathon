// BillingEngineView.jsx - Buildly Orange Dark Theme Idempotent Batch Billing Console
import React, { useState } from 'react';
import {
  Zap,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Clock,
  ArrowRight,
  Database,
  FileText,
  Lock
} from 'lucide-react';

export default function BillingEngineView({
  subscriptions,
  invoices,
  billedPeriods,
  onExecuteBillingRun,
}) {
  const [asOfDate, setAsOfDate] = useState('2026-10-31');
  const [lastResult, setLastResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      const res = onExecuteBillingRun(asOfDate);
      setLastResult(res);
      setIsRunning(false);
    }, 350);
  };

  // Pre-calculate eligible count as of the current selected date
  const eligibleSubs = subscriptions.filter((s) => {
    if (s.state !== 'active' || s.is_paused || !s.nextBillingDate) return false;
    return s.nextBillingDate <= asOfDate;
  });

  return (
    <main className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-950/60 px-2.5 py-0.5 rounded-full border border-orange-800/60">
            Automated Operations
          </span>
          <span className="text-xs text-slate-400">• Idempotent Batch Cron</span>
        </div>
        <h1 className="text-2xl font-black text-white mt-1">⚡ Automated Recurring Billing Engine</h1>
        <p className="text-xs text-slate-400">
          Runs daily via automated cron or on-demand. Evaluates active subscriptions, generates customer invoices, applies taxes/discounts, and enforces SQL uniqueness constraints to guarantee zero double-billing.
        </p>
      </div>

      {/* Control Console Card */}
      <div className="rounded-3xl border border-slate-800 bg-[#121620]/90 p-6 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Demo Execution Parameter</span>
              <span className="text-[10px] font-mono font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-700 text-orange-400">
                Idempotency Locked
              </span>
            </div>
            <h3 className="text-lg font-black text-white">Run Billing As Of Specified Date</h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <label htmlFor="asOfDateInput" className="font-semibold text-slate-300">As Of:</label>
              <input
                id="asOfDateInput"
                type="date"
                value={asOfDate}
                onChange={(e) => setAsOfDate(e.target.value)}
                className="bg-transparent font-mono font-bold text-white focus:outline-none"
              />
            </div>

            <button
              onClick={handleRun}
              disabled={isRunning}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 hover:brightness-110 font-bold text-xs shadow-md shadow-orange-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Zap className={`w-4 h-4 fill-current ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? 'Processing Batch...' : 'Execute Billing Run'}</span>
            </button>
          </div>
        </div>

        {/* Live Result Notification Banner */}
        {lastResult && (
          <div className={`p-4 rounded-2xl border flex items-start gap-3.5 transition-all shadow-md ${
            lastResult.created > 0
              ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
              : 'bg-amber-950/40 border-amber-500/50 text-amber-300'
          }`}>
            {lastResult.created > 0 ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <div className="text-xs font-black uppercase tracking-wider">
                {lastResult.created > 0 ? 'Billing Batch Successfully Generated' : 'Zero Duplicate Invoices (Strictly Idempotent Guard)'}
              </div>
              <div className="text-xs font-mono">
                Result: <strong>created {lastResult.created}</strong>, <strong>skipped {lastResult.skipped} (already billed or paused)</strong>, <strong>errors {lastResult.errors}</strong>.
              </div>
              <p className="text-[11px] opacity-90 leading-relaxed">
                {lastResult.created > 0
                  ? `Invoices were created for eligible subscriptions due on or before ${asOfDate}. Their next billing schedules have advanced automatically.`
                  : `All active subscriptions due as of ${asOfDate} already have verified billing period records. The composite unique constraint (subscription_id, period_start) mathematically prevented duplicate invoice generation.`}
              </p>
            </div>
          </div>
        )}

        {/* Batch Engine Explanation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-500">Target Candidates</div>
            <div className="text-xl font-black text-white font-mono">{eligibleSubs.length} Subscriptions Due</div>
            <p className="text-[11px] text-slate-400">Active contracts with next billing &le; {asOfDate}.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-500">Taxes &amp; Discounts</div>
            <div className="text-xl font-black text-white font-mono">18% GST + Best Promo</div>
            <p className="text-[11px] text-slate-400">Single best discount picked per line without stacking.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-500">Idempotency Guard</div>
            <div className="text-xl font-black text-emerald-400 font-mono">brightloop.billing.period</div>
            <p className="text-[11px] text-slate-400">Composite unique constraint blocks duplicate billing runs.</p>
          </div>
        </div>
      </div>

      {/* Billed Periods Audit Log Table */}
      <div className="rounded-3xl border border-slate-800 bg-[#121620]/90 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Audit Trail</span>
            <h3 className="text-sm font-black text-white">Billed Periods Ledger (SQL Unique Records)</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">{billedPeriods.length} Records Logged</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-4">Subscription ID</th>
                <th className="py-2.5 px-4">Period Start</th>
                <th className="py-2.5 px-4">Period End / Next Billing</th>
                <th className="py-2.5 px-4">Generated Invoice</th>
                <th className="py-2.5 px-4 text-center">Idempotency Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {billedPeriods.map((bp, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-bold text-slate-200">{bp.subscriptionId}</td>
                  <td className="py-3 px-4 text-slate-400">{bp.periodStart}</td>
                  <td className="py-3 px-4 text-slate-400">{bp.periodEnd}</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">{bp.invoiceId || 'INV/2026/0010X'}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 text-[10px] font-bold border border-emerald-800/60">
                      LOCKED (Verified)
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
