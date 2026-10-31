# FitFlow — Gym Membership & Subscription Management System
> **Built for Odoo Make-A-Ton Hackathon**  
> *Category:* Subscription Management System

FitFlow is a responsive Gym Operations Dashboard & Subscription Lifecycle Management System built around Odoo’s ERP architecture. It helps gym staff manage members, recurring plans, variant add-ons, quotations, attendance check-in, 7-day expiry renewal alerts, automated invoicing, and executive revenue analytics in one unified system.

---

## 🚀 Key Features

- **Multi-Frequency Plans & Variants**: Configure monthly, quarterly, and yearly memberships with dynamic variant pricing (e.g., Personal Trainer add-on, Locker access).
- **Quotation to Subscription Lifecycle**: Quotation templates transitioning seamlessly: `Draft` ➔ `Quotation` ➔ `Confirmed` ➔ `Active` ➔ `Expiring Soon` ➔ `Renewed / Closed`.
- **Automated Invoicing & Taxes**: Automated recurring invoice generation with tax calculations (e.g. 18% GST/VAT) and discount rule enforcement.
- **Counter Payments**: Record settlements via Cash, UPI, Card, and Bank with instant invoice reconciliation and overdue chasing notes.
- **Fast Desk Operations & Attendance**: Real-time one-click member attendance check-in with instant validity badges (`Active` vs `Expired Warning`).
- **7-Day Expiry & Renewal Engine**: Automated alerts for upcoming renewals with one-click contract extension and invoice creation.
- **Finance Lead Executive Dashboard**: Real-time KPI analytics responding in under 2 seconds (Active MRR, Overdue Debts, Inactive Members $>14$ days).
- **Mobile Responsive Ergonomics**: Desktop dual-column command center + Mobile touch-friendly bottom-nav front-desk mode.
- **Odoo ERP Ecosystem Mapping**: Built to mirror `sale.subscription`, `account.move`, `account.payment`, `res.partner`, and `hr.attendance`.

---

## 📄 Project Blueprint & Documentation

- [Executive Blueprint PDF](FitFlow_Odoo_Hackathon_Blueprint.pdf)
- [Blueprint HTML Source](fitflow_blueprint.html)

---

## 🛠️ Security & Access Control
- Strict email uniqueness and password complexity enforcement (8+ characters, uppercase, lowercase, special character).
- Role-Based Access Control (RBAC):
  - **Admin**: System config, plans, variants, discounts, taxes, staff management, executive finance reports.
  - **Front-Desk Staff**: Member registration, quotes, payments, attendance check-in, renewals.
  - **Member Portal**: Self-service view of active pass, expiry, invoices, and attendance logs.
