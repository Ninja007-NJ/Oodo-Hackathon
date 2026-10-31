// PlansView.jsx - Admin Subscription Plans with Intervals, Min Qty & Lifecycle Flags
import React, { useState } from 'react';
import { Repeat, Plus, Calendar, Check, X, Shield, Clock, Zap } from 'lucide-react';

export default function PlansView({ plans, onAddPlan }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [billingPeriod, setBillingPeriod] = useState('monthly'); // daily | weekly | monthly | yearly
  const [minQty, setMinQty] = useState(1);
  const [availableFrom, setAvailableFrom] = useState('2026-01-01');
  const [availableTo, setAvailableTo] = useState('2026-12-31');
  const [autoClose, setAutoClose] = useState(false);
  const [closable, setClosable] = useState(true);
  const [pausable, setPausable] = useState(true);
  const [renewable, setRenewable] = useState(true);
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || price === '') return;
    const newPlan = {
      id: `plan_${Date.now()}`,
      name,
      price: Number(price),
      billing_period: billingPeriod,
      min_qty: Number(minQty) || 1,
      available_from: availableFrom,
      available_to: availableTo,
      auto_close: autoClose,
      closable,
      pausable,
      renewable,
      description: description || `${billingPeriod} recurring plan`,
    };
    if (onAddPlan) onAddPlan(newPlan);
    setModalOpen(false);
    setName('');
    setPrice('');
    setDescription('');
  };

  return (
    <main className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-950/60 px-2.5 py-0.5 rounded-full border border-orange-800/60">
              Admin Configuration
            </span>
            <span className="text-xs text-slate-400">• Odoo Subscription Plans</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Subscription Plan Rules &amp; Intervals</h1>
          <p className="text-xs text-slate-400">
            Configure recurring contract intervals (daily, weekly, monthly, yearly), minimum purchase quantity, and lifecycle flags.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-xs shadow-md hover:brightness-110 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Plan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((p) => {
          return (
            <div
              key={p.id}
              className="rounded-2xl border border-slate-800 bg-[#121620]/90 p-5 space-y-4 flex flex-col justify-between hover:border-slate-700 transition-all shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2.5">
                  <div>
                    <h3 className="font-bold text-white text-base">{p.name}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-orange-400 font-mono">
                      {p.billing_period}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-white font-mono">₹{p.price.toLocaleString('en-IN')}</span>
                    <span className="block text-[10px] text-slate-500">/{p.billing_period}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed min-h-[36px]">
                  {p.description}
                </p>

                <div className="space-y-1.5 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 font-mono text-[11px]">
                  <div className="flex justify-between text-slate-400">
                    <span>Min Quantity:</span>
                    <strong className="text-slate-200">{p.min_qty} unit(s)</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Validity Window:</span>
                    <span className="text-slate-300">{p.available_from} to {p.available_to}</span>
                  </div>
                </div>

                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Lifecycle Flags:
                  </span>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                    <div className={`p-1.5 rounded-lg border flex items-center gap-1.5 ${p.pausable ? 'bg-emerald-950/30 border-emerald-900/60 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                      {p.pausable ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3" />}
                      <span>Pausable</span>
                    </div>
                    <div className={`p-1.5 rounded-lg border flex items-center gap-1.5 ${p.closable ? 'bg-emerald-950/30 border-emerald-900/60 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                      {p.closable ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3" />}
                      <span>Closable</span>
                    </div>
                    <div className={`p-1.5 rounded-lg border flex items-center gap-1.5 ${p.renewable ? 'bg-emerald-950/30 border-emerald-900/60 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                      {p.renewable ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3" />}
                      <span>Renewable</span>
                    </div>
                    <div className={`p-1.5 rounded-lg border flex items-center gap-1.5 ${p.auto_close ? 'bg-amber-950/30 border-amber-900/60 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                      {p.auto_close ? <Check className="w-3 h-3 text-amber-400" /> : <X className="w-3 h-3" />}
                      <span>Auto Close</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal to add Plan */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121620] border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Configure New Plan</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Plan Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Enterprise Weekly"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Billing Interval</label>
                  <select
                    value={billingPeriod}
                    onChange={(e) => setBillingPeriod(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:border-orange-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Price per Interval (₹)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="2500"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Minimum Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={minQty}
                    onChange={(e) => setMinQty(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Available From</label>
                  <input
                    type="date"
                    value={availableFrom}
                    onChange={(e) => setAvailableFrom(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Available To</label>
                  <input
                    type="date"
                    value={availableTo}
                    onChange={(e) => setAvailableTo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1.5">Lifecycle Flags</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pausable}
                      onChange={(e) => setPausable(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-900 text-orange-500"
                    />
                    <span>Allow Customer Pause</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={closable}
                      onChange={(e) => setClosable(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-900 text-orange-500"
                    />
                    <span>Allow Customer Close</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={renewable}
                      onChange={(e) => setRenewable(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-900 text-orange-500"
                    />
                    <span>Allow Auto-Renewal</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoClose}
                      onChange={(e) => setAutoClose(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-900 text-orange-500"
                    />
                    <span>Auto-Close on Expiry</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-500 text-slate-950 font-bold hover:bg-orange-400 cursor-pointer shadow-md"
                >
                  Save Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
