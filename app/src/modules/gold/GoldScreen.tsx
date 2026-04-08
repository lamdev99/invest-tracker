import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { GoldPriceCard } from './components/GoldPriceCard';
import { GoldHoldingCard } from './components/GoldHoldingCard';
import { useGoldPrice } from './hooks/useGoldPrice';
import { formatVND, sumBigs } from '../../utils/math';
import Big from 'big.js';

const MOCK_HOLDINGS = [
  {
    id: '1',
    type: 'SJC',
    weight: '2.5',
    unit: 'TAEL',
    purchasePrice: '78000000',
    purchaseDate: '2024-01-15T00:00:00Z',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    type: '9999',
    weight: '0.5',
    unit: 'TAEL',
    purchasePrice: '68500000',
    purchaseDate: '2023-11-20T00:00:00Z',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const GoldScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const { data: prices, isLoading, isError, refetch } = useGoldPrice();
  
  // These will be replaced by real hooks later
  const holdings = MOCK_HOLDINGS;


  const totalValue = useMemo(() => {
    if (!prices) return new Big(0);
    return holdings.reduce((acc, holding) => {
      const priceObj = prices.find((p) => p.type === holding.type);
      const marketPrice = priceObj ? new Big(priceObj.sell) : new Big(holding.purchasePrice);
      return acc.plus(marketPrice.times(holding.weight));
    }, new Big(0));
  }, [holdings, prices]);

  const totalPnL = useMemo(() => {
    if (!prices) return new Big(0);
    return holdings.reduce((acc, holding) => {
      const priceObj = prices.find((p) => p.type === holding.type);
      if (!priceObj) return acc;
      const marketPrice = new Big(priceObj.sell);
      const cost = new Big(holding.purchasePrice).times(holding.weight);
      const current = marketPrice.times(holding.weight);
      return acc.plus(current.minus(cost));
    }, new Big(0));
  }, [holdings, prices]);

  const handlePress = (id: string) => {
    navigation.navigate('GoldDetail', { holdingId: id });
  };

  const onRefresh = () => {
    refetch();
  };

  if (isLoading && !prices) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={holdings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl 
            refreshing={isLoading} 
            onRefresh={onRefresh} 
            tintColor={colors.primary} 
          />
        }
        ListHeaderComponent={
          <>
            <View style={styles.summaryCard}>
              <View>
                <Text style={styles.summaryLabel}>{t('gold.totalValue')}</Text>
                <Text style={styles.summaryValue}>{formatVND(totalValue)}</Text>
              </View>
              <View style={styles.pnlContainer}>
                <Text style={styles.summaryLabel}>{t('gold.totalPnL')}</Text>
                <Text style={[styles.pnlValue, { color: totalPnL.gte(0) ? colors.success : colors.danger }]}>
                  {totalPnL.gt(0) && '+'}{formatVND(totalPnL)}
                </Text>
              </View>
            </View>

            {isError && (
              <View style={styles.errorBanner}>
                <AlertTriangle size={16} color={colors.danger} />
                <Text style={styles.errorText}>{t('common.syncFailed')}</Text>
              </View>
            )}
            {prices && (
              <GoldPriceCard 
                prices={prices} 
                lastUpdated={t('common.justNow')} 
                onRefresh={onRefresh}
                isLoading={isLoading}
              />
            )}
            <Text style={styles.sectionTitle}>{t('gold.yourHoldings')}</Text>
          </>
        }
        renderItem={({ item }) => (
          <GoldHoldingCard 
            holding={item as any} 
            currentPrice={prices?.find(p => p.type === item.type)} 
            onPress={handlePress} 
          />
        )}

        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{t('gold.emptyState')}</Text>
            <Text style={styles.emptySubText}>{t('gold.emptyStateAction')}</Text>
          </View>
        }
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
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.danger + '10',
    padding: 12,
    marginHorizontal: spacing.lg,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.danger + '20',
  },
  errorText: {
    ...typography.caption,
    color: colors.danger,
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: colors.chart.gold,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  pnlContainer: {
    alignItems: 'flex-end',
  },
  pnlValue: {
    ...typography.smallBold,
    color: colors.white,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: 12,
    marginTop: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
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

