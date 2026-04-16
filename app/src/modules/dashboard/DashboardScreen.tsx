import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Text,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


import { useTranslation } from 'react-i18next';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { SyncStatusBanner } from '../../components/SyncStatusBanner';
import { useDashboardStore } from './store/useDashboardStore';
import { TotalValueCard } from './components/TotalValueCard';
import { PnLSummaryCard } from './components/PnLSummaryCard';
import { AllocationChart } from './components/AllocationChart';
import { AssetClassRow } from './components/AssetClassRow';
import { RecommendationStrip } from './components/RecommendationStrip';
import { QuickAddFAB } from './components/QuickAddFAB';
import { formatDate } from '../../utils/date';

import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type DashboardNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<any, 'DashboardTab'>,
  NativeStackNavigationProp<any>
>;

interface DashboardScreenProps {
  navigation: DashboardNavigationProp;
}

export const DashboardScreen = ({ navigation }: DashboardScreenProps) => {
  const { t } = useTranslation();
  const { summary, isLoading, syncErrors, refreshDashboard } = useDashboardStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    refreshDashboard();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshDashboard();
    setRefreshing(false);
  };

  const hasError = syncErrors.gold || syncErrors.stocks;
  const syncStatus = hasError ? 'error' : null;

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
            <Text style={typography.h1}>{t('dashboard.title')}</Text>
            {summary && (
              <Text style={styles.lastUpdated}>
                {t('dashboard.lastUpdated', {
                  time: formatDate(summary.lastUpdated),
                })}
              </Text>
            )}
          </View>

          <SyncStatusBanner
            status={syncStatus}
            message={syncErrors.gold || syncErrors.stocks || undefined}
            lastUpdated={summary ? formatDate(summary.lastUpdated) : undefined}
          />

          <TotalValueCard />
          <PnLSummaryCard />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('dashboard.portfolioAllocation')}</Text>
            <AllocationChart />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('dashboard.insightsTips')}</Text>
            <RecommendationStrip />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('dashboard.assetBreakdown')}</Text>
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

        <QuickAddFAB onPress={() => {
          Alert.alert(
            t('common.addInvestment'),
            t('common.addInvestmentSelect'),
            [
              {
                text: t('savings.title'),
                onPress: () => navigation.navigate('SavingsTab', { screen: 'AddEditDeposit' }),
              },
              {
                text: t('gold.title'),
                onPress: () => navigation.navigate('GoldTab', { screen: 'AddEditGold' }),
              },
              {
                text: t('stocks.title'),
                onPress: () => navigation.navigate('StocksTab', { screen: 'AddEditStock' }),
              },
              { text: t('common.cancel'), style: 'cancel' },
            ]
          );
        }} />


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
