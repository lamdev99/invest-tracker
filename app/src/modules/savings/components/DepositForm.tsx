import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import { addMonthsToDate, formatDate } from '../../../utils/date';
import { Deposit, InterestType } from '../types';

interface DepositFormProps {
  initialData?: Partial<Deposit>;
  onSubmit: (data: Omit<Deposit, 'id' | 'createdAt' | 'updatedAt'>) => void;
  isLoading?: boolean;
}

export const DepositForm = ({ initialData, onSubmit, isLoading }: DepositFormProps) => {
  const { t } = useTranslation();
  
  const [bankName, setBankName] = useState(initialData?.bankName || '');
  const [accountLabel, setAccountLabel] = useState(initialData?.accountLabel || '');
  const [principal, setPrincipal] = useState(initialData?.principal || '');
  const [annualRate, setAnnualRate] = useState(initialData?.annualRate || '');
  const [termMonths, setTermMonths] = useState(initialData?.termMonths?.toString() || '12');
  const [startDate, setStartDate] = useState(initialData?.startDate || new Date().toISOString().split('T')[0]);
  const [interestType, setInterestType] = useState<InterestType>(initialData?.interestType || 'SIMPLE');
  const [compoundFrequency, setCompoundFrequency] = useState(initialData?.compoundFrequency?.toString() || '12');
  const [notes, setNotes] = useState(initialData?.notes || '');

  const [maturityDate, setMaturityDate] = useState('');

  useEffect(() => {
    if (startDate && termMonths) {
      setMaturityDate(addMonthsToDate(startDate, parseInt(termMonths, 10)));
    }
  }, [startDate, termMonths]);

  const handleSave = () => {
    if (!bankName || !principal || !annualRate || !termMonths) {
      alert('Please fill all required fields');
      return;
    }

    onSubmit({
      bankName,
      accountLabel,
      principal,
      annualRate,
      termMonths: parseInt(termMonths, 10),
      startDate,
      maturityDate,
      interestType,
      compoundFrequency: interestType === 'COMPOUND' ? parseInt(compoundFrequency, 10) : undefined,
      status: 'ACTIVE',
      notes,
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.label}>Bank Name *</Text>
        <TextInput
          style={styles.input}
          value={bankName}
          onChangeText={setBankName}
          placeholder="e.g. Vietcombank"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Account Label (Optional)</Text>
        <TextInput
          style={styles.input}
          value={accountLabel}
          onChangeText={setAccountLabel}
          placeholder="e.g. Savings 12M"
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.section, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>Principal (VND) *</Text>
          <TextInput
            style={styles.input}
            value={principal}
            onChangeText={setPrincipal}
            keyboardType="numeric"
            placeholder="e.g. 100000000"
          />
        </View>
        <View style={[styles.section, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.label}>Annual Rate (%) *</Text>
          <TextInput
            style={styles.input}
            value={annualRate}
            onChangeText={(val) => setAnnualRate(val)}
            keyboardType="numeric"
            placeholder="e.g. 0.065"
          />
          <Text style={styles.hint}>e.g. 0.065 for 6.5%</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.section, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>Term (Months) *</Text>
          <TextInput
            style={styles.input}
            value={termMonths}
            onChangeText={setTermMonths}
            keyboardType="numeric"
          />
        </View>
        <View style={[styles.section, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.label}>Start Date *</Text>
          <TextInput
            style={styles.input}
            value={startDate}
            onChangeText={setStartDate}
            placeholder="YYYY-MM-DD"
          />
        </View>
      </View>

      <View style={styles.infoBox}>
         <Text style={styles.infoLabel}>Maturity Date (Auto-calculated)</Text>
         <Text style={styles.infoValue}>{formatDate(maturityDate)}</Text>
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.label}>Compound Interest?</Text>
        <Switch
          value={interestType === 'COMPOUND'}
          onValueChange={(val) => setInterestType(val ? 'COMPOUND' : 'SIMPLE')}
        />
      </View>

      {interestType === 'COMPOUND' && (
        <View style={styles.section}>
          <Text style={styles.label}>Compound Frequency (per year)</Text>
          <TextInput
            style={styles.input}
            value={compoundFrequency}
            onChangeText={setCompoundFrequency}
            keyboardType="numeric"
          />
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
        />
      </View>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSave}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>{isLoading ? 'Saving...' : 'Save Deposit'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
  },
  label: {
    ...typography.small,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    ...typography.body,
    color: colors.text,
  },
  hint: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 4,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  infoBox: {
    backgroundColor: `${colors.primary}05`,
    padding: 12,
    borderRadius: 8,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: `${colors.primary}10`,
  },
  infoLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  infoValue: {
    ...typography.bodyBold,
    color: colors.primary,
    marginTop: 2,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingVertical: 8,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    ...typography.bodyBold,
    color: colors.white,
  },
});
