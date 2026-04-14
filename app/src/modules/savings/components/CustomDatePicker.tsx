import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Calendar as CalendarIcon, X, ChevronRight } from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import { formatDate } from '../../../utils/date';

interface CustomDatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (date: string) => void;
  label?: string;
}

export const CustomDatePicker = ({ value, onChange, label }: CustomDatePickerProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  const currentDate = new Date(value);
  const years = Array.from({ length: 21 }, (_, i) => 2020 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState(currentDate.getDate());

  const days = Array.from({ length: getDaysInMonth(selectedYear, selectedMonth) }, (_, i) => i + 1);

  const handleConfirm = () => {
    const date = new Date(selectedYear, selectedMonth - 1, selectedDay);
    onChange(date.toISOString().split('T')[0]);
    setModalVisible(false);
  };

  const PickerColumn = ({ data, selected, onSelect, label }: any) => (
    <View style={styles.column}>
      <Text style={styles.columnLabel}>{label}</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.item, selected === item && styles.selectedItem]}
            onPress={() => onSelect(item)}
          >
            <Text style={[styles.itemText, selected === item && styles.selectedItemText]}>
              {item < 10 ? `0${item}` : item}
            </Text>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <View style={styles.triggerContent}>
          <View style={styles.left}>
            <CalendarIcon size={20} color={colors.primary} style={styles.icon} />
            <Text style={styles.valueText}>{formatDate(value)}</Text>
          </View>
          <ChevronRight size={20} color={colors.textSecondary} />
        </View>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.overlay}>
          <SafeAreaView style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.title}>{label || 'Select Date'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.pickerContainer}>
              <PickerColumn
                label="Day"
                data={days}
                selected={selectedDay}
                onSelect={setSelectedDay}
              />
              <PickerColumn
                label="Month"
                data={months}
                selected={selectedMonth}
                onSelect={(m: number) => {
                   setSelectedMonth(m);
                   const maxDays = getDaysInMonth(selectedYear, m);
                   if (selectedDay > maxDays) setSelectedDay(maxDays);
                }}
              />
              <PickerColumn
                label="Year"
                data={years}
                selected={selectedYear}
                onSelect={(y: number) => {
                   setSelectedYear(y);
                   const maxDays = getDaysInMonth(y, selectedMonth);
                   if (selectedDay > maxDays) setSelectedDay(maxDays);
                }}
              />
            </View>

            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.confirmText}>Confirm Date</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xs,
  },
  trigger: {
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
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  valueText: {
    ...typography.body,
    color: colors.text,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.h3,
    color: colors.text,
  },
  pickerContainer: {
    flexDirection: 'row',
    height: 250,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  column: {
    flex: 1,
    alignItems: 'center',
  },
  columnLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  selectedItem: {
    backgroundColor: `${colors.primary}15`,
  },
  itemText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  selectedItemText: {
    color: colors.primary,
    fontWeight: '700',
  },
  confirmButton: {
    backgroundColor: colors.primary,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmText: {
    ...typography.bodyBold,
    color: colors.white,
  },
});
