// DiscountsView.jsx - Admin Discount Rules with Fixed/Percent, Min Spend, Dates & Usage Limit
import React, { useState } from 'react';
import { Percent, Plus, Calendar, Tag, Check, X, ShieldAlert, Sparkles, Hash } from 'lucide-react';

export default function DiscountsView({ discounts, onAddDiscount }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('percent'); // percent | fixed
  const [value, setValue] = useState('');
  const [minPurchase, setMinPurchase] = useState(0);
  const [minQty, setMinQty] = useState(1);
  const [usageLimit, setUsageLimit] = useState(10);
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-12-31');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || value === '') return;
    const newDisc = {
      id: `disc_${Date.now()}`,
      name,
      type,
      value: Number(value),
      min_purchase: Number(minPurchase) || 0,
      min_qty: Number(minQty) || 1,
      usage_limit: Number(usageLimit) || 0,
      used_count: 0,
      start_date: startDate,
      end_date: endDate,
      active: true,
      scope: 'subscription',
    };
    if (onAddDiscount) onAddDiscount(newDisc);
    setModalOpen(false);
    setName('');
    setValue('');
  };

  return (
    <main className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-950/60 px-2.5 py-0.5 rounded-full border border-orange-800/60">
              Admin Only
            </span>
            <span className="text-xs text-slate-400">• Odoo Discount Rules</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Promotional Discounts &amp; Caps</h1>
          <p className="text-xs text-slate-400">
            Define non-stacking percentage or fixed amount discounts, minimum purchase thresholds, validity dates, and usage limits.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-xs shadow-md hover:brightness-110 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Discount Rule</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {discounts.map((d) => (
          <div
            key={d.id}
            className="rounded-2xl border border-slate-800 bg-[#121620]/90 p-5 space-y-4 flex flex-col justify-between hover:border-slate-700 transition-all shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center">
                    <Percent className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{d.name}</h3>
                    <span className="text-[10px] uppercase font-mono text-slate-400">
                      Type: <strong className="text-orange-400">{d.type}</strong>
                    </span>
                  </div>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${d.active ? 'bg-emerald-950/60 border-emerald-800 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                  {d.active ? 'Active' : 'Expired'}
                </span>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Discount Value:</span>
                  <strong className="text-white">
                    {d.type === 'percent' ? `${d.value}% Off` : `₹${d.value.toLocaleString('en-IN')} Flat`}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Min Purchase:</span>
                  <span className="text-slate-300">₹{d.min_purchase} (min {d.min_qty} qty)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Usage Limit:</span>
                  <span className="text-slate-300">
                    {d.usage_limit > 0 ? `${d.used_count || 0} / ${d.usage_limit} used` : 'Unlimited'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Validity:</span>
                  <span className="text-slate-400 text-[10px]">{d.start_date} to {d.end_date}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400">
                Rule engine automatically applies the <strong>single highest-saving discount</strong> without predatory stacking.
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121620] border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Create Discount Rule</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Rule Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Q4 Startup Boost 15%"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Discount Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:border-orange-500"
                  >
                    <option value="percent">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Value ({type === 'percent' ? '%' : '₹'})</label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={type === 'percent' ? '15' : '500'}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Min Spend (₹)</label>
                  <input
                    type="number"
                    value={minPurchase}
                    onChange={(e) => setMinPurchase(e.target.value)}
                    placeholder="1000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Usage Limit</label>
                  <input
                    type="number"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value)}
                    placeholder="10 (0 for unlim)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Valid From</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Valid Until</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:border-orange-500"
                  />
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
                  Save Discount Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
