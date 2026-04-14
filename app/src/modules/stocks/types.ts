export type StockExchange = 'HOSE' | 'HNX' | 'UPCOM';

export interface StockPosition {
  id: string;
  ticker: string;
  exchange: StockExchange;
  shares: string; // Big.js decimal string
  avgPrice: string; // Big.js decimal string (VND)
  purchaseDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockPrice {
  ticker: string;
  name?: string;
  currentPrice: string;
  change: string;
  changePercent: string;
  updatedAt: string;
}
