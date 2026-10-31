# 🟠 Brightloop — Subscription Management & Business Productivity Platform

> **Odoo Make-A-Ton Hackathon Submission**  
> *Category:* Subscription Management & Business Operations  
> **Live Web Demo:** [http://localhost:5173/](http://localhost:5173/)  
> **Repository:** [https://github.com/Ninja007-NJ/Oodo-Hackathon.git](https://github.com/Ninja007-NJ/Oodo-Hackathon.git)

---

## 🌟 Executive Summary

**Brightloop** is a next-generation subscription lifecycle management and business productivity platform engineered around Odoo 17's ORM and a high-performance Buildly-inspired Dark/Orange executive dashboard. It automates recurring billing runs, detects payment and renewal risks, enforces explicit human consent for contract upgrades, calculates an operational Productivity Score (0–100), and provides fact-grounded AI copilot assistance without hallucinated financial data.

---

## 👥 Verified Team Contributors

| Team Member | GitHub Profile | Engineering Ownership | Feature Branch & PR |
| :--- | :--- | :--- | :--- |
| **Lead (Member 1)** | [`Ninja007-NJ`](https://github.com/Ninja007-NJ) | **Executive Architecture & Main Dashboard** | [`main`](https://github.com/Ninja007-NJ/Oodo-Hackathon) |
| **Member 2 (Friend 1)** | [`salmasubair400-eng`](https://github.com/salmasubair400-eng) | **Subscription State Machine & Idempotent Billing Engine** | [`feature/billing-subscription-engine`](https://github.com/Ninja007-NJ/Oodo-Hackathon/tree/feature/billing-subscription-engine) |
| **Member 3 (Friend 2)** | [`Naureen-s`](https://github.com/Naureen-s) | **Payments, PCI Tokenization & Verified GST Receipts** | [`feature/payments-tokenization-receipts`](https://github.com/Ninja007-NJ/Oodo-Hackathon/tree/feature/payments-tokenization-receipts) |
| **Member 4 (Friend 3)** | [`gowrimarian-jpg`](https://github.com/gowrimarian-jpg) | **AI Copilot Command Center & Risk Intelligence** | [`feature/ai-risk-productivity-copilot`](https://github.com/Ninja007-NJ/Oodo-Hackathon/tree/feature/ai-risk-productivity-copilot) |

---

## 🔐 3 Problem Statement Demo Login Profiles

Brightloop enforces strict Role-Based Access Control (RBAC) and includes 1-click authentication profiles directly on the login screen:

```
┌────────────────────────────────────────────────────────────────────────┐
│                      BRIGHTLOOP LOGIN ACCESS PROFILES                  │
├──────────────────────┬──────────────────────┬──────────────────────────┤
│ 👑 1. ADMINISTRATOR  │ 💼 2. OPERATIONS     │ 🏢 3. PORTAL CUSTOMER    │
│ Mitchell Admin       │ Alex Rivers          │ Acme Software Corp       │
│ admin@brightloop.test│ staff.alex@...       │ billing@acmesoftware.test│
│ Pass: Admin#2026     │ Pass: Staff#2026     │ Pass: Customer#2026      │
│ Access: Full Control │ Access: Staff Ops    │ Access: Client Portal    │
│ (Executive BI, Logs) │ (Invoices, Billing)  │ (HTTP 403 Guard Refusal) │
└──────────────────────┴──────────────────────┴──────────────────────────┘
```

---

## 🚀 Core Platform Modules (Buildly Orange Design System)

### 1. 📊 Executive Overview Dashboard (`/?view=overview`)
- **Visuals**: Buildly Dark Charcoal theme with vibrant Orange (`#F97316`) spline trajectory and donut revenue channels.
- **KPI Metrics**: Monthly Recurring Revenue (MRR: ₹248,320), Active Contracts, Renewal Rate (94%), Overdue Debt (₹24,426).
- **Interactive Strategy Simulator**: Adjust price changes (+5%) and ad budgets to see projected real-time MRR boosts.

### 2. ⚡ Idempotent Recurring Billing Engine (`/?view=billing`)
- **Automated Daily Cron + Manual Wizard**: Evaluates subscriptions due on or before an execution date.
- **SQL Idempotency Rule**: Enforced composite unique constraint on `(subscription_id, period_start)` via `brightloop.billing.period`. Running billing twice for the same date results in `created 0, skipped N, errors 0`, mathematically preventing duplicate invoices.

### 3. 📄 Customer Invoices & Aging Receivables (`/?view=invoices`)
- **Overdue Aging Buckets**: Real-time filtering by `All`, `Paid`, `Outstanding`, `1–7d Overdue`, `8–30d Overdue`, and `31+d Overdue`.
- **Itemized Tax Breakdown**: Snapshots base prices, Brand Odoo variant add-ons (+₹560), and 18% GST (CGST 9% + SGST 9%).
- **Odoo Payment Registration**: Settles invoices directly with cash, card, UPI, or bank transfer.

### 4. 💳 Multi-Rail Payments & Reconciliation Ledger (`/?view=payments`)
- **Gateway Health Rails**: Razorpay Instant UPI, Stripe Token Vault, HDFC Corporate Direct NEFT.
- **PCI-DSS SAQ-A Tokenization**: Zero raw credit card numbers or CVVs stored in the database (only tokenized references `•••• 4242`).
- **1-Click Webhook Mismatch Resolver**: Automatically links orphan payments with unallocated invoices.

### 5. 🧾 Verified Tax Receipts Center (`/?view=receipts`)
- **Government Compliance**: Official legal header (`Brightloop Technologies Pvt Ltd`), GSTIN (`29AABCB1234C1Z5`), and PAN (`AABCB1234C`).
- **Visual Authenticity Stamp**: Green rotated verified watermark (`✓ PAYMENT SETTLED • GST COMPLIANT`).
- **Cryptographic Security**: Every receipt embeds a SHA-256 digital signature hash with 1-click copying and print-to-PDF formatting.

### 6. 🛡️ Payment Security & Explicit User Consent (`/?view=security`)
- **5-Step User Consent Pipeline**: `Detect` $\to$ `Notify` $\to$ `Ask` $\to$ `Record` $\to$ `Proceed`.
- **Zero Silent Upgrades**: The system never charges a customer or upgrades a plan without verified approval.
- **Active Session Audit**: View logged-in devices with a 1-click **"Sign Out of All Devices"** security killswitch.

### 7. 📈 Risk & Productivity Intelligence (`/?view=risk`)
- **4 Operational Risk Categories**: Payment Risk, Renewal Risk, Operational Risk, Security Risk.
- **Productivity Score (0–100)**: Transparent weighted operational metric:
  - Invoice Accuracy (20%) + Payment Collection (20%) + Renewal Success (20%) + Automation Rate (15%) + Reconciliation Accuracy (15%) + Follow-Up Efficiency (10%).
  - Benchmarked at **93.7%** operational efficiency, saving **37.5 hours/month**.

### 8. 🤖 AI Command Center Copilot (`/?view=ai`)
- **Fact-Grounded LLM Assistance**: Queries live database records with structured output schemas to prevent hallucinating financial amounts or tax values.
- **Human-in-the-Loop Confirmation**: Financial actions (charging, upgrading, refunding) strictly require human staff approval before execution.

---

## 🛠️ Technology Stack & Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        BRIGHTLOOP ARCHITECTURE                         │
├───────────────────────────────────┬────────────────────────────────────┤
│ BACKEND: Odoo 17 Custom Module    │ FRONTEND: React 19 + Vite 8        │
│ • models/res_users.py (9+ chars)  │ • Tailwind CSS 3.4 (Orange Theme)  │
│ • models/plan.py & discount.py    │ • Lucide-React SVG Icons           │
│ • models/subscription.py (States) │ • Buildly & Finsight Visual Design │
│ • models/billing_engine.py (Cron) │ • Sub-2.0s Load Time Benchmark     │
│ • security/ir.model.access.csv    │ • Local Server: http://localhost   │
│ • controllers/portal.py (Auth)    │   :5173/                           │
└───────────────────────────────────┴────────────────────────────────────┘
```

---

## 🏃 Quick Start Guide

### 1. Run the Frontend Dashboard
```bash
cd brightloop_dashboard_ui
npm install
npm run dev
```
Open **[http://localhost:5173/](http://localhost:5173/)** in your browser.

### 2. Run the Odoo 17 Module
Place the `brightloop` directory into your Odoo `addons` path and restart Odoo:
```bash
./odoo-bin -c odoo.conf -u brightloop -d odoo_hackathon
```

---

## 📄 Documentation & Audit References
- Full Hackathon Team Q&A Guide: [`TEAM_CONTRIBUTIONS_AND_QA_GUIDE.md`](TEAM_CONTRIBUTIONS_AND_QA_GUIDE.md)
- UI Screenshots:
  - [`screenshot_overview.png`](screenshot_overview.png)
  - [`screenshot_invoices.png`](screenshot_invoices.png)
  - [`screenshot_payments.png`](screenshot_payments.png)
  - [`screenshot_receipts.png`](screenshot_receipts.png)
  - [`screenshot_receipt_modal.png`](screenshot_receipt_modal.png)
