import './src/i18n';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RootNavigation } from './src/navigation';
import { StatusBar } from 'expo-status-bar';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RootNavigation />
      <StatusBar style="auto" />
    </QueryClientProvider>
  );
}
