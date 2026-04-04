import Big from 'big.js';

export type AssetClass = 'SAVINGS' | 'STOCKS' | 'GOLD';

export interface PortfolioSummary {
  totalValue: Big;
  byClass: {
    savings: Big;
    stocks: Big;
    gold: Big;
  };
  pnl: Big;
  pnlPercent: Big;
  lastUpdated: string;
}

export interface AssetClassSummary {
  type: AssetClass;
  value: Big;
  pnl: Big;
  pnlPercent: Big;
  percentage: Big; // Percentage of total portfolio
}
