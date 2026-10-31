// SubscriptionOperationsPage.jsx - Exact Layout matching Finsight Image & Prompt
import React, { useState } from 'react';
import {
  Settings,
  CreditCard,
  Users,
  Repeat,
  Calendar,
  DollarSign,
  ChevronRight,
  Plus,
  CheckCircle2,
  Sliders,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Pause,
  Play,
  RotateCcw,
  X,
  Search
} from 'lucide-react';

export default function SubscriptionOperationsPage({
  subscriptions,
  onUpdateSubscription,
  onCreateFromTemplate,
  onNavigate,
}) {
  const [activeSubTab, setActiveSubTab] = useState('subscription');
  const [activeUsersSlider, setActiveUsersSlider] = useState(10000);
  const [isYearlyBilling, setIsYearlyBilling] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const activeSub = subscriptions.find((s) => s.state === 'active') || subscriptions[0];

  const filteredSubs = subscriptions.filter((s) => {
    if (statusFilter !== 'all' && s.state !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        s.number.toLowerCase().includes(q) ||
        s.customerName.toLowerCase().includes(q) ||
        s.planName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const plansList = [
    {
      id: 'starter',
      name: 'Starter',
      priceMonthly: 1500,
      priceYearly: 1050, // -30%
      desc: 'For individual entrepreneurs and small teams',
      usersLimit: '500 users',
      ordersLimit: '1,000 transactions',
      features: ['Basic financial tools', 'Email support', 'Standard API limits'],
      isCurrent: true,
    },
    {
      id: 'plus',
      name: 'Plus',
      priceMonthly: 3500,
      priceYearly: 2450,
      desc: 'For growing teams requiring automation',
      usersLimit: '1,000 users',
      ordersLimit: '5,000 transactions',
      features: ['Advanced management tools', 'Phone & email support', 'Integration with other systems'],
      isCurrent: false,
    },
    {
      id: 'pro',
      name: 'Pro',
      priceMonthly: 5500,
      priceYearly: 3850,
      desc: 'For scaling businesses with heavy operations',
      usersLimit: '5,000 users',
      ordersLimit: '25,000 transactions',
      features: ['Customizable dashboards', 'Advanced management tools', '24/7 dedicated support', 'Odoo ERP sync'],
      isPopular: true,
      isCurrent: false,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      priceMonthly: 12500,
      priceYearly: 8750,
      desc: 'For large organizations with custom security',
      usersLimit: 'Unlimited users',
      ordersLimit: 'Custom volume limits',
      features: ['Dedicated account manager', 'Customizable features', '24/7 priority support', 'Advanced reporting and audit'],
      isCurrent: false,
    },
  ];

  return (
    <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-200">
      {/* Sub-navigation Pills (Exact matching Finsight Image) */}
      <div className="flex items-center gap-1 border-b border-slate-800 pb-2 text-xs font-semibold overflow-x-auto">
        {['Overview', 'Subscription', 'Custom Domains', 'Extras', 'Integrations'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab.toLowerCase())}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeSubTab === tab.toLowerCase()
                ? 'bg-slate-800 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Subscription Operations</h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage customer tiers, active user limits, renewals, and lifecycle changes.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('portal')}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 cursor-pointer"
          >
            Contact support
          </button>
          <button
            onClick={onCreateFromTemplate}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 shadow-md cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>Change plan</span>
          </button>
        </div>
      </div>

      {/* Top Subscription Metric Badges Strip (from Finsight Image) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3.5 rounded-2xl border border-slate-800 bg-slate-900/90 space-y-1">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <Settings className="w-3.5 h-3.5" />
            <span>Subscription</span>
          </div>
          <div className="text-base font-black text-white">{activeSub.planName}</div>
        </div>

        <div className="p-3.5 rounded-2xl border border-slate-800 bg-slate-900/90 space-y-1">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <Users className="w-3.5 h-3.5" />
            <span>Active Users</span>
          </div>
          <div className="text-base font-black text-white">500 seats</div>
        </div>

        <div className="p-3.5 rounded-2xl border border-slate-800 bg-slate-900/90 space-y-1">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <Repeat className="w-3.5 h-3.5" />
            <span>Monthly Orders</span>
          </div>
          <div className="text-base font-black text-white">20,000 /mo</div>
        </div>

        <div className="p-3.5 rounded-2xl border border-slate-800 bg-slate-900/90 space-y-1">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Plan Cost</span>
          </div>
          <div className="text-base font-black text-emerald-400">₹{activeSub.amountTotal.toLocaleString('en-IN')}/mo</div>
        </div>

        <div className="p-3.5 rounded-2xl border border-slate-800 bg-slate-900/90 space-y-1 col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <Calendar className="w-3.5 h-3.5" />
            <span>Renewal Date</span>
          </div>
          <div className="text-base font-black text-white">{activeSub.nextBillingDate || 'Nov 15, 2026'}</div>
        </div>
      </div>

      {/* Upgrade & Interactive Usage Slider Section (Exact from Finsight Image) */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-black text-white">Upgrade and get more out of Brightloop</h2>

          {/* Monthly / Yearly Toggle */}
          <div className="flex items-center gap-3 text-xs">
            <span className={`font-semibold ${!isYearlyBilling ? 'text-white' : 'text-slate-400'}`}>Bill monthly</span>
            <button
              onClick={() => setIsYearlyBilling(!isYearlyBilling)}
              className="relative w-11 h-6 rounded-full bg-slate-800 p-0.5 transition-colors cursor-pointer"
            >
              <div className={`w-5 h-5 rounded-full bg-emerald-400 transition-transform ${isYearlyBilling ? 'translate-x-5' : ''}`} />
            </button>
            <span className={`font-semibold flex items-center gap-1.5 ${isYearlyBilling ? 'text-white' : 'text-slate-400'}`}>
              <span>Bill yearly</span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-800">
                -30%
              </span>
            </span>
          </div>
        </div>

        {/* Interactive Active Users Slider */}
        <div className="space-y-2">
          <div className="text-xs text-slate-400 flex justify-between">
            <span>Monthly active seats</span>
            <span className="font-mono font-bold text-emerald-400 text-sm">
              {activeUsersSlider.toLocaleString('en-IN')} seats
            </span>
          </div>

          <div className="relative pt-2">
            <input
              type="range"
              min="500"
              max="50000"
              step="500"
              value={activeUsersSlider}
              onChange={(e) => setActiveUsersSlider(Number(e.target.value))}
              className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-2">
              <span>500</span>
              <span className="font-bold text-slate-300">10,000</span>
              <span>50,000+</span>
            </div>
          </div>
        </div>

        {/* 4 Plan Cards Comparison (Exact layout from Finsight Image) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {plansList.map((plan) => {
            const price = isYearlyBilling ? plan.priceYearly : plan.priceMonthly;

            return (
              <div
                key={plan.id}
                className={`rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all ${
                  plan.isPopular
                    ? 'border-2 border-purple-500 bg-gradient-to-b from-purple-950/40 to-slate-900 shadow-xl shadow-purple-950/20'
                    : 'border border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-black text-white">{plan.name}</h3>
                    {plan.isPopular && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 bg-purple-900/70 px-2 py-0.5 rounded-full border border-purple-700">
                        Most popular
                      </span>
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <div className="text-2xl font-black text-white">
                      ₹{price.toLocaleString('en-IN')}
                      <span className="text-xs font-normal text-slate-400"> / month</span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {isYearlyBilling ? 'billed annually (-30% applied)' : 'billed monthly'}
                    </div>
                  </div>

                  <button
                    onClick={() => alert(`Upgrading to ${plan.name} plan with ${activeUsersSlider} seats.`)}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      plan.isCurrent
                        ? 'bg-slate-800 text-slate-400 cursor-default'
                        : plan.isPopular
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:brightness-110 shadow-md shadow-purple-900/30'
                        : 'bg-white text-black hover:bg-neutral-200'
                    }`}
                  >
                    {plan.isCurrent ? 'Current plan' : `Upgrade to ${plan.name}`}
                  </button>

                  <div className="pt-2 text-xs space-y-1.5 text-slate-300">
                    <div className="text-[11px] font-bold text-slate-400">{plan.desc}</div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{plan.usersLimit}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{plan.ordersLimit}</span>
                    </div>
                    {plan.features.map((f, fi) => (
                      <div key={fi} className="flex items-center gap-1.5 text-slate-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Operational Subscriptions Table & State Transitions */}
      <div className="rounded-3xl border-2 border-black bg-white text-black p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Traceable Subscriptions</span>
            <h3 className="text-lg font-black text-black">Active Contract Records</h3>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-48 sm:w-64">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search contracts..."
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl pl-8 pr-3 py-1.5 text-xs text-black"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Subscription #</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Plan</th>
                <th className="py-2.5 px-3">Next Billing</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredSubs.map((sub) => (
                <tr
                  key={sub.id}
                  onClick={() => setSelectedSub(sub)}
                  className="hover:bg-neutral-50 cursor-pointer"
                >
                  <td className="py-3 px-3 font-mono font-bold text-black">{sub.number}</td>
                  <td className="py-3 px-3 font-medium text-neutral-800">{sub.customerName}</td>
                  <td className="py-3 px-3 text-neutral-600">{sub.planName}</td>
                  <td className="py-3 px-3 font-mono text-neutral-600">{sub.nextBillingDate || '—'}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-neutral-100 text-neutral-800 border">
                      {sub.is_paused ? 'Paused' : sub.state}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-black text-black">
                    ₹{sub.amountTotal.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button className="text-neutral-400 hover:text-black">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
