import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
    isBalanceVisible: boolean;
    toggleBalanceVisibility: () => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            isBalanceVisible: true,
            toggleBalanceVisibility: () =>
                set((state) => ({ isBalanceVisible: !state.isBalanceVisible })),
        }),
        {
            name: 'settings-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
