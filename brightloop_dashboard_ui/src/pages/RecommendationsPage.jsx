// RecommendationsPage.jsx - AI Plan Optimization & Commerce-Style Suggestions
import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Package,
  Layers,
  X,
  Sliders
} from 'lucide-react';

export default function RecommendationsPage({ onNavigate }) {
  const [whyModalItem, setWhyModalItem] = useState(null);
  const [acceptedRecs, setAcceptedRecs] = useState([]);

  const recommendations = [
    {
      id: 'rec_01',
      title: 'Upgrade Beta Enterprises to Enterprise Contract',
      plan: 'Enterprise Annual Tier',
      price: '₹12,500/month (billed yearly)',
      impact: '+₹42,000 Annual Value',
      fitScore: 94,
      reason: 'Customer has added 12 extra seats in the past 60 days, exceeding the Business plan threshold. An enterprise contract provides dedicated SLA at lower per-seat unit pricing.',
      usageSignal: 'Seats: 17/15 limit (113% capacity)',
      type: 'upgrade',
    },
    {
      id: 'rec_02',
      title: 'Attach Priority Support Add-on to Horizon Systems',
      plan: 'Priority Support Add-on',
      price: '₹500/month',
      impact: '+₹6,000 Annual MRR',
      fitScore: 88,
      reason: 'Account logged 4 critical production inquiry tickets last week. High correlation with customers requiring dedicated 1-hour response SLA.',
      usageSignal: 'Support volume: 4 tickets/wk',
      type: 'addon',
    },
    {
      id: 'rec_03',
      title: 'Recommend Plan Consolidation for Underused Trial',
      plan: 'Starter Monthly Tier',
      price: '₹1,500/month',
      impact: 'Prevents Customer Churn',
      fitScore: 81,
      reason: 'Customer is consistently utilizing 2 seats out of a larger provisioned quota. Suggesting a right-sized tier lowers upfront friction and maintains positive retention.',
      usageSignal: 'Usage: 2/10 seats (20% capacity)',
      type: 'rightsize',
    },
  ];

  const handleAction = (id, choice) => {
    setAcceptedRecs((prev) => [...prev, { id, choice }]);
  };

  return (
    <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-200">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 bg-teal-950/80 px-2.5 py-0.5 rounded-full border border-teal-800/80">
          AI Optimization &amp; Commerce Engine
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
          Recommendations &amp; Plan Optimization
        </h1>
        <p className="text-xs text-slate-400">
          Personalized subscription and add-on suggestions inspired by commerce platforms. Transparent explanations with explicit human consent controls.
        </p>
      </div>

      {/* Grid of Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendations.map((rec) => {
          const isDone = acceptedRecs.some((a) => a.id === rec.id);

          return (
            <div
              key={rec.id}
              className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl flex flex-col justify-between space-y-5 hover:border-slate-700 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                    {rec.type} Suggestion
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-teal-300 font-mono text-[10px] font-bold border border-slate-700">
                    {rec.fitScore}% fit
                  </span>
                </div>

                <h3 className="text-base font-black text-white leading-snug">{rec.title}</h3>

                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Suggested Target</div>
                  <div className="font-bold text-white text-xs">{rec.plan}</div>
                  <div className="text-xs font-mono font-bold text-emerald-400">{rec.price}</div>
                  <div className="text-[11px] font-bold text-teal-300 pt-0.5">{rec.impact}</div>
                </div>

                <div className="text-xs text-slate-400 leading-relaxed">
                  <span className="text-slate-300 font-medium">{rec.usageSignal}</span>
                  <p className="mt-1">{rec.reason}</p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-[11px]">
                  <button
                    onClick={() => setWhyModalItem(rec)}
                    className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Why this recommendation?</span>
                  </button>
                </div>

                {isDone ? (
                  <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Action Scheduled</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => handleAction(rec.id, 'approved')}
                      className="py-2 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-all cursor-pointer shadow-md"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(rec.id, 'dismissed')}
                      className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 cursor-pointer"
                    >
                      Remind Later
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* "Why Am I Seeing This?" Explanation Modal */}
      {whyModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Sparkles className="w-4 h-4 text-glow" />
                <span>Explainable AI Recommendation Logic</span>
              </div>
              <button onClick={() => setWhyModalItem(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-slate-300 leading-relaxed">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-emerald-400">
                {whyModalItem.title}
              </div>
              <p>
                <strong>Signal Inputs:</strong> Evaluated customer’s 60-day seat provisioning history, ticket frequency, and plan capacity limits.
              </p>
              <p>
                <strong>Safeguard Policy:</strong> Brightloop recommendations never alter contract states or trigger billing without explicit human authorization.
              </p>
            </div>

            <div className="pt-2 flex justify-end border-t border-slate-800">
              <button
                onClick={() => setWhyModalItem(null)}
                className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
