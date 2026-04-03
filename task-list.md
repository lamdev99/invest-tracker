# InvestTracker — Task List

> **Phase 1 Scope** | React Native + Python Backend  
> Status legend: `[ ]` todo · `[/]` in progress · `[x]` done

---

## 🏗️ Project Setup

### Mobile App (React Native)
- [x] Initialize React Native project (Expo or bare RN — TBD)
- [x] Set up folder structure: `src/modules/`, `src/components/`, `src/services/`, `src/store/`
- [x] Configure navigation library (React Navigation)
- [x] Set up local database (SQLite — library TBD)
- [x] Set up state management (Zustand / Redux Toolkit — TBD)
- [x] Configure i18n (Vietnamese + English)
- [x] Set up linting and formatting (ESLint, Prettier)
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

### Data Layer
- [x] Define `PortfolioSummary` type: `{ totalValue: Big; byClass: { savings: Big; stocks: Big; gold: Big }; pnl: Big; pnlPercent: Big }`
- [x] Implement `calculatePortfolioSummary(deposits[], stocks[], golds[])` in `src/utils/math.ts` using `big.js`
- [x] Implement `calculateAllocationPercent(classValue: Big, total: Big): Big` helper in `src/utils/math.ts`

### State (Zustand)
- [x] Create `src/store/useDashboardStore.ts` with state: `{ summary: PortfolioSummary | null; isLoading: boolean; lastUpdated: string | null }`
- [x] Add `refreshDashboard()` action that aggregates data from all module stores and recalculates summary

### Data Fetching (TanStack Query)
- [x] Create `src/modules/dashboard/hooks/useDashboardSummary.ts` — React Query hook that reads local SQLite and returns `PortfolioSummary`
- [x] Ensure hook gracefully returns cached data when offline (`staleTime: Infinity` when offline)

### UI — Components
- [x] Create `src/components/Card.tsx` — reusable surface card with shadow and border-radius
- [x] Create `src/modules/dashboard/components/TotalValueCard.tsx` — displays masked/unmasked total VND value (Eye icon toggle — per `rules.md §4`)
- [x] Create `src/modules/dashboard/components/AllocationChart.tsx` — pie/donut chart (savings / stocks / gold) using `react-native-svg` or equivalent; colors from `theme/colors.ts`
- [x] Create `src/modules/dashboard/components/AssetClassRow.tsx` — single row: icon, label, VND value, P&L badge (green/red)
- [x] Create `src/modules/dashboard/components/PnLSummaryCard.tsx` — overall P&L amount + percentage in VND format `1.000.000,00`
- [x] Create `src/modules/dashboard/components/RecommendationStrip.tsx` — horizontal scroll strip of up to 3 suggestion cards (placeholder for Module 6)
- [x] Create `src/modules/dashboard/components/QuickAddFAB.tsx` — floating action button (+) with bottom-right anchor; opens a bottom sheet with 3 options: Savings / Stocks / Gold

### UI — Screen
- [x] Build `DashboardScreen.tsx` layout:
  - [x] Header: app title + masked balance toggle
  - [x] `TotalValueCard`
  - [x] `AllocationChart` + 3× `AssetClassRow`
  - [x] `PnLSummaryCard`
  - [x] `RecommendationStrip` (placeholder)
  - [x] `QuickAddFAB`
- [x] Handle loading state (skeleton placeholder while data loads)
- [x] Handle empty state (no data yet — show onboarding card: "Add your first investment")
- [x] Refresh on pull-to-refresh

### Integration
- [x] Wire `useDashboardSummary` hook into `DashboardScreen`
- [x] Display `lastUpdated` timestamp (formatted `DD/MM/YYYY HH:mm` — per `rules.md §2`)
- [x] On `QuickAddFAB` press → navigate to respective module Add screen

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
