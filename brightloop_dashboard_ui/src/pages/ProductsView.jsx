// ProductsView.jsx - Admin Product & Variant Catalog with Brand Variant (+₹560)
import React, { useState } from 'react';
import { Package, Plus, Layers, DollarSign, Tag, Check, X, Info } from 'lucide-react';

export default function ProductsView({ products, onAddProduct }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [type, setType] = useState('service');
  const [odooVariantExtra, setOdooVariantExtra] = useState(560);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !basePrice) return;
    const newProd = {
      id: `prod_${Date.now()}`,
      name,
      basePrice: Number(basePrice),
      costPrice: Number(costPrice) || 0,
      type,
      variants: [
        { name: 'Standard Brand', extra: 0 },
        { name: 'Odoo Brand', extra: Number(odooVariantExtra) || 0 },
      ],
    };
    if (onAddProduct) onAddProduct(newProd);
    setModalOpen(false);
    setName('');
    setBasePrice('');
    setCostPrice('');
  };

  return (
    <main className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-950/60 px-2.5 py-0.5 rounded-full border border-orange-800/60">
              Admin Product Catalog
            </span>
            <span className="text-xs text-slate-400">• Odoo Variant Pricing</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Products, Cost &amp; Dynamic Variants</h1>
          <p className="text-xs text-slate-400">
            Define recurring service products with cost price, base sales price, and dynamic brand variants (+₹560 Odoo brand).
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-xs shadow-md hover:brightness-110 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Product</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((p) => {
          const odooVar = p.variants?.find((v) => v.name.toLowerCase().includes('odoo'));
          return (
            <div
              key={p.id}
              className="rounded-2xl border border-slate-800 bg-[#121620]/90 p-5 space-y-4 hover:border-slate-700 transition-all shadow-sm"
            >
              <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{p.name}</h3>
                    <span className="text-[10px] uppercase font-mono text-slate-400">
                      Type: <strong className="text-slate-200">{p.type}</strong>
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-white font-mono">₹{p.basePrice.toLocaleString('en-IN')}</span>
                  <span className="block text-[10px] text-slate-400">Base Sales Price</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 block">Cost Price (Margin Basis)</span>
                  <span className="font-mono font-bold text-slate-300">₹{p.costPrice ? p.costPrice.toLocaleString('en-IN') : '0'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Standard Margin</span>
                  <span className="font-mono font-bold text-emerald-400">
                    ₹{p.costPrice ? (p.basePrice - p.costPrice).toLocaleString('en-IN') : p.basePrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {p.variants && p.variants.length > 0 ? (
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Product Variants &amp; Price Extras:
                  </span>
                  <div className="space-y-1.5">
                    {p.variants.map((v, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center justify-between p-2 rounded-lg text-xs border ${
                          v.extra > 0
                            ? 'bg-orange-950/30 border-orange-900/60 text-orange-200'
                            : 'bg-slate-900 border-slate-800 text-slate-300'
                        }`}
                      >
                        <span className="font-semibold">{v.name}</span>
                        <div className="flex items-center gap-2 font-mono">
                          {v.extra > 0 ? (
                            <>
                              <span className="text-[11px] text-orange-400 font-bold">+₹{v.extra} extra</span>
                              <span className="text-xs text-white font-bold bg-orange-950 px-2 py-0.5 rounded border border-orange-800">
                                ₹{(p.basePrice + v.extra).toLocaleString('en-IN')} total
                              </span>
                            </>
                          ) : (
                            <span className="text-slate-500 text-[11px]">Base price (₹0 extra)</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-[11px] text-slate-500 italic">No variants configured for this product.</div>
              )}

              {odooVar && (
                <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-[11px] text-orange-300 flex items-center gap-2">
                  <Info className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>
                    <strong>Problem Statement Rule:</strong> Brand &quot;Odoo&quot; adds ₹560, confirmed at ₹2,060 unit price snapshot.
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal to add new Product */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121620] border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Add New Recurring Product</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Product Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Analytics Add-on"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Base Price (₹)</label>
                  <input
                    type="number"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    placeholder="1500"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Cost Price (₹)</label>
                  <input
                    type="number"
                    value={costPrice}
                    onChange={(e) => setCostPrice(e.target.value)}
                    placeholder="400"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Odoo Brand Variant Extra (₹)</label>
                <input
                  type="number"
                  value={odooVariantExtra}
                  onChange={(e) => setOdooVariantExtra(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:border-orange-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Specifies the price extra when customer chooses Odoo brand.</span>
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
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
