# InvestTracker — Requirements Document

> **Generated:** 2026-03-31  
> **Version:** 1.0 (Phase 1 Scope)

---

## 1. Understanding Summary

| Item | Detail |
|------|--------|
| **What** | Mobile app to track, visualize, and get recommendations on personal investment portfolios |
| **Why** | Individual investors lack a simple tool to see all their assets (savings, stocks, gold) in one place with profit/loss clarity |
| **Who** | Individual retail investors in Vietnam |
| **Platform** | React Native (iOS + Android) |
| **Backend** | Custom REST API — Python (FastAPI or Django — TBD) |
| **Data Storage** | Local-first on device; optional cloud backup/sync via backend |
| **Primary Currency** | VND; architected for multi-currency support later |
| **Non-Goals (Phase 1)** | AI-driven advice, D/E/F instrument types, web dashboard, paid data providers |

---

## 2. Investment Instruments

### Phase 1
| Instrument | Key Data Points |
|---|---|
| **Bank Savings Deposit** | Bank name, deposit amount, interest rate, term, start date, maturity date, interest type (simple/compound) |
| **Stocks / ETFs** | Ticker, exchange, number of shares, purchase price, purchase date, current price (manual or API) |
| **Gold** | Type (SJC/999.9), weight (tael/gram), purchase price, purchase date, current price (API) |

### Phase 2 (Future)
- Cryptocurrency, Real estate, Foreign currency holdings, Other instruments

---

## 3. Functional Requirements

### 3.1 Portfolio Dashboard
- [ ] Overview screen showing total portfolio value in VND
- [ ] Breakdown by asset class (savings / stocks / gold) — chart + list
- [ ] Total profit/loss (amount + %) per asset and overall
- [ ] Quick-add entry point for new investment records

### 3.2 Bank Savings Module
- [ ] Add/edit/delete savings deposit records
- [ ] Auto-calculate interest earned to date and at maturity
- [ ] Display maturity countdown (days remaining)
- [ ] Support simple interest and compound interest calculations
- [ ] Support multiple banks

### 3.3 Stocks / ETFs Module
- [ ] Add/edit/delete stock position records
- [ ] Manual price entry OR fetch from free API (e.g., VietStock, CafeF)
- [ ] Calculate unrealized P&L per position
- [ ] Total cost basis vs. current value

### 3.4 Gold Module
- [ ] Add/edit/delete gold holding records
- [ ] Fetch current gold price from free API (e.g., SJC API)
- [ ] Manual price override option
- [ ] Calculate unrealized P&L

### 3.5 Exchange Rates
- [ ] Display key exchange rates (USD/VND, EUR/VND) from free API
- [ ] Manual override if API unavailable
- [ ] Used to convert multi-currency values to VND base

### 3.6 Basic Recommendations (Phase 1)
- [ ] Analyze portfolio allocation ratios (e.g., 80% savings → suggest diversification)
- [ ] Rule-based suggestion engine:
  - Over-concentration warnings (>70% in one asset class)
  - Underperforming deposit interest vs. current market rates
  - High cash-drag alert (idle savings could earn more)
- [ ] Suggestion cards displayed on dashboard

### 3.7 AI-Driven Advice (Phase 2)
- [ ] Risk tolerance questionnaire
- [ ] Market trend analysis integration
- [ ] Personalized rebalancing suggestions via LLM

### 3.8 Notifications & Alerts
- [ ] **Maturity reminders:** Push notification at 30 days, 7 days, 1 day before deposit maturity
- [ ] **Price alerts:** User-defined thresholds for gold price / stock price
- [ ] **Portfolio summary:** Weekly and/or monthly P&L digest notification
- [ ] Notification settings screen (enable/disable per type)

### 3.9 Data Sync (Optional Cloud Backup)
- [ ] Data stored locally by default (SQLite or similar)
- [ ] Optional sign-up / sign-in for cloud sync
- [ ] Manual backup and restore (export/import JSON)
- [ ] Auto-sync when online (if opted in)

---

## 4. Non-Functional Requirements

| Area | Requirement | Notes |
|------|-------------|-------|
| **Performance** | App startup < 2s; dashboard load < 1s | Local-first helps |
| **Scale** | Single-user per device; cloud sync ~1000 MAU target for Phase 1 | |
| **Offline** | All core features work without internet | API price fetch degrades gracefully |
| **Security** | Local data unencrypted (Phase 1); cloud sync uses JWT auth | Sensitive financial data — consider encryption Phase 2 |
| **Privacy** | No PII required for local mode; email only for cloud sync | |
| **Reliability** | API failures silently fall back to last cached price | |
| **Maintainability** | Clean module separation per asset class | For Phase 2 extensibility |
| **Accessibility** | Vietnamese + English language support in Phase 1 | i18n-ready architecture |

---

## 5. External Dependencies

| Service | Purpose | Type |
|---------|---------|------|
| SJC / BTMC API | Gold spot prices | Free |
| VietStock / CafeF API | Stock/ETF prices | Free (rate-limited) |
| Exchange Rate API (e.g., exchangerate.host) | USD/EUR/VND rates | Free |
| Firebase Cloud Messaging (FCM) | Push notifications | Free tier |
| Custom Backend API | Cloud sync, auth | Self-hosted Python |

---

## 6. Assumptions

1. Free APIs will have sufficient rate limits for Phase 1 user volumes
2. Users manually enter their positions (no broker API integration in Phase 1)
3. Gold prices are SJC-standard (Vietnamese market)
4. The backend tech stack (FastAPI vs. Django) will be decided before Phase 1 development begins
5. Local database is SQLite (via React Native libraries — specific library TBD by developer)
6. Multi-currency display is read-only in Phase 1; all base calculations in VND
7. Push notifications use FCM (requires both iOS/Android setup)

---

## 7. Explicit Non-Goals (Phase 1)

- No broker API integration (no auto-import of trades)
- No tax calculation or reporting
- No social features (sharing portfolios)
- No web version
- No crypto, real estate, or foreign currency instrument tracking
- No paid data providers
- No AI-driven advice (Phase 2)

---

## 8. Decision Log

| # | Decision | Alternatives Considered | Rationale |
|---|----------|------------------------|-----------|
| 1 | React Native for mobile | Flutter, native iOS/Android | User specified |
| 2 | Local-first + optional cloud | Cloud-only, local-only | Best balance of privacy and convenience |
| 3 | Python backend | Node.js, Go, Java | User specified |
| 4 | Phase 1: A, B, C instruments only | All instruments at once | Risk reduction; focus on core value |
| 5 | Rule-based recommendations (Phase 1) | AI from day 1 | Simpler, faster, no AI infra cost |
| 6 | Free APIs + manual entry | Paid data providers | Cost control; free APIs sufficient for Phase 1 |
| 7 | Vietnam primary, multi-currency ready | Single currency only | Future-proofing without current complexity |
