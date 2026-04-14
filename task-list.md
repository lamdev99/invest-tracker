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
- [x] Define `Deposit` schema (bank name, amount, rate, term, start date, maturity date, interest type)
- [x] Implement CRUD operations for Deposit (local DB)
- [x] In `src/utils/math.ts`, add `calculateSimpleInterestForDeposit(principal: string, annualRate: string, termMonths: number): Big`
  - Formula: `P × r × (termMonths / 12)` using `big.js`
  - Use `Big.RM = 1` (Round Half Up) as per `rules.md §1`
- [x] In `src/utils/math.ts`, add `calculateCompoundInterestForDeposit(principal: string, annualRate: string, termMonths: number, compoundFrequency: number): Big`
  - Formula: `P × (1 + r/n)^(n × t)` where `t = termMonths / 12`
  - Use `Big.RM = 1` (Round Half Up) per `rules.md §1`
- [x] In `src/utils/math.ts`, add `calculateInterestEarned(deposit: Deposit, asOfDate?: Date): Big`
  - Dispatches to simple/compound based on `deposit.interestType`
  - `asOfDate` defaults to today — used to show interest earned "to date" (not at full maturity)
  - Clamp `asOfDate` to `maturityDate` if already past
- [x] In `src/utils/math.ts`, add `calculateMaturityValue(deposit: Deposit): Big`
  - Returns `principal + interest at full maturity`
- [x] In `src/utils/date.ts`, add `getDaysToMaturity(maturityDate: string): number`
  - Returns max(0, days remaining) — never shows negative days
- [x] In `src/utils/date.ts`, add `addMonthsToDate(date: string, months: number): string`
  - Used to auto-compute `maturityDate` from startDate + termMonths

### Data Layer — SQLite Schema & CRUD
- [x] Define `Deposit` TypeScript interface in `src/modules/savings/types.ts`:
  - `id`, `bankName`, `accountLabel?`, `principal` (string), `annualRate` (string), `termMonths`, `startDate`, `maturityDate`, `interestType: 'SIMPLE' | 'COMPOUND'`, `compoundFrequency?`, `status: 'ACTIVE' | 'MATURED' | 'WITHDRAWN'`, `notes?`, `createdAt`, `updatedAt`
- [x] Create `src/modules/savings/db/schema.ts` — `CREATE TABLE IF NOT EXISTS deposits (...)` DDL
- [x] Create `src/modules/savings/db/migration.ts` — run schema setup on first app launch via `expo-sqlite`
- [x] Create `src/modules/savings/db/repository.ts` with exported functions:
  - [x] `getAllDeposits(): Promise<Deposit[]>` — ORDER BY maturityDate ASC
  - [x] `getDepositById(id: string): Promise<Deposit | null>`
  - [x] `createDeposit(data): Promise<Deposit>` — generates UUID, sets `createdAt`/`updatedAt`
  - [x] `updateDeposit(id: string, data: Partial<Deposit>): Promise<Deposit>` — updates `updatedAt`
  - [x] `deleteDeposit(id: string): Promise<void>`

### State (Zustand)
- [x] Create `src/store/useSavingsStore.ts` with:
  - `deposits: Deposit[]`, `isLoading: boolean`
  - Actions: `loadDeposits()`, `addDeposit(data)`, `updateDeposit(id, data)`, `deleteDeposit(id)`
  - Each action calls the repository then refreshes the local `deposits` array

### Data Fetching Hooks (TanStack Query + convention.md)
- [x] Create `src/modules/savings/hooks/useDeposits.ts` — `useQuery` that calls `getAllDeposits()`, with `staleTime` set for offline use
- [x] Create `src/modules/savings/hooks/useSavingsMutations.ts` — `useMutation` hooks for create, update, delete; invalidate `deposits` query key on success

### UI — Components
- [x] Create `src/modules/savings/components/MaturityBadge.tsx`:
  - Accepts `daysRemaining: number`
  - Green (`>30d`), Amber (`7–30d`), Red (`<7d`), Grey (`MATURED`)
- [x] Create `src/modules/savings/components/DepositCard.tsx`:
  - Bank name + account label
  - Principal formatted via `formatVND` (VND)
  - Interest earned to date via `calculateInterestEarned(deposit)`
  - `MaturityBadge` with days remaining
  - Status pill: `ACTIVE` / `MATURED` / `WITHDRAWN`
  - `memo`-wrapped per `convention.md §3`
