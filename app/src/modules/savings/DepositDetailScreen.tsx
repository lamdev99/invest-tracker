import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Landmark, Calendar, Percent, Clock, FileText, Trash2, Edit } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { useDeposits } from './hooks/useDeposits';
import { useSavingsMutations } from './hooks/useSavingsMutations';
import { formatVND, calculateInterestEarned } from '../../utils/math';
import { formatDate } from '../../utils/date';

export const DepositDetailScreen = ({ route, navigation }: any) => {
  const { depositId } = route.params;
  const { data: deposits } = useDeposits();
  const { deleteDeposit } = useSavingsMutations();

  const deposit = deposits?.find((d) => d.id === depositId);

  if (!deposit) return null;

  const handleDelete = () => {
    Alert.alert(
      'Delete Deposit',
      'Are you sure you want to delete this savings account?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            await deleteDeposit(depositId);
            navigation.goBack();
          }
        },
      ]
    );
  };

  const InfoRow = ({ icon: Icon, label, value }: any) => (
    <View style={styles.infoRow}>
      <View style={styles.infoLeft}>
        <View style={styles.iconWrapper}>
          <Icon size={18} color={colors.secondary} />
        </View>
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.bankName}>{deposit.bankName}</Text>
          {deposit.accountLabel && (
             <Text style={styles.label}>{deposit.accountLabel}</Text>
          )}
        </View>

        <View style={styles.principalCard}>
           <Text style={styles.principalLabel}>Principal Amount</Text>
           <Text style={styles.principalValue}>{formatVND(deposit.principal)} VND</Text>
           <View style={styles.extraInfo}>
             <Text style={styles.extraLabel}>Interest Earned: </Text>
             <Text style={styles.extraValue}>+{formatVND(calculateInterestEarned(deposit))} VND</Text>
           </View>
        </View>

        <View style={styles.section}>
          <InfoRow icon={Percent} label="Annual Interest Rate" value={`${parseFloat(deposit.annualRate) * 100}%`} />
          <InfoRow icon={Clock} label="Term Duration" value={`${deposit.termMonths} Months`} />
          <InfoRow icon={Calendar} label="Start Date" value={formatDate(deposit.startDate)} />
          <InfoRow icon={Calendar} label="Maturity Date" value={formatDate(deposit.maturityDate)} />
          <InfoRow icon={Landmark} label="Interest Type" value={deposit.interestType} />
          {deposit.compoundFrequency && (
             <InfoRow icon={Clock} label="Compound Frequency" value={`${deposit.compoundFrequency} times/year`} />
          )}
        </View>

        {deposit.notes && (
          <View style={styles.section}>
            <View style={styles.notesHeader}>
              <FileText size={18} color={colors.secondary} />
              <Text style={styles.sectionTitle}>Notes</Text>
            </View>
            <Text style={styles.notesText}>{deposit.notes}</Text>
          </View>
        )}

        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]}
            onPress={() => navigation.navigate('AddEditDeposit', { depositId })}
          >
            <Edit size={20} color={colors.primary} />
            <Text style={styles.editText}>Edit Details</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Trash2 size={20} color={colors.danger} />
            <Text style={styles.deleteText}>Delete Deposit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  bankName: {
    ...typography.h2,
    color: colors.text,
  },
  label: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 4,
  },
  principalCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  principalLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  principalValue: {
    ...typography.h2,
    color: colors.primary,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  infoValue: {
    ...typography.bodyBold,
    color: colors.text,
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    ...typography.bodyBold,
    color: colors.text,
    marginLeft: 8,
  },
  notesText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  actions: {
    marginBottom: 40,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  editButton: {
    backgroundColor: `${colors.primary}05`,
    borderColor: colors.primary,
  },
  editText: {
    ...typography.bodyBold,
    color: colors.primary,
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: `${colors.danger}05`,
    borderColor: colors.danger,
  },
  deleteText: {
    ...typography.bodyBold,
    color: colors.danger,
    marginLeft: 8,
  },
  extraInfo: {
    flexDirection: 'row',
    marginTop: 12,
    backgroundColor: `${colors.success}10`,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  extraLabel: {
    ...typography.small,
    color: colors.textSecondary,
  },
  extraValue: {
    ...typography.small,
    fontWeight: '700',
    color: colors.success,
  },
});
