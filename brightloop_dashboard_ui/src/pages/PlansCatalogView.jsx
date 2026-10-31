// PlansCatalogView.jsx
import React, { useState } from 'react';
import {
  Package,
  Plus,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Layers,
  X
} from 'lucide-react';

export default function PlansCatalogView({
  plans,
  products,
  onAddPlan,
  currentRole,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanPrice, setNewPlanPrice] = useState('2500');
  const [newPlanPeriod, setNewPlanPeriod] = useState('monthly');
  const [newPlanClosable, setNewPlanClosable] = useState(true);
  const [newPlanPausable, setNewPlanPausable] = useState(true);
  const [newPlanRenewable, setNewPlanRenewable] = useState(true);
  const [newPlanAutoClose, setNewPlanAutoClose] = useState(false);

  const isAdmin = currentRole === 'admin';

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newPlanName) return;
    onAddPlan({
      id: `plan_${Date.now()}`,
      name: newPlanName,
      price: parseFloat(newPlanPrice) || 0,
      billing_period: newPlanPeriod,
      min_qty: 1,
      closable: newPlanClosable,
      pausable: newPlanPausable,
      renewable: newPlanRenewable,
      auto_close: newPlanAutoClose,
      description: 'Configured via Brightloop Administrator Console.',
    });
    setModalOpen(false);
    setNewPlanName('');
  };

  return (
    <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Service Catalog &amp; Variants</span>
          <h1 className="text-2xl font-black text-black">Subscription Plans &amp; Product Add-ons</h1>
          <p className="text-xs text-neutral-600">
            Define billing intervals (daily, weekly, monthly, yearly), seat minimums, lifecycle flags, and brand variants (+₹560 for Odoo).
          </p>
        </div>

        {isAdmin ? (
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black text-white hover:bg-neutral-800 text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Create New Plan</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 text-[11px] text-neutral-500 font-medium border border-neutral-200">
            <ShieldAlert className="w-3.5 h-3.5 text-neutral-400" />
            <span>Read-Only for Staff (Admin Config Required)</span>
          </div>
        )}
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="rounded-3xl border-2 border-black bg-white p-5 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                  {plan.billing_period} Tier
                </span>
                <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-[10px] font-bold text-neutral-800">
                  Min {plan.min_qty} seats
                </span>
              </div>

              <h3 className="text-lg font-black text-black tracking-tight">{plan.name}</h3>

              <div className="text-3xl font-black text-black">
                ₹{plan.price.toLocaleString('en-IN')}
                <span className="text-xs font-normal text-neutral-400">/{plan.billing_period}</span>
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed pt-1">
                {plan.description}
              </p>
            </div>

            <div className="space-y-1.5 pt-3 border-t border-neutral-100 text-xs text-neutral-700">
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Auto Close on Expiry:</span>
                <span className={`font-bold ${plan.auto_close ? 'text-emerald-700' : 'text-neutral-400'}`}>
                  {plan.auto_close ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Cancel / Closable:</span>
                <span className={`font-bold ${plan.closable ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {plan.closable ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Pausable:</span>
                <span className={`font-bold ${plan.pausable ? 'text-emerald-700' : 'text-neutral-400'}`}>
                  {plan.pausable ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Renewable:</span>
                <span className={`font-bold ${plan.renewable ? 'text-emerald-700' : 'text-neutral-400'}`}>
                  {plan.renewable ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Brand Product Variants Showcase (Brightloop CRM + Odoo +560) */}
      <div className="rounded-3xl border-2 border-black bg-white p-6 shadow-sm space-y-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Odoo Product Template &amp; Attributes</span>
          <h3 className="text-lg font-black text-black">Product Variants &amp; Price Extra Rules</h3>
          <p className="text-xs text-neutral-600">
            Testing criteria: Selecting brand variant "Odoo" dynamically adds ₹560 to the base price of the item upon snapshotting.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {products.find((p) => p.id === 'prod_crm')?.variants.map((v, i) => (
            <div key={i} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Variant</div>
              <div className="text-base font-black text-black">{v.name}</div>
              <div className="text-xs text-neutral-600">
                Price Adjustment: <strong className={v.extra > 0 ? 'text-teal-700' : 'text-neutral-700'}>
                  {v.extra > 0 ? `+₹${v.extra}` : 'Base Price (₹1,500)'}
                </strong>
              </div>
              <div className="text-xs font-mono font-bold text-black pt-1">
                Final Snapshot: ₹{1500 + v.extra}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Plan Modal (Admin Only) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <form onSubmit={handleCreate} className="w-full max-w-md bg-white rounded-3xl border-2 border-black p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-lg font-black text-black">Create Subscription Plan</h3>
              <button type="button" onClick={() => setModalOpen(false)} className="text-neutral-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-neutral-700">Plan Name</label>
                <input
                  type="text"
                  required
                  value={newPlanName}
                  onChange={(e) => setNewPlanName(e.target.value)}
                  placeholder="e.g. Enterprise Quarterly"
                  className="w-full mt-1 bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-700">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newPlanPrice}
                    onChange={(e) => setNewPlanPrice(e.target.value)}
                    className="w-full mt-1 bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-black"
                  />
                </div>
                <div>
                  <label className="font-bold text-neutral-700">Billing Period</label>
                  <select
                    value={newPlanPeriod}
                    onChange={(e) => setNewPlanPeriod(e.target.value)}
                    className="w-full mt-1 bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-black"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-neutral-100">
                <label className="font-bold text-neutral-700 block">Lifecycle Rules</label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="chk_closable"
                    checked={newPlanClosable}
                    onChange={(e) => setNewPlanClosable(e.target.checked)}
                  />
                  <label htmlFor="chk_closable">Permit early cancellation (Closable)</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="chk_pausable"
                    checked={newPlanPausable}
                    onChange={(e) => setNewPlanPausable(e.target.checked)}
                  />
                  <label htmlFor="chk_pausable">Allow temporary pause (Pausable)</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="chk_renewable"
                    checked={newPlanRenewable}
                    onChange={(e) => setNewPlanRenewable(e.target.checked)}
                  />
                  <label htmlFor="chk_renewable">Auto-renewable at cycle end</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="chk_autoclose"
                    checked={newPlanAutoClose}
                    onChange={(e) => setNewPlanAutoClose(e.target.checked)}
                  />
                  <label htmlFor="chk_autoclose">Auto-close on contract expiry</label>
                </div>
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-neutral-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-black text-white font-bold text-xs shadow-md"
              >
                Save Plan
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
