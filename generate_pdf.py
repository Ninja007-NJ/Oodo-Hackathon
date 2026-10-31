# generate_pdf.py
import subprocess
import os

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>FitFlow - Odoo Make-A-Ton Blueprint</title>
<style>
  @page {
    size: A4;
    margin: 18mm 16mm 18mm 16mm;
    @bottom-right {
      content: counter(page);
    }
  }

  * {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #1e293b;
    line-height: 1.5;
    font-size: 10pt;
    margin: 0;
    padding: 0;
  }

  .cover {
    page-break-after: always;
    padding: 40px 10px 0 10px;
    height: 90vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .badge-container {
    display: flex;
    gap: 8px;
    margin-bottom: 24px;
  }

  .badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 9999px;
    font-size: 8.5pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .badge-purple {
    background-color: #f3e8ff;
    color: #714b67;
    border: 1px solid #d8b4fe;
  }

  .badge-teal {
    background-color: #ccfbf1;
    color: #017e84;
    border: 1px solid #99f6e4;
  }

  .badge-amber {
    background-color: #fef3c7;
    color: #b45309;
    border: 1px solid #fde68a;
  }

  .badge-green {
    background-color: #dcfce7;
    color: #15803d;
    border: 1px solid #bbf7d0;
  }

  .cover-title {
    font-size: 32pt;
    font-weight: 800;
    color: #714b67; /* Odoo brand purple */
    line-height: 1.15;
    margin: 0 0 12px 0;
  }

  .cover-subtitle {
    font-size: 15pt;
    color: #475569;
    font-weight: 500;
    margin: 0 0 24px 0;
  }

  .cover-desc {
    font-size: 11pt;
    color: #334155;
    background: #f8fafc;
    border-left: 4px solid #714b67;
    padding: 16px 20px;
    border-radius: 0 8px 8px 0;
    line-height: 1.6;
    margin-bottom: 30px;
  }

  .cover-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-bottom: 30px;
  }

  .cover-card {
    border: 1px solid #e2e8f0;
    padding: 16px;
    border-radius: 8px;
    background-color: #ffffff;
  }

  .cover-card h4 {
    margin: 0 0 6px 0;
    color: #714b67;
    font-size: 10.5pt;
  }

  .cover-card p {
    margin: 0;
    font-size: 9pt;
    color: #64748b;
  }

  .cover-meta {
    border-top: 1px solid #e2e8f0;
    padding-top: 16px;
    display: flex;
    justify-content: space-between;
    font-size: 8.5pt;
    color: #64748b;
  }

  h1 {
    font-size: 16pt;
    font-weight: 800;
    color: #714b67;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 6px;
    margin-top: 24px;
    margin-bottom: 14px;
    break-after: avoid;
  }

  h2 {
    font-size: 12.5pt;
    font-weight: 700;
    color: #017e84; /* Odoo teal */
    margin-top: 18px;
    margin-bottom: 10px;
    break-after: avoid;
  }

  h3 {
    font-size: 10.5pt;
    font-weight: 700;
    color: #1e293b;
    margin-top: 14px;
    margin-bottom: 6px;
    break-after: avoid;
  }

  p {
    margin: 0 0 10px 0;
    text-align: justify;
  }

  .callout {
    background: #f8fafc;
    border-left: 3.5px solid #017e84;
    padding: 10px 14px;
    margin: 12px 0;
    border-radius: 0 6px 6px 0;
    font-size: 9.5pt;
  }

  .callout strong {
    color: #017e84;
  }

  .callout-pitch {
    background: #faf5ff;
    border-left: 3.5px solid #714b67;
    padding: 12px 16px;
    margin: 14px 0;
    border-radius: 0 6px 6px 0;
    font-size: 10pt;
    font-style: italic;
    color: #3b0764;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0 16px 0;
    font-size: 8.5pt;
    break-inside: avoid;
  }

  th {
    background-color: #f1f5f9;
    color: #334155;
    font-weight: 700;
    text-align: left;
    padding: 8px 10px;
    border: 1px solid #cbd5e1;
  }

  td {
    padding: 7px 10px;
    border: 1px solid #e2e8f0;
    vertical-align: top;
  }

  tr:nth-child(even) td {
    background-color: #f8fafc;
  }

  .flow-box-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 14px 0;
    gap: 6px;
    break-inside: avoid;
  }

  .flow-box {
    flex: 1;
    background: #ffffff;
    border: 1.5px solid #cbd5e1;
    border-radius: 6px;
    padding: 8px 6px;
    text-align: center;
    box-shadow: 0 1px 2px rgba(0,0,0,0.03);
  }

  .flow-box .title {
    font-weight: 700;
    font-size: 8.5pt;
    color: #714b67;
  }

  .flow-box .desc {
    font-size: 7.5pt;
    color: #64748b;
    margin-top: 2px;
  }

  .flow-arrow {
    font-size: 12pt;
    color: #94a3b8;
    font-weight: bold;
  }

  .tag-status {
    display: inline-block;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 7.5pt;
    font-weight: 600;
  }

  .page-break {
    page-break-after: always;
  }

  .two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin: 10px 0;
    break-inside: avoid;
  }

  .card-box {
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 12px;
    background: #ffffff;
  }

  .card-box h4 {
    margin: 0 0 6px 0;
    font-size: 9.5pt;
    color: #714b67;
  }

  ul, ol {
    margin: 0 0 10px 0;
    padding-left: 20px;
  }

  li {
    margin-bottom: 4px;
    font-size: 9pt;
  }

  .code-term {
    font-family: "Courier New", Courier, monospace;
    background: #f1f5f9;
    padding: 1px 4px;
    border-radius: 3px;
    font-size: 8.5pt;
    color: #0f172a;
  }
