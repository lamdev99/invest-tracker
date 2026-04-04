import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext } from 'expo-sqlite';
import { useSavingsStore } from '../../../store/useSavingsStore';
import { Deposit } from '../types';

export const useSavingsMutations = () => {
  const db = useSQLiteContext();
  const queryClient = useQueryClient();
  const { addDeposit, updateDeposit, deleteDeposit } = useSavingsStore();

  const addMutation = useMutation({
    mutationFn: (data: Omit<Deposit, 'createdAt' | 'updatedAt'>) => addDeposit(db, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['deposits'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Deposit> }) =>
      updateDeposit(db, id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['deposits'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteDeposit(db, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['deposits'] }),
  });

  return {
    addDeposit: addMutation.mutateAsync,
    updateDeposit: updateMutation.mutateAsync,
    deleteDeposit: deleteMutation.mutateAsync,
    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
