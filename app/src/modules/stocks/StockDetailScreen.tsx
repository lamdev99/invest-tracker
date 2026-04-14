import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Platform,
} from 'react-native';
import { SafeAreaView as SafeAreaViewContext } from 'react-native-safe-area-context';



import { 
  TrendingUp, 
  TrendingDown, 
  Edit2, 
  Trash2, 
  Calendar, 
  Briefcase,
  DollarSign,
  BarChart3
} from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { formatVND } from '../../utils/math';
import { formatDate } from '../../utils/date';
import Big from 'big.js';

import { useStockPrice } from './hooks/useStockPrice';

// Mock positions remain for now until DB is ready
const MOCK_POSITIONS = [
  {
    id: '1',
    ticker: 'FPT',
    exchange: 'HOSE' as const,
    shares: '500',
    avgPrice: '95000',
    purchaseDate: '2023-10-10T00:00:00Z',
    notes: 'Long-term investment in tech leader.',
  },
  {
    id: '2',
    ticker: 'VNM',
    exchange: 'HOSE' as const,
    shares: '1200',
    avgPrice: '72500',
    purchaseDate: '2023-12-05T00:00:00Z',
  },
];

export const StockDetailScreen = ({ route, navigation }: any) => {
  const { positionId } = route.params;
  const position = MOCK_POSITIONS.find(p => p.id === positionId);
  
  // Real-time price hook
  const { data: priceData, isLoading } = useStockPrice(position?.ticker || '');
  
  if (!position) return null;

  const quantity = new Big(position.shares);
  const avgPrice = new Big(position.avgPrice);
  const cost = quantity.times(avgPrice);

  const priceNow = priceData ? new Big(priceData.currentPrice) : avgPrice;
  const currentValue = quantity.times(priceNow);
  const pnl = currentValue.minus(cost);
  const pnlPercent = cost.eq(0) ? new Big(0) : pnl.div(cost).times(100);
  const isPositive = pnl.gte(0);

  const handleDelete = () => {
    Alert.alert(
      'Delete Position',
      `Are you sure you want to delete your ${position.ticker} position?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => navigation.goBack() 
        },
      ]
    );
  };

  const DetailItem = ({ icon: Icon, label, value, valueColor = colors.text }: any) => (
    <View style={styles.detailItem}>
      <View style={styles.detailIcon}>
        <Icon size={20} color={colors.primary} />
      </View>
      <View>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={[styles.detailValue, { color: valueColor }]}>{value}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaViewContext style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={styles.headerCard}>
          <View style={styles.tickerHeader}>
             <Text style={styles.tickerText}>{position.ticker}</Text>
             <View style={styles.exchangeBadge}>
               <Text style={styles.exchangeText}>{position.exchange}</Text>
             </View>
          </View>
          
          <View style={styles.mainPnL}>
            <Text style={styles.totalValueLabel}>Current Market Value</Text>
            <Text style={styles.totalValueText}>{formatVND(currentValue)}</Text>
            <View style={[styles.pnlBadge, { backgroundColor: isPositive ? colors.success + '20' : colors.danger + '20' }]}>
              {isPositive ? <TrendingUp size={16} color={colors.success} /> : <TrendingDown size={16} color={colors.danger} />}
              <Text style={[styles.pnlPercent, { color: isPositive ? colors.success : colors.danger }]}>
                {isPositive && '+'}{formatVND(pnl)} ({pnlPercent.toFixed(2)}%)
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Position Metrics</Text>
          <View style={styles.detailsGrid}>
            <DetailItem icon={Briefcase} label="Quantity" value={`${position.shares} Shares`} />
            <DetailItem icon={DollarSign} label="Avg. Purchase Price" value={formatVND(avgPrice)} />
            <DetailItem icon={BarChart3} label="Total Cost Basis" value={formatVND(cost)} />
            <DetailItem icon={Calendar} label="First Purchase Date" value={formatDate(position.purchaseDate)} />
          </View>
        </View>

        {position.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <View style={styles.notesCard}>
              <Text style={styles.notesText}>{position.notes}</Text>
            </View>
          </View>
        )}

        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]}
            onPress={() => navigation.navigate('AddEditStock', { positionId: position.id })}
          >
            <Edit2 size={20} color={colors.white} />
            <Text style={styles.actionButtonText}>Edit Position</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Trash2 size={20} color={colors.danger} />
            <Text style={[styles.actionButtonText, { color: colors.danger }]}>Remove</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaViewContext>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  headerCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  tickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tickerText: {
    ...typography.h1,
    color: colors.text,
  },
  exchangeBadge: {
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 12,
  },
  exchangeText: {
    ...typography.smallBold,
    color: colors.textSecondary,
    fontSize: 12,
  },
  mainPnL: {
    alignItems: 'center',
  },
  totalValueLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  totalValueText: {
    ...typography.h1,
    fontSize: 28,
    color: colors.text,
    marginBottom: 12,
  },
  pnlBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  pnlPercent: {
    ...typography.bodyBold,
    marginLeft: 6,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: 16,
  },
  detailsGrid: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  detailLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    ...typography.bodyBold,
    color: colors.text,
  },
  notesCard: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  notesText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  editButton: {
    backgroundColor: colors.primary,
  },
  deleteButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  actionButtonText: {
    ...typography.bodyBold,
    color: colors.white,
  },
});
