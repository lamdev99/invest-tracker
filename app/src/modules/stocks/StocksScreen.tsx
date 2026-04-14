import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTranslation } from 'react-i18next';
import { Plus, Search, AlertTriangle } from 'lucide-react-native';

import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { StockPriceCard } from './components/StockPriceCard';
import { StockPositionCard } from './components/StockPositionCard';
import { formatVND } from '../../utils/math';
import Big from 'big.js';
import { useStockPrices } from './hooks/useStockPrice';

// Mock positions remain for now until DB is ready
const MOCK_POSITIONS = [
  {
    id: '1',
    ticker: 'FPT',
    exchange: 'HOSE' as const,
    shares: '500',
    avgPrice: '95000',
    purchaseDate: '2023-10-10T00:00:00Z',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    ticker: 'VNM',
    exchange: 'HOSE' as const,
    shares: '1200',
    avgPrice: '72500',
    purchaseDate: '2023-12-05T00:00:00Z',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const WATCHLIST = ['VNM', 'FPT', 'VCB', 'HPG', 'SSI', 'VIC'];

export const StocksScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const positions = MOCK_POSITIONS;
  
  // Fetch real-time prices for watchlist and holdings
  const tickerList = useMemo(() => {
    const fromPositions = positions.map(p => p.ticker);
    return Array.from(new Set([...WATCHLIST, ...fromPositions]));
  }, [positions]);

  const { data: prices = [], isLoading, refetch, isError } = useStockPrices(tickerList);

  const totalValue = useMemo(() => {
    return positions.reduce((acc, pos) => {
      const priceObj = prices.find((p) => p.ticker === pos.ticker);
      const marketPrice = priceObj ? new Big(priceObj.currentPrice) : new Big(pos.avgPrice);
      return acc.plus(marketPrice.times(pos.shares));
    }, new Big(0));
  }, [positions, prices]);

  const totalPnL = useMemo(() => {
    return positions.reduce((acc, pos) => {
      const priceObj = prices.find((p) => p.ticker === pos.ticker);
      if (!priceObj) return acc;
      const marketPrice = new Big(priceObj.currentPrice);
      const cost = new Big(pos.avgPrice).times(pos.shares);
      const current = marketPrice.times(pos.shares);
      return acc.plus(current.minus(cost));
    }, new Big(0));
  }, [positions, prices]);

  const handlePress = (id: string) => {
    navigation.navigate('StockDetail', { positionId: id });
  };

  const onRefresh = () => {
    refetch();
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={positions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <View style={styles.summaryCard}>
              <View>
                <Text style={styles.summaryLabel}>{t('stocks.totalValue')}</Text>
                <Text style={styles.summaryValue}>{formatVND(totalValue)}</Text>
              </View>
              <View style={styles.pnlContainer}>
                <Text style={styles.summaryLabel}>{t('stocks.overallPnL')}</Text>
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

            <StockPriceCard 
              prices={prices} 
              lastUpdated={t('common.justNow')} 
              onRefresh={onRefresh}
              isLoading={isLoading}
            />

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('stocks.yourPositions')}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('AddEditStock')}>
                <Plus size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <StockPositionCard 
            position={item as any} 
            currentPrice={prices.find(p => p.ticker === item.ticker)} 
            onPress={handlePress} 
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{t('stocks.emptyState')}</Text>
            <Text style={styles.emptySubText}>{t('stocks.emptyStateAction')}</Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} tintColor={colors.primary} />
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
  listContent: {
    padding: spacing.lg,
  },
  summaryCard: {
    backgroundColor: colors.chart.stocks,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
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

