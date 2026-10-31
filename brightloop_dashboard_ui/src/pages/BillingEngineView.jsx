// BillingEngineView.jsx
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
    }, 400);
  };

  // Pre-calculate eligible count as of the current selected date
  const eligibleSubs = subscriptions.filter((s) => {
    if (s.state !== 'active' || s.is_paused || !s.nextBillingDate) return false;
    return s.nextBillingDate <= asOfDate;
  });

  return (
    <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Scheduled Recurring Operations</span>
        <h1 className="text-2xl font-black text-black">⚡ Automated Billing Engine</h1>
        <p className="text-xs text-neutral-600">
          Runs daily via automated cron or on-demand. Evaluates active subscriptions, generates customer invoices, applies taxes/discounts, and enforces SQL uniqueness constraints to guarantee zero double-billing.
        </p>
      </div>

      {/* Control Console Card */}
      <div className="rounded-3xl border-2 border-black bg-white p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Demo Execution Parameter</span>
              <span className="text-[10px] font-mono font-bold bg-neutral-100 px-2 py-0.5 rounded text-neutral-800">
                Idempotency Locked
              </span>
            </div>
            <h3 className="text-lg font-black text-black">Run Billing As Of Specified Date</h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-1.5 text-xs">
              <Calendar className="w-3.5 h-3.5 text-neutral-500" />
              <label htmlFor="asOfDateInput" className="font-semibold text-neutral-700">As Of:</label>
              <input
                id="asOfDateInput"
                type="date"
                value={asOfDate}
                onChange={(e) => setAsOfDate(e.target.value)}
                className="bg-transparent font-mono font-bold text-black focus:outline-none"
              />
            </div>

            <button
              onClick={handleRun}
              disabled={isRunning}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black text-white hover:bg-neutral-800 font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <Zap className={`w-4 h-4 text-emerald-400 ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? 'Processing Batch...' : 'Execute Billing Run'}</span>
            </button>
          </div>
        </div>

        {/* Live Result Notification Banner */}
        {lastResult && (
          <div className={`p-4 rounded-2xl border flex items-start gap-3.5 transition-all ${
            lastResult.created > 0
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-amber-50 border-amber-300 text-amber-900'
          }`}>
            {lastResult.created > 0 ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <div className="text-xs font-black uppercase tracking-wider">
                {lastResult.created > 0 ? 'Billing Batch Successfully Generated' : 'Zero Duplicate Invoices (Idempotent Guard)'}
              </div>
              <div className="text-xs font-mono">
                Result: <strong>created {lastResult.created}</strong>, <strong>skipped {lastResult.skipped} (already billed)</strong>, <strong>errors {lastResult.errors}</strong>.
              </div>
              <p className="text-[11px] opacity-90 leading-relaxed">
                {lastResult.created > 0
                  ? `Invoices were created for eligible subscriptions due on or before ${asOfDate}. Their next billing schedules have advanced automatically.`
                  : `All active subscriptions due as of ${asOfDate} already have verified billing period records. The SQL unique constraint prevented duplicate invoice generation.`}
              </p>
            </div>
          </div>
        )}

        {/* Batch Engine Explanation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
            <div className="text-[10px] uppercase font-bold text-neutral-400">Target Candidates</div>
            <div className="text-xl font-black text-black">{eligibleSubs.length} Subscriptions Due</div>
            <p className="text-[11px] text-neutral-500">Active contracts with next billing &le; {asOfDate}.</p>
          </div>
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
            <div className="text-[10px] uppercase font-bold text-neutral-400">Taxes &amp; Discounts</div>
            <div className="text-xl font-black text-black">18% GST + Best Promo</div>
            <p className="text-[11px] text-neutral-500">Single best discount picked per line without stacking.</p>
          </div>
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
            <div className="text-[10px] uppercase font-bold text-neutral-400">Idempotency Guard</div>
            <div className="text-xl font-black text-emerald-700">brightloop.billing.period</div>
            <p className="text-[11px] text-neutral-500">SQL unique constraint blocks duplicate billing runs.</p>
          </div>
        </div>
      </div>

      {/* Billed Periods Audit Log Table */}
      <div className="rounded-3xl border-2 border-black bg-white overflow-hidden shadow-sm">
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Audit Trail</span>
            <h3 className="text-sm font-black text-black">Billed Periods Ledger (SQL Unique Records)</h3>
          </div>
          <span className="text-xs font-mono text-neutral-500">{billedPeriods.length} Records Logged</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-4">Subscription ID</th>
                <th className="py-2.5 px-4">Period Start</th>
                <th className="py-2.5 px-4">Period End / Next Billing</th>
                <th className="py-2.5 px-4">Generated Invoice</th>
                <th className="py-2.5 px-4 text-center">Idempotency Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-mono">
              {billedPeriods.map((bp, idx) => (
                <tr key={idx} className="hover:bg-neutral-50/70">
                  <td className="py-3 px-4 font-bold text-black">{bp.subscriptionId}</td>
                  <td className="py-3 px-4 text-neutral-700">{bp.periodStart}</td>
                  <td className="py-3 px-4 text-neutral-700">{bp.periodEnd}</td>
                  <td className="py-3 px-4 text-emerald-700 font-bold">{bp.invoiceId || 'INV/2026/0010X'}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
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
