import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTranslation } from 'react-i18next';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { useDeposits } from './hooks/useDeposits';
import { DepositCard } from './components/DepositCard';
import { formatVND, sumBigs } from '../../utils/math';
import Big from 'big.js';

import { useSettingsStore } from '../../store/useSettingsStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type SavingsStackParamList = {
  SavingsList: undefined;
  DepositDetail: { depositId: string };
  AddEditDeposit: { depositId?: string };
};

interface SavingsScreenProps {
  navigation: NativeStackNavigationProp<SavingsStackParamList, 'SavingsList'>;
}

export const SavingsScreen = ({ navigation }: SavingsScreenProps) => {
  const { isBalanceVisible } = useSettingsStore();
  const { t } = useTranslation();
  const { data: deposits, isLoading, refetch } = useDeposits();

  const totalPrincipal = useMemo(() => {
    if (!deposits) return new Big(0);
    return sumBigs(deposits.map((d) => d.principal));
  }, [deposits]);

  const handlePress = (id: string) => {
    navigation.navigate('DepositDetail', { depositId: id });
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={deposits}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>{t('savings.totalSavings')}</Text>
              <Text style={styles.summaryValue}>
                {isBalanceVisible ? formatVND(totalPrincipal) : '••••••••'}
              </Text>
            </View>
            <Text style={styles.sectionTitle}>{t('savings.yourDeposits')}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <DepositCard deposit={item} onPress={handlePress} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{t('savings.emptyState')}</Text>
            <Text style={styles.emptySubText}>{t('savings.emptyStateAction')}</Text>
          </View>
        }
        onRefresh={refetch}
        refreshing={isLoading}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.lg,
  },
  summaryCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  summaryLabel: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  summaryValue: {
    ...typography.h2,
    color: colors.white,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    ...typography.bodyBold,
    color: colors.textSecondary,
  },
  emptySubText: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 4,
  },
});
