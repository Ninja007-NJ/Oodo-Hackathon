// ReportsAnalyticsPage.jsx - Comprehensive Monthly Revenue & Renewal Reports
import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Share2,
  Filter,
  CheckCircle2,
  DollarSign,
  Repeat
} from 'lucide-react';

export default function ReportsAnalyticsPage({ subscriptions, invoices }) {
  const [reportPeriod, setReportPeriod] = useState('2026-10');

  const monthlyBreakdown = [
    { month: 'Jul 2026', revenue: 18200, collections: 17500, renewals: 95, churn: 2.1 },
    { month: 'Aug 2026', revenue: 21400, collections: 20100, renewals: 92, churn: 1.8 },
    { month: 'Sep 2026', revenue: 27800, collections: 26400, renewals: 97, churn: 1.4 },
    { month: 'Oct 2026', revenue: 32440, collections: 30100, renewals: 94, churn: 1.2 },
  ];

  return (
    <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Financial Reporting</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Reports &amp; Analytics</h1>
          <p className="text-xs text-slate-400">Monthly revenue run-rate, collection performance, churn vs. renewals.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Exporting verified financial CSV report...')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Historical Monthly Ledger */}
      <div className="rounded-3xl border-2 border-black bg-white text-black p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-black text-black">Monthly Recurring Revenue Ledger</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Reporting Period</th>
                <th className="py-2.5 px-3 text-right">Billed Revenue</th>
                <th className="py-2.5 px-3 text-right">Collections (₹)</th>
                <th className="py-2.5 px-3 text-center">Collection Rate</th>
                <th className="py-2.5 px-3 text-center">Renewal Rate</th>
                <th className="py-2.5 px-3 text-center">Net Churn</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-mono">
              {monthlyBreakdown.map((row, idx) => (
                <tr key={idx} className="hover:bg-neutral-50">
                  <td className="py-3 px-3 font-sans font-bold text-black">{row.month}</td>
                  <td className="py-3 px-3 text-right font-black text-black">₹{row.revenue.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 text-right text-emerald-700 font-bold">₹{row.collections.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 text-center font-sans">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      {((row.collections / row.revenue) * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-sans font-bold text-black">{row.renewals}%</td>
                  <td className="py-3 px-3 text-center text-slate-500 font-sans">{row.churn}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
