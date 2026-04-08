import { GoldPrice, GoldType } from '../types';
import { fetchWithRetry } from '../../../utils/api';

export const fetchGoldPrices = async (): Promise<GoldPrice[]> => {
  const VANG_TODAY_API = 'https://vang.today/api/prices';

  try {
    const prices: GoldPrice[] = [];

    // 1. Fetch from Vang.Today API (Reliable third-party aggregator)
    const response = await fetchWithRetry(VANG_TODAY_API);
    if (!response.ok) {
      throw new Error(`Failed to fetch gold prices from Vang.Today: ${response.status}`);
    }
    const json = await response.json();

    if (json.success && json.prices) {
      // SJL1L10 = SJC 1L-10L
      const sjc = json.prices['SJL1L10'];
      if (sjc) {
        prices.push({
          type: 'SJC',
          buy: sjc.buy.toString(),
          sell: sjc.sell.toString(),
          updatedAt: new Date(json.timestamp * 1000).toISOString(),
        });
      }

      // SJ9999 = SJC 99.99
      const sj9999 = json.prices['SJ9999'];
      if (sj9999) {
        prices.push({
          type: '9999',
          buy: sj9999.buy.toString(),
          sell: sj9999.sell.toString(),
          updatedAt: new Date(json.timestamp * 1000).toISOString(),
        });
      }
    }

    return prices;
  } catch (error) {
    console.error('Error fetching gold prices:', error);
    throw error;
  }
};
