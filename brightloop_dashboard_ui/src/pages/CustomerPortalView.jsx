// CustomerPortalView.jsx
import React, { useState } from 'react';
import {
  UserCheck,
  CreditCard,
  Download,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Send,
  ShieldCheck,
  FileText
} from 'lucide-react';

export default function CustomerPortalView({
  subscriptions,
  invoices,
  onRequestChange,
}) {
  const [requestType, setRequestType] = useState('change');
  const [requestNote, setRequestNote] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState(false);

  // Customer isolated data (Acme Software Corp)
  const mySubs = subscriptions.filter((s) => s.customerId === 'cust_acme');
  const activeSub = mySubs[0] || subscriptions[0];
  const myInvoices = invoices.filter((i) => i.customerName.includes('Acme'));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!requestNote) return;
    onRequestChange(activeSub.id, {
      type: requestType,
      note: requestNote,
      timestamp: new Date().toLocaleTimeString(),
    });
    setSubmittedMessage(true);
    setRequestNote('');
    setTimeout(() => setSubmittedMessage(false), 5000);
  };

  return (
    <main className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Customer Self-Service Portal
          </span>
          <h1 className="text-2xl font-black text-black mt-1">Welcome, Acme Software Corp</h1>
          <p className="text-xs text-neutral-600">Isolated customer view: access your active membership, receipts, and submit change requests directly to support.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-neutral-100 text-xs font-mono text-neutral-600 border border-neutral-200">
            Account: billing@acmesoftware.test
          </span>
        </div>
      </div>

      {submittedMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Your request has been safely dispatched to the operations team and scheduled on the staff activity chatter.</span>
        </div>
      )}

      {/* Active Subscription Overview Card */}
      {activeSub && (
        <div className="rounded-3xl border-2 border-black bg-white p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-black font-mono">{activeSub.number}</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wide border border-emerald-300">
                  {activeSub.state}
                </span>
              </div>
              <div className="text-xs text-neutral-500 mt-0.5">Plan Tier: <strong className="text-black">{activeSub.planName}</strong></div>
            </div>

            <div className="text-right">
              <div className="text-xs text-neutral-400">Total Billed per Cycle</div>
              <div className="text-2xl font-black text-black">₹{activeSub.amountTotal.toLocaleString('en-IN')}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200">
              <div className="text-neutral-400 text-[10px] uppercase font-bold">Start Date</div>
              <div className="font-bold text-black mt-0.5">{activeSub.startDate}</div>
            </div>
            <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200">
              <div className="text-neutral-400 text-[10px] uppercase font-bold">Next Billing Date</div>
              <div className="font-bold text-emerald-700 mt-0.5 font-mono">{activeSub.nextBillingDate || 'Pending'}</div>
            </div>
            <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200">
              <div className="text-neutral-400 text-[10px] uppercase font-bold">Terms</div>
              <div className="font-bold text-black mt-0.5">{activeSub.paymentTerm}</div>
            </div>
            <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200">
              <div className="text-neutral-400 text-[10px] uppercase font-bold">Auto-Renewable</div>
              <div className="font-bold text-emerald-700 mt-0.5">Yes (Active)</div>
            </div>
          </div>

          {/* Subscribed Product Lines */}
          <div className="space-y-2 pt-2">
            <div className="text-xs font-bold text-black uppercase tracking-wider">Subscribed Lines &amp; Brand Add-ons</div>
            <div className="border border-neutral-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-bold text-[10px]">
                  <tr>
                    <th className="py-2.5 px-4">Item</th>
                    <th className="py-2.5 px-2 text-center">Qty</th>
                    <th className="py-2.5 px-4 text-right">Unit Price</th>
                    <th className="py-2.5 px-4 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {activeSub.lines.map((ln) => (
                    <tr key={ln.id}>
                      <td className="py-2.5 px-4">
                        <div className="font-bold text-black">{ln.productName}</div>
                        {ln.variant && <div className="text-[10px] text-teal-700 font-medium">{ln.variant}</div>}
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono">{ln.qty}</td>
                      <td className="py-2.5 px-4 text-right font-mono">₹{ln.unitPrice}</td>
                      <td className="py-2.5 px-4 text-right font-mono font-bold text-black">₹{ln.subtotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Invoices & Receipt History */}
      <div className="rounded-3xl border-2 border-black bg-white p-6 shadow-sm space-y-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Billing History</span>
          <h3 className="text-lg font-black text-black">Your Invoices &amp; Receipts</h3>
        </div>

        <div className="border border-neutral-200 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-bold text-[10px]">
              <tr>
                <th className="py-2.5 px-4">Invoice #</th>
                <th className="py-2.5 px-4">Date</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Amount</th>
                <th className="py-2.5 px-4 text-center">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {myInvoices.map((inv) => (
                <tr key={inv.id}>
                  <td className="py-3 px-4 font-mono font-bold text-black">{inv.number}</td>
                  <td className="py-3 px-4 text-neutral-600 font-mono">{inv.invoiceDate}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                      Paid
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-black text-black">₹{inv.amountTotal.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => alert(`Simulating PDF Receipt Download for ${inv.number}`)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-neutral-300 hover:bg-neutral-100 text-[11px] font-semibold text-neutral-700 cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Self-Service Plan Change / Cancellation Request Form */}
      <div className="rounded-3xl border-2 border-black bg-neutral-900 text-white p-6 shadow-xl space-y-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">Self-Service Action</span>
          <h3 className="text-lg font-black text-white">Request Plan Change or Cancellation</h3>
          <p className="text-xs text-neutral-400">
            Submit changes to your billing tier, request seat additions, or request cancellation. A task is immediately scheduled on the support queue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-neutral-300">Request Type</label>
              <select
                value={requestType}
                onChange={(e) => setRequestType(e.target.value)}
                className="w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="change">Upgrade / Change Plan</option>
                <option value="add_seats">Add Extra Seats</option>
                <option value="cancel">Request Cancellation</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-neutral-300">Notes / Justification</label>
              <input
                type="text"
                required
                value={requestNote}
                onChange={(e) => setRequestNote(e.target.value)}
                placeholder="e.g. Please add 5 extra seats starting next month..."
                className="w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Request to Staff</span>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
