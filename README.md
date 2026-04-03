# InvestTracker — Smart Investment Portfolio Manager

> **InvestTracker** is a mobile application designed for individual retail investors in Vietnam to track, visualize, and optimize multi-channel assets (Savings, Stocks, and Gold) within a single, unified interface.

---

## 🛠️ Setup Requirements

Before you begin, ensure you have the following installed on your local machine:

### Frontend (Mobile)
*   **Node.js:** v18.x or higher (LTS recommended)
*   **Yarn/NPM:** Latest version
*   **JDK:** Java Development Kit 17 (for Android)
*   **Android Studio:** Configured with Android SDK and Emulator
*   **Xcode:** (macOS only) v15.0 or higher for iOS development
*   **CocoaPods:** For managing iOS dependencies

### Backend (API)
*   **Python:** v3.10 or higher
*   **Docker:** Recommended for running PostgreSQL and Redis locally
*   **Poetry/Pip:** For Python package management

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone [https://github.com/your-repo/invest-tracker.git](https://github.com/your-repo/invest-tracker.git)
cd invest-tracker
```

## Mobile Setup (React Native)
```bash
# Install JS dependencies
npm install

# Install iOS dependencies (macOS only)
cd ios && pod install && cd ..

# Setup environment files
cp .env.example .env.development
```

```bash
Debug run
# Init app to emulator
npx react-native run-android

# Refresh
npx react-native start
```

## Backend Setup (FastAPI)
```
cd backend
# Install dependencies
pip install -r requirements.txt

# Start local database (using Docker)
docker-compose up -d

# Run migrations
alembic upgrade head

# Start the dev server
uvicorn main:app --reload
```

## Running the App
```bash
npm run android:dev
```
```bash
npm run ios:dev
```
## Project Structure:
```
src/
├── api/            # API instances and global API client configurations
├── components/     # Shared UI atoms (Buttons, Inputs, Cards, Modals)
├── modules/        # Main business logic partitioned by feature
├── navigation/     # Navigation stacks and type definitions
├── store/          # Zustand store definitions per module
└── utils/          # Calculation helpers (Interest, P&L) and formatters
```

## Privacy & Security
Offline-First: Your financial data is stored locally on your device by default (SQLite).

Privacy-Centric: No account registration is required to access core tracking features.

Data Integrity: All calculations use high-precision math libraries (big.js) to prevent rounding errors in VND.

## Roadmap
[x] Phase 1: Core tracking for Savings, Gold, and Stocks.

[ ] Phase 2: AI-driven (Gemini) market trend analysis and rebalancing suggestions.

[ ] Phase 3: Expansion to Real Estate, Foreign Currency, and Cryptocurrency tracking.