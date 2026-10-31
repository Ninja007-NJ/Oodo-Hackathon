// InvoicesView.jsx
import React, { useState } from 'react';
import {
  CreditCard,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  DollarSign,
  Download,
  Calendar,
  X
} from 'lucide-react';

export default function InvoicesView({
  invoices,
  onRegisterPayment,
  initialFilter = 'all',
}) {
  const [filterState, setFilterState] = useState(initialFilter);
  const [search, setSearch] = useState('');
  const [paymentModalInvoice, setPaymentModalInvoice] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [paymentMemo, setPaymentMemo] = useState('Manual counter reconciliation');

  const today = new Date('2026-10-31');

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
    setPaymentModalInvoice(null);
  };

  return (
    <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Accounting &amp; Billing Records</span>
        <h1 className="text-2xl font-black text-black">Customer Invoices &amp; Payments</h1>
        <p className="text-xs text-neutral-600">
          Generated automatically from subscriptions. Reconcile settlements via standard Odoo payment registration across Cash, UPI, Card, and Bank.
        </p>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 pb-3">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { id: 'all', label: 'All Invoices' },
            { id: 'paid', label: 'Paid' },
            { id: 'outstanding', label: 'Outstanding' },
            { id: 'overdue', label: 'Overdue (All)' },
            { id: 'overdue_1_7', label: '1–7 Days Overdue' },
            { id: 'overdue_8_30', label: '8–30 Days Overdue' },
            { id: 'overdue_31_plus', label: '31+ Days Overdue' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterState(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                filterState === tab.id
                  ? 'bg-black text-white shadow-sm'
                  : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invoice #, customer..."
            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-neutral-800 focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-3xl border-2 border-black bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Invoice Date</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Origin Subscription</th>
                <th className="py-3 px-4 text-center">Payment State</th>
                <th className="py-3 px-4 text-right">Total Amount</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map((inv) => {
                const isPaid = inv.paymentState === 'paid';
                const isOverdue = !isPaid && new Date(inv.dueDate) < today;

                return (
                  <tr key={inv.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-black">{inv.number}</td>
                    <td className="py-3 px-4 font-medium text-neutral-800">
                      <div>{inv.customerName}</div>
                      <div className="text-[10px] text-neutral-400">{inv.customerEmail}</div>
                    </td>
                    <td className="py-3 px-4 text-neutral-600 font-mono">{inv.invoiceDate}</td>
                    <td className={`py-3 px-4 font-mono ${isOverdue ? 'text-rose-600 font-bold' : 'text-neutral-600'}`}>
                      {inv.dueDate}
                      {isOverdue && <span className="block text-[9px] uppercase font-sans text-rose-500">Overdue</span>}
                    </td>
                    <td className="py-3 px-4 font-mono text-neutral-500">
                      {inv.subscriptionNumber || 'Direct Order'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide ${
                        isPaid
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : isOverdue
                          ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}>
                        {isPaid ? 'Paid' : isOverdue ? 'Overdue' : 'Outstanding'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-black text-black">
                      ₹{inv.amountTotal.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {!isPaid ? (
                        <button
                          onClick={() => setPaymentModalInvoice(inv)}
                          className="px-3 py-1 rounded-xl bg-black text-white hover:bg-neutral-800 text-[11px] font-bold shadow-xs transition-all cursor-pointer"
                        >
                          Register Payment
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-600 font-bold flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Reconciled
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-neutral-400">
                    No invoice records found matching the active criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Payment Modal (Odoo-Style Register Payment) */}
      {paymentModalInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-3xl border-2 border-black p-6 shadow-2xl space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Odoo Payment Registration</span>
                <h3 className="text-lg font-black text-black">Record Payment</h3>
              </div>
              <button
                onClick={() => setPaymentModalInvoice(null)}
                className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-neutral-700">Invoice Target</label>
                <div className="font-mono font-bold text-black mt-0.5">
                  {paymentModalInvoice.number} ({paymentModalInvoice.customerName})
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-700">Amount to Settle (₹)</label>
                <input
                  type="text"
                  readOnly
                  value={`₹${paymentModalInvoice.amountResidual.toLocaleString('en-IN')}`}
                  className="w-full mt-1 bg-neutral-100 border border-neutral-300 rounded-xl px-3 py-2 font-mono font-bold text-black"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700">Payment Journal / Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full mt-1 bg-white border border-neutral-300 rounded-xl px-3 py-2 font-medium text-black focus:outline-none focus:ring-1 focus:ring-black"
                >
                  <option value="upi">UPI / Instant QR</option>
                  <option value="card">Credit / Debit Card</option>
                  <option value="bank">Bank Transfer / NEFT</option>
                  <option value="cash">Counter Cash</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-neutral-700">Audit Memo / Reference Note</label>
                <input
                  type="text"
                  value={paymentMemo}
                  onChange={(e) => setPaymentMemo(e.target.value)}
                  className="w-full mt-1 bg-white border border-neutral-300 rounded-xl px-3 py-2 text-black focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="e.g. Transaction Ref, Bank UTR..."
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-neutral-100">
              <button
                onClick={() => setPaymentModalInvoice(null)}
                className="px-4 py-2 rounded-xl border border-neutral-300 text-xs font-bold hover:bg-neutral-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPayment}
                className="px-5 py-2 rounded-xl bg-black text-white hover:bg-neutral-800 text-xs font-bold shadow-md cursor-pointer"
              >
                Confirm &amp; Post Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
