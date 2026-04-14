import { useQuery } from '@tanstack/react-query';
import { fetchStockPrices } from '../api/stockService';
import { StockPrice } from '../types';

export const useStockPrices = (tickers: string[]) => {
  return useQuery<StockPrice[]>({
    queryKey: ['stockPrices', tickers.sort().join(',')],
    queryFn: () => fetchStockPrices(tickers),
    enabled: tickers.length > 0,
    refetchInterval: 60000, // Refresh every minute
    staleTime: 30000, // Data is fresh for 30s
    retry: 3,
    refetchOnWindowFocus: true,
  });
};


export const useStockPrice = (ticker: string) => {
  return useQuery<StockPrice | null>({
    queryKey: ['stockPrice', ticker],
    queryFn: () => fetchStockPrices([ticker]).then(res => res[0] || null),
    enabled: !!ticker,
    refetchInterval: 60000,
    staleTime: 30000,
  });
};
