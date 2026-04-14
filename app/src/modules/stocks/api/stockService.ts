import { StockPrice } from '../types';
import { fetchWithRetry } from '../../../utils/api';


/**
 * Service to fetch stock prices from VNDirect Finfo API
 * API: https://finfo-api.vndirect.com.vn/v4/stock_prices?q=code:VNM,FPT
 */
export const fetchStockPrices = async (tickers: string[]): Promise<StockPrice[]> => {
  if (tickers.length === 0) return [];

  // Filter out empty or invalid tickers
  const validTickers = tickers.filter(t => t && t.trim().length > 0).map(t => t.toUpperCase());
  if (validTickers.length === 0) return [];

  try {
    const codes = validTickers.join(',');
    const response = await fetchWithRetry(
      `https://finfo-api.vndirect.com.vn/v4/stock_prices?q=code:${codes}`,
      {
        headers: {
          'Referer': 'https://www.vndirect.com.vn/',
          'Accept': 'application/json',
        }
      }
    );

    if (!response.ok) {
        if (response.status === 429) {
            throw new Error('VNDirect API Rate Limit Exceeded. Please try again later.');
        }
        throw new Error(`Failed to fetch stock prices: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();
    
    if (!json || !json.data) {
        console.warn('VNDirect API returned empty or invalid data structure:', json);
        return [];
    }

    const data = json.data || [];

    return data.map((item: any) => ({
      ticker: item.code,
      currentPrice: (item.close * 1000).toString(), // Prices are often in 1000s VND
      change: (item.change * 1000).toString(),
      changePercent: item.pctChange !== undefined ? (item.pctChange >= 0 ? `+${item.pctChange}%` : `${item.pctChange}%`) : '0%',
      updatedAt: new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error in fetchStockPrices:', error);
    // Rethrow to allow useQuery to handle retry or error state
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
