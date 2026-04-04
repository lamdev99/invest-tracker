import './src/i18n';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RootNavigation } from './src/navigation';
import { StatusBar } from 'expo-status-bar';

import { SQLiteProvider } from 'expo-sqlite';
import { migrateSavings } from './src/modules/savings/db/migration';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SQLiteProvider databaseName="invest-tracker.db" onInit={migrateSavings}>
        <RootNavigation />
        <StatusBar style="auto" />
      </SQLiteProvider>
    </QueryClientProvider>
  );
}
