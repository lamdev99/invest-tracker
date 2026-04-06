import { StockPrice } from '../types';

/**
 * Service to fetch stock prices from VNDirect Finfo API
 * API: https://finfo-api.vndirect.com.vn/v4/stock_prices?q=code:VNM,FPT
 */
export const fetchStockPrices = async (tickers: string[]): Promise<StockPrice[]> => {
  if (tickers.length === 0) return [];

  try {
    const codes = tickers.join(',');
    const response = await fetch(
      `https://finfo-api.vndirect.com.vn/v4/stock_prices?q=code:${codes}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch stock prices');
    }

    const json = await response.json();
    const data = json.data || [];

    return data.map((item: any) => ({
      ticker: item.code,
      currentPrice: item.close.toString(),
      change: item.change.toString(),
      changePercent: item.pctChange >= 0 ? `+${item.pctChange}%` : `${item.pctChange}%`,
      updatedAt: new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching stock prices:', error);
    throw error;
  }
};

/**
 * Fetch a single stock price
 */
export const fetchStockPrice = async (ticker: string): Promise<StockPrice | null> => {
  const prices = await fetchStockPrices([ticker]);
  return prices.length > 0 ? prices[0] : null;
};
