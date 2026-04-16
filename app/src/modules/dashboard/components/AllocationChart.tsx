import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { G, Circle } from 'react-native-svg';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { calculateAllocationPercent } from '../../../utils/math';
import { useDashboardStore } from '../store/useDashboardStore';

export const AllocationChart = () => {
  const { summary } = useDashboardStore();

  if (!summary) return null;

  const { savings, stocks, gold } = summary.byClass;
  const total = summary.totalValue;

  const data = [
    { label: 'Savings', value: savings, color: colors.chart.savings },
    { label: 'Stocks', value: stocks, color: colors.chart.stocks },
    { label: 'Gold', value: gold, color: colors.chart.gold },
  ].filter((d) => d.value.gt(0));

  const size = 180;
  const strokeWidth = 25;
  const radius = (size - strokeWidth) / 2;
  const circum = 2 * Math.PI * radius;

  let currentOffset = 0;

  return (
    <View style={styles.container}>
      <View style={styles.chartWrapper}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
            {data.map((item, index) => {
              const percent = calculateAllocationPercent(item.value, total).toNumber();
              const strokeDashoffset = circum - (percent / 100) * circum;
              const rotation = (currentOffset / 100) * 360;
              currentOffset += percent;

              return (
                <Circle
                  key={index}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={item.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${circum} ${circum}`}
                  strokeDashoffset={strokeDashoffset}
                  transform={`rotate(${rotation}, ${size / 2}, ${size / 2})`}
                  strokeLinecap="round"
                />
              );
            })}
          </G>
        </Svg>
        <View style={styles.centerText}>
          <Text style={styles.centerLabel}>Asset</Text>
          <Text style={styles.centerValue}>Breakdown</Text>
        </View>
      </View>

      <View style={styles.legend}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>
              {item.label} ({calculateAllocationPercent(item.value, total).toFixed(1)}%)
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  chartWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    position: 'absolute',
    alignItems: 'center',
  },
  centerLabel: {
    ...typography.small,
    color: colors.secondary,
  },
  centerValue: {
    ...typography.small,
    fontWeight: '700',
    color: colors.text,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginBottom: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    ...typography.small,
    color: colors.textSecondary,
  },
});
