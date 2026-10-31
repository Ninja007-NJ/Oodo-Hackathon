// TaxesView.jsx - Admin Tax Management Page (GST 18%, SGST/CGST split & Exemption)
import React, { useState } from 'react';
import { Receipt, Plus, Check, X, ShieldCheck, Info } from 'lucide-react';

export default function TaxesView({ taxes, onAddTax }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [rate, setRate] = useState('');
  const [cgst, setCgst] = useState('');
  const [sgst, setSgst] = useState('');
  const [description, setDescription] = useState('');

  const defaultTaxes = [
    {
      id: 'tax_gst_18',
      name: 'GST 18% (Standard Rate)',
      rate: 18,
      type: 'percent',
      cgst: 9,
      sgst: 9,
      description: 'Standard B2B SaaS subscription tax (9% CGST + 9% SGST).',
      active: true,
      scope: 'SaaS Services',
    },
    {
      id: 'tax_gst_0',
      name: 'GST Exempt (0% SEZ / Export)',
      rate: 0,
      type: 'percent',
      cgst: 0,
      sgst: 0,
      description: 'Zero-rated supply for Special Economic Zones (SEZ) and cross-border clients.',
      active: true,
      scope: 'Export / SEZ',
    },
  ];

  const taxList = taxes && taxes.length > 0 ? taxes : defaultTaxes;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || rate === '') return;
    const r = Number(rate);
    const newTax = {
      id: `tax_${Date.now()}`,
      name,
      rate: r,
      type: 'percent',
      cgst: Number(cgst) || r / 2,
      sgst: Number(sgst) || r / 2,
      description: description || `${r}% statutory tax`,
      active: true,
      scope: 'Custom Bracket',
    };
    if (onAddTax) onAddTax(newTax);
    setModalOpen(false);
    setName('');
    setRate('');
    setCgst('');
    setSgst('');
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
            <span className="text-xs text-slate-400">• Odoo Accounting Taxes</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Statutory Tax &amp; GST Configuration</h1>
          <p className="text-xs text-slate-400">
            Define statutory tax brackets applied automatically across subscription and invoice line items.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-xs shadow-md hover:brightness-110 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Tax Bracket</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {taxList.map((t) => (
          <div
            key={t.id}
            className="rounded-3xl border border-slate-800 bg-[#121620]/90 p-6 space-y-4 hover:border-slate-700 transition-all shadow-sm"
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                  %
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">{t.name}</h3>
                  <span className="text-[10px] uppercase font-mono text-slate-400">
                    Scope: <strong className="text-slate-200">{t.scope || 'Services'}</strong>
                  </span>
                </div>
              </div>
              <div className="text-right font-mono">
                <span className="text-2xl font-black text-emerald-400">{t.rate}%</span>
                <span className="block text-[10px] text-slate-500">Tax Rate</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {t.description}
            </p>

            <div className="grid grid-cols-2 gap-3 bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-500 block">CGST Component</span>
                <span className="font-bold text-slate-300">{t.cgst}%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">SGST Component</span>
                <span className="font-bold text-slate-300">{t.sgst}%</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Automatically applied to all invoice line items and printed on official GST tax receipts.</span>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121620] border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Add Tax Bracket</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Tax Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. GST 12% Software"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Total Rate (%)</label>
                  <input
                    type="number"
                    value={rate}
                    onChange={(e) => {
                      const v = e.target.value;
                      setRate(v);
                      if (v) {
                        setCgst(Number(v) / 2);
                        setSgst(Number(v) / 2);
                      }
                    }}
                    placeholder="18"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">CGST (%)</label>
                  <input
                    type="number"
                    value={cgst}
                    onChange={(e) => setCgst(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">SGST (%)</label>
                  <input
                    type="number"
                    value={sgst}
                    onChange={(e) => setSgst(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Description &amp; Applicability</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Applicable to B2B software services..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:border-orange-500"
                />
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
                  Save Tax Bracket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
