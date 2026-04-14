import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTranslation } from 'react-i18next';
import { colors } from '../../theme/colors';
import { StockPositionForm } from './components/StockPositionForm';

// Mock data for initial loading in edit mode
const MOCK_POSITIONS = [
  {
    id: '1',
    ticker: 'FPT',
    exchange: 'HOSE' as const,
    shares: '500',
    avgPrice: '95000',
    purchaseDate: '2023-10-10T00:00:00Z',
    notes: 'Long-term investment in tech leader.',
  },
];

export const AddEditStockScreen = ({ route, navigation }: any) => {
  const { t } = useTranslation();
  const positionId = route.params?.positionId;
  const initialData = positionId ? MOCK_POSITIONS.find(p => p.id === positionId) : undefined;

  const handleSubmit = (data: any) => {
    // Mutation placeholder
    console.log('Saving stock position:', data);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        <StockPositionForm 
          initialData={initialData} 
          onSubmit={handleSubmit}
          isLoading={false}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
});
