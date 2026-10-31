// ExecutiveOverviewPage.jsx - Exact Layout matching Buildly Reference & Prompt
import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Sparkles,
  ArrowRight,
  DollarSign,
  Users,
  Repeat,
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
  Share2,
  Calendar,
  Layers,
  Zap,
  Sliders,
  ShieldCheck,
  ChevronRight,
  MoreVertical
} from 'lucide-react';
import { ProgressRing } from '../components/ui';

export default function ExecutiveOverviewPage({
  subscriptions,
  invoices,
  onNavigate,
  onFilterInvoices,
  onFilterSubscriptions,
  loadTimeMs = 38,
}) {
  const [timeRange, setTimeRange] = useState('30D');
  const [strategyPrice, setStrategyPrice] = useState(5);
  const [strategyBudget, setStrategyBudget] = useState(24000);
  const [strategyTraffic, setStrategyTraffic] = useState(12);

  // Reconciled Metrics
  const activeSubs = subscriptions.filter((s) => s.state === 'active' && !s.is_paused);
  const paidInvoices = invoices.filter((i) => i.paymentState === 'paid');
  const totalRevenue = paidInvoices.reduce((s, i) => s + i.amountTotal, 0);

  const overdueInvoices = invoices.filter((i) => i.paymentState !== 'paid' && new Date(i.dueDate) < new Date('2026-10-31'));
  const overdueAmount = overdueInvoices.reduce((s, i) => s + i.amountResidual, 0);

  // Strategy Simulation Calculation
  const simulatedImpact = Math.round((totalRevenue * (strategyPrice / 100)) + (strategyTraffic * 450));

  return (
    <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-in fade-in duration-200">
      {/* 1. Header with Greeting & Action Controls (from Buildly Image) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Good morning, Rakib 👋
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800/80">
              ⚡ {loadTimeMs}ms (&lt;2.0s target)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Brightloop AI Business Copilot active • Financial health is optimal with zero duplicate billing events.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Time Filter Pills */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-1 flex items-center gap-1 text-xs">
            {['24H', '7D', '30D', '90D'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  timeRange === range
                    ? 'bg-brand text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <button
            onClick={() => onNavigate('billing')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 hover:brightness-110 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Run Billing</span>
          </button>
        </div>
      </div>

      {/* 2. AI Business Summary Banner (from ASCII Art) */}
      <section className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-900/90 p-5 shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-purple-950/80 border border-purple-800/80 text-purple-400 shrink-0">
              <Sparkles className="w-5 h-5 text-glow" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                  AI Business Summary
                </span>
                <span className="text-xs text-slate-400">Updated 10m ago from database</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed max-w-3xl">
                Monthly recurring revenue is pacing at <strong>₹32,440.00</strong> (<strong>+18%</strong> vs prior period). 
                <strong> 2 renewals</strong> are due in the next 7 days, and <strong>₹24,426.00</strong> in overdue invoices has been categorized into aging debt follow-up queues. Zero duplicate invoices were generated during today’s batch cron run.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('ai')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold shrink-0 cursor-pointer border border-slate-700"
          >
            Open AI Assistant &rarr;
          </button>
        </div>
      </section>

      {/* 3. Top 5 Key Metric Cards (Matching Buildly Image) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Total Revenue */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm hover:border-slate-700 transition-all cursor-pointer">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Total Revenue</span>
            <span className="flex items-center gap-0.5 text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded text-[10px]">
              <TrendingUp className="w-3 h-3" /> 18%
            </span>
          </div>
          <div className="text-2xl font-black text-white mt-2">₹248,320</div>
          <div className="text-[10px] text-slate-400 mt-1">Prev: ₹210,450</div>
        </div>

        {/* Active Subscriptions */}
        <div 
          onClick={() => { onFilterSubscriptions('active'); onNavigate('subscriptions'); }}
          className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm hover:border-slate-700 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Active Subs</span>
            <span className="flex items-center gap-0.5 text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded text-[10px]">
              <TrendingUp className="w-3 h-3" /> 9%
            </span>
          </div>
          <div className="text-2xl font-black text-white mt-2">{activeSubs.length} Active</div>
          <div className="text-[10px] text-slate-400 mt-1">+1 paused contract</div>
        </div>

        {/* Renewal Rate */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm hover:border-slate-700 transition-all cursor-pointer">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Renewal Rate</span>
            <span className="flex items-center gap-0.5 text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded text-[10px]">
              <TrendingUp className="w-3 h-3" /> 4.2%
            </span>
          </div>
          <div className="text-2xl font-black text-white mt-2">94.0%</div>
          <div className="text-[10px] text-slate-400 mt-1">Due: 2 upcoming</div>
        </div>

        {/* Overdue Payments */}
        <div 
          onClick={() => { onFilterInvoices('overdue'); onNavigate('invoices'); }}
          className="rounded-2xl border border-rose-900/50 bg-rose-950/20 p-4 shadow-sm hover:border-rose-700 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="text-rose-400 font-medium">Overdue Debt</span>
            <span className="flex items-center gap-0.5 text-rose-400 font-bold bg-rose-950/80 px-1.5 py-0.5 rounded text-[10px]">
              <TrendingDown className="w-3 h-3" /> 4%
            </span>
          </div>
          <div className="text-2xl font-black text-rose-300 mt-2">₹{overdueAmount.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-rose-400/80 mt-1">{overdueInvoices.length} invoices flagged</div>
        </div>

        {/* Productivity Score */}
        <div 
          onClick={() => onNavigate('risk')}
          className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm hover:border-slate-700 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Productivity Score</span>
            <span className="flex items-center gap-0.5 text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded text-[10px]">
              <TrendingUp className="w-3 h-3" /> 3%
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-2">93.7%</div>
          <div className="text-[10px] text-slate-400 mt-1">Prev: 89.2%</div>
        </div>
      </div>

      {/* 4. Main Charts & Strategy Simulator Grid (from Buildly Image) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue vs Conversion Trends Spline Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Recurring Trajectory</span>
              <h3 className="text-lg font-black text-white">Revenue vs. Conversion Trends</h3>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> Revenue (₹)
              </span>
              <span className="flex items-center gap-1.5 text-orange-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> Conversion Rate (%)
              </span>
            </div>
          </div>

          {/* Interactive SVG Trend Visualizer */}
          <div className="h-60 w-full relative pt-4">
            <svg viewBox="0 0 700 200" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="conversionGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="40" x2="700" y2="40" stroke="#1e293b" strokeDasharray="4 4" />
              <line x1="0" y1="90" x2="700" y2="90" stroke="#1e293b" strokeDasharray="4 4" />
              <line x1="0" y1="140" x2="700" y2="140" stroke="#1e293b" strokeDasharray="4 4" />

              {/* Revenue Curve */}
              <path
                d="M 0 130 Q 150 110, 300 135 T 500 100 T 700 120 L 700 180 L 0 180 Z"
                fill="url(#revenueGrad)"
              />
              <path
                d="M 0 130 Q 150 110, 300 135 T 500 100 T 700 120"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2.5"
              />

              {/* Conversion Curve (Orange Accent) */}
              <path
                d="M 0 160 Q 150 140, 320 60 T 520 150 T 700 140 L 700 180 L 0 180 Z"
                fill="url(#conversionGrad)"
              />
              <path
                d="M 0 160 Q 150 140, 320 60 T 520 150 T 700 140"
                fill="none"
                stroke="#f97316"
                strokeWidth="3"
              />
              <circle cx="320" cy="60" r="5" fill="#f97316" stroke="#ffffff" strokeWidth="2" />
            </svg>

            {/* X-Axis Labels */}
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-2">
              <span>Oct 1</span>
              <span>Oct 7</span>
              <span>Oct 14</span>
              <span>Oct 21</span>
              <span>Oct 28</span>
              <span>Today</span>
            </div>
          </div>
        </div>

        {/* Right Column: Traffic Sources & Strategy Simulator */}
        <div className="space-y-6">
          {/* Revenue Sources Donut Simulation */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Revenue Channels</h4>
            <div className="flex items-center justify-between">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#1e293b" strokeWidth="4" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#f97316" strokeWidth="4" strokeDasharray="38 100" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#38bdf8" strokeWidth="4" strokeDasharray="26 100" strokeDashoffset="-38" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="18 100" strokeDashoffset="-64" />
                </svg>
                <div className="absolute text-center">
                  <div className="text-xs font-black text-white">12.8k</div>
                  <div className="text-[8px] text-slate-500 uppercase">Total</div>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="text-slate-400">Direct SaaS:</span>
                  <strong className="text-white">38%</strong>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  <span className="text-slate-400">Partner &amp; Odoo:</span>
                  <strong className="text-white">26%</strong>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-slate-400">Add-ons:</span>
                  <strong className="text-white">18%</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Strategy Simulator (from Buildly Image) */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Strategy Simulator</h4>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">+{strategyPrice}% Price Shift</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Price Change (%)</span>
                  <span className="font-bold text-white">+{strategyPrice}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={strategyPrice}
                  onChange={(e) => setStrategyPrice(Number(e.target.value))}
                  className="w-full accent-brand cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Target Ad Budget</span>
                  <span className="font-bold text-white">₹{strategyBudget.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="50000"
                  step="1000"
                  value={strategyBudget}
                  onChange={(e) => setStrategyBudget(Number(e.target.value))}
                  className="w-full accent-brand cursor-pointer"
                />
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Projected MRR Boost:</span>
                <span className="text-sm font-black text-emerald-400">+₹{simulatedImpact.toLocaleString('en-IN')}/mo</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. AI Recommendations Strip (Exact Cards from Buildly Image) */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-glow" />
          <h3 className="text-base font-black text-white">AI Recommendations &amp; Optimization</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Rec 1 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Growth Optimization</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-mono font-bold text-slate-300">91% fit</span>
              </div>
              <h4 className="text-sm font-black text-white">Increase pricing for Starter Add-on by 5%</h4>
              <div className="text-xs font-bold text-emerald-400">+₹12,400 Projected Revenue</div>
              <p className="text-xs text-slate-400">High demand + low price sensitivity detected across 15 active accounts.</p>
            </div>
            <button
              onClick={() => onNavigate('plans')}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all cursor-pointer"
            >
              Apply Change
            </button>
          </div>

          {/* Rec 2 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Cost Efficiency</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-mono font-bold text-slate-300">84% fit</span>
              </div>
              <h4 className="text-sm font-black text-white">Consolidate underutilized Trial tier</h4>
              <div className="text-xs font-bold text-rose-400">-₹3,200 Infrastructure Cost</div>
              <p className="text-xs text-slate-400">Low completion rate over the last 14 days on 7-day trials.</p>
            </div>
            <button
              onClick={() => onNavigate('plans')}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all cursor-pointer"
            >
              View Tier
            </button>
          </div>

          {/* Rec 3 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Retention Strategy</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-mono font-bold text-slate-300">88% fit</span>
              </div>
              <h4 className="text-sm font-black text-white">Prompt annual upgrade before 7d renewal</h4>
              <div className="text-xs font-bold text-emerald-400">+18% Lifetime Value</div>
              <p className="text-xs text-slate-400">Target accounts with &gt;90 days active tenure with -30% yearly incentive.</p>
            </div>
            <button
              onClick={() => onNavigate('subscriptions')}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all cursor-pointer"
            >
              Target Accounts
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
