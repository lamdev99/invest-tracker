import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { RefreshCw, TrendingUp, TrendingDown } from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import { StockPrice } from '../types';
import { formatVND } from '../../../utils/math';

interface StockPriceCardProps {
  prices: StockPrice[];
  lastUpdated: string;
  onRefresh: () => void;
  isLoading?: boolean;
}

export const StockPriceCard = memo(({ prices, lastUpdated, onRefresh, isLoading }: StockPriceCardProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Market Prices</Text>
        <TouchableOpacity 
          onPress={onRefresh} 
          disabled={isLoading}
          style={styles.refreshButton}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <>
              <Text style={styles.lastUpdated}>{lastUpdated}</Text>
              <RefreshCw size={14} color={colors.primary} />
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        {prices.map((item, index) => {
          const isPositive = !item.change.startsWith('-');
          return (
            <View 
              key={item.ticker} 
              style={[
                styles.item, 
                index % 2 === 0 && styles.itemBorderRight,
                index < prices.length - 2 && styles.itemBorderBottom
              ]}
            >
              <View style={styles.itemHeader}>
                <Text style={styles.ticker}>{item.ticker}</Text>
                <View style={[styles.changeBadge, { backgroundColor: isPositive ? colors.success + '15' : colors.danger + '15' }]}>
                  {isPositive ? (
                    <TrendingUp size={10} color={colors.success} />
                  ) : (
                    <TrendingDown size={10} color={colors.danger} />
                  )}
                  <Text style={[styles.changeText, { color: isPositive ? colors.success : colors.danger }]}>
                    {item.changePercent}
                  </Text>
                </View>
              </View>
              <Text style={styles.price}>{formatVND(item.currentPrice)}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.bodyBold,
    color: colors.text,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastUpdated: {
    ...typography.caption,
    color: colors.textSecondary,
    marginRight: 6,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  item: {
    width: '50%',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  itemBorderRight: {
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  itemBorderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  ticker: {
    ...typography.smallBold,
    color: colors.textSecondary,
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  changeText: {
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 2,
  },
  price: {
    ...typography.bodyBold,
    color: colors.text,
  },
});
