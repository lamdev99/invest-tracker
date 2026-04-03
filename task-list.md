# InvestTracker — Task List

> **Phase 1 Scope** | React Native + Python Backend  
> Status legend: `[ ]` todo · `[/]` in progress · `[x]` done

---

## 🏗️ Project Setup

### Mobile App (React Native)
- [ ] Initialize React Native project (Expo or bare RN — TBD)
- [ ] Set up folder structure: `src/modules/`, `src/components/`, `src/services/`, `src/store/`
- [ ] Configure navigation library (React Navigation)
- [ ] Set up local database (SQLite — library TBD)
- [ ] Set up state management (Zustand / Redux Toolkit — TBD)
- [ ] Configure i18n (Vietnamese + English)
- [ ] Set up linting and formatting (ESLint, Prettier)
- [x] Set up environment config (dev/staging/prod API URLs)

### Backend (Python)
- [ ] Initialize Python project (FastAPI or Django — TBD by developer)
- [ ] Set up project structure: `app/routers/`, `app/models/`, `app/services/`, `app/core/`
- [ ] Set up database ORM and migrations (SQLAlchemy + Alembic or Django ORM)
- [ ] Set up JWT authentication
- [ ] Configure environment variables and settings
- [ ] Set up Docker / docker-compose for local development
- [ ] Set up CI pipeline (lint + test)

---

## 📊 Module 1 — Portfolio Dashboard

- [ ] Design dashboard screen layout (chart + asset breakdown + recommendations strip)
- [ ] Implement total portfolio value calculation (sum all assets in VND)
- [ ] Implement asset class breakdown chart (pie/donut)
- [ ] Implement profit/loss summary (total + per class)
- [ ] Implement "Quick Add" FAB (floating action button) routing to instrument forms
- [ ] Connect dashboard to local data store (reactive updates)

---

## 🏦 Module 2 — Bank Savings Deposits

### Data Layer
- [ ] Define `Deposit` schema (bank name, amount, rate, term, start date, maturity date, interest type)
- [ ] Implement CRUD operations for Deposit (local DB)
- [ ] Implement simple interest calculation: `P × r × t`
- [ ] Implement compound interest calculation: `P × (1 + r/n)^(n×t)`
- [ ] Implement "interest earned to date" calculation
- [ ] Implement "days to maturity" calculation

### UI
- [ ] Deposit list screen (sorted by maturity date)
- [ ] Deposit detail screen
- [ ] Add/Edit deposit form with validation
- [ ] Delete deposit (with confirmation)
- [ ] Maturity countdown badge per deposit card

---

## 📈 Module 3 — Stocks / ETFs

### Data Layer
- [ ] Define `StockPosition` schema (ticker, exchange, shares, purchase price, purchase date, notes)
- [ ] Implement CRUD operations for StockPosition (local DB)
- [ ] Implement unrealized P&L calculation
- [ ] Implement API price fetch (VietStock / CafeF — TBD)
- [ ] Implement price cache with timestamp (last updated)
- [ ] Implement manual price override

### UI
- [ ] Stock positions list screen
- [ ] Position detail screen with P&L breakdown
- [ ] Add/Edit position form with validation
- [ ] Delete position (with confirmation)
- [ ] Price refresh button + last-updated label

---

## 🥇 Module 4 — Gold

### Data Layer
- [ ] Define `GoldHolding` schema (type: SJC/999.9, weight, unit: tael/gram, purchase price, purchase date)
- [ ] Implement CRUD operations for GoldHolding (local DB)
- [ ] Implement unrealized P&L calculation
- [ ] Implement SJC API price fetch
- [ ] Implement price cache with timestamp
- [ ] Implement manual price override

### UI
- [ ] Gold holdings list screen
- [ ] Holding detail screen with P&L
- [ ] Add/edit holding form with validation
- [ ] Delete holding (with confirmation)
- [ ] Current gold price display card + last updated

---

## 💱 Module 5 — Exchange Rates

- [ ] Integrate free exchange rate API (exchangerate.host or similar)
- [ ] Display USD/VND, EUR/VND rates on a rates widget
- [ ] Cache rates locally (refresh every N hours)
- [ ] Manual override for rates
- [ ] Use rates for multi-currency conversions across modules

---

## 💡 Module 6 — Recommendations Engine (Phase 1)

- [ ] Define recommendation rule set:
  - Asset class concentration > 70% → diversification suggestion
  - Deposit interest rate below current market average → alert
  - Cash-drag detection (savings in checking vs. time deposit rates)
- [ ] Implement rule evaluator service (local, no backend needed)
- [ ] Design recommendation card component
- [ ] Display top 1–3 recommendations on dashboard
- [ ] Recommendation detail screen (explanation + action)

---

## 🔔 Module 7 — Notifications

- [ ] Integrate Firebase Cloud Messaging (FCM) — iOS + Android setup
- [ ] Implement local notification scheduler (for maturity reminders)
- [ ] Maturity reminder logic: trigger at 30d, 7d, 1d before each deposit maturity
- [ ] Price alert: user sets threshold → check on app open or background fetch
- [ ] Weekly portfolio summary notification
- [ ] Monthly portfolio summary notification
- [ ] Notification settings screen (per-type toggle)
- [ ] Handle notification tap → navigate to relevant screen

---

## ☁️ Module 8 — Cloud Sync (Optional)

### Backend API Endpoints
- [ ] `POST /auth/register` — create account
- [ ] `POST /auth/login` — JWT login
- [ ] `POST /auth/refresh` — token refresh
- [ ] `GET/POST /sync/deposits` — sync deposits
- [ ] `GET/POST /sync/stocks` — sync stock positions
- [ ] `GET/POST /sync/gold` — sync gold holdings
- [ ] `GET/POST /sync/settings` — sync user settings/alerts
- [ ] Conflict resolution strategy (last-write-wins for Phase 1)

### Mobile Sync
- [ ] Sync settings screen (enable/disable, last synced timestamp)
- [ ] Login / register screen
- [ ] Manual sync button
- [ ] Background auto-sync when online and opted in
- [ ] Export to JSON (manual backup)
- [ ] Import from JSON (manual restore)

---

## ⚙️ Settings & Misc

- [ ] App settings screen
- [ ] Currency display preferences (VND default)
- [ ] Notification preferences
- [ ] Data management screen (export, import, clear all data)
- [ ] About screen (version, licenses)

---

## 🧪 Testing

### Mobile
- [ ] Unit tests for calculation logic (interest, P&L, recommendations)
- [ ] Unit tests for API service mocks
- [ ] Integration tests for local DB CRUD
- [ ] E2E test for critical paths: add deposit → dashboard shows value

### Backend
- [ ] Unit tests for auth endpoints
- [ ] Unit tests for sync endpoints
- [ ] Integration tests with test database

---

## 🚀 Launch Readiness

- [ ] App icon + splash screen design
- [ ] iOS App Store listing preparation
- [ ] Google Play Store listing preparation
- [ ] Privacy policy page
- [ ] Backend deployment (cloud server — TBD)
- [ ] Database hosting setup (TBD)
- [ ] FCM production credentials setup
- [ ] Beta testing (TestFlight / Play internal track)
