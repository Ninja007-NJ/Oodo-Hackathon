// BrightloopSidebar.jsx
import React from 'react';
import {
  LayoutDashboard,
  Repeat,
  FileText,
  Zap,
  CreditCard,
  Package,
  Percent,
  UserCheck,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  UserPlus
} from 'lucide-react';

export default function BrightloopSidebar({
  activeView,
  setActiveView,
  workspace,
  setWorkspace,
  counts = {},
  currentRole,
}) {
  const isCustomer = currentRole === 'customer';

  const navItems = [
    {
      group: 'Core Operations',
      items: [
        { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard, badge: null, staffOnly: true },
        { id: 'subscriptions', label: 'Subscriptions', icon: Repeat, badge: counts.activeSubs || 0 },
        { id: 'templates', label: 'Quotation Templates', icon: FileText, badge: null },
        { id: 'billing', label: '⚡ Run Billing Engine', icon: Zap, badge: 'Daily Cron' },
        { id: 'invoices', label: 'Invoices & Payments', icon: CreditCard, badge: counts.overdueCount > 0 ? `${counts.overdueCount} Overdue` : null, badgeDanger: counts.overdueCount > 0 },
      ],
    },
    {
      group: 'Catalog & Config (Admin)',
      items: [
        { id: 'plans', label: 'Subscription Plans', icon: Package, badge: counts.plansCount || 4 },
        { id: 'discounts', label: 'Discounts & Taxes', icon: Percent, badge: 'GST 18%' },
      ],
    },
    {
      group: 'Public & Portal Experience',
      items: [
        { id: 'portal', label: 'Customer Portal', icon: UserCheck, badge: 'Self-Service' },
        { id: 'signup', label: 'Website Sign-Up Policy', icon: UserPlus, badge: '9+ Chars' },
      ],
    },
  ];

  return (
    <aside className="w-full md:w-64 lg:w-72 bg-slate-900/95 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-3.75rem)] border-r border-slate-800 select-none">
      {/* Workspace Switcher */}
      <div className="p-3 border-b border-slate-800">
        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1.5 px-1">
          Active Workspace
        </div>
        <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setWorkspace('operations')}
            className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              workspace === 'operations'
                ? 'bg-brand text-white shadow-sm shadow-brand/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Ops Desk</span>
          </button>
          <button
            onClick={() => setWorkspace('executive')}
            className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              workspace === 'executive'
                ? 'bg-brand text-white shadow-sm shadow-brand/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Executive BI</span>
          </button>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto p-3 space-y-5">
        {navItems.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-2.5 py-1">
              {group.group}
            </div>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              const isRestrictedForCustomer = isCustomer && item.staffOnly;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-800 text-white font-bold ring-1 ring-slate-700 shadow-sm'
                      : isRestrictedForCustomer
                      ? 'text-slate-500 hover:bg-slate-800/40 opacity-70'
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-glow' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.badgeDanger
                          ? 'bg-rose-950/80 text-rose-300 border border-rose-800/80 animate-pulse'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* System Status Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/50 text-[11px] space-y-1.5">
        <div className="flex items-center justify-between text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>RBAC Server Guard</span>
          </span>
          <span className="text-emerald-400 font-bold">Enforced</span>
        </div>
        <div className="text-[10px] text-slate-400">
          Odoo [17] Compatible ORM Engine
        </div>
      </div>
    </aside>
  );
}
