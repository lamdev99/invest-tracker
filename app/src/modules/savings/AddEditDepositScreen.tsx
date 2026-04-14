import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDeposits } from './hooks/useDeposits';
import { useSavingsMutations } from './hooks/useSavingsMutations';
import { DepositForm } from './components/DepositForm';
import { colors } from '../../theme/colors';

export const AddEditDepositScreen = ({ route, navigation }: any) => {
  const depositId = route.params?.depositId;
  const { data: deposits } = useDeposits();
  const { addDeposit, updateDeposit, isAdding, isUpdating } = useSavingsMutations();

  const deposit = deposits?.find((d) => d.id === depositId);

  const handleSubmit = async (data: any) => {
    if (depositId) {
      await updateDeposit({ id: depositId, data });
    } else {
      await addDeposit({
        ...data,
        id: Math.random().toString(36).substring(7), // Simple UUID for now
      });
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <DepositForm
        initialData={deposit}
        onSubmit={handleSubmit}
        isLoading={isAdding || isUpdating}
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
