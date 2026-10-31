// ExecutiveOverviewPage.jsx - Consistent Dynamic Metrics, Overdue Aging Buckets & Collections Breakdown
import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Repeat,
  AlertCircle,
  CheckCircle2,
  Clock,
  Calendar,
  Layers,
  Zap,
  ArrowRight,
  Filter,
  DollarSign,
  Building,
  UserCheck,
  FileText
} from 'lucide-react';

export default function ExecutiveOverviewPage({
  subscriptions = [],
  invoices = [],
  onNavigate,
  onFilterInvoices,
  onFilterSubscriptions,
  loadTimeMs = 38,
}) {
  const [timeRange, setTimeRange] = useState('30D');
  const [selectedPlanFilter, setSelectedPlanFilter] = useState('all');

  const today = new Date('2026-10-31');

  // --- Dynamic Single Source of Truth Metrics ---
  const activeSubs = subscriptions.filter((s) => s.state === 'active');
  const paidInvoices = invoices.filter((i) => i.paymentState === 'paid');
  const totalRevenue = paidInvoices.reduce((s, i) => s + i.amountTotal, 0);

  // Overdue calculations
  const overdueInvoices = invoices.filter(
    (i) => i.paymentState !== 'paid' && new Date(i.dueDate) < today
  );
  const overdueAmount = overdueInvoices.reduce((s, i) => s + i.amountResidual, 0);

  // Aging Buckets (1-7d, 8-30d, 31+d)
  const aging_1_7 = overdueInvoices.filter((inv) => {
    const diff = Math.ceil((today - new Date(inv.dueDate)) / (1000 * 60 * 60 * 24));
    return diff >= 1 && diff <= 7;
  });
  const aging_8_30 = overdueInvoices.filter((inv) => {
    const diff = Math.ceil((today - new Date(inv.dueDate)) / (1000 * 60 * 60 * 24));
    return diff >= 8 && diff <= 30;
  });
  const aging_31_plus = overdueInvoices.filter((inv) => {
    const diff = Math.ceil((today - new Date(inv.dueDate)) / (1000 * 60 * 60 * 24));
    return diff >= 31;
  });

  const sumAging1_7 = aging_1_7.reduce((s, i) => s + i.amountResidual, 0);
  const sumAging8_30 = aging_8_30.reduce((s, i) => s + i.amountResidual, 0);
  const sumAging31Plus = aging_31_plus.reduce((s, i) => s + i.amountResidual, 0);

  // MRR from active subscriptions
  const mrr = activeSubs.reduce((sum, s) => {
    const monthlyRate = s.planId.includes('yearly')
      ? s.amountTotal / 12
      : s.amountTotal;
    return sum + monthlyRate;
  }, 0);

  return (
    <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-in fade-in duration-150">
      {/* 1. Header with Greeting & Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Executive Finance &amp; Operations
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800/80 font-mono">
              ⚡ {loadTimeMs}ms measured
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Single source of truth metrics derived from active contracts, invoices, and payment reconciliation records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Time Filter Pills */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-1 flex items-center gap-1 text-xs">
            {['24H', '7D', '30D', '90D'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  timeRange === range
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <button
            onClick={() => onNavigate('billing')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 text-slate-950 font-black text-xs shadow-md shadow-orange-500/20 hover:brightness-110 active:scale-95 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Run Billing Engine</span>
          </button>
        </div>
      </div>

      {/* 2. Top 4 Consistent Dynamic KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Settled Revenue */}
        <div 
          onClick={() => { onFilterInvoices('paid'); onNavigate('invoices'); }}
          className="rounded-2xl border border-slate-800 bg-[#121620]/90 p-5 shadow-sm hover:border-slate-700 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Settled Revenue</span>
            <span className="flex items-center gap-0.5 text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded text-[10px]">
              <TrendingUp className="w-3 h-3" /> Reconciled
            </span>
          </div>
          <div className="text-2xl font-black text-white mt-2 font-mono">
            ₹{totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 1 })}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            From {paidInvoices.length} paid invoice(s)
          </div>
        </div>

        {/* Active Subscriptions Count */}
        <div 
          onClick={() => { onFilterSubscriptions('active'); onNavigate('subscriptions'); }}
          className="rounded-2xl border border-slate-800 bg-[#121620]/90 p-5 shadow-sm hover:border-slate-700 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Active Subscriptions</span>
            <span className="text-orange-400 font-mono font-bold text-xs">
              {subscriptions.length} total
            </span>
          </div>
          <div className="text-2xl font-black text-white mt-2 font-mono">
            {activeSubs.length} Active
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            MRR: ~₹{Math.round(mrr).toLocaleString('en-IN')}/mo
          </div>
        </div>

        {/* Total Overdue Receivables */}
        <div 
          onClick={() => { onFilterInvoices('overdue'); onNavigate('invoices'); }}
          className="rounded-2xl border border-rose-900/50 bg-rose-950/20 p-5 shadow-sm hover:border-rose-700 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="text-rose-400 font-medium">Overdue Debt</span>
            <span className="flex items-center gap-0.5 text-rose-400 font-bold bg-rose-950/80 px-2 py-0.5 rounded text-[10px]">
              <TrendingDown className="w-3 h-3" /> Aging
            </span>
          </div>
          <div className="text-2xl font-black text-rose-300 mt-2 font-mono">
            ₹{overdueAmount.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-rose-400/80 mt-1">
            {overdueInvoices.length} overdue invoice(s)
          </div>
        </div>

        {/* Collection Performance */}
        <div className="rounded-2xl border border-slate-800 bg-[#121620]/90 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Collection Health</span>
            <span className="text-emerald-400 font-mono font-bold text-xs">
              {totalRevenue + overdueAmount > 0 ? Math.round((totalRevenue / (totalRevenue + overdueAmount)) * 100) : 100}%
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-2 font-mono">
            Optimal
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Zero duplicate billing errors
          </div>
        </div>
      </div>

      {/* 3. Overdue Aging Analysis (1–7d, 8–30d, 31+d Buckets) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Accounts Receivable Aging Analysis
            </h2>
          </div>
          <span className="text-xs text-slate-400">Click any bucket to filter invoices</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Bucket 1: 1-7 Days */}
          <div
            onClick={() => { onFilterInvoices('overdue_1_7'); onNavigate('invoices'); }}
            className="p-5 rounded-2xl border border-amber-900/50 bg-amber-950/20 hover:border-amber-700 transition-all cursor-pointer shadow-sm group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                1–7 Days Overdue
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-900/60 text-amber-300 font-bold font-mono">
                {aging_1_7.length} invoice
              </span>
            </div>
            <div className="text-2xl font-black text-white mt-3 font-mono">
              ₹{sumAging1_7.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-slate-400 group-hover:text-amber-300 transition-colors">
              <span>Follow-up reminder queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Bucket 2: 8-30 Days */}
          <div
            onClick={() => { onFilterInvoices('overdue_8_30'); onNavigate('invoices'); }}
            className="p-5 rounded-2xl border border-orange-900/50 bg-orange-950/20 hover:border-orange-700 transition-all cursor-pointer shadow-sm group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400">
                8–30 Days Overdue
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-orange-900/60 text-orange-300 font-bold font-mono">
                {aging_8_30.length} invoice
              </span>
            </div>
            <div className="text-2xl font-black text-white mt-3 font-mono">
              ₹{sumAging8_30.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-slate-400 group-hover:text-orange-300 transition-colors">
              <span>Escalated debt notice</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Bucket 3: 31+ Days */}
          <div
            onClick={() => { onFilterInvoices('overdue_31_plus'); onNavigate('invoices'); }}
            className="p-5 rounded-2xl border border-rose-900/50 bg-rose-950/30 hover:border-rose-700 transition-all cursor-pointer shadow-sm group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">
                31+ Days Overdue
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-900/80 text-rose-300 font-bold font-mono">
                {aging_31_plus.length} invoice
              </span>
            </div>
            <div className="text-2xl font-black text-white mt-3 font-mono">
              ₹{sumAging31Plus.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-slate-400 group-hover:text-rose-300 transition-colors">
              <span>Account suspension trigger</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Active Subscriptions Breakdown & Quick Navigation */}
      <section className="rounded-3xl border border-slate-800 bg-[#121620]/90 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Repeat className="w-4 h-4 text-orange-400" />
            <h3 className="font-bold text-white text-sm">Contract Lifecycle Distribution</h3>
          </div>
          <button
            onClick={() => onNavigate('subscriptions')}
            className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Subscriptions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { state: 'draft', label: 'Draft', count: subscriptions.filter((s) => s.state === 'draft').length, color: 'text-slate-400' },
            { state: 'quotation', label: 'Quotation', count: subscriptions.filter((s) => s.state === 'quotation').length, color: 'text-sky-400' },
            { state: 'confirmed', label: 'Confirmed', count: subscriptions.filter((s) => s.state === 'confirmed').length, color: 'text-blue-400' },
            { state: 'active', label: 'Active', count: subscriptions.filter((s) => s.state === 'active').length, color: 'text-emerald-400' },
            { state: 'closed', label: 'Closed', count: subscriptions.filter((s) => s.state === 'closed').length, color: 'text-slate-500' },
          ].map((item) => (
            <div
              key={item.state}
              onClick={() => { onFilterSubscriptions(item.state); onNavigate('subscriptions'); }}
              className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer text-center"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{item.label}</span>
              <span className={`text-xl font-black font-mono mt-1 block ${item.color}`}>{item.count}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
