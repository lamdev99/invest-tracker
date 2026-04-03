import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PiggyBank, TrendingUp, Coins, ChevronRight } from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { formatVND } from '../../../utils/math';
import { AssetClass } from '../types';

import Big from 'big.js';

interface AssetClassRowProps {
  type: AssetClass;
  value: string | number | Big;
  pnl?: string;
  onPress?: () => void;
}

export const AssetClassRow = ({ type, value, pnl, onPress }: AssetClassRowProps) => {
  const getIcon = () => {
    switch (type) {
      case 'SAVINGS':
        return <PiggyBank size={24} color={colors.chart.savings} />;
      case 'STOCKS':
        return <TrendingUp size={24} color={colors.chart.stocks} />;
      case 'GOLD':
        return <Coins size={24} color={colors.chart.gold} />;
    }
  };

  const getLabel = () => {
    switch (type) {
      case 'SAVINGS': return 'Savings';
      case 'STOCKS': return 'Stocks';
      case 'GOLD': return 'Gold';
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.left}>
        <View style={styles.iconWrapper}>{getIcon()}</View>
        <View>
          <Text style={styles.label}>{getLabel()}</Text>
          {pnl && <Text style={styles.pnl}>{pnl}</Text>}
        </View>
      </View>
      <View style={styles.right}>
        <Text style={styles.value}>{formatVND(value)}</Text>
        <ChevronRight size={20} color={colors.border} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  label: {
    ...typography.bodyBold,
    color: colors.text,
  },
  pnl: {
    ...typography.small,
    color: colors.success,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    ...typography.bodyBold,
    color: colors.text,
    marginRight: 4,
  },
});
