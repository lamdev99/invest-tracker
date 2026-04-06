import { useQuery } from '@tanstack/react-query';
import { fetchGoldPrices } from '../api/goldService';
import { GoldPrice } from '../types';

export const useGoldPrice = () => {
  return useQuery<GoldPrice[]>({
    queryKey: ['goldPrices'],
    queryFn: fetchGoldPrices,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};
