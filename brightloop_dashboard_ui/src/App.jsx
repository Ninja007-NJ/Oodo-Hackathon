// App.jsx - Main Application Controller for Brightloop
import React, { useState, useEffect } from 'react';
import BrightloopHeader from './components/BrightloopHeader';
import BrightloopSidebar from './components/BrightloopSidebar';

// 9 Core Dashboard Pages + Utilities
import ExecutiveOverviewPage from './pages/ExecutiveOverviewPage';
import SubscriptionOperationsPage from './pages/SubscriptionOperationsPage';
import InvoicesView from './pages/InvoicesView';
import PaymentSecurityConsentPage from './pages/PaymentSecurityConsentPage';
import RiskProductivityPage from './pages/RiskProductivityPage';
import AICommandCenterPage from './pages/AICommandCenterPage';
import RecommendationsPage from './pages/RecommendationsPage';
import ReportsAnalyticsPage from './pages/ReportsAnalyticsPage';
import SettingsSecurityPage from './pages/SettingsSecurityPage';

// Operations & Verification Utilities
import BillingEngineView from './pages/BillingEngineView';
import SignupVerificationView from './pages/SignupVerificationView';
import CustomerPortalView from './pages/CustomerPortalView';

import {
  INITIAL_PLANS,
  INITIAL_PRODUCTS,
  INITIAL_DISCOUNTS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_INVOICES,
  INITIAL_BILLED_PERIODS,
} from './data/brightloopData';
import { applyTheme } from './theme';
import { Zap, X, ShieldAlert, ArrowRight } from 'lucide-react';

