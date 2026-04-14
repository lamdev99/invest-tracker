import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Coins, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Card } from '../../../components/Card';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { formatVND } from '../../../utils/math';
import { GoldHolding, GoldPrice } from '../types';
import Big from 'big.js';

interface GoldHoldingCardProps {
  holding: GoldHolding;
  currentPrice?: GoldPrice;
  onPress: (id: string) => void;
}

export const GoldHoldingCard = memo(({ holding, currentPrice, onPress }: GoldHoldingCardProps) => {
  const { t } = useTranslation();
  const purchasePrice = new Big(holding.purchasePrice);
  const weight = new Big(holding.weight);
  const totalCost = purchasePrice.times(weight);
  
  let currentVal = totalCost;
  let pnl = new Big(0);
  let pnlPercent = new Big(0);

  if (currentPrice) {
    const marketPrice = new Big(currentPrice.sell);
    currentVal = marketPrice.times(weight);
    pnl = currentVal.minus(totalCost);
    if (!totalCost.eq(0)) {
       pnlPercent = pnl.times(100).div(totalCost);
    }
  }

  const isPositive = pnl.gte(0);

  return (
    <TouchableOpacity onPress={() => onPress(holding.id)} activeOpacity={0.7}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.infoRow}>
            <View style={styles.iconWrapper}>
              <Coins size={20} color={colors.chart.gold} />
            </View>
            <View>
              <Text style={styles.type}>{holding.type === 'SJC' ? 'SJC Gold' : '999.9 Gold'}</Text>
              <Text style={styles.weight}>{holding.weight} {t(`units.${holding.unit.toLowerCase()}`)}</Text>
            </View>
          </View>

          <View style={styles.pnlContainer}>
            <Text style={[styles.pnlValue, { color: isPositive ? colors.success : colors.danger }]}>
              {pnl.gt(0) && '+'}{formatVND(pnl)}
            </Text>
            <View style={[styles.pnlBadge, { backgroundColor: isPositive ? `${colors.success}15` : `${colors.danger}15` }]}>
              {isPositive ? <TrendingUp size={12} color={colors.success} /> : <TrendingDown size={12} color={colors.danger} />}
              <Text style={[styles.pnlPercent, { color: isPositive ? colors.success : colors.danger }]}>
                {Math.abs(parseFloat(pnlPercent.toFixed(2)))}%
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <View>
            <Text style={styles.caption}>Market Value</Text>
            <Text style={styles.value}>{formatVND(currentVal)}</Text>
          </View>
          <ChevronRight size={20} color={colors.border} />
        </View>
      </Card>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    padding: 12,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: `${colors.chart.gold}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  type: {
    ...typography.bodyBold,
    color: colors.text,
  },
  weight: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  pnlContainer: {
    alignItems: 'flex-end',
  },
  pnlValue: {
    ...typography.smallBold,
  },
  pnlBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
  },
  pnlPercent: {
    ...typography.tinyBold,
    marginLeft: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  caption: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  value: {
    ...typography.bodyBold,
    color: colors.primary,
  },
});
