// InvoicesView.jsx - Full Dark-Navy Accounting & Invoicing Portal with Drawer and Receipt Links
import React, { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Printer,
  Download,
  Calendar,
  X,
  CreditCard,
  Building2,
  Receipt,
  Eye,
  ShieldCheck,
  Check
} from 'lucide-react';

export default function InvoicesView({
  invoices,
  onRegisterPayment,
  onNavigate,
  onViewReceipt,
  initialFilter = 'all',
}) {
  const [filterState, setFilterState] = useState(initialFilter);
  const [search, setSearch] = useState('');
  const [paymentModalInvoice, setPaymentModalInvoice] = useState(null);
  const [viewDetailInvoice, setViewDetailInvoice] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [paymentMemo, setPaymentMemo] = useState('Manual counter reconciliation');

  const today = new Date('2026-10-31');

  // Summary Metrics
  const totalInvoiced = invoices.reduce((sum, i) => sum + i.amountTotal, 0);
  const totalPaid = invoices.filter((i) => i.paymentState === 'paid').reduce((sum, i) => sum + i.amountTotal, 0);
  const totalOutstanding = invoices
    .filter((i) => i.paymentState === 'not_paid' && new Date(i.dueDate) >= today)
    .reduce((sum, i) => sum + i.amountResidual, 0);
  const totalOverdue = invoices
    .filter((i) => i.paymentState === 'not_paid' && new Date(i.dueDate) < today)
    .reduce((sum, i) => sum + i.amountResidual, 0);

  const filtered = invoices.filter((inv) => {
    if (filterState === 'paid' && inv.paymentState !== 'paid') return false;
    if (filterState === 'outstanding' && inv.paymentState !== 'not_paid') return false;

    if (filterState.startsWith('overdue')) {
      if (inv.paymentState !== 'not_paid') return false;
      const due = new Date(inv.dueDate);
      const diffDays = Math.ceil((today - due) / (1000 * 60 * 60 * 24));
      if (filterState === 'overdue' && diffDays <= 0) return false;
      if (filterState === 'overdue_1_7' && (diffDays < 1 || diffDays > 7)) return false;
      if (filterState === 'overdue_8_30' && (diffDays < 8 || diffDays > 30)) return false;
      if (filterState === 'overdue_31_plus' && diffDays < 31) return false;
    }

    if (search) {
      const q = search.toLowerCase();
      return (
        inv.number.toLowerCase().includes(q) ||
        inv.customerName.toLowerCase().includes(q) ||
        (inv.subscriptionNumber && inv.subscriptionNumber.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleConfirmPayment = () => {
    if (!paymentModalInvoice) return;
    onRegisterPayment(paymentModalInvoice.id, {
      method: paymentMethod,
      memo: paymentMemo,
      amount: paymentModalInvoice.amountResidual,
      date: '2026-10-31',
    });
    const inv = paymentModalInvoice;
    setPaymentModalInvoice(null);
    if (onViewReceipt && inv.receiptNumber) {
      onViewReceipt(inv.receiptNumber);
    }
  };

  return (
    <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-800/50">
              Module 3 • Invoices &amp; Payments
            </span>
            <span className="text-xs text-slate-400">18% GST Compliant Accounting</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1.5 flex items-center gap-2">
            <FileText className="w-6 h-6 text-cyan-400" />
            Customer Invoices &amp; Receivables
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Automated billing invoices with aging buckets (1–7d, 8–30d, 31+d), line item taxes, and instant settlement reconciliation.
          </p>
        </div>

        {/* Quick Nav Shortcut to Payments & Receipts */}
        <div className="flex items-center gap-2">
          {onNavigate && (
            <>
              <button
                onClick={() => onNavigate('payments')}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-cyan-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                <span>Payments Ledger</span>
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

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Invoiced</div>
          <div className="text-xl font-black text-white mt-1">₹{totalInvoiced.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-slate-500 mt-1 font-mono">{invoices.length} total issued</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-900/40 backdrop-blur-xl">
          <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">Settled &amp; Reconciled</div>
          <div className="text-xl font-black text-emerald-400 mt-1">₹{totalPaid.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-emerald-600/80 mt-1 font-mono">100% audit matched</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-900/40 backdrop-blur-xl">
          <div className="text-[10px] uppercase font-bold tracking-wider text-amber-400">Current Outstanding</div>
          <div className="text-xl font-black text-amber-400 mt-1">₹{totalOutstanding.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-amber-500/80 mt-1 font-mono">Within standard credit terms</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-rose-900/40 backdrop-blur-xl">
          <div className="text-[10px] uppercase font-bold tracking-wider text-rose-400">Overdue Receivables</div>
          <div className="text-xl font-black text-rose-400 mt-1">₹{totalOverdue.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-rose-500/80 mt-1 font-mono">Aging alerts active</div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { id: 'all', label: 'All Invoices' },
            { id: 'paid', label: 'Paid & Reconciled' },
            { id: 'outstanding', label: 'Outstanding' },
            { id: 'overdue', label: 'Overdue (All)' },
            { id: 'overdue_1_7', label: '1–7d Overdue' },
            { id: 'overdue_8_30', label: '8–30d Overdue' },
            { id: 'overdue_31_plus', label: '31+d Overdue' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterState(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                filterState === tab.id
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
            placeholder="Search invoice #, customer..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Invoice Date</th>
                <th className="py-3.5 px-4">Due Date</th>
                <th className="py-3.5 px-4">Origin Sub</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Total Amount</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((inv) => {
                const isPaid = inv.paymentState === 'paid';
                const isOverdue = !isPaid && new Date(inv.dueDate) < today;

                return (
                  <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-cyan-300">
                      <button
                        onClick={() => setViewDetailInvoice(inv)}
                        className="hover:underline cursor-pointer flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5 text-cyan-400" />
                        {inv.number}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-200">
                      <div>{inv.customerName}</div>
                      <div className="text-[10px] text-slate-500">{inv.customerEmail}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono">{inv.invoiceDate}</td>
                    <td className={`py-3.5 px-4 font-mono ${isOverdue ? 'text-rose-400 font-bold' : 'text-slate-400'}`}>
                      {inv.dueDate}
                      {isOverdue && <span className="block text-[9px] uppercase font-sans text-rose-500">Overdue</span>}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {inv.subscriptionNumber || <span className="text-slate-600">Manual Order</span>}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide ${
                        isPaid
                          ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60'
                          : isOverdue
                          ? 'bg-rose-950/80 text-rose-400 border-rose-800/60 animate-pulse'
                          : 'bg-amber-950/80 text-amber-400 border-amber-800/60'
                      }`}>
                        {isPaid ? 'Paid' : isOverdue ? 'Overdue' : 'Outstanding'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-white">
                      ₹{inv.amountTotal.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setViewDetailInvoice(inv)}
                          title="View Invoice Breakdown"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {!isPaid ? (
                          <button
                            onClick={() => setPaymentModalInvoice(inv)}
                            className="px-2.5 py-1 rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 text-[11px] font-bold shadow-md shadow-cyan-500/20 transition-all cursor-pointer flex items-center gap-1"
                          >
                            <CreditCard className="w-3 h-3" />
                            <span>Register Payment</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              if (onViewReceipt && inv.receiptNumber) {
                                onViewReceipt(inv.receiptNumber);
                              } else {
                                setViewDetailInvoice(inv);
                              }
                            }}
                            className="px-2.5 py-1 rounded-xl bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 hover:bg-emerald-900/60 text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
                          >
                            <Receipt className="w-3 h-3 text-emerald-400" />
                            <span>Receipt</span>
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
                    No invoice records found matching the active criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Detail Drawer / Modal */}
      {viewDetailInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in duration-200 text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="text-lg font-black text-white">{viewDetailInvoice.number}</h3>
                  <div className="text-[10px] text-slate-400">
                    Origin: {viewDetailInvoice.subscriptionNumber || 'Manual Direct Invoice'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setViewDetailInvoice(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Billing Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500">Billed To</span>
                <div className="font-bold text-white mt-0.5">{viewDetailInvoice.customerName}</div>
                <div className="text-[10px] text-slate-400">{viewDetailInvoice.customerEmail}</div>
                <div className="text-[10px] text-slate-400">GST: {viewDetailInvoice.customerGst || 'Unregistered'}</div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500">Timeline</span>
                <div className="text-slate-300 mt-0.5">Issued: <strong className="text-white">{viewDetailInvoice.invoiceDate}</strong></div>
                <div className="text-slate-300">Due: <strong className="text-white">{viewDetailInvoice.dueDate}</strong></div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500">Status</span>
                <div className="mt-1">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${
                    viewDetailInvoice.paymentState === 'paid'
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                      : 'bg-rose-950 text-rose-400 border-rose-800'
                  }`}>
                    {viewDetailInvoice.paymentState === 'paid' ? 'Paid & Reconciled' : 'Unpaid'}
                  </span>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/40">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950 border-b border-slate-800 text-[10px] uppercase text-slate-400 font-bold">
                  <tr>
                    <th className="py-2.5 px-3">Item Description</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Unit Price</th>
                    <th className="py-2.5 px-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {viewDetailInvoice.lines && viewDetailInvoice.lines.length > 0 ? (
                    viewDetailInvoice.lines.map((l, i) => (
                      <tr key={i}>
                        <td className="py-2.5 px-3 text-slate-200">{l.description}</td>
                        <td className="py-2.5 px-3 text-center text-slate-400">{l.qty}</td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-300">₹{l.unitPrice}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-white">₹{l.total}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="py-2.5 px-3 text-slate-200">Recurring Subscription Service</td>
                      <td className="py-2.5 px-3 text-center text-slate-400">1</td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-300">₹{viewDetailInvoice.amountUntaxed}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-white">₹{viewDetailInvoice.amountUntaxed}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Calculations Breakdown */}
            <div className="flex justify-end text-xs">
              <div className="w-64 space-y-1.5 border-t border-slate-800 pt-2 font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Untaxed Amount:</span>
                  <span>₹{viewDetailInvoice.amountUntaxed.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>GST (18% Total):</span>
                  <span>₹{viewDetailInvoice.amountTax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-cyan-400 border-t border-slate-800 pt-1">
                  <span>Grand Total:</span>
                  <span>₹{viewDetailInvoice.amountTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between border-t border-slate-800 pt-3">
              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs text-slate-300 font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-cyan-400" />
                <span>Print Invoice</span>
              </button>

              <div className="flex items-center gap-2">
                {viewDetailInvoice.paymentState === 'paid' && viewDetailInvoice.receiptNumber && onViewReceipt && (
                  <button
                    onClick={() => {
                      setViewDetailInvoice(null);
                      onViewReceipt(viewDetailInvoice.receiptNumber);
                    }}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>View Stamped Receipt</span>
                  </button>
                )}
                <button
                  onClick={() => setViewDetailInvoice(null)}
                  className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Register Payment Modal (Odoo-Style Register Payment) */}
      {paymentModalInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in duration-200 text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  Odoo Payment Registration
                </span>
                <h3 className="text-lg font-black text-white">Record &amp; Settle Payment</h3>
              </div>
              <button
                onClick={() => setPaymentModalInvoice(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-400 block mb-1">Target Customer &amp; Invoice</label>
                <div className="font-mono font-bold text-white bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center">
                  <span>{paymentModalInvoice.number}</span>
                  <span className="text-cyan-400 text-xs">{paymentModalInvoice.customerName}</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-400 block mb-1">Settlement Balance (₹)</label>
                <input
                  type="text"
                  readOnly
                  value={`₹${paymentModalInvoice.amountResidual.toLocaleString('en-IN')}`}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 font-mono font-bold text-cyan-400"
                />
              </div>

              <div>
                <label className="font-bold text-slate-400 block mb-1">Payment Journal / Rail</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 font-medium text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="upi">UPI / Instant QR (Razorpay Rail)</option>
                  <option value="card">Credit / Debit Card (Stripe Token Vault)</option>
                  <option value="bank">Bank Transfer / NEFT (HDFC API)</option>
                  <option value="cash">Counter Cash Settlement</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-400 block mb-1">Audit Memo &amp; Reference</label>
                <input
                  type="text"
                  value={paymentMemo}
                  onChange={(e) => setPaymentMemo(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  placeholder="e.g. Transaction Ref, Bank UTR..."
                />
              </div>

              <div className="p-3 bg-cyan-950/40 border border-cyan-800/50 rounded-xl text-[11px] text-cyan-300 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  Posting payment triggers automated ledger reconciliation, updates MRR, creates a cryptographically signed GST receipt, and records audit consent.
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
              <button
                onClick={() => setPaymentModalInvoice(null)}
                className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-bold hover:bg-slate-800 text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPayment}
                className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 text-xs font-bold shadow-lg shadow-cyan-500/20 cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Post Payment &amp; Issue Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