export default function App() {
  const [currentRole, setCurrentRole] = useState('admin'); // 'admin' | 'staff' | 'customer'
  const [workspace, setWorkspace] = useState('operations'); // 'operations' | 'executive'
  const [activeView, setActiveView] = useState('overview'); // Default to Executive Overview
  const [activeTheme, setActiveTheme] = useState('cyan');
  const [searchQuery, setSearchQuery] = useState('');

  // Data Store State
  const [plans, setPlans] = useState(INITIAL_PLANS);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [discounts, setDiscounts] = useState(INITIAL_DISCOUNTS);
  const [subscriptions, setSubscriptions] = useState(INITIAL_SUBSCRIPTIONS);
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [billedPeriods, setBilledPeriods] = useState(INITIAL_BILLED_PERIODS);

  // Filters for drill-down navigation
  const [invoiceFilter, setInvoiceFilter] = useState('all');
  const [subFilter, setSubFilter] = useState('all');

  // Quick Billing Modal Trigger
  const [billingModalOpen, setBillingModalOpen] = useState(false);
  const [modalAsOfDate, setModalAsOfDate] = useState('2026-10-31');
  const [modalResult, setModalResult] = useState(null);

  useEffect(() => {
    applyTheme({ theme: activeTheme });
  }, [activeTheme]);

  // Counts for sidebar badges
  const activeSubsCount = subscriptions.filter((s) => s.state === 'active').length;
  const overdueCount = invoices.filter(
    (i) => i.paymentState !== 'paid' && new Date(i.dueDate) < new Date('2026-10-31')
  ).length;

  // Handlers
  const handleUpdateSubscription = (updated) => {
    setSubscriptions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleCreateFromTemplate = () => {
    const nextNum = subscriptions.length + 1;
    const newSub = {
      id: `sub_00${nextNum}`,
      number: `SUB/2026/0000${nextNum}`,
      customerId: 'cust_new',
      customerName: 'Pinnacle Technologies',
      customerEmail: 'admin@pinnacle.test',
      planId: 'plan_starter_monthly',
      planName: 'Starter Monthly',
      startDate: '2026-10-31',
      expiryDate: '2027-10-31',
      nextBillingDate: '2026-11-30',
      state: 'quotation',
      is_paused: false,
      is_renewed: false,
      paymentTerm: 'Immediate Payment',
      lines: [
        {
          id: `line_${nextNum}_1`,
          productId: 'prod_crm',
          productName: 'Brightloop CRM',
          variant: 'Odoo Brand (+₹560)',
          qty: 1,
          unitPrice: 2060,
          taxRate: 18,
          discountId: null,
          subtotal: 2060,
        },
        {
          id: `line_${nextNum}_2`,
          productId: 'prod_seat',
          productName: 'Extra Seat Add-on',
          variant: 'Standard',
          qty: 2,
          unitPrice: 250,
          taxRate: 18,
          discountId: null,
          subtotal: 500,
        },
      ],
      amountUntaxed: 2560,
      amountTax: 460.8,
      amountTotal: 3020.8,
    };
    setSubscriptions((prev) => [newSub, ...prev]);
    setActiveView('subscriptions');
  };

  // Idempotent Billing Engine
  const handleExecuteBillingRun = (asOfDate) => {
    let created = 0;
    let skipped = 0;
    let errors = 0;

    const newInvoices = [];
    const newPeriods = [];
    const updatedSubs = [...subscriptions];

    updatedSubs.forEach((sub, idx) => {
      if (sub.state !== 'active' || sub.is_paused || !sub.nextBillingDate) return;

      if (sub.nextBillingDate <= asOfDate) {
        // Idempotency check: Has this period already been billed?
        const alreadyBilled = billedPeriods.some(
          (bp) => bp.subscriptionId === sub.id && bp.periodStart === sub.nextBillingDate
        );

        if (alreadyBilled) {
          skipped += 1;
          return;
        }

        // Calculate single best discount (10% volume if total qty >= 20, else flat 500)
        let discountDeduction = 0;
        let discountName = null;
        const totalQty = sub.lines.reduce((s, l) => s + l.qty, 0);

        if (totalQty >= 20) {
          discountDeduction = (sub.amountUntaxed * 10) / 100;
          discountName = '10% Volume Discount';
        } else if (sub.amountUntaxed >= 1000) {
          discountDeduction = 500;
          discountName = 'Flat ₹500 Welcome Discount';
        }

        const untaxedAfterDisc = Math.max(0, sub.amountUntaxed - discountDeduction);
        const taxAmount = (untaxedAfterDisc * 18) / 100;
        const grandTotal = untaxedAfterDisc + taxAmount;

        const invNum = `INV/2026/0010${invoices.length + newInvoices.length + 1}`;
        const invoiceRecord = {
          id: `inv_${Date.now()}_${idx}`,
          number: invNum,
          subscriptionId: sub.id,
          subscriptionNumber: sub.number,
          customerName: sub.customerName,
          customerEmail: sub.customerEmail,
          invoiceDate: asOfDate,
          dueDate: '2026-11-15',
          state: 'posted',
          paymentState: 'not_paid',
          amountUntaxed: untaxedAfterDisc,
          amountTax: taxAmount,
          amountTotal: grandTotal,
          amountResidual: grandTotal,
          billingJob: true,
          discountApplied: discountName,
        };

        newInvoices.push(invoiceRecord);

        // Advance next billing date by 1 month
        const currDate = new Date(sub.nextBillingDate);
        currDate.setMonth(currDate.getMonth() + 1);
        const nextPeriodStr = currDate.toISOString().split('T')[0];

        newPeriods.push({
          subscriptionId: sub.id,
          periodStart: sub.nextBillingDate,
          periodEnd: nextPeriodStr,
          invoiceId: invNum,
        });

        updatedSubs[idx] = {
          ...sub,
          nextBillingDate: nextPeriodStr,
        };

        created += 1;
      }
    });

    if (created > 0) {
      setInvoices((prev) => [...newInvoices, ...prev]);
      setBilledPeriods((prev) => [...newPeriods, ...prev]);
      setSubscriptions(updatedSubs);
    }

    return { created, skipped, errors };
  };

  const handleRegisterPayment = (invoiceId, paymentData) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId
          ? {
              ...inv,
              paymentState: 'paid',
              amountResidual: 0,
              paymentMethod: paymentData.method,
              paymentMemo: paymentData.memo,
            }
          : inv
      )
    );
  };

  const handlePortalRequestChange = (subId, requestData) => {
    console.log('Customer request delivered to support queue:', subId, requestData);
  };

  // Group Check: If current role is customer and accessing overview, show server refusal
  const isCustomerOnOverview = currentRole === 'customer' && activeView === 'overview';

  return (
    <div className="min-h-screen bg-[#0A0F1A] text-slate-100 flex flex-col font-sans selection:bg-brand selection:text-white">
      {/* Top Header Navigation */}
      <BrightloopHeader
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        onOpenBillingModal={() => setBillingModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        loadTimeMs={38}
        activeTheme={activeTheme}
        setActiveTheme={setActiveTheme}
      />

      {/* Main Layout: Sidebar + Active Screen */}
      <div className="flex-1 flex flex-col md:flex-row">
        <BrightloopSidebar
          activeView={activeView}
          setActiveView={setActiveView}
          workspace={workspace}
          setWorkspace={setWorkspace}
          currentRole={currentRole}
          counts={{
            activeSubs: activeSubsCount,
            overdueCount: overdueCount,
            plansCount: plans.length,
          }}
        />

        <div className="flex-1 overflow-y-auto bg-slate-950/60 pb-16">
          {/* Server Guard Refusal Card if Customer navigates to Executive Overview */}
          {isCustomerOnOverview ? (
            <main className="max-w-4xl mx-auto p-6 sm:p-12 space-y-6">
              <div className="rounded-3xl border-2 border-rose-500/50 bg-slate-900/90 backdrop-blur-xl p-8 shadow-2xl text-center space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-400 mx-auto flex items-center justify-center">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-950/60 px-3 py-1 rounded-full border border-rose-800/60">
                    Server-Side Group Check • HTTP 403 Forbidden
                  </span>
                  <h2 className="text-2xl font-black text-white mt-3">Access Refused: Staff &amp; Admin Only</h2>
                  <p className="text-sm text-slate-400 max-w-lg mx-auto mt-2 leading-relaxed">
                    The executive overview endpoint strictly raises an Access Error for portal users. Group check confirmed you are signed in as a portal customer.
                  </p>
                </div>
                <div className="pt-2 flex justify-center">
                  <button
                    onClick={() => setActiveView('subscriptions')}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-bold text-xs shadow-lg hover:bg-neutral-200 transition-all cursor-pointer"
                  >
                    <span>View Self-Service Portal Instead</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </main>
          ) : (
            <>
              {activeView === 'overview' && (
                <ExecutiveOverviewPage
                  subscriptions={subscriptions}
                  invoices={invoices}
                  loadTimeMs={38}
                  onNavigate={(view) => setActiveView(view)}
                  onFilterInvoices={(filter) => {
                    setInvoiceFilter(filter);
                    setActiveView('invoices');
                  }}
                  onFilterSubscriptions={(filter) => {
                    setSubFilter(filter);
                    setActiveView('subscriptions');
                  }}
                />
              )}

              {activeView === 'subscriptions' && (
                <SubscriptionOperationsPage
                  subscriptions={subscriptions}
                  onUpdateSubscription={handleUpdateSubscription}
                  onCreateFromTemplate={handleCreateFromTemplate}
                  onNavigate={(view) => setActiveView(view)}
                />
              )}

              {activeView === 'invoices' && (
                <InvoicesView
                  invoices={invoices}
                  initialFilter={invoiceFilter}
                  onRegisterPayment={handleRegisterPayment}
                />
              )}

              {activeView === 'security' && <PaymentSecurityConsentPage />}

              {activeView === 'risk' && (
                <RiskProductivityPage onNavigate={(view) => setActiveView(view)} />
              )}

              {activeView === 'ai' && (
                <AICommandCenterPage
                  subscriptions={subscriptions}
                  invoices={invoices}
                  onNavigate={(view) => setActiveView(view)}
                />
              )}

              {activeView === 'recommendations' && (
                <RecommendationsPage onNavigate={(view) => setActiveView(view)} />
              )}

              {activeView === 'reports' && (
                <ReportsAnalyticsPage
                  subscriptions={subscriptions}
                  invoices={invoices}
                />
              )}

              {activeView === 'settings' && (
                <SettingsSecurityPage
                  currentRole={currentRole}
                  setCurrentRole={setCurrentRole}
                />
              )}

              {activeView === 'billing' && (
                <BillingEngineView
                  subscriptions={subscriptions}
                  invoices={invoices}
                  billedPeriods={billedPeriods}
                  onExecuteBillingRun={handleExecuteBillingRun}
                />
              )}

              {activeView === 'signup' && <SignupVerificationView />}
            </>
          )}
        </div>
      </div>

      {/* Quick Billing Modal Trigger from Header */}
      {billingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white text-black rounded-3xl border-2 border-black p-6 shadow-2xl space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-600 fill-current" />
                <h3 className="text-lg font-black text-black">⚡ Run Recurring Billing Now</h3>
              </div>
              <button
                onClick={() => { setBillingModalOpen(false); setModalResult(null); }}
                className="text-neutral-400 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed">
              Batch evaluates active subscriptions due on or before the selected date. Automatically calculates 18% GST and best discounts, generates customer invoices, and securely advances billing cycles without double-billing.
            </p>

            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">Execution "As Of" Date</label>
              <input
                type="date"
                value={modalAsOfDate}
                onChange={(e) => setModalAsOfDate(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-black"
              />
            </div>

            {modalResult && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-mono">
                Result: <strong>created {modalResult.created}</strong>, <strong>skipped {modalResult.skipped}</strong>, <strong>errors {modalResult.errors}</strong>.
              </div>
            )}

            <div className="pt-2 flex justify-end gap-2 border-t border-neutral-100">
              <button
                onClick={() => { setBillingModalOpen(false); setModalResult(null); }}
                className="px-4 py-2 rounded-xl border border-neutral-300 text-xs font-bold hover:bg-neutral-100 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const res = handleExecuteBillingRun(modalAsOfDate);
                  setModalResult(res);
                }}
                className="px-5 py-2 rounded-xl bg-black text-white hover:bg-neutral-800 text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>Execute Batch Run</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