</style>
</head>
<body>

<!-- COVER PAGE -->
<div class="cover">
  <div>
    <div class="badge-container">
      <span class="badge badge-purple">Odoo Make-A-Ton Hackathon</span>
      <span class="badge badge-teal">Official Project Blueprint</span>
      <span class="badge badge-amber">Subscription Management System</span>
    </div>

    <div class="cover-title">FitFlow</div>
    <div class="cover-subtitle">Gym Membership & Subscription Management Platform</div>

    <div class="cover-desc">
      A comprehensive, responsive operations dashboard and subscription engine built around Odoo’s architectural principles. FitFlow runs the full lifecycle of a gym subscription business: product plans with dynamic variants, quotation templates, automated billing runs, real-time desk attendance check-in, 7-day expiry renewal alerts, and sub-2-second executive finance analytics.
    </div>

    <div class="cover-grid">
      <div class="cover-card">
        <h4>🎯 The Hackathon Challenge</h4>
        <p>Direct implementation of the Brightloop Subscription Management challenge: plans, recurring billing intervals, variant pricing (+560 model), discount rules, and overdue invoice tracking.</p>
      </div>
      <div class="cover-card">
        <h4>⚡ Operational Reality</h4>
        <p>Eliminates paper binders, disconnected POS machines, and manual spreadsheets by creating a unified workflow from member onboarding to daily front-desk attendance.</p>
      </div>
      <div class="cover-card">
        <h4>📱 Responsive Ergonomics</h4>
        <p>Desktop command center for admins with keyboard shortcuts and two-column workflows, paired with a touch-friendly mobile bottom-nav view for quick front-desk check-in.</p>
      </div>
      <div class="cover-card">
        <h4>🔄 Odoo Native Alignment</h4>
        <p>Directly models Odoo’s <code>sale.subscription</code>, <code>account.move</code>, <code>res.partner</code>, and <code>hr.attendance</code> workflows with modular business logic.</p>
      </div>
    </div>
  </div>

  <div class="cover-meta">
    <div><strong>Event:</strong> Odoo Make-A-Ton | <strong>Domain:</strong> Fitness & Subscription Operations</div>
    <div><strong>Status:</strong> Architecture & Execution Blueprint | <strong>Target Response:</strong> &lt; 2s</div>
  </div>
</div>

<!-- SECTION 1: THE PITCH & HACKATHON STRATEGY -->
<h1>1. The Pitch Strategy & Hackathon Narrative</h1>