- [x] Create `src/modules/savings/components/DepositForm.tsx`:
  - Fields: Bank Name (text), Label (optional), Principal (numeric input), Annual Rate % (numeric), Term in months (numeric), Start Date (date picker — displayed in `DD/MM/YYYY`), Interest Type toggle (Simple / Compound), Compound Frequency (hidden unless Compound), Notes
  - `maturityDate` auto-computed and displayed (read-only) when startDate + termMonths are filled
  - Validation: all required fields, rate 0–100%, term > 0
  - On change: all monetary values formatted with `formatVND`

### UI — Screens
- [x] Build `SavingsScreen.tsx`:
  - Uses `useDeposits` hook
  - Header: total savings value (VND) + total interest earned (both masked if balance hidden)
  - Empty state with "No deposits yet — tap + to add"
  - `FlatList` of `DepositCard` sorted by maturity date ASC
  - Pull-to-refresh triggers `useDeposits` refetch
- [x] Build `DepositDetailScreen.tsx`:
  - All deposit fields displayed in `DD/MM/YYYY` and VND format
  - Interest earned to date + full maturity value
  - Progress bar: `startDate → today → maturityDate`
  - Edit button → navigates to `AddEditDepositScreen` with `depositId`
  - Delete button → confirmation alert → `deleteDeposit` mutation
- [x] Build `AddEditDepositScreen.tsx`:
  - `depositId?` route param: if present → prefill form for edit mode; else → add mode
  - Uses `DepositForm`
  - Save → `createDeposit` or `updateDeposit` mutation → navigate back

### Navigation
- [x] Register `DepositDetailScreen` and `AddEditDepositScreen` in a Savings Native Stack under `SavingsScreen`
- [x] Wire `QuickAddFAB` on `DashboardScreen` → navigate to `AddEditDepositScreen` (add mode) for Savings
---

## 🎨 Module 2 — Savings UI Enhancements

- [x] Fetch and save local bank list from `https://api.vietqr.io/v2/banks` to `src/assets/data/banks.json`
- [x] Implement `BankPicker` component (searchable dropdown/modal)
- [x] Integrate custom `DateTimePicker` for date selection (fallback for native lib)
- [x] Update `DepositForm.tsx`:
  - Replace Bank Name `TextInput` with `BankPicker`
  - Replace Start Date `TextInput` with `DateTimePicker`
  - Maintain auto-calculation logic for `maturityDate`
- [x] Verify UI responsiveness and accessibility


## 📈 Module 3 — Stocks / ETFs

### Data Layer
- [ ] Define `StockPosition` schema (ticker, exchange, shares, purchase price, purchase date, notes)
- [ ] Implement CRUD operations for StockPosition (local DB)
- [ ] Implement unrealized P&L calculation
- [ ] Implement API price fetch (VietStock / CafeF — TBD)
- [ ] Implement price cache with timestamp (last updated)
- [ ] Implement manual price override

### UI — Components
- [x] Create `src/modules/stocks/components/StockPriceCard.tsx`:
  - Display VNINDEX and tracked ticker prices
  - Manual refresh with loading indicator
- [x] Create `src/modules/stocks/components/StockPositionCard.tsx`:
  - Ticker, avg cost, current value, unrealized P&L
  - Color-coded badges for gains/losses
  - Performance-optimized with `memo`
- [x] Create `src/modules/stocks/components/StockPositionForm.tsx`:
  - Fields: Ticker, Exchange, Shares, Price, Date
  - Validation for ticker format and numeric entries

### UI — Screens
- [x] Build `StockScreen.tsx`:
  - Portfolio summary header (Total Value & P&L)
  - Searchable list of positions
  - Pull-to-refresh integration
- [x] Build `StockDetailScreen.tsx`:
  - Deep-dive metrics: Cost vs Market, Break-even point
  - Edit and Delete/Sell actions
- [x] Build `AddEditStockScreen.tsx`:
  - Host for `StockPositionForm`
  - Logic for Add vs Edit modes

### Navigation & Integration
- [x] Register screens in a `StocksStack` in `navigation/index.tsx`
- [x] Wire Dashboard FAB to navigate to `AddEditStockScreen` (Stock mode)
- [ ] Ensure `refreshDashboard()` in `useDashboardStore` includes stock data

---

## 🥇 Module 4 — Gold

