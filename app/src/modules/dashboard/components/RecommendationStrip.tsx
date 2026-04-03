import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Lightbulb } from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';

export const RecommendationStrip = () => {
  const recommendations = [
    {
      id: '1',
      title: 'Diversify Portfolio',
      desc: 'High concentration in Savings. Consider Stocks.',
    },
    {
      id: '2',
      title: 'Gold Price Dip',
      desc: 'SJC Gold is down 2%. Good entry point?',
    },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {recommendations.map((item) => (
        <View key={item.id} style={styles.card}>
          <View style={styles.header}>
            <Lightbulb size={16} color={colors.accent} />
            <Text style={styles.title}>{item.title}</Text>
          </View>
          <Text style={styles.desc}>{item.desc}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingRight: spacing.lg,
  },
  card: {
    width: 200,
    backgroundColor: `${colors.accent}10`,
    borderRadius: 12,
    padding: spacing.md,
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: `${colors.accent}20`,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    ...typography.small,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 6,
  },
  desc: {
    ...typography.small,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