<div class="callout-pitch">
  "Every gym in the world is fundamentally a subscription business fighting the exact same daily battles as SaaS platforms: failed recurring payments, expiring contracts, manual invoice typing, and customer churn. Today, gym staff juggle spreadsheets, WhatsApp reminders, and paper check-in sheets. FitFlow unites these operations into an Odoo-driven platform where quoting, recurring billing, desk check-ins, and renewals flow seamlessly."
</div>

<h2>The 3-Minute Live Hackathon Demo Arc</h2>
<p>Judges at Odoo Make-A-Ton look for business coherence, architectural elegance, and complete end-to-end execution. Here is the timed live demonstration sequence:</p>

<table>
  <thead>
    <tr>
      <th style="width: 14%;">Timing</th>
      <th style="width: 26%;">Demo Stage</th>
      <th style="width: 35%;">What the Judges See On Screen</th>
      <th style="width: 25%;">Odoo Challenge Criteria</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>0:00 – 0:45</strong></td>
      <td><strong>Admin Catalog & Setup</strong></td>
      <td>Admin defines the "Elite Fitness" plan (Monthly/Quarterly/Yearly), creates a Personal Trainer variant (+₹500 / +$50), and configures a 10% promo discount code with tax calculation rules.</td>
      <td>Plan variants, billing frequencies, pricing rules, tax rules.</td>
    </tr>
    <tr>
      <td><strong>0:45 – 1:30</strong></td>
      <td><strong>Quote to Confirmed Subscription</strong></td>
      <td>Front desk staff creates a quotation from a pre-built template for a new member, applies the promo discount, and confirms it. System auto-generates the invoice and records payment. Status moves to <strong>ACTIVE</strong>.</td>
      <td>Quotation lifecycle: Draft &rarr; Quote &rarr; Confirmed &rarr; Active. Instant invoice generation.</td>
    </tr>
    <tr>
      <td><strong>1:30 – 2:00</strong></td>
      <td><strong>Desk Operations & Attendance</strong></td>
      <td>Staff switches to Mobile View. Taps "⚡ Quick Check-in", searches member, gets an instant green "Active" badge with validity date, and logs attendance. Demonstrates rejection alert for expired members.</td>
      <td>Mobile responsive UI, touch-friendly front desk operations, real-time check-in validation.</td>
    </tr>
    <tr>
      <td><strong>2:00 – 2:30</strong></td>
      <td><strong>Billing Day & Renewal Engine</strong></td>
      <td>Simulates "Billing Day": System flags memberships expiring within 7 days. One-click batch renewal creates the next cycle invoice and extends valid membership dates without manual re-typing.</td>
      <td>Recurring billing automation, renewal alert engine, no duplicate billing.</td>
    </tr>
    <tr>
      <td><strong>2:30 – 3:00</strong></td>
      <td><strong>Finance Lead Executive Dashboard</strong></td>
      <td>Admin reviews real-time KPIs: Active Subscriptions, Monthly Recurring Revenue (MRR), Overdue Invoices list with chasing notes, and inactive member retention alerts (&gt;14 days absent).</td>
      <td>Executive finance summary, overdue debt chasing, sub-2s responsiveness.</td>
    </tr>
  </tbody>
</table>

<div class="page-break"></div>

<!-- SECTION 2: ODOO ECOSYSTEM ALIGNMENT -->
<h1>2. FitFlow & Odoo Ecosystem Mapping</h1>
<p>FitFlow is built to seamlessly mirror the modular data structures and transaction lifecycles of Odoo ERP. The table below details how every gym operation directly maps to Odoo applications:</p>

