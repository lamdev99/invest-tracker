import { create } from 'zustand';
import * as SQLite from 'expo-sqlite';
import { Deposit } from '../modules/savings/types';
import * as SavingsRepo from '../modules/savings/db/repository';

interface SavingsState {
  deposits: Deposit[];
  isLoading: boolean;
  loadDeposits: (db: SQLite.SQLiteDatabase) => Promise<void>;
  addDeposit: (db: SQLite.SQLiteDatabase, data: Omit<Deposit, 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateDeposit: (db: SQLite.SQLiteDatabase, id: string, data: Partial<Deposit>) => Promise<void>;
  deleteDeposit: (db: SQLite.SQLiteDatabase, id: string) => Promise<void>;
}

export const useSavingsStore = create<SavingsState>((set, get) => ({
  deposits: [],
  isLoading: false,

  loadDeposits: async (db) => {
    set({ isLoading: true });
    try {
      const deposits = await SavingsRepo.getAllDeposits(db);
      set({ deposits, isLoading: false });
    } catch (error) {
      console.error('[SavingsStore] Error loading deposits:', error);
      set({ isLoading: false });
    }
  },

  addDeposit: async (db, data) => {
    await SavingsRepo.createDeposit(db, data);
    await get().loadDeposits(db);
  },

  updateDeposit: async (db, id, data) => {
    await SavingsRepo.updateDeposit(db, id, data);
    await get().loadDeposits(db);
  },

  deleteDeposit: async (db, id) => {
    await SavingsRepo.deleteDeposit(db, id);
    await get().loadDeposits(db);
  },
}));
