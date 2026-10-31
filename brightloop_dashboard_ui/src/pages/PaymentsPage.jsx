// PaymentsPage.jsx - Dedicated Secure Payments & Reconciliation Ledger
import React, { useState } from 'react';
import {
  CreditCard,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Receipt,
  RotateCcw,
  ExternalLink,
  QrCode,
  Building,
  Lock,
  Zap,
  Check,
  X
} from 'lucide-react';

export default function PaymentsPage({
  payments,
  onResolveMismatch,
  onViewReceipt,
  onNavigate,
}) {
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [notification, setNotification] = useState(null);

  // Summaries
  const totalSettled = payments
    .filter((p) => p.status === 'reconciled')
    .reduce((sum, p) => sum + p.amount, 0);
  const mismatchCount = payments.filter((p) => p.status === 'mismatch').length;
  const pendingCount = payments.filter((p) => p.status === 'pending_webhook').length;

  const filtered = payments.filter((p) => {
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        p.paymentNumber.toLowerCase().includes(q) ||
        p.customerName.toLowerCase().includes(q) ||
        p.transactionId.toLowerCase().includes(q) ||
        (p.invoiceNumber && p.invoiceNumber.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleQuickResolve = (payId) => {
    if (onResolveMismatch) {
      onResolveMismatch(payId);
    }
    setNotification('Payment successfully matched to invoice INV/2026/00092 and reconciled!');
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Notification Toast */}
      {notification && (
        <div className="p-3.5 bg-emerald-950/90 border border-emerald-500 rounded-2xl text-emerald-300 text-xs font-semibold flex items-center justify-between shadow-2xl animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-800/50">
              Module 4 • Payments &amp; Settlement
            </span>
            <span className="text-xs text-slate-400">PCI-DSS Tokenized Gateway Rails</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1.5 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-cyan-400" />
            Payments &amp; Reconciliation Ledger
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time settlement tracking across UPI QR, tokenized credit cards, corporate NEFT wires, and audit verification.
          </p>
        </div>

        {/* Quick Nav Shortcuts */}
        <div className="flex items-center gap-2">
          {onNavigate && (
            <>
              <button
                onClick={() => onNavigate('invoices')}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-cyan-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>View Invoices</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigate('receipts')}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500/50 text-emerald-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Receipt className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Receipts</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Gateway Rails Status Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-400 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Razorpay Instant UPI</div>
              <div className="text-[10px] text-slate-400">Zero-fee settlement active</div>
            </div>
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
            Operational
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-950 border border-purple-800 text-purple-400 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Stripe Token Vault</div>
              <div className="text-[10px] text-slate-400">0 Raw Cards • 100% Tokenized</div>
            </div>
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
            PCI SAQ-A
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-950 border border-blue-800 text-blue-400 flex items-center justify-center">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">HDFC Corporate NEFT</div>
              <div className="text-[10px] text-slate-400">Auto Recon Bot Active</div>
            </div>
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
            Synced
          </span>
        </div>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Settled Volume</div>
          <div className="text-xl font-black text-white mt-1">₹{totalSettled.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-emerald-400 mt-1 font-mono">100% gateway verified</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-900/40 backdrop-blur-xl">
          <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">Gateway Success Rate</div>
          <div className="text-xl font-black text-emerald-400 mt-1">99.4%</div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">0.6% retry cleared</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-900/40 backdrop-blur-xl">
          <div className="text-[10px] uppercase font-bold tracking-wider text-amber-400">Reconciliation Mismatches</div>
          <div className="text-xl font-black text-amber-400 mt-1">{mismatchCount} Flagged</div>
          <div className="text-[10px] text-amber-500/80 mt-1 font-mono">Requires memo match</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-900/40 backdrop-blur-xl">
          <div className="text-[10px] uppercase font-bold tracking-wider text-cyan-400">Tokenized Profiles</div>
          <div className="text-xl font-black text-cyan-400 mt-1">100% Protected</div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">Zero raw card storage</div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { id: 'all', label: 'All Transactions' },
            { id: 'reconciled', label: 'Reconciled' },
            { id: 'mismatch', label: 'Mismatch Flagged' },
            { id: 'pending_webhook', label: 'Pending Webhook' },
            { id: 'refunded', label: 'Refunded' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                filterStatus === tab.id
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
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
            placeholder="Search payment #, txn id, client..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Payment #</th>
                <th className="py-3.5 px-4">Txn ID / Gateway</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Linked Invoice</th>
                <th className="py-3.5 px-4">Method Rail</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Settled Amount</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((pay) => {
                const isReconciled = pay.status === 'reconciled';
                const isMismatch = pay.status === 'mismatch';

                return (
                  <tr key={pay.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-cyan-300">
                      <button
                        onClick={() => setSelectedTxn(pay)}
                        className="hover:underline cursor-pointer flex items-center gap-1.5"
                      >
                        <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                        {pay.paymentNumber}
                      </button>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-slate-300 text-[11px]">{pay.transactionId}</div>
                      <div className="text-[10px] text-slate-500">{pay.gateway}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-200">
                      <div>{pay.customerName}</div>
                      <div className="text-[10px] text-slate-500">{pay.paymentDate} • {pay.paymentTime}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {pay.invoiceNumber || <span className="text-amber-400">Unmatched Memo</span>}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] text-slate-300 flex items-center gap-1.5">
                        {pay.method === 'upi' && <QrCode className="w-3.5 h-3.5 text-cyan-400" />}
                        {pay.method === 'card' && <Lock className="w-3.5 h-3.5 text-purple-400" />}
                        {pay.method === 'bank' && <Building className="w-3.5 h-3.5 text-blue-400" />}
                        <span>{pay.methodLabel}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide ${
                        isReconciled
                          ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60'
                          : isMismatch
                          ? 'bg-amber-950/80 text-amber-400 border-amber-800/60 animate-pulse'
                          : 'bg-blue-950/80 text-blue-400 border-blue-800/60'
                      }`}>
                        {isReconciled ? 'Reconciled' : isMismatch ? 'Mismatch Flag' : pay.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-white">
                      ₹{pay.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {isMismatch ? (
                          <button
                            onClick={() => handleQuickResolve(pay.id)}
                            className="px-2.5 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-bold transition-all cursor-pointer shadow-md shadow-amber-500/20 flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            <span>1-Click Resolve</span>
                          </button>
                        ) : pay.receiptNumber && onViewReceipt ? (
                          <button
                            onClick={() => onViewReceipt(pay.receiptNumber)}
                            className="px-2.5 py-1 rounded-xl bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 hover:bg-emerald-900/60 text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
                          >
                            <Receipt className="w-3 h-3 text-emerald-400" />
                            <span>Receipt</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => setSelectedTxn(pay)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-500">
                    No payment records found matching the active criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {selectedTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4 animate-in fade-in duration-200 text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="text-lg font-black text-white">{selectedTxn.paymentNumber}</h3>
                  <div className="text-[10px] text-slate-400 font-mono">ID: {selectedTxn.transactionId}</div>
                </div>
              </div>
              <button
                onClick={() => setSelectedTxn(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs bg-slate-950/60 p-4 rounded-2xl border border-slate-800 font-mono">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400 font-sans">Payer / Customer:</span>
                <span className="font-bold text-white font-sans">{selectedTxn.customerName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400 font-sans">Payment Date &amp; Time:</span>
                <span className="text-slate-200">{selectedTxn.paymentDate} • {selectedTxn.paymentTime}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400 font-sans">Payment Rail:</span>
                <span className="text-cyan-300 font-sans font-bold">{selectedTxn.methodLabel}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400 font-sans">Gateway Processor:</span>
                <span className="text-slate-300">{selectedTxn.gateway}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400 font-sans">Token Vault Ref:</span>
                <span className="text-purple-300">{selectedTxn.tokenVaultRef}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400 font-sans">Audit Memo:</span>
                <span className="text-slate-300">{selectedTxn.memo}</span>
              </div>
              <div className="flex justify-between pt-1 text-sm font-bold">
                <span className="text-slate-300 font-sans">Settled Total:</span>
                <span className="text-emerald-400">₹{selectedTxn.amount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-800 pt-3">
              {selectedTxn.receiptNumber && onViewReceipt ? (
                <button
                  onClick={() => {
                    const r = selectedTxn.receiptNumber;
                    setSelectedTxn(null);
                    onViewReceipt(r);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Open Official Receipt</span>
                </button>
              ) : (
                <div />
              )}

              <button
                onClick={() => setSelectedTxn(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer"
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