### Data Layer — SQLite Schema & CRUD
- [ ] Define `GoldHolding` interface in `src/modules/gold/types.ts`
- [ ] Create `src/modules/gold/db/schema.ts` — `CREATE TABLE gold_holdings`
- [ ] Create `src/modules/gold/db/repository.ts` with `getAllHoldings`, `createHolding`, `updateHolding`, `deleteHolding`
- [ ] In `src/utils/math.ts`, add `calculateGoldPnL(holding: GoldHolding, currentPrice: Big): Big`
- [ ] In `src/utils/math.ts`, add `calculateTotalGoldValue(holdings: GoldHolding[], prices: GoldPrice[]): Big`

### State (Zustand)
- [ ] Create `src/store/useGoldStore.ts` with:
  - `holdings: GoldHolding[]`, `prices: GoldPrice[]`, `isLoading: boolean`
  - Actions: `loadHoldings()`, `addHolding(data)`, `updateHolding(id, data)`, `deleteHolding(id)`, `refreshPrices()`
  - Each CRUD action calls the repository then refreshes the store

### Data Fetching Hooks (TanStack Query)
- [ ] Create `src/modules/gold/hooks/useGoldHoldings.ts` — `useQuery` for all holdings
- [ ] Create `src/modules/gold/hooks/useGoldPrice.ts` — `useQuery` for SJC/999.9 prices with offline fallback
- [ ] Create `src/modules/gold/hooks/useGoldMutations.ts` — `useMutation` hooks for gold holding CRUD; invalidate `goldHoldings` query key on success

### UI — Components
- [x] Create `src/modules/gold/components/GoldPriceCard.tsx`:
  - Display SJC buy/sell prices for SJC and 999.9
  - "Last updated" timestamp (formatted `DD/MM/YYYY HH:mm`)
  - Manual refresh button with loading state
- [x] Create `src/modules/gold/components/GoldHoldingCard.tsx`:
  - Gold type, weight (formatted with unit), purchase price (VND)
  - Current value + unrealized P&L (amount + %) with color coding (green/red)
  - `memo`-wrapped for performance
- [x] Create `src/modules/gold/components/GoldHoldingForm.tsx`:
  - Fields: Gold Type (Picker), Weight (Numeric), Unit (Tael/Gram), Purchase Price (Numeric), Purchase Date (DateTimePicker)
  - Validation: all required, positive weight/price
  - Format monetary values via `formatVND`

### UI — Screens
- [x] Build `GoldScreen.tsx`:
  - Header: total gold value (VND) + total gold P&L (amount+%)
  - Support masking via "Eye" icon (balance toggle)
  - `GoldPriceCard` as top-level widget
  - `FlatList` of `GoldHoldingCard` sorted by date DESC
  - Pull-to-refresh to trigger `refreshPrices` and `loadHoldings`
- [x] Build `GoldDetailScreen.tsx`:
  - Detailed holding metrics: cost basis, current market value, total P&L
  - Edit button → `AddEditGoldScreen`
  - Delete button → Confirmation alert
- [x] Build `AddEditGoldScreen.tsx`:
  - `holdingId?` route param: add vs edit mode
  - Uses `GoldHoldingForm`
  - Save action → Mutation → navigate back

### Navigation & Integration
- [x] Register `GoldDetailScreen` and `AddEditGoldScreen` in a Gold Native Stack
- [x] Wire `QuickAddFAB` from Dashboard → navigate to `AddEditGoldScreen` (Gold mode)
- [x] Ensure `refreshDashboard()` in `useDashboardStore` includes gold data


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
---

## 🛠️ General Maintenance & Global Fixes

### Infrastructure & Deprecations
- [x] Migrate `SafeAreaView` from `react-native` to `react-native-safe-area-context`:
  - [x] Wrap application with `SafeAreaProvider` in `App.tsx` or `RootNavigation`
  - [x] Replace `SafeAreaView` occurrences in `SavingsScreen.tsx`, `StocksScreen.tsx`, and `GoldScreen.tsx`
  - [x] Adjust padding/insets for custom headers and notches

### Bug Fixes
- [ ] Fix Price Fetching Failures:
  - [ ] Gold: Investigate and fix intermittent SJC scraping failures (check for DOM changes or rate limits)
  - [ ] Stocks: Implement retry logic and error handling for VNDirect API (`finfo-api`)
  - [ ] Global: Add a "Last sync failed" warning UI when price data is stale
