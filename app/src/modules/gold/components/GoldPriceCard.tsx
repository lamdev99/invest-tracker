import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { RefreshCw, TrendingUp, TrendingDown } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Card } from '../../../components/Card';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { formatVND } from '../../../utils/math';
import { GoldPrice } from '../types';

interface GoldPriceCardProps {
  prices: GoldPrice[];
  isLoading?: boolean;
  onRefresh?: () => void;
  lastUpdated?: string;
}

export const GoldPriceCard = ({ prices, isLoading, onRefresh, lastUpdated }: GoldPriceCardProps) => {
  const { t } = useTranslation();

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>SJC Gold Price</Text>
          {lastUpdated && (
            <Text style={styles.lastUpdated}>Refreshed: {lastUpdated}</Text>
          )}
        </View>
        <TouchableOpacity onPress={onRefresh} disabled={isLoading} style={styles.refreshButton}>
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <RefreshCw size={18} color={colors.primary} />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.priceContainer}>
        {prices.map((price) => (
          <View key={price.type} style={styles.priceRow}>
            <View style={styles.typeCol}>
              <Text style={styles.typeName}>{price.type === 'SJC' ? 'SJC' : '999.9'}</Text>
              <Text style={styles.unitLabel}>/ {t('units.tael')}</Text>
            </View>
            <View style={styles.valueCol}>
              <Text style={styles.priceLabel}>Buy</Text>
              <Text style={styles.priceValue}>{formatVND(price.buy)}</Text>
            </View>
            <View style={[styles.valueCol, styles.rightCol]}>
              <Text style={styles.priceLabel}>Sell</Text>
              <Text style={[styles.priceValue, { color: colors.danger }]}>{formatVND(price.sell)}</Text>
            </View>
          </View>
        ))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleRow: {
    flex: 1,
  },
  title: {
    ...typography.bodyBold,
    color: colors.text,
  },
  lastUpdated: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  refreshButton: {
    padding: 4,
  },
  priceContainer: {
    gap: 16,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  typeCol: {
    width: 60,
  },
  typeName: {
    ...typography.bodyBold,
    color: colors.text,
  },
  unitLabel: {
    ...typography.small,
    color: colors.textSecondary,
  },
  valueCol: {
    flex: 1,
    alignItems: 'center',
  },
  rightCol: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  priceValue: {
    ...typography.smallBold,
    color: colors.success,
  },
});
