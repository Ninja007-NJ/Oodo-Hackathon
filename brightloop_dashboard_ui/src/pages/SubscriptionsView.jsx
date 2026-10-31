// SubscriptionsView.jsx
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
  Sparkles,
  ChevronRight,
  ExternalLink,
  Layers,
  X
} from 'lucide-react';

export default function SubscriptionsView({
  subscriptions,
  onUpdateSubscription,
  onCreateFromTemplate,
  initialFilter = 'all',
  currentRole,
}) {
  const [filterState, setFilterState] = useState(initialFilter);
  const [selectedSub, setSelectedSub] = useState(null);
  const [search, setSearch] = useState('');

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
    onUpdateSubscription(updated);
    setSelectedSub(updated);
  };

  const getBadgeCls = (state, isPaused) => {
    if (isPaused) return 'bg-amber-100 text-amber-800 border-amber-300';
    switch (state) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'quotation':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'closed':
        return 'bg-neutral-200 text-neutral-800 border-neutral-300';
      default:
        return 'bg-neutral-100 text-neutral-600 border-neutral-200';
    }
  };

  return (
    <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header & New from Template Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Contract Lifecycle</span>
          <h1 className="text-2xl font-black text-black">Subscriptions &amp; Quotations</h1>
          <p className="text-xs text-neutral-600">Traceable state machine from initial quotation to recurring activation and renewal.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onCreateFromTemplate}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black text-white hover:bg-neutral-800 text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>New From Template</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 pb-3">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {['all', 'active', 'quotation', 'confirmed', 'paused', 'closed', 'draft'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterState(tab)}
              className={`px-3 py-1.5 rounded-lg capitalize font-semibold transition-all cursor-pointer ${
                filterState === tab
                  ? 'bg-black text-white shadow-sm'
                  : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by number, customer, plan..."
            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-neutral-800 focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="rounded-3xl border-2 border-black bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Subscription #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Plan</th>
                <th className="py-3 px-4">Next Billing Date</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Total Amount</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map((sub) => (
                <tr
                  key={sub.id}
                  onClick={() => setSelectedSub(sub)}
                  className="hover:bg-neutral-50/80 transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-black">{sub.number}</td>
                  <td className="py-3.5 px-4 font-medium text-neutral-800">
                    <div>{sub.customerName}</div>
                    <div className="text-[10px] text-neutral-400">{sub.customerEmail}</div>
                  </td>
                  <td className="py-3.5 px-4 text-neutral-700">{sub.planName}</td>
                  <td className="py-3.5 px-4 font-mono text-neutral-600">
                    {sub.nextBillingDate || '—'}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide ${getBadgeCls(sub.state, sub.is_paused)}`}>
                      {sub.is_paused ? 'Paused' : sub.state}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-black">
                    ₹{sub.amountTotal.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button className="text-neutral-400 hover:text-black">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-neutral-400">
                    No subscriptions matching the filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 360° Traceable Detail Side Drawer */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-6 border-l-2 border-black flex flex-col justify-between">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Subscription Dossier</span>
                  <h2 className="text-xl font-black text-black font-mono">{selectedSub.number}</h2>
                </div>
                <button
                  onClick={() => setSelectedSub(null)}
                  className="p-1.5 rounded-xl hover:bg-neutral-100 text-neutral-500 hover:text-black cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Bar State Transition Indicator */}
              <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200">
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-2">
                  State Machine Statusbar
                </div>
                <div className="flex items-center justify-between text-xs font-bold">
                  {['draft', 'quotation', 'confirmed', 'active', 'closed'].map((st, i, arr) => {
                    const isPassed = ['draft', 'quotation', 'confirmed', 'active', 'closed'].indexOf(selectedSub.state) >= i;
                    const isCurrent = selectedSub.state === st;
                    return (
                      <React.Fragment key={st}>
                        <div className={`flex items-center gap-1 capitalize ${isCurrent ? 'text-black font-black' : isPassed ? 'text-neutral-700' : 'text-neutral-300'}`}>
                          <span className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-emerald-500 animate-pulse' : isPassed ? 'bg-black' : 'bg-neutral-300'}`} />
                          <span>{st}</span>
                        </div>
                        {i < arr.length - 1 && <span className="text-neutral-300">→</span>}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Operational Action Buttons */}
              <div className="flex flex-wrap gap-2">
                {selectedSub.state === 'draft' && (
                  <button
                    onClick={() => handleAction(selectedSub, 'quotation')}
                    className="px-3.5 py-1.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-neutral-800 cursor-pointer"
                  >
                    Send Quotation
                  </button>
                )}
                {selectedSub.state === 'quotation' && (
                  <button
                    onClick={() => handleAction(selectedSub, 'confirm')}
                    className="px-3.5 py-1.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-neutral-800 cursor-pointer"
                  >
                    Confirm Terms
                  </button>
                )}
                {selectedSub.state === 'confirmed' && (
                  <button
                    onClick={() => handleAction(selectedSub, 'activate')}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 cursor-pointer"
                  >
                    Activate Subscription
                  </button>
                )}
                {selectedSub.state === 'active' && (
                  <>
                    <button
                      onClick={() => handleAction(selectedSub, 'pause')}
                      className="px-3.5 py-1.5 rounded-xl border border-neutral-300 bg-white text-black text-xs font-bold hover:bg-neutral-100 cursor-pointer flex items-center gap-1.5"
                    >
                      {selectedSub.is_paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                      <span>{selectedSub.is_paused ? 'Resume' : 'Pause'}</span>
                    </button>
                    <button
                      onClick={() => handleAction(selectedSub, 'close')}
                      className="px-3.5 py-1.5 rounded-xl border border-rose-300 text-rose-700 bg-rose-50 text-xs font-bold hover:bg-rose-100 cursor-pointer"
                    >
                      Close Subscription
                    </button>
                  </>
                )}
                {(selectedSub.state === 'closed' || selectedSub.state === 'active') && (
                  <button
                    onClick={() => handleAction(selectedSub, 'renew')}
                    className="px-3.5 py-1.5 rounded-xl border border-blue-300 text-blue-700 bg-blue-50 text-xs font-bold hover:bg-blue-100 cursor-pointer flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Renew Cycle</span>
                  </button>
                )}
              </div>

              {/* Core Information Grid */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                  <div className="text-neutral-400 text-[10px] uppercase font-bold">Customer</div>
                  <div className="font-bold text-black mt-0.5">{selectedSub.customerName}</div>
                  <div className="text-neutral-500 text-[11px]">{selectedSub.customerEmail}</div>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                  <div className="text-neutral-400 text-[10px] uppercase font-bold">Plan Tier</div>
                  <div className="font-bold text-black mt-0.5">{selectedSub.planName}</div>
                  <div className="text-neutral-500 text-[11px]">{selectedSub.paymentTerm}</div>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                  <div className="text-neutral-400 text-[10px] uppercase font-bold">Start / Expiry</div>
                  <div className="font-medium text-black mt-0.5">{selectedSub.startDate} &rarr; {selectedSub.expiryDate || 'Open'}</div>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                  <div className="text-neutral-400 text-[10px] uppercase font-bold">Next Scheduled Billing</div>
                  <div className="font-mono font-bold text-emerald-600 mt-0.5">{selectedSub.nextBillingDate || 'Not Scheduled'}</div>
                </div>
              </div>

              {/* Snapshotted Product Lines (Including Brand Variants) */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-black uppercase tracking-wider">
                  Snapshotted Order Lines
                </div>
                <div className="border border-neutral-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-semibold text-[10px]">
                      <tr>
                        <th className="py-2 px-3">Item / Variant</th>
                        <th className="py-2 px-2 text-center">Qty</th>
                        <th className="py-2 px-3 text-right">Unit Price</th>
                        <th className="py-2 px-3 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {selectedSub.lines.map((ln) => (
                        <tr key={ln.id}>
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-black">{ln.productName}</div>
                            {ln.variant && <div className="text-[10px] text-teal-600 font-medium">{ln.variant}</div>}
                          </td>
                          <td className="py-2.5 px-2 text-center font-mono">{ln.qty}</td>
                          <td className="py-2.5 px-3 text-right font-mono">₹{ln.unitPrice}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold">₹{ln.subtotal}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-neutral-50 font-bold border-t border-neutral-200">
                      <tr>
                        <td colSpan={3} className="py-2 px-3 text-right text-neutral-500">Untaxed:</td>
                        <td className="py-2 px-3 text-right">₹{selectedSub.amountUntaxed}</td>
                      </tr>
                      <tr>
                        <td colSpan={3} className="py-2 px-3 text-right text-neutral-500">GST (18%):</td>
                        <td className="py-2 px-3 text-right">₹{selectedSub.amountTax}</td>
                      </tr>
                      <tr className="border-t border-neutral-300 text-black text-sm">
                        <td colSpan={3} className="py-2.5 px-3 text-right font-black">Grand Total:</td>
                        <td className="py-2.5 px-3 text-right font-black">₹{selectedSub.amountTotal}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-100">
              <button
                onClick={() => setSelectedSub(null)}
                className="w-full py-2.5 rounded-xl border border-neutral-300 font-bold text-xs hover:bg-neutral-100 cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
