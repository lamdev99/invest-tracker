import { useQuery } from '@tanstack/react-query';
import { useSQLiteContext } from 'expo-sqlite';
import { useSavingsStore } from '../../../store/useSavingsStore';

/**
 * Hook to fetch all savings deposits with React Query.
 * Uses the SQLite context to provide the DB instance to the Zustand store.
 */
export const useDeposits = () => {
  const db = useSQLiteContext();
  const { loadDeposits, deposits } = useSavingsStore();

  return useQuery({
    queryKey: ['deposits'],
    queryFn: async () => {
      await loadDeposits(db);
      return useSavingsStore.getState().deposits;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