<table>
  <thead>
    <tr>
      <th>FitFlow Feature</th>
      <th>Target Odoo App</th>
      <th>Odoo Technical Model</th>
      <th>Workflow & Architectural Role</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Member Records & Enquiries</strong></td>
      <td>Odoo CRM & Contacts</td>
      <td><code>res.partner</code>, <code>crm.lead</code></td>
      <td>Central contact master, stage-based lead conversion, emergency details.</td>
    </tr>
    <tr>
      <td><strong>Membership Plans & Add-ons</strong></td>
      <td>Odoo Sales & Products</td>
      <td><code>product.template</code>, <code>product.attribute</code></td>
      <td>Base plans with recurring frequency attributes and add-on variant pricing (+560).</td>
    </tr>
    <tr>
      <td><strong>Quotations & Subscriptions</strong></td>
      <td>Odoo Subscriptions</td>
      <td><code>sale.order</code>, <code>sale.subscription</code></td>
      <td>Contract state transitions: Draft &rarr; Quotation &rarr; Confirmed &rarr; Active &rarr; Closed.</td>
    </tr>
    <tr>
      <td><strong>Invoices & Automated Tax</strong></td>
      <td>Odoo Invoicing / Accounting</td>
      <td><code>account.move</code>, <code>account.tax</code></td>
      <td>Automated recurring invoice generation, standard GST/VAT tax calculation.</td>
    </tr>
    <tr>
      <td><strong>Counter Payments</strong></td>
      <td>Odoo Point of Sale / Bank</td>
      <td><code>account.payment</code></td>
      <td>Multi-method reconciliation (Cash, UPI, Card, Bank) settled against invoices.</td>
    </tr>
    <tr>
      <td><strong>Front-Desk Check-in</strong></td>
      <td>Odoo HR & Attendance</td>
      <td><code>hr.attendance</code></td>
      <td>Fast daily attendance tracking, timestamped logs, and access validation.</td>
    </tr>
    <tr>
      <td><strong>Renewal & Expiry Alerts</strong></td>
      <td>Marketing Automation / Actions</td>
      <td><code>base.automation</code>, <code>mail.template</code></td>
      <td>Automated 7-day advance triggers, automated invoice drafts, follow-up logs.</td>
    </tr>
  </tbody>
</table>

<!-- SECTION 3: RBAC & SECURITY -->
<h1>3. Role-Based Access Control (RBAC) & Security Policy</h1>
<p>Per the hackathon security guidelines, access is strictly partitioned across three roles with enforced password standards.</p>

