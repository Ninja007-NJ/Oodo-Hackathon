// BrightloopSidebar.jsx - Strict Role-Based Navigation Hierarchy
import React from 'react';
import {
  LayoutDashboard,
  Repeat,
  FileText,
  Receipt,
  Settings,
  Zap,
  UserPlus,
  Package,
  Calendar,
  Percent,
  FileSpreadsheet,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function BrightloopSidebar({
  activeView,
  setActiveView,
  counts = {},
  currentRole = 'admin',
}) {
  const isCustomer = currentRole === 'customer';

  // Customer navigation (strictly isolated to own data)
  const customerSections = [
    {
      title: 'Self-Service Portal',
      items: [
        { id: 'subscriptions', label: 'My Subscriptions', icon: Repeat, badge: counts.customerSubsCount || counts.activeSubs || 0 },
        { id: 'invoices', label: 'My Invoices', icon: FileText, badge: counts.customerOverdueCount > 0 ? `${counts.customerOverdueCount} Overdue` : null, badgeDanger: counts.customerOverdueCount > 0 },
        { id: 'receipts', label: 'My Tax Receipts', icon: Receipt, badge: 'GST' },
      ],
    },
    {
      title: 'Account & Security',
      items: [
        { id: 'settings', label: 'Profile & Password', icon: Settings, badge: null },
      ],
    },
  ];

  // Staff and Admin navigation (full operations & configuration)
  const staffSections = [
    {
      title: 'Operations & Billing',
      items: [
        { id: 'overview', label: 'Executive Overview', icon: LayoutDashboard, badge: null },
        { id: 'subscriptions', label: 'Subscriptions Lifecycle', icon: Repeat, badge: counts.activeSubs || 0 },
        { id: 'invoices', label: 'Customer Invoices', icon: FileText, badge: counts.overdueCount > 0 ? `${counts.overdueCount} Overdue` : null, badgeDanger: counts.overdueCount > 0 },
        { id: 'templates', label: 'Quotation Templates', icon: FileSpreadsheet, badge: 'Standard' },
        { id: 'billing', label: '⚡ Run Billing Engine', icon: Zap, badge: 'Idempotent' },
      ],
    },
    {
      title: 'Catalog & Rules (Admin)',
      items: [
        { id: 'products', label: 'Products & Variants', icon: Package, badge: '+₹560 Odoo' },
        { id: 'plans', label: 'Subscription Plans', icon: Calendar, badge: 'Intervals' },
        { id: 'discounts', label: 'Discount Rules', icon: Percent, badge: 'Promo' },
        { id: 'taxes', label: 'Tax Brackets (GST)', icon: Receipt, badge: '18%' },
      ],
    },
    {
      title: 'Compliance & Audit',
      items: [
        { id: 'receipts', label: 'Verified GST Receipts', icon: Receipt, badge: 'SHA-256' },
        { id: 'signup', label: 'Sign-Up Policy Test', icon: UserPlus, badge: '>8 Chars' },
        { id: 'settings', label: 'System Settings', icon: Settings, badge: null },
      ],
    },
  ];

  const sections = isCustomer ? customerSections : staffSections;

  return (
    <aside className="w-full md:w-64 lg:w-72 bg-[#0D1017] text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-3.75rem)] border-r border-slate-800 select-none">
      {/* Role Context Bar */}
      <div className="p-3.5 border-b border-slate-800 bg-slate-950/60">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            Active Workspace
          </span>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
            isCustomer
              ? 'bg-blue-950/80 text-blue-400 border-blue-800'
              : 'bg-orange-950/80 text-orange-400 border-orange-800'
          }`}>
            {isCustomer ? 'Customer Portal' : currentRole.toUpperCase()}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1 truncate">
          {isCustomer ? 'Isolated self-service workspace' : 'Full operations & administrative access'}
        </p>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {sections.map((sec, sIdx) => (
          <div key={sIdx} className="space-y-1">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-2.5 py-1">
              {sec.title}
            </div>
            {sec.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500/20 to-amber-500/10 text-white font-bold border border-orange-500/40 shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-orange-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.badgeDanger
                          ? 'bg-rose-950/80 text-rose-300 border border-rose-800/80'
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

      {/* RBAC Guard Status Footer */}
      <div className="p-3.5 border-t border-slate-800 bg-slate-950/80 text-[11px] space-y-1">
        <div className="flex items-center justify-between text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>RBAC Enforced</span>
          </span>
          <span className="text-emerald-400 font-bold font-mono text-[10px]">
            {isCustomer ? 'ISOLATED' : 'STAFF/ADMIN'}
          </span>
        </div>
        <p className="text-[10px] text-slate-400 leading-tight">
          {isCustomer
            ? 'Access restricted to own customer records only.'
            : 'Zero customer data leakage across tenant partitions.'}
        </p>
      </div>
    </aside>
  );
}
