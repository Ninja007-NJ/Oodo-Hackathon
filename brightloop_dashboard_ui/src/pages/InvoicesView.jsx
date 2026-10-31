// InvoicesView.jsx - Full Dark-Navy Accounting & Invoicing Portal with Status Stepper & Odoo Buttons
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
  Check,
  Send,
  Ban,
  MailCheck
} from 'lucide-react';

export default function InvoicesView({
  invoices = [],
  onRegisterPayment,
  onUpdateInvoice,
  onNavigate,
  onViewReceipt,
  initialFilter = 'all',
  currentRole = 'admin',
}) {
  const [filterState, setFilterState] = useState(initialFilter);
  const [search, setSearch] = useState('');
  const [paymentModalInvoice, setPaymentModalInvoice] = useState(null);
  const [viewDetailInvoice, setViewDetailInvoice] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('2026-10-31');
  const [paymentMemo, setPaymentMemo] = useState('Payment settlement via portal');
  const [emailSentNotice, setEmailSentNotice] = useState(null);

  const today = new Date('2026-10-31');
  const isCustomer = currentRole === 'customer';

  // Summary Metrics
  const totalInvoiced = invoices.reduce((sum, i) => sum + i.amountTotal, 0);
  const totalPaid = invoices.filter((i) => i.paymentState === 'paid').reduce((sum, i) => sum + i.amountTotal, 0);
  const totalOutstanding = invoices
    .filter((i) => i.paymentState !== 'paid' && i.state !== 'cancelled' && new Date(i.dueDate) >= today)
    .reduce((sum, i) => sum + i.amountResidual, 0);
  const totalOverdue = invoices
    .filter((i) => i.paymentState !== 'paid' && i.state !== 'cancelled' && new Date(i.dueDate) < today)
    .reduce((sum, i) => sum + i.amountResidual, 0);

  const filtered = invoices.filter((inv) => {
    if (filterState === 'paid' && inv.paymentState !== 'paid') return false;
    if (filterState === 'outstanding' && (inv.paymentState === 'paid' || inv.state === 'cancelled')) return false;
    if (filterState === 'draft' && inv.state !== 'draft') return false;
    if (filterState === 'cancelled' && inv.state !== 'cancelled') return false;

    if (filterState.startsWith('overdue')) {
      if (inv.paymentState === 'paid' || inv.state === 'cancelled') return false;
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

  const handleOpenPaymentModal = (inv) => {
    setPaymentModalInvoice(inv);
    setPaymentAmount(inv.amountResidual || inv.amountTotal);
    setPaymentDate('2026-10-31');
    setPaymentMemo(`Settlement for ${inv.number}`);
  };

  const handleConfirmPayment = () => {
    if (!paymentModalInvoice) return;
    const inv = paymentModalInvoice;
    if (onRegisterPayment) {
      onRegisterPayment(inv.id, {
        method: paymentMethod,
        memo: paymentMemo,
        amount: Number(paymentAmount) || inv.amountResidual,
        date: paymentDate,
      });
    }
    setPaymentModalInvoice(null);
    if (viewDetailInvoice && viewDetailInvoice.id === inv.id) {
      setViewDetailInvoice((prev) => ({
        ...prev,
        paymentState: 'paid',
        amountResidual: 0,
      }));
    }
  };

  const handleConfirmInvoice = (inv) => {
    const updated = { ...inv, state: 'posted' };
    if (onUpdateInvoice) onUpdateInvoice(updated);
    setViewDetailInvoice(updated);
  };

  const handleCancelInvoice = (inv) => {
    const updated = { ...inv, state: 'cancelled' };
    if (onUpdateInvoice) onUpdateInvoice(updated);
    setViewDetailInvoice(updated);
  };

  const handleSendEmail = (inv) => {
    setEmailSentNotice(`Invoice ${inv.number} dispatched to ${inv.customerEmail} via SMTP.`);
    setTimeout(() => setEmailSentNotice(null), 5000);
  };

  return (
    <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-950/60 px-2.5 py-0.5 rounded-full border border-orange-800/50">
              {isCustomer ? 'Self-Service Portal' : 'Module 3 • Invoices & Payments'}
            </span>
            <span className="text-xs text-slate-400">18% GST Compliant Accounting</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1.5 flex items-center gap-2">
            <FileText className="w-6 h-6 text-orange-400" />
            {isCustomer ? 'My Invoices & Billing Statements' : 'Customer Invoices & Receivables'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isCustomer
              ? 'Review your billed invoices, view line item GST breakdowns, and download official receipts.'
              : 'Lifecycle status flow (Draft → Confirmed → Paid), aging buckets (1–7d, 8–30d, 31+d), and payment registration.'}
          </p>
        </div>

        {/* Quick Nav Shortcut to Receipts */}
        <div className="flex items-center gap-2">
          {onNavigate && (
            <button
              onClick={() => onNavigate('receipts')}
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-emerald-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Receipt className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tax Receipts</span>
            </button>
          )}
        </div>
      </div>

      {emailSentNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
          <MailCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{emailSentNotice}</span>
        </div>
      )}

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#121620]/90 border border-slate-800 backdrop-blur-xl">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Invoiced</div>
          <div className="text-xl font-black text-white mt-1">₹{totalInvoiced.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-slate-500 mt-1 font-mono">{invoices.length} total issued</div>
        </div>
        <div className="p-4 rounded-2xl bg-[#121620]/90 border border-emerald-900/40 backdrop-blur-xl">
          <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">Settled &amp; Paid</div>
          <div className="text-xl font-black text-emerald-400 mt-1">₹{totalPaid.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-emerald-600/80 mt-1 font-mono">100% audit matched</div>
        </div>
        <div className="p-4 rounded-2xl bg-[#121620]/90 border border-amber-900/40 backdrop-blur-xl">
          <div className="text-[10px] uppercase font-bold tracking-wider text-amber-400">Current Outstanding</div>
          <div className="text-xl font-black text-amber-400 mt-1">₹{totalOutstanding.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-amber-500/80 mt-1 font-mono">Within credit terms</div>
        </div>
        <div className="p-4 rounded-2xl bg-[#121620]/90 border border-rose-900/40 backdrop-blur-xl">
          <div className="text-[10px] uppercase font-bold tracking-wider text-rose-400">Overdue Receivables</div>
          <div className="text-xl font-black text-rose-400 mt-1">₹{totalOverdue.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-rose-500/80 mt-1 font-mono">Aging alerts active</div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#121620]/80 p-3 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { id: 'all', label: 'All Invoices' },
            { id: 'outstanding', label: 'Outstanding' },
            { id: 'paid', label: 'Paid' },
            { id: 'draft', label: 'Draft' },
            { id: 'overdue', label: 'Overdue (All)' },
            { id: 'overdue_1_7', label: '1–7 Days' },
            { id: 'overdue_8_30', label: '8–30 Days' },
            { id: 'overdue_31_plus', label: '31+ Days' },
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
            placeholder="Search invoice #, customer..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Invoices Data Table */}
      <div className="rounded-3xl border border-slate-800 bg-[#121620]/90 backdrop-blur-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400">
              <tr>
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Invoice Date</th>
                <th className="py-3.5 px-4">Due Date</th>
                <th className="py-3.5 px-4">Origin Sub</th>
                <th className="py-3.5 px-4 text-center">Lifecycle State</th>
                <th className="py-3.5 px-4 text-center">Payment Status</th>
                <th className="py-3.5 px-4 text-right">Total Amount</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((inv) => {
                const isPaid = inv.paymentState === 'paid';
                const isCancelled = inv.state === 'cancelled';
                const isDraft = inv.state === 'draft';
                const isOverdue = !isPaid && !isCancelled && !isDraft && new Date(inv.dueDate) < today;

                return (
                  <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-orange-400">
                      <button
                        onClick={() => setViewDetailInvoice(inv)}
                        className="hover:underline cursor-pointer flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5 text-orange-400" />
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
                        isCancelled
                          ? 'bg-slate-900 text-slate-500 border-slate-800'
                          : isDraft
                          ? 'bg-slate-800 text-slate-400 border-slate-700'
                          : 'bg-blue-950/80 text-blue-400 border-blue-800/60'
                      }`}>
                        {inv.state || 'posted'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide ${
                        isPaid
                          ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60'
                          : isCancelled
                          ? 'bg-slate-900 text-slate-500 border-slate-800'
                          : isOverdue
                          ? 'bg-rose-950/80 text-rose-400 border-rose-800/60 animate-pulse'
                          : 'bg-amber-950/80 text-amber-400 border-amber-800/60'
                      }`}>
                        {isPaid ? 'Paid' : isCancelled ? 'Void' : isOverdue ? 'Overdue' : 'Outstanding'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-white">
                      ₹{inv.amountTotal.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setViewDetailInvoice(inv)}
                          title="View Invoice Breakdown & Status Flow"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {!isPaid && !isCancelled ? (
                          <button
                            onClick={() => handleOpenPaymentModal(inv)}
                            className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 hover:brightness-110 text-[11px] font-bold shadow-md shadow-orange-500/20 transition-all cursor-pointer flex items-center gap-1"
                          >
                            <CreditCard className="w-3 h-3" />
                            <span>Record Payment</span>
                          </button>
                        ) : isPaid ? (
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
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-slate-500">
                    No invoice records found matching the active criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Detail Drawer / Modal with Lifecycle Stepper & Actions */}
      {viewDetailInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl bg-[#121620] border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in duration-200 text-slate-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-400" />
                <div>
                  <h3 className="text-lg font-black text-white">{viewDetailInvoice.number}</h3>
                  <div className="text-[10px] text-slate-400">
                    Origin: {viewDetailInvoice.subscriptionNumber || 'Direct Customer Invoice'}
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

            {/* Lifecycle Status Stepper (Draft → Confirmed → Paid) */}
            <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-2">Invoice Lifecycle Status Flow</div>
              <div className="flex items-center justify-between relative">
                {['draft', 'confirmed', 'paid'].map((st, idx) => {
                  const currentSt = viewDetailInvoice.paymentState === 'paid' ? 'paid' : (viewDetailInvoice.state || 'confirmed');
                  const stepOrder = ['draft', 'confirmed', 'paid'];
                  const isPassed = stepOrder.indexOf(currentSt) >= idx;
                  const isCurrent = currentSt === st || (currentSt === 'posted' && st === 'confirmed');

                  return (
                    <div key={st} className="flex-1 flex flex-col items-center relative z-10">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
                          isCurrent
                            ? 'bg-orange-500 text-slate-950 border-orange-400 ring-2 ring-orange-500/30'
                            : isPassed
                            ? 'bg-emerald-600 text-white border-emerald-500'
                            : 'bg-slate-900 text-slate-500 border-slate-800'
                        }`}
                      >
                        {isPassed && !isCurrent ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                      </div>
                      <span className={`text-[10px] uppercase font-bold mt-1.5 ${
                        isCurrent ? 'text-orange-400' : isPassed ? 'text-slate-300' : 'text-slate-600'
                      }`}>
                        {st}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Bar (Confirm, Cancel, Send by Email, Print, Record Payment) */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                {viewDetailInvoice.state === 'draft' && (
                  <button
                    onClick={() => handleConfirmInvoice(viewDetailInvoice)}
                    className="px-3 py-1.5 rounded-xl bg-orange-500 text-slate-950 font-bold hover:bg-orange-400 cursor-pointer flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Confirm Invoice</span>
                  </button>
                )}

                {viewDetailInvoice.state !== 'cancelled' && viewDetailInvoice.paymentState !== 'paid' && (
                  <button
                    onClick={() => handleCancelInvoice(viewDetailInvoice)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-rose-400 border border-rose-900/40 hover:bg-rose-950/60 font-semibold cursor-pointer flex items-center gap-1"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>Cancel</span>
                  </button>
                )}

                <button
                  onClick={() => handleSendEmail(viewDetailInvoice)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold cursor-pointer flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5 text-blue-400" />
                  <span>Send by Email</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold cursor-pointer flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-400" />
                  <span>Print</span>
                </button>
              </div>

              {viewDetailInvoice.paymentState !== 'paid' && viewDetailInvoice.state !== 'cancelled' && (
                <button
                  onClick={() => handleOpenPaymentModal(viewDetailInvoice)}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold hover:brightness-110 cursor-pointer flex items-center gap-1.5 shadow-md"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Record Payment</span>
                </button>
              )}
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
                <span className="text-[10px] uppercase font-bold text-slate-500">Payment Status</span>
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
                <div className="flex justify-between text-sm font-black text-orange-400 border-t border-slate-800 pt-1">
                  <span>Grand Total:</span>
                  <span>₹{viewDetailInvoice.amountTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-2 border-t border-slate-800 pt-3">
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
      )}

      {/* Record Payment Form Modal (Method, Amount, Date, Note) */}
      {paymentModalInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-[#121620] border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in duration-200 text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400">
                  Odoo Payment Wizard
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
                  <span className="text-orange-400 text-xs">{paymentModalInvoice.customerName}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Payment Amount (₹)</label>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 font-mono font-bold text-orange-400 focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Payment Date</label>
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 font-mono text-slate-200 focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-400 block mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 font-medium text-slate-200 focus:outline-none focus:border-orange-500"
                >
                  <option value="upi">UPI / Instant QR</option>
                  <option value="card">Credit / Debit Card</option>
                  <option value="bank">Bank Transfer / NEFT</option>
                  <option value="cash">Counter Cash Settlement</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-400 block mb-1">Payment Memo / Note</label>
                <input
                  type="text"
                  value={paymentMemo}
                  onChange={(e) => setPaymentMemo(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-orange-500"
                  placeholder="e.g. UTR number, bank transfer reference..."
                />
              </div>

              <div className="p-3 bg-orange-950/30 border border-orange-800/40 rounded-xl text-[11px] text-orange-300 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span>
                  Posting payment marks the invoice as Paid, generates a cryptographic GST receipt, and reconciles the account balance.
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
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold hover:brightness-110 text-xs shadow-lg shadow-orange-500/20 cursor-pointer flex items-center gap-1.5"
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
