import { create } from 'zustand';

interface PortfolioState {
  totalValue: string;
  refreshPortfolio: () => Promise<void>;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  totalValue: '0',
  refreshPortfolio: async () => {
    // Placeholder for refresh logic
    console.log('Refreshing portfolio...');
  },
}));

interface PriceState {
  goldPrice: string;
  stockPrice: Record<string, string>;
  setGoldPrice: (price: string) => void;
  setStockPrice: (ticker: string, price: string) => void;
}

export const usePriceStore = create<PriceState>((set) => ({
  goldPrice: '0',
  stockPrice: {},
  setGoldPrice: (price) => set({ goldPrice: price }),
  setStockPrice: (ticker, price) => 
    set((state) => ({ 
      stockPrice: { ...state.stockPrice, [ticker]: price } 
    })),
}));
