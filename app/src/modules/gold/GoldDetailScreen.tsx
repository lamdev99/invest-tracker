import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Edit2, Trash2, Calendar, Coins, Scale, Wallet, TrendingUp, TrendingDown } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { formatVND } from '../../utils/math';
import { formatDate } from '../../utils/date';
import Big from 'big.js';

// Mock data for UI development
const MOCK_HOLDING = {
  id: '1',
  type: 'SJC',
  weight: '2.5',
  unit: 'TAEL',
  purchasePrice: '78000000',
  purchaseDate: '2024-01-15T00:00:00Z',
  notes: 'Bought at SJC store in District 1.',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const MOCK_PRICE = { type: 'SJC', buy: '79500000', sell: '81500000', updatedAt: new Date().toISOString() };

import { useSettingsStore } from '../../store/useSettingsStore';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type GoldStackParamList = {
  GoldList: undefined;
  GoldDetail: { holdingId: string };
  AddEditGold: { holdingId?: string };
};

interface GoldDetailScreenProps {
  route: RouteProp<GoldStackParamList, 'GoldDetail'>;
  navigation: NativeStackNavigationProp<GoldStackParamList, 'GoldDetail'>;
}

export const GoldDetailScreen = ({ route, navigation }: GoldDetailScreenProps) => {
  const { isBalanceVisible } = useSettingsStore();
  const { t } = useTranslation();
  // const { holdingId } = route.params;
  const holding = MOCK_HOLDING; // In real app: useGetHolding(holdingId)
  const currentPrice = MOCK_PRICE;

  const costBasis = new Big(holding.purchasePrice).times(holding.weight);
  const marketValue = currentPrice ? new Big(currentPrice.sell).times(holding.weight) : costBasis;
  const pnl = marketValue.minus(costBasis);
  const pnlPercent = costBasis.eq(0) ? new Big(0) : pnl.times(100).div(costBasis);

  const handleDelete = () => {
    Alert.alert(
      'Delete Holding',
      'Are you sure you want to delete this gold holding?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // delete mutation
            navigation.goBack();
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Coins size={32} color={colors.chart.gold} />
          </View>
          <Text style={styles.title}>{holding.type} Gold Holding</Text>
          <View style={[styles.pnlBadge, { backgroundColor: pnl.gte(0) ? `${colors.success}15` : `${colors.danger}15` }]}>
            {pnl.gte(0) ? <TrendingUp size={16} color={colors.success} /> : <TrendingDown size={16} color={colors.danger} />}
            <Text style={[styles.pnlText, { color: pnl.gte(0) ? colors.success : colors.danger }]}>
              {isBalanceVisible ? `${formatVND(pnl)} (${pnlPercent.toFixed(2)}%)` : '••••••••'}
            </Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Market Value</Text>
            <Text style={[styles.statValue, { color: colors.primary }]}>{isBalanceVisible ? formatVND(marketValue) : '••••••••'}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Cost Basis</Text>
            <Text style={styles.statValue}>{isBalanceVisible ? formatVND(costBasis) : '••••••••'}</Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <DetailItem icon={<Scale size={20} color={colors.secondary} />} label="Weight" value={`${holding.weight} ${t(`units.${holding.unit.toLowerCase()}`)}`} />
          <DetailItem
            icon={<Wallet size={20} color={colors.secondary} />}
            label="Purchase Price"
            value={isBalanceVisible ? `${formatVND(holding.purchasePrice)} / ${t(`units.${holding.unit.toLowerCase()}`)}` : '••••••••'}
          />
          <DetailItem icon={<Calendar size={20} color={colors.secondary} />} label="Purchase Date" value={formatDate(holding.purchaseDate)} />
          {holding.notes && (
            <View style={styles.notesContainer}>
              <Text style={styles.notesLabel}>Notes</Text>
              <Text style={styles.notesText}>{holding.notes}</Text>
            </View>
          )}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => navigation.navigate('AddEditGold', { holdingId: holding.id })}
          >
            <Edit2 size={20} color={colors.white} />
            <Text style={styles.buttonText}>Edit Holding</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Trash2 size={20} color={colors.danger} />
            <Text style={[styles.buttonText, { color: colors.danger }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const DetailItem = ({ icon, label, value }: DetailItemProps) => (
  <View style={styles.detailItem}>
    <View style={styles.detailLabelRow}>
      {icon}
      <Text style={styles.detailLabel}>{label}</Text>
    </View>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: `${colors.chart.gold}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: 8,
  },
  pnlBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pnlText: {
    ...typography.bodyBold,
    marginLeft: 6,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    ...typography.bodyBold,
    color: colors.text,
  },
  detailsContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 32,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    ...typography.body,
    color: colors.textSecondary,
    marginLeft: 12,
  },
  detailValue: {
    ...typography.bodyBold,
    color: colors.text,
  },
  notesContainer: {
    marginTop: 16,
  },
  notesLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  notesText: {
    ...typography.body,
    color: colors.text,
    lineHeight: 20,
  },
  actions: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  editButton: {
    backgroundColor: colors.primary,
  },
  deleteButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.danger,
  },
  buttonText: {
    ...typography.bodyBold,
    color: colors.white,
  },
});
