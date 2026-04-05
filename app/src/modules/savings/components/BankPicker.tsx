import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  Image,
  SafeAreaView,
} from 'react-native';
import { Search, X, ChevronDown } from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import banksData from '../../../assets/data/banks.json';

interface Bank {
  id: number;
  name: string;
  code: string;
  shortName: string;
  logo: string;
}

interface BankPickerProps {
  value: string;
  onChange: (bankName: string) => void;
  error?: string;
}

export const BankPicker = ({ value, onChange, error }: BankPickerProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const banks: Bank[] = (banksData as any).data || [];

  const filteredBanks = useMemo(() => {
    if (!searchQuery) return banks;
    const query = searchQuery.toLowerCase();
    return banks.filter(
      (b) =>
        b.name.toLowerCase().includes(query) ||
        b.shortName.toLowerCase().includes(query) ||
        b.code.toLowerCase().includes(query)
    );
  }, [searchQuery, banks]);

  const selectedBank = useMemo(
    () => banks.find((b) => b.shortName === value || b.name === value),
    [value, banks]
  );

  const handleSelect = (bank: Bank) => {
    onChange(bank.shortName);
    setModalVisible(false);
    setSearchQuery('');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.pickerTrigger, error ? styles.errorBorder : null]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <View style={styles.triggerContent}>
          {selectedBank ? (
            <View style={styles.selectedRow}>
              <Image source={{ uri: selectedBank.logo }} style={styles.logoSmall} />
              <Text style={styles.selectedText}>{selectedBank.shortName}</Text>
            </View>
          ) : (
            <Text style={styles.placeholderText}>Select a bank</Text>
          )}
          <ChevronDown size={20} color={colors.textSecondary} />
        </View>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Bank</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <Search size={20} color={colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search bank name or code..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
          </View>

          <FlatList
            data={filteredBanks}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.bankItem}
                onPress={() => handleSelect(item)}
              >
                <Image source={{ uri: item.logo }} style={styles.logo} />
                <View style={styles.bankInfo}>
                  <Text style={styles.bankShortName}>{item.shortName}</Text>
                  <Text style={styles.bankFullName} numberOfLines={1}>
                    {item.name}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.listContent}
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xs,
  },
  pickerTrigger: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    height: 50,
    justifyContent: 'center',
  },
  triggerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoSmall: {
    width: 24,
    height: 24,
    borderRadius: 4,
    marginRight: 8,
    backgroundColor: colors.surface,
  },
  selectedText: {
    ...typography.body,
    color: colors.text,
  },
  placeholderText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  errorBorder: {
    borderColor: colors.danger,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.text,
  },
  listContent: {
    padding: spacing.lg,
  },
  bankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.surface,
    marginRight: 12,
  },
  bankInfo: {
    flex: 1,
  },
  bankShortName: {
    ...typography.bodyBold,
    color: colors.text,
  },
  bankFullName: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
