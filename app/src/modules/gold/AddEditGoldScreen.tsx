import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '../../theme/colors';
import { GoldHoldingForm } from './components/GoldHoldingForm';

import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GoldHolding } from './types';

type GoldStackParamList = {
  GoldList: undefined;
  GoldDetail: { holdingId: string };
  AddEditGold: { holdingId?: string };
};

interface AddEditGoldScreenProps {
  route: RouteProp<GoldStackParamList, 'AddEditGold'>;
  navigation: NativeStackNavigationProp<GoldStackParamList, 'AddEditGold'>;
}

export const AddEditGoldScreen = ({ route, navigation }: AddEditGoldScreenProps) => {
  const holdingId = route.params?.holdingId;

  // In real app: const { data: holding } = useGetHolding(holdingId)
  const initialData: Partial<GoldHolding> | undefined = holdingId ? {
    id: holdingId,
    type: 'SJC',
    weight: '2.5',
    unit: 'TAEL',
    purchasePrice: '78000000',
    purchaseDate: '2024-01-15T00:00:00Z',
  } : undefined;

  const handleSubmit = (data: Omit<GoldHolding, 'id' | 'createdAt' | 'updatedAt'>) => {
    // In real app: mutation call
    console.log('Submitting gold holding:', data);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <GoldHoldingForm
        initialData={initialData}
        onSubmit={handleSubmit}
        isLoading={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
