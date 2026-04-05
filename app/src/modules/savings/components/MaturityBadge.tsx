import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';

interface MaturityBadgeProps {
  daysRemaining: number;
}

export const MaturityBadge = ({ daysRemaining }: MaturityBadgeProps) => {
  let bgColor = colors.success;
  let textColor = colors.white;
  let label = `${daysRemaining}d`;

  if (daysRemaining === 0) {
    bgColor = colors.border;
    textColor = colors.textSecondary;
    label = 'Matured';
  } else if (daysRemaining < 7) {
    bgColor = colors.danger;
  } else if (daysRemaining <= 30) {
    bgColor = colors.warning;
  }

  return (
    <View style={[styles.badge, { backgroundColor: bgColor }]}>
      <Text style={[styles.text, { color: textColor }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  text: {
    ...typography.small,
    fontWeight: '700',
  },
});
