import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TrendingUp, TrendingDown, ChevronRight } from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import { StockPosition, StockPrice } from '../types';
import { formatVND } from '../../../utils/math';
import Big from 'big.js';

interface StockPositionCardProps {
  position: StockPosition;
  currentPrice?: StockPrice;
  onPress: (id: string) => void;
}

export const StockPositionCard = memo(({ position, currentPrice, onPress }: StockPositionCardProps) => {
  const quantity = new Big(position.shares);
  const avgPrice = new Big(position.avgPrice);
  const cost = quantity.times(avgPrice);

  const priceNow = currentPrice ? new Big(currentPrice.currentPrice) : avgPrice;
  const currentValue = quantity.times(priceNow);
  const pnl = currentValue.minus(cost);
  const pnlPercent = cost.eq(0) ? new Big(0) : pnl.div(cost).times(100);

  const isPositive = pnl.gte(0);

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => onPress(position.id)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.tickerContainer}>
          <Text style={styles.ticker}>{position.ticker}</Text>
          <View style={styles.exchangeBadge}>
            <Text style={styles.exchangeText}>{position.exchange}</Text>
          </View>
        </View>
        <View style={styles.pnlBadge}>
          {isPositive ? (
            <TrendingUp size={14} color={colors.success} strokeWidth={2.5} />
          ) : (
            <TrendingDown size={14} color={colors.danger} strokeWidth={2.5} />
          )}
          <Text style={[styles.pnlText, { color: isPositive ? colors.success : colors.danger }]}>
            {isPositive && '+'}{pnlPercent.toFixed(2)}%
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.infoRow}>
          <View>
            <Text style={styles.label}>Shares</Text>
            <Text style={styles.value}>{position.shares}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.label}>Current Value</Text>
            <Text style={styles.value}>{formatVND(currentValue)}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.footer}>
          <View>
            <Text style={styles.label}>Avg Price</Text>
            <Text style={styles.subValue}>{formatVND(avgPrice)}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.label}>Gain/Loss</Text>
            <Text style={[styles.subValue, { color: isPositive ? colors.success : colors.danger }]}>
              {isPositive && '+'}{formatVND(pnl)}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.chevron}>
        <ChevronRight size={20} color={colors.textSecondary} />
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  tickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ticker: {
    ...typography.bodyBold,
    fontSize: 18,
    color: colors.text,
  },
  exchangeBadge: {
    backgroundColor: colors.background,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  exchangeText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '700',
  },
  pnlBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.03)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pnlText: {
    ...typography.smallBold,
    marginLeft: 4,
  },
  content: {
    marginTop: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  value: {
    ...typography.bodyBold,
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
    opacity: 0.5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subValue: {
    ...typography.smallBold,
    color: colors.text,
  },
  chevron: {
    position: 'absolute',
    right: spacing.sm,
    top: '50%',
    marginTop: -10,
  },
});
