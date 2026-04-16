import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Card } from '../../../components/Card';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { formatVND } from '../../../utils/math';
import { useDashboardStore } from '../store/useDashboardStore';
import { useSettingsStore } from '../../../store/useSettingsStore';

export const TotalValueCard = () => {
  const { t } = useTranslation();
  const { summary } = useDashboardStore();
  const { isBalanceVisible, toggleBalanceVisibility } = useSettingsStore();

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.label}>{t('dashboard.totalValue')}</Text>
        <TouchableOpacity onPress={toggleBalanceVisibility} hitSlop={10}>
          {isBalanceVisible ? (
            <Eye size={20} color={colors.secondary} />
          ) : (
            <EyeOff size={20} color={colors.secondary} />
          )}
        </TouchableOpacity>
      </View>
      <Text style={styles.value}>
        {isBalanceVisible
          ? `${formatVND(summary?.totalValue || 0)} VND`
          : '•••••••• VND'}
      </Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.8)',
  },
  value: {
    ...typography.h2,
    color: colors.white,
  },
});
