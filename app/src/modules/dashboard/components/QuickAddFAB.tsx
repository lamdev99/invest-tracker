import React from 'react';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Plus } from 'lucide-react-native';
import { colors } from '../../../theme/colors';

interface QuickAddFABProps {
  onPress: () => void;
}

export const QuickAddFAB = ({ onPress }: QuickAddFABProps) => {
  return (
    <TouchableOpacity style={styles.fab} onPress={onPress} activeOpacity={0.8}>
      <Plus size={32} color={colors.white} strokeWidth={2.5} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
    }),
  },
});
