import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Text,
  SafeAreaView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { useDashboardStore } from '../../store/useDashboardStore';
import { TotalValueCard } from './components/TotalValueCard';
import { PnLSummaryCard } from './components/PnLSummaryCard';
import { AllocationChart } from './components/AllocationChart';
import { AssetClassRow } from './components/AssetClassRow';
import { RecommendationStrip } from './components/RecommendationStrip';
import { QuickAddFAB } from './components/QuickAddFAB';
import { formatDate } from '../../utils/date';

export const DashboardScreen = () => {
  const { t } = useTranslation();
  const { summary, isLoading, refreshDashboard } = useDashboardStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    refreshDashboard();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshDashboard();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.header}>
            <Text style={typography.h1}>InvestTracker</Text>
            {summary && (
              <Text style={styles.lastUpdated}>
                {t('dashboard.lastUpdated', {
                  time: formatDate(summary.lastUpdated),
                })}
              </Text>
            )}
          </View>

          <TotalValueCard />
          <PnLSummaryCard />
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Portfolio Allocation</Text>
            <AllocationChart />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Insights & Tips</Text>
            <RecommendationStrip />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Asset Breakdown</Text>
            {summary && (
              <View style={styles.list}>
                <AssetClassRow
                  type="SAVINGS"
                  value={summary.byClass.savings}
                  pnl="+4.2%"
                />
                <AssetClassRow
                  type="STOCKS"
                  value={summary.byClass.stocks}
                  pnl="+12.5%"
                />
                <AssetClassRow
                  type="GOLD"
                  value={summary.byClass.gold}
                  pnl="-1.8%"
                />
              </View>
            )}
          </View>
        </ScrollView>

        <QuickAddFAB onPress={() => console.log('Quick Add pressed')} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing['3xl'],
  },
  header: {
    marginBottom: spacing.xl,
  },
  lastUpdated: {
    ...typography.small,
    color: colors.secondary,
    marginTop: 4,
  },
  section: {
    marginTop: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  list: {
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
