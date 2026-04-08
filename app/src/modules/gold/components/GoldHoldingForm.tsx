import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import { formatDate } from '../../../utils/date';
import { GoldHolding, GoldType, GoldUnit } from '../types';
import { CustomDatePicker } from '../../savings/components/CustomDatePicker';

interface GoldHoldingFormProps {
  initialData?: Partial<GoldHolding>;
  onSubmit: (data: Omit<GoldHolding, 'id' | 'createdAt' | 'updatedAt'>) => void;
  isLoading?: boolean;
}

export const GoldHoldingForm = ({ initialData, onSubmit, isLoading }: GoldHoldingFormProps) => {
  const { t } = useTranslation();
  const [type, setType] = useState<GoldType>(initialData?.type || 'SJC');
  const [weight, setWeight] = useState(initialData?.weight || '');
  const [unit, setUnit] = useState<GoldUnit>(initialData?.unit || 'TAEL');
  const [purchasePrice, setPurchasePrice] = useState(initialData?.purchasePrice || '');
  const [purchaseDate, setPurchaseDate] = useState(initialData?.purchaseDate || new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState(initialData?.notes || '');

  const handleSave = () => {
    if (!weight || !purchasePrice) {
      alert('Please fill all required fields');
      return;
    }

    onSubmit({
      type,
      weight,
      unit,
      purchasePrice,
      purchaseDate,
      notes,
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.label}>Gold Type *</Text>
        <View style={styles.tabContainer}>
          {(['SJC', '9999'] as GoldType[]).map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.tab, type === t && styles.activeTab]}
              onPress={() => setType(t)}
            >
              <Text style={[styles.tabText, type === t && styles.activeTabText]}>
                {t === 'SJC' ? 'SJC' : '999.9'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.section, { flex: 2, marginRight: 8 }]}>
          <Text style={styles.label}>Weight *</Text>
          <TextInput
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
            placeholder="0.0"
          />
        </View>
        <View style={[styles.section, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.label}>Unit *</Text>
          <View style={styles.tabContainer}>
            {(['TAEL', 'GRAM'] as GoldUnit[]).map((u) => (
              <TouchableOpacity
                key={u}
                style={[styles.tab, unit === u && styles.activeTab]}
                onPress={() => setUnit(u)}
              >
                <Text style={[styles.tabText, unit === u && styles.activeTabText]}>
                  {t(`units.${u.toLowerCase()}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Purchase Price (VND / {t(`units.${unit.toLowerCase()}`)}) *</Text>
        <TextInput
          style={styles.input}
          value={purchasePrice}
          onChangeText={setPurchasePrice}
          keyboardType="numeric"
          placeholder="e.g. 78000000"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Purchase Date *</Text>
        <CustomDatePicker
          value={purchaseDate}
          onChange={setStartDate => setPurchaseDate(setStartDate)}
          label="Select Purchase Date"
        />
      </View>

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
        <Text style={styles.buttonText}>{isLoading ? 'Saving...' : 'Save Gold Holding'}</Text>
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
    ...typography.smallBold,
    color: colors.text,
    marginBottom: 8,
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: colors.white,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  tabText: {
    ...typography.small,
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '700',
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
