// TemplatesView.jsx - Quotation Templates with 1-Click Subscription Creation
import React, { useState } from 'react';
import { FileSpreadsheet, Plus, ArrowRight, Check, CheckCircle2, User, Layers, Calendar, DollarSign } from 'lucide-react';

export default function TemplatesView({ templates, onCreateFromTemplate, customers = [] }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState('cust_acme');
  const [createdSubNumber, setCreatedSubNumber] = useState(null);

  const defaultCustomers = [
    { id: 'cust_acme', name: 'Acme Software Corp', email: 'billing@acmesoftware.test' },
    { id: 'cust_beta', name: 'Beta Enterprises LLC', email: 'finance@betaenterprises.test' },
    { id: 'cust_alpha', name: 'Alpha Innovations', email: 'contact@alphatech.test' },
  ];
  const custList = customers.length > 0 ? customers : defaultCustomers;

  const handleCreate = (tmpl) => {
    const cust = custList.find((c) => c.id === selectedCustomerId) || custList[0];
    const newSub = onCreateFromTemplate(tmpl, cust);
    setCreatedSubNumber(newSub?.number || 'SUB/2026/00008');
    setTimeout(() => setCreatedSubNumber(null), 6000);
  };

  return (
    <main className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-950/60 px-2.5 py-0.5 rounded-full border border-orange-800/60">
              Quotation Templates
            </span>
            <span className="text-xs text-slate-400">• Standardized Onboarding Bundles</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Predefined Quotation Templates</h1>
          <p className="text-xs text-slate-400">
            Generate standardized customer subscription contracts with predefined product lines, variants, and payment terms in one click.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-semibold">Target Customer:</label>
          <select
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500 font-medium"
          >
            {custList.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.email})
              </option>
            ))}
          </select>
        </div>
      </div>

      {createdSubNumber && (
        <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/50 text-emerald-300 text-xs flex items-center justify-between gap-3 shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              Successfully created new subscription <strong>{createdSubNumber}</strong> in <strong>Draft</strong> state from template with all lines snapshot!
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 font-bold">Status: Draft</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((tmpl) => {
          const subtotal = tmpl.lines.reduce((s, l) => s + (l.unitPrice * l.qty), 0);
          const tax = subtotal * 0.18;
          const total = subtotal + tax;

          return (
            <div
              key={tmpl.id}
              className="rounded-3xl border border-slate-800 bg-[#121620]/90 p-6 space-y-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">{tmpl.name}</h3>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span className="text-orange-400 font-bold">{tmpl.planName}</span>
                        <span>•</span>
                        <span>Term: {tmpl.paymentTerm}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-white font-mono">₹{total.toLocaleString('en-IN')}</span>
                    <span className="block text-[10px] text-slate-400">incl. 18% GST</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {tmpl.description}
                </p>

                {/* Predefined Lines */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Predefined Subscription Lines ({tmpl.lines.length}):
                  </span>
                  <div className="divide-y divide-slate-800/80 rounded-xl bg-slate-950/70 border border-slate-800/80 overflow-hidden">
                    {tmpl.lines.map((l, idx) => (
                      <div key={idx} className="p-2.5 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-semibold text-slate-200">{l.productName}</span>
                          {l.variant && (
                            <span className="block text-[10px] text-orange-400 font-mono">
                              Variant: {l.variant}
                            </span>
                          )}
                        </div>
                        <div className="text-right font-mono">
                          <span className="text-slate-400">{l.qty} × ₹{l.unitPrice}</span>
                          <span className="block font-bold text-white">₹{(l.qty * l.unitPrice).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Target: {custList.find((c) => c.id === selectedCustomerId)?.name}
                </span>
                <button
                  onClick={() => handleCreate(tmpl)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-xs hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-md shadow-orange-500/20"
                >
                  <span>Create Subscription from Template</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
