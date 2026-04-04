import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Landmark, ChevronRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Card } from '../../../components/Card';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { formatVND } from '../../../utils/math';
import { getDaysToMaturity } from '../../../utils/date';
import { Deposit } from '../types';
import { MaturityBadge } from './MaturityBadge';

interface DepositCardProps {
  deposit: Deposit;
  onPress: (id: string) => void;
}

export const DepositCard = memo(({ deposit, onPress }: DepositCardProps) => {
  const daysLeft = getDaysToMaturity(deposit.maturityDate);

  return (
    <TouchableOpacity onPress={() => onPress(deposit.id)} activeOpacity={0.7}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.bankInfo}>
            <View style={styles.iconWrapper}>
              <Landmark size={20} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.bankName}>{deposit.bankName}</Text>
              {deposit.accountLabel && (
                <Text style={styles.label}>{deposit.accountLabel}</Text>
              )}
            </View>
          </View>
          <MaturityBadge daysRemaining={daysLeft} />
        </View>

        <View style={styles.footer}>
          <View>
            <Text style={styles.caption}>Principal</Text>
            <Text style={styles.value}>{formatVND(deposit.principal)}</Text>
          </View>
          <View style={styles.right}>
             <Text style={styles.rate}>{parseFloat(deposit.annualRate) * 100}% p.a</Text>
             <ChevronRight size={20} color={colors.border} />
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bankInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: `${colors.primary}10`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  bankName: {
    ...typography.bodyBold,
    color: colors.text,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
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
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rate: {
    ...typography.small,
    color: colors.textSecondary,
    marginRight: 4,
  },
});
