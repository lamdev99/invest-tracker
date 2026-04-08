import { create } from 'zustand';
import Big from 'big.js';
import { PortfolioSummary } from '../modules/dashboard/types';

interface DashboardState {
  summary: PortfolioSummary | null;
  isLoading: boolean;
  syncErrors: {
    gold: string | null;
    stocks: string | null;
  };
  isBalanceVisible: boolean;
  toggleBalanceVisibility: () => void;
  refreshDashboard: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  summary: null,
  isLoading: false,
  syncErrors: {
    gold: null,
    stocks: null,
  },
  isBalanceVisible: true,
  toggleBalanceVisibility: () =>
    set((state) => ({ isBalanceVisible: !state.isBalanceVisible })),
  refreshDashboard: async () => {
    set({ isLoading: true, syncErrors: { gold: null, stocks: null } });
    
    try {
        // In Phase 1, we still use mock summary, but in real app we'd call services here
        // simulate a bit of logic for error reporting
        await new Promise((resolve) => setTimeout(resolve, 800));

        // MOCK DATA for Phase 1
        const mockSummary: PortfolioSummary = {
          totalValue: new Big(1500000000),
          byClass: {
            savings: new Big(1000000000),
            stocks: new Big(350000000),
            gold: new Big(150000000),
          },
          pnl: new Big(45000000),
          pnlPercent: new Big(3.09),
          lastUpdated: new Date().toISOString(),
        };

        set({ summary: mockSummary, isLoading: false, syncErrors: { gold: null, stocks: null } });
    } catch (error) {
        set({ isLoading: false, syncErrors: { gold: 'Failed to refresh some data', stocks: null } });
    }
  },
}));