<div class="two-col">
  <div class="card-box">
    <h4>🔒 Security & Password Compliance</h4>
    <ul>
      <li><strong>Strict Email Uniqueness:</strong> Exactly one account per verified email.</li>
      <li><strong>Enforced Complexity:</strong> Minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 special character (<code>[!@#$%^&amp;*]</code>).</li>
      <li><strong>Session Security:</strong> Role-aware route guard prevents unauthorized API access.</li>
      <li><strong>Audit Logging:</strong> All payments and check-ins record the executing staff ID.</li>
    </ul>
  </div>
  <div class="card-box">
    <h4>👥 Role Permissions Matrix</h4>
    <ul>
      <li><strong>Gym Admin:</strong> Complete system control, plan creation, variant pricing, discount rules, tax rates, staff user management, and executive financial reports.</li>
      <li><strong>Front-Desk Staff:</strong> Member registration, quotation drafting, invoice confirmation, payment recording, attendance check-in, and renewal triggers.</li>
      <li><strong>Member Portal:</strong> Self-service view of active plan, expiration date, payment history, attendance logs, and renewal requests.</li>
    </ul>
  </div>
</div>

<!-- SECTION 4: CORE BUSINESS STATE MACHINES -->
<h1>4. Core Business State Machines</h1>

<h2>A. Subscription Lifecycle State Machine</h2>
<div class="flow-box-container">
  <div class="flow-box">
    <div class="title">Draft</div>
    <div class="desc">Initial Quote drafted</div>
  </div>
  <div class="flow-arrow">&rarr;</div>
  <div class="flow-box">
    <div class="title">Quotation</div>
    <div class="desc">Discounts & Variants added</div>
  </div>
  <div class="flow-arrow">&rarr;</div>
  <div class="flow-box">
    <div class="title">Confirmed</div>
    <div class="desc">Accepted by customer</div>
  </div>
  <div class="flow-arrow">&rarr;</div>
  <div class="flow-box" style="border-color: #22c55e; background: #f0fdf4;">
    <div class="title" style="color: #15803d;">Active</div>
    <div class="desc">Invoice paid & access on</div>
  </div>
  <div class="flow-arrow">&rarr;</div>
  <div class="flow-box" style="border-color: #eab308; background: #fefce8;">
    <div class="title" style="color: #a16207;">Expiring Soon</div>
    <div class="desc">&le; 7 days to renewal</div>
  </div>
  <div class="flow-arrow">&rarr;</div>
  <div class="flow-box">
    <div class="title">Renewed / Closed</div>
    <div class="desc">Extended or Terminated</div>
  </div>
</div>

<h2>B. Invoice & Payment Settlement State Machine</h2>
<div class="flow-box-container">
  <div class="flow-box">
    <div class="title">Draft Invoice</div>
    <div class="desc">Generated from plan lines</div>
  </div>
  <div class="flow-arrow">&rarr;</div>
  <div class="flow-box">
    <div class="title">Confirmed</div>
    <div class="desc">Taxes applied & locked</div>
  </div>
  <div class="flow-arrow">&rarr;</div>
  <div class="flow-box" style="border-color: #22c55e; background: #f0fdf4;">
    <div class="title" style="color: #15803d;">Paid</div>
    <div class="desc">Reconciled in full</div>
  </div>
  <div class="flow-arrow">or</div>
  <div class="flow-box" style="border-color: #ef4444; background: #fef2f2;">
    <div class="title" style="color: #b91c1c;">Overdue</div>
    <div class="desc">Past due date, chased</div>
  </div>
</div>

<div class="page-break"></div>

<!-- SECTION 5: RELATIONAL DATABASE MODEL -->
<h1>5. Relational Data Model & Field Specifications</h1>
<p>FitFlow stores business data in normalized entities that support rapid query speeds (&lt;2s) even with thousands of active member records.</p>

<table>
  <thead>
    <tr>
      <th style="width: 20%;">Entity</th>
      <th style="width: 35%;">Key Fields & Data Types</th>
      <th style="width: 45%;">Business Rules & Validation Logic</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>User / Member</strong><br><span class="code-term">res_partner</span></td>
      <td><code>id (UUID), email (UK), password_hash, full_name, phone, role (admin|staff|member), status, created_at</code></td>
      <td>Email must be strictly unique. Password validated for 8+ chars, upper, lower, and special character.</td>
    </tr>
    <tr>
      <td><strong>Membership Plan</strong><br><span class="code-term">product_template</span></td>
      <td><code>id, name, billing_interval (daily|weekly|monthly|yearly), interval_count, base_price, cost_price, min_qty, available_from, available_to, allow_pause</code></td>
      <td>Governs contract duration. Defines whether a plan can be paused (e.g. for injury) or auto-closes on expiry.</td>
    </tr>
    <tr>
      <td><strong>Plan Variant</strong><br><span class="code-term">product_attribute</span></td>
      <td><code>id, plan_id (FK), variant_name (Trainer|Locker|Diet), additional_price, is_active</code></td>
      <td>Adds specific line addons to base subscription (e.g., Personal Trainer adds ₹500 / $50).</td>
    </tr>
    <tr>
      <td><strong>Discount Rule</strong><br><span class="code-term">discount_rule</span></td>
      <td><code>id, code (UK), discount_type (percent|fixed), discount_value, min_purchase, max_uses, current_uses, valid_from, valid_to</code></td>
      <td>Admin configured. Automatically validates cart thresholds and decrements remaining uses.</td>
    </tr>
    <tr>
      <td><strong>Tax Rule</strong><br><span class="code-term">account_tax</span></td>
      <td><code>id, name (e.g. GST 18%), rate_percentage (18.0), is_active</code></td>
      <td>Automatically applies tax on taxable base lines before final invoice confirmation.</td>
    </tr>
    <tr>
      <td><strong>Subscription</strong><br><span class="code-term">sale_subscription</span></td>
      <td><code>id, sub_number (UK), user_id (FK), plan_id (FK), state, start_date, expiry_date, subtotal, discount, tax, grand_total</code></td>
      <td>Moves through state machine. Auto-calculates next billing date based on plan interval.</td>
    </tr>
    <tr>
      <td><strong>Invoice</strong><br><span class="code-term">account_move</span></td>
      <td><code>id, inv_number (UK), subscription_id (FK), user_id (FK), state (draft|confirmed|paid|overdue), due_date, total, balance_due</code></td>
      <td>Created automatically on subscription confirmation or renewal. Prevents double-billing.</td>
    </tr>
    <tr>
      <td><strong>Payment</strong><br><span class="code-term">account_payment</span></td>
      <td><code>id, payment_number (UK), invoice_id (FK), amount, method (cash|card|upi|bank), payment_date, reference_note</code></td>
      <td>Reduces invoice <code>balance_due</code>. Changes invoice state to Paid when balance reaches 0.</td>
    </tr>
    <tr>
      <td><strong>Attendance Log</strong><br><span class="code-term">hr_attendance</span></td>
      <td><code>id, user_id (FK), subscription_id (FK), check_in_time, status (granted|warning|rejected), notes</code></td>
      <td>Instant desk verification. Rejects entry if subscription state is not Active or invoice is overdue.</td>
    </tr>
  </tbody>
</table>

<!-- SECTION 6: RESPONSIVE UI ERGONOMICS -->
<h1>6. Responsive UI Architecture & Operations Ergonomics</h1>

<div class="two-col">
  <div class="card-box">
    <h4>🖥️ Desktop Command Center (1280px+)</h4>
    <ul>
      <li><strong>Navigation:</strong> Persistent left sidebar with real-time badges (e.g., "Renewals Due: 5").</li>
      <li><strong>Quick Search:</strong> Global <code>Ctrl + K</code> shortcut to search members instantly by phone or name.</li>
      <li><strong>Split Workflows:</strong> Two-column forms with live calculations (tax & discount totals update dynamically).</li>
      <li><strong>Side Drawer:</strong> Full member 360° profile view slides in without leaving the current table.</li>
    </ul>
  </div>
  <div class="card-box">
    <h4>📱 Mobile Front-Desk View (&lt;768px)</h4>
    <ul>
      <li><strong>Bottom Bar:</strong> 4 high-frequency touch targets (Dashboard, Check-in, Members, Invoices).</li>
      <li><strong>One-Thumb Check-in:</strong> Front desk staff can search a member and tap large green "CHECK IN" button with one hand.</li>
      <li><strong>Card Stacks:</strong> Wide desktop tables convert into touch cards with color-coded status pills.</li>
      <li><strong>Haptic / Visual Feedback:</strong> High contrast confirmation banners for check-ins and payment receipts.</li>
    </ul>
  </div>
</div>

<div class="page-break"></div>

<!-- SECTION 7: PHASED IMPLEMENTATION PLAN -->
<h1>7. Step-by-Step Implementation Plan ("Develop One-by-One")</h1>
<p>To ensure a rock-solid, fully testable submission for Odoo Make-A-Ton, development is sequenced into six self-contained milestones:</p>

<table>
  <thead>
    <tr>
      <th style="width: 15%;">Milestone</th>
      <th style="width: 25%;">Core Deliverables</th>
      <th style="width: 40%;">Key Implementation Steps</th>
      <th style="width: 20%;">Acceptance Criteria</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Phase 1</strong><br>Foundations &amp; Auth</td>
      <td>RBAC Security &amp; Data Models</td>
      <td>
        • Setup standalone responsive framework.<br>
        • Implement User model with password rule verification (8+ chars, upper, lower, special).<br>
        • Seed demo dataset (Admin, Staff, 5 active/expiring members).
      </td>
      <td>Login works with role switching (Admin, Staff, Member). Passwords strictly enforced.</td>
    </tr>
    <tr>
      <td><strong>Phase 2</strong><br>Plans, Variants &amp; Quotes</td>
      <td>Product Catalog &amp; Quotation Engine</td>
      <td>
        • Plan configuration (monthly, quarterly, yearly).<br>
        • Variant builder (Personal Trainer +₹500, Locker +₹200).<br>
        • Discount rules engine (percentage &amp; fixed limits).<br>
        • Quotation builder moving from Draft &rarr; Confirmed.
      </td>
      <td>Quotes calculate dynamic totals with variants and discounts automatically.</td>
    </tr>
    <tr>
      <td><strong>Phase 3</strong><br>Billing &amp; Payments</td>
      <td>Automated Invoicing &amp; Tax Calculation</td>
      <td>
        • Auto-generate invoice from confirmed quotes.<br>
        • Apply 18% tax calculation automatically.<br>
        • Record payments across Cash, UPI, Card.<br>
        • Transition invoice from Confirmed &rarr; Paid.
      </td>
      <td>Invoice balance drops to zero; payments audit log recorded; no duplicate billing.</td>
    </tr>
    <tr>
      <td><strong>Phase 4</strong><br>Desk Operations</td>
      <td>Quick Check-in &amp; Attendance Logs</td>
      <td>
        • Instant member search by name or phone.<br>
        • Real-time membership check: Active &rarr; Granted; Expired &rarr; Alert prompt.<br>
        • Attendance history timeline.<br>
        • Inactivity detector (&gt;14 days absent).
      </td>
      <td>1-tap check-in on mobile; clear visual alert if member membership has lapsed.</td>
    </tr>
    <tr>
      <td><strong>Phase 5</strong><br>Renewal Automation</td>
      <td>7-Day Expiry &amp; 1-Click Renewals</td>
      <td>
        • Dynamic filter: memberships expiring in &le;7 days.<br>
        • 1-Click Renewal: extends dates and generates renewal invoice.<br>
        • Member Portal view: member logs in to view membership pass and invoice receipts.
      </td>
      <td>Renewal seamlessly extends subscription without creating orphaned records.</td>
    </tr>
    <tr>
      <td><strong>Phase 6</strong><br>Executive Dashboard</td>
      <td>Finance Lead Analytics (&lt;2s) &amp; Odoo Export</td>
      <td>
        • Real-time KPI cards: MRR, Active Count, Overdue Invoices, Today's Check-ins.<br>
        • Filterable tables with instant search (&lt;2s response).<br>
        • Odoo Integration API Payload export (JSON mapping to <code>sale.subscription</code>).
      </td>
      <td>Fast, reactive dashboard providing complete visibility into gym recurring revenue.</td>
    </tr>
  </tbody>
</table>

<!-- SECTION 8: HACKATHON READINESS & CHECKLIST -->
<h1>8. Hackathon Presentation Checklist</h1>

<div class="two-col">
  <div class="card-box">
    <h4>📋 The Judging Criteria Checklist</h4>
    <ul>
      <li>✅ <strong>Subscription Depth:</strong> Multiple frequencies, variants, discounts, quotation templates, and automatic renewals covered.</li>
      <li>✅ <strong>Odoo Philosophy:</strong> Connected app architecture (Sales + Accounting + Attendance + CRM) without siloed data.</li>
      <li>✅ <strong>Operational Usability:</strong> High-touch front-desk workflows (attendance, instant alerts) tested for speed.</li>
      <li>✅ <strong>Security & RBAC:</strong> Password complexity and multi-user portal segregation strictly implemented.</li>
    </ul>
  </div>
  <div class="card-box">
    <h4>💡 Pro-Tips for the Pitch</h4>
    <ul>
      <li><strong>Show, Don't Tell:</strong> Walk through the persona of member "Alex" from initial quotation to desk check-in.</li>
      <li><strong>Highlight the "Billing Day" Button:</strong> Demonstrate batch recurring billing running in seconds.</li>
      <li><strong>Demo on Mobile:</strong> Open the mobile view on a phone or DevTools to prove true front-desk ergonomics.</li>
      <li><strong>Emphasize MRR:</strong> Show the Finance Dashboard calculating Monthly Recurring Revenue instantly.</li>
    </ul>
  </div>
</div>

<div style="margin-top: 30px; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 8.5pt; color: #94a3b8;">
  FitFlow — Built for Odoo Make-A-Ton Hackathon • Subscription Management System Blueprint
</div>

</body>
</html>
"""

html_path = os.path.abspath("fitflow_blueprint.html")
pdf_path = os.path.abspath("FitFlow_Odoo_Hackathon_Blueprint.pdf")

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"HTML written to {html_path}")

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
cmd = [
    edge_path,
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    f"--print-to-pdf={pdf_path}",
    f"file:///{html_path.replace(os.sep, '/')}"
]

print("Executing Edge headless to generate PDF...")
result = subprocess.run(cmd, capture_output=True, text=True)
print(f"Exit code: {result.returncode}")
if os.path.exists(pdf_path):
    print(f"SUCCESS: Generated PDF at {pdf_path} (Size: {os.path.getsize(pdf_path)} bytes)")
else:
    print(f"ERROR: PDF was not generated. Stderr: {result.stderr}")
