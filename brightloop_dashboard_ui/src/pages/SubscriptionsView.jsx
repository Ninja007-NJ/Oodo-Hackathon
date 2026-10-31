// SubscriptionsView.jsx - Buildly Orange Dark Theme Subscriptions Lifecycle with Status Flow Stepper
import React, { useState } from 'react';
import {
  Repeat,
  Search,
  Filter,
  Plus,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Pause,
  Play,
  XCircle,
  RotateCcw,
  Clock,
  Layers,
  X,
  FileSpreadsheet,
  Building,
  UserCheck
} from 'lucide-react';

export default function SubscriptionsView({
  subscriptions = [],
  onUpdateSubscription,
  onNavigate,
  initialFilter = 'all',
  currentRole = 'admin',
}) {
  const [filterState, setFilterState] = useState(initialFilter);
  const [selectedSub, setSelectedSub] = useState(null);
  const [search, setSearch] = useState('');

  const isCustomer = currentRole === 'customer';

  const filtered = subscriptions.filter((sub) => {
    if (filterState !== 'all' && sub.state !== filterState) {
      if (filterState === 'paused' && sub.is_paused) return true;
      return false;
    }
    if (search) {
      const q = search.toLowerCase();
      return (
        sub.number.toLowerCase().includes(q) ||
        sub.customerName.toLowerCase().includes(q) ||
        sub.planName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleAction = (sub, action) => {
    const updated = { ...sub };
    if (action === 'quotation') {
      updated.state = 'quotation';
    } else if (action === 'confirm') {
      updated.state = 'confirmed';
    } else if (action === 'activate') {
      updated.state = 'active';
      if (!updated.nextBillingDate) updated.nextBillingDate = '2026-10-31';
    } else if (action === 'pause') {
      updated.is_paused = !updated.is_paused;
    } else if (action === 'close') {
      updated.state = 'closed';
      updated.closeDate = '2026-10-31';
    } else if (action === 'renew') {
      updated.state = 'active';
      updated.is_renewed = true;
      updated.closeDate = null;
    }
    if (onUpdateSubscription) onUpdateSubscription(updated);
    setSelectedSub(updated);
  };

  const getBadgeCls = (state, isPaused) => {
    if (isPaused) return 'bg-amber-950/80 text-amber-400 border-amber-800/80';
    switch (state) {
      case 'active':
        return 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80';
      case 'quotation':
        return 'bg-sky-950/80 text-sky-400 border-sky-800/80';
      case 'confirmed':
        return 'bg-blue-950/80 text-blue-400 border-blue-800/80';
      case 'closed':
        return 'bg-slate-900 text-slate-500 border-slate-800';
      case 'draft':
      default:
        return 'bg-slate-900 text-slate-400 border-slate-800';
    }
  };

  const stages = ['draft', 'quotation', 'confirmed', 'active', 'closed'];

  return (
    <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-950/60 px-2.5 py-0.5 rounded-full border border-orange-800/60">
              {isCustomer ? 'My Account' : 'Module 2 • Subscription Lifecycle'}
            </span>
            <span className="text-xs text-slate-400">• State Machine</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">
            {isCustomer ? 'My Subscriptions & Contracts' : 'Subscription Contracts & State Machine'}
          </h1>
          <p className="text-xs text-slate-400">
            {isCustomer
              ? 'View your active contracts, plan renewals, and pricing tier breakdown.'
              : 'Full state lifecycle: Draft → Quotation → Confirmed → Active → Closed with pause and resume controls.'}
          </p>
        </div>

        {!isCustomer && (
          <div className="flex items-center gap-2">
            {onNavigate && (
              <button
                onClick={() => onNavigate('templates')}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-orange-500 text-slate-200 text-xs font-bold transition-all cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-orange-400" />
                <span>Create from Template</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { id: 'all', label: 'All Contracts' },
            { id: 'active', label: 'Active' },
            { id: 'quotation', label: 'Quotation' },
            { id: 'confirmed', label: 'Confirmed' },
            { id: 'draft', label: 'Draft' },
            { id: 'closed', label: 'Closed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterState(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                filterState === tab.id
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contract #, customer..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="rounded-3xl border border-slate-800 bg-[#121620]/90 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Contract #</th>
                {!isCustomer && <th className="py-3.5 px-4">Customer</th>}
                <th className="py-3.5 px-4">Plan &amp; Rate</th>
                <th className="py-3.5 px-4">Next Billing Date</th>
                <th className="py-3.5 px-4 text-center">Lifecycle State</th>
                <th className="py-3.5 px-4 text-right">Amount (Total)</th>
                <th className="py-3.5 px-4 text-center">Lifecycle Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((sub) => {
                const isPaused = sub.is_paused;
                return (
                  <tr key={sub.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-orange-400">
                      <button
                        onClick={() => setSelectedSub(sub)}
                        className="hover:underline cursor-pointer flex items-center gap-1.5"
                      >
                        <Repeat className="w-3.5 h-3.5" />
                        {sub.number}
                      </button>
                    </td>
                    {!isCustomer && (
                      <td className="py-3.5 px-4 font-medium text-slate-200">
                        <div>{sub.customerName}</div>
                        <div className="text-[10px] text-slate-500">{sub.customerEmail}</div>
                      </td>
                    )}
                    <td className="py-3.5 px-4 text-slate-300">
                      <span className="font-semibold block">{sub.planName}</span>
                      <span className="text-[10px] text-slate-500 font-mono">Term: {sub.paymentTerm}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {sub.nextBillingDate || <span className="text-slate-600">—</span>}
                      {sub.state === 'active' && sub.nextBillingDate === '2026-10-31' && (
                        <span className="block text-[9px] font-sans text-orange-400 font-bold">Due for Cron</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getBadgeCls(sub.state, isPaused)}`}>
                        {isPaused ? 'Paused' : sub.state}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-white font-mono">
                      ₹{sub.amountTotal.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedSub(sub)}
                          className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-bold cursor-pointer"
                        >
                          Inspect
                        </button>
                        {!isCustomer && sub.state === 'draft' && (
                          <button
                            onClick={() => handleAction(sub, 'quotation')}
                            className="px-2.5 py-1 rounded-xl bg-sky-950 border border-sky-800 text-sky-300 hover:bg-sky-900 text-[11px] font-bold cursor-pointer"
                          >
                            Send Quote
                          </button>
                        )}
                        {!isCustomer && sub.state === 'quotation' && (
                          <button
                            onClick={() => handleAction(sub, 'confirm')}
                            className="px-2.5 py-1 rounded-xl bg-blue-950 border border-blue-800 text-blue-300 hover:bg-blue-900 text-[11px] font-bold cursor-pointer"
                          >
                            Confirm
                          </button>
                        )}
                        {!isCustomer && sub.state === 'confirmed' && (
                          <button
                            onClick={() => handleAction(sub, 'activate')}
                            className="px-2.5 py-1 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 hover:bg-emerald-900 text-[11px] font-bold cursor-pointer"
                          >
                            Activate
                          </button>
                        )}
                        {sub.state === 'active' && (
                          <button
                            onClick={() => handleAction(sub, 'pause')}
                            className="px-2.5 py-1 rounded-xl bg-amber-950 border border-amber-800 text-amber-300 hover:bg-amber-900 text-[11px] font-bold cursor-pointer"
                          >
                            {isPaused ? 'Resume' : 'Pause'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={isCustomer ? 6 : 7} className="text-center py-10 text-slate-500">
                    No subscriptions found for this view.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contract Detail Modal with Status Flow Stepper */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-[#121620] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in duration-150 text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <Repeat className="w-5 h-5 text-orange-400" />
                <div>
                  <h3 className="text-lg font-black text-white">{selectedSub.number}</h3>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Plan: <strong className="text-slate-200">{selectedSub.planName}</strong>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedSub(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Visual State Lifecycle Stepper */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Subscription Lifecycle Progression:
              </span>
              <div className="flex items-center justify-between gap-1 text-[11px] font-mono">
                {stages.map((st, i) => {
                  const currentIdx = stages.indexOf(selectedSub.state);
                  const isDone = i <= currentIdx && selectedSub.state !== 'closed';
                  const isCurrent = st === selectedSub.state;
                  return (
                    <div key={st} className="flex-1 text-center">
                      <div className={`h-1.5 rounded-full mb-1.5 ${
                        isCurrent
                          ? 'bg-orange-500 shadow-sm shadow-orange-500/50'
                          : isDone
                          ? 'bg-emerald-500'
                          : 'bg-slate-800'
                      }`} />
                      <span className={`capitalize ${isCurrent ? 'font-black text-orange-400' : isDone ? 'text-slate-300' : 'text-slate-600'}`}>
                        {st}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Customer & Period Metadata */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500">Customer</span>
                <div className="font-bold text-white mt-0.5">{selectedSub.customerName}</div>
                <div className="text-[10px] text-slate-400">{selectedSub.customerEmail}</div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500">Billing Cycle</span>
                <div className="text-slate-300 mt-0.5">Start: <strong className="text-white">{selectedSub.startDate}</strong></div>
                <div className="text-slate-300">Next Due: <strong className="text-orange-400">{selectedSub.nextBillingDate || 'N/A'}</strong></div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500">Contract Status</span>
                <div className="mt-1">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${getBadgeCls(selectedSub.state, selectedSub.is_paused)}`}>
                    {selectedSub.is_paused ? 'Paused' : selectedSub.state}
                  </span>
                </div>
              </div>
            </div>

            {/* Contract Lines */}
            <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/40">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950 border-b border-slate-800 text-[10px] uppercase text-slate-400 font-bold">
                  <tr>
                    <th className="py-2.5 px-3">Product / Service</th>
                    <th className="py-2.5 px-3">Variant Snapshot</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Unit Price</th>
                    <th className="py-2.5 px-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {selectedSub.lines?.map((l, i) => (
                    <tr key={i}>
                      <td className="py-2.5 px-3 font-semibold text-slate-200">{l.productName}</td>
                      <td className="py-2.5 px-3 text-orange-400 font-mono text-[11px]">{l.variant || 'Standard'}</td>
                      <td className="py-2.5 px-3 text-center text-slate-400">{l.qty}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-300">₹{l.unitPrice}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-white">₹{l.subtotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculations Breakdown */}
            <div className="flex justify-end text-xs">
              <div className="w-64 space-y-1.5 border-t border-slate-800 pt-2 font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Untaxed Amount:</span>
                  <span>₹{selectedSub.amountUntaxed.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>GST (18% Total):</span>
                  <span>₹{selectedSub.amountTax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-orange-400 border-t border-slate-800 pt-1">
                  <span>Contract Total:</span>
                  <span>₹{selectedSub.amountTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Lifecycle Action Buttons */}
            <div className="flex items-center justify-between border-t border-slate-800 pt-3">
              <div className="flex items-center gap-2">
                {!isCustomer && selectedSub.state === 'draft' && (
                  <button
                    onClick={() => handleAction(selectedSub, 'quotation')}
                    className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold cursor-pointer"
                  >
                    Send Quotation
                  </button>
                )}
                {!isCustomer && selectedSub.state === 'quotation' && (
                  <button
                    onClick={() => handleAction(selectedSub, 'confirm')}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer"
                  >
                    Confirm Order
                  </button>
                )}
                {!isCustomer && selectedSub.state === 'confirmed' && (
                  <button
                    onClick={() => handleAction(selectedSub, 'activate')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
                  >
                    Activate Contract
                  </button>
                )}
                {selectedSub.state === 'active' && (
                  <button
                    onClick={() => handleAction(selectedSub, 'pause')}
                    className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold cursor-pointer"
                  >
                    {selectedSub.is_paused ? 'Resume Contract' : 'Pause Contract'}
                  </button>
                )}
                {selectedSub.state === 'active' && (
                  <button
                    onClick={() => handleAction(selectedSub, 'close')}
                    className="px-3 py-1.5 rounded-xl bg-rose-900/60 hover:bg-rose-900 text-rose-300 text-xs font-bold cursor-pointer border border-rose-700"
                  >
                    Close Contract
                  </button>
                )}
                {selectedSub.state === 'closed' && (
                  <button
                    onClick={() => handleAction(selectedSub, 'renew')}
                    className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold cursor-pointer"
                  >
                    Renew Contract
                  </button>
                )}
              </div>

              <button
                onClick={() => setSelectedSub(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
