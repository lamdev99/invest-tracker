import { create } from 'zustand';
import Big from 'big.js';
import { PortfolioSummary } from '../modules/dashboard/types';

interface DashboardState {
  summary: PortfolioSummary | null;
  isLoading: boolean;
  isBalanceVisible: boolean;
  toggleBalanceVisibility: () => void;
  refreshDashboard: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  summary: null,
  isLoading: false,
  isBalanceVisible: true,
  toggleBalanceVisibility: () =>
    set((state) => ({ isBalanceVisible: !state.isBalanceVisible })),
  refreshDashboard: async () => {
    set({ isLoading: true });
    
    // Simulate API/DB delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // MOCK DATA for Phase 1 (as requested)
    const mockSummary: PortfolioSummary = {
      totalValue: new Big(1500000000), // 1.5 Billion VND
      byClass: {
        savings: new Big(1000000000), // 1 Billion
        stocks: new Big(350000000),  // 350 Million
        gold: new Big(150000000),    // 150 Million
      },
      pnl: new Big(45000000), // 45 Million Profit
      pnlPercent: new Big(3.09),
      lastUpdated: new Date().toISOString(),
    };

    set({ summary: mockSummary, isLoading: false });
  },
}));
