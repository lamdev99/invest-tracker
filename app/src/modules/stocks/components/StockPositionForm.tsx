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
import { StockPosition, StockExchange } from '../types';
import { CustomDatePicker } from '../../savings/components/CustomDatePicker';

interface StockPositionFormProps {
  initialData?: Partial<StockPosition>;
  onSubmit: (data: Omit<StockPosition, 'id' | 'createdAt' | 'updatedAt'>) => void;
  isLoading?: boolean;
}

export const StockPositionForm = ({ initialData, onSubmit, isLoading }: StockPositionFormProps) => {
  const [ticker, setTicker] = useState(initialData?.ticker || '');
  const [exchange, setExchange] = useState<StockExchange>(initialData?.exchange || 'HOSE');
  const [shares, setShares] = useState(initialData?.shares || '');
  const [avgPrice, setAvgPrice] = useState(initialData?.avgPrice || '');
  const [purchaseDate, setPurchaseDate] = useState(initialData?.purchaseDate || new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState(initialData?.notes || '');

  const handleSave = () => {
    if (!ticker || !shares || !avgPrice) {
      alert('Please fill all required fields');
      return;
    }

    onSubmit({
      ticker: ticker.toUpperCase(),
      exchange,
      shares,
      avgPrice,
      purchaseDate,
      notes,
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.label}>Ticker Symbol *</Text>
        <TextInput
          style={[styles.input, { fontWeight: '700', fontSize: 18 }]}
          value={ticker}
          onChangeText={(text) => setTicker(text.toUpperCase())}
          placeholder="e.g. VNM, FPT"
          autoCapitalize="characters"
          maxLength={10}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Exchange *</Text>
        <View style={styles.tabContainer}>
          {(['HOSE', 'HNX', 'UPCOM'] as StockExchange[]).map((e) => (
            <TouchableOpacity
              key={e}
              style={[styles.tab, exchange === e && styles.activeTab]}
              onPress={() => setExchange(e)}
            >
              <Text style={[styles.tabText, exchange === e && styles.activeTabText]}>
                {e}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.section, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>Shares *</Text>
          <TextInput
            style={styles.input}
            value={shares}
            onChangeText={setShares}
            keyboardType="numeric"
            placeholder="0"
          />
        </View>
        <View style={[styles.section, { flex: 2, marginLeft: 8 }]}>
          <Text style={styles.label}>Avg Purchase Price (VND) *</Text>
          <TextInput
            style={styles.input}
            value={avgPrice}
            onChangeText={setAvgPrice}
            keyboardType="numeric"
            placeholder="e.g. 50000"
          />
        </View>
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
          placeholder="Optional notes..."
        />
      </View>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSave}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>{isLoading ? 'Saving...' : 'Save Stock Position'}</Text>
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
