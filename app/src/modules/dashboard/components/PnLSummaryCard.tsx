import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp, TrendingDown } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Card } from '../../../components/Card';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { formatVND } from '../../../utils/math';
import { useDashboardStore } from '../store/useDashboardStore';

export const PnLSummaryCard = () => {
  const { t } = useTranslation();
  const { summary } = useDashboardStore();

  if (!summary) return null;

  const isProfit = summary.pnl.gte(0);
  const color = isProfit ? colors.success : colors.danger;
  const Icon = isProfit ? TrendingUp : TrendingDown;

  return (
    <Card style={styles.card}>
      <Text style={styles.label}>{t('dashboard.profit')}</Text>
      <View style={styles.row}>
        <View style={styles.valueRow}>
          <Icon size={20} color={color} style={styles.icon} />
          <Text style={[styles.value, { color }]}>
            {formatVND(summary.pnl)} VND
          </Text>
        </View>
        <View style={[styles.badge, { backgroundColor: `${color}15` }]}>
          <Text style={[styles.badgeText, { color }]}>
            {isProfit ? '+' : ''}
            {summary.pnlPercent.toFixed(2)}%
          </Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingVertical: 12,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  value: {
    ...typography.h3,
    fontWeight: '700',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    ...typography.small,
    fontWeight: '700',
  },
});
