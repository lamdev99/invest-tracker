import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AlertTriangle, RefreshCw } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface SyncStatusBannerProps {
  status: 'error' | 'stale' | 'success' | null;
  message?: string;
  lastUpdated?: string;
}

export const SyncStatusBanner = ({ status, message, lastUpdated }: SyncStatusBannerProps) => {
  const { t } = useTranslation();
  
  if (!status || status === 'success') return null;

  const isError = status === 'error';
  const bgColor = isError ? colors.danger + '15' : colors.warning + '15';
  const iconColor = isError ? colors.danger : colors.warning;
  const borderColor = isError ? colors.danger + '30' : colors.warning + '30';

  return (
    <View style={[styles.container, { backgroundColor: bgColor, borderColor }]}>
      <View style={styles.iconContainer}>
        {isError ? (
          <AlertTriangle size={18} color={iconColor} />
        ) : (
          <RefreshCw size={18} color={iconColor} />
        )}
      </View>
      <View style={styles.content}>
        <Text style={[styles.message, { color: iconColor }]}>
          {message || (isError ? t('common.syncFailed') : t('common.syncStale'))}
        </Text>
        {lastUpdated && (
          <Text style={styles.timestamp}>
            {t('common.lastSync', { time: lastUpdated })}
          </Text>
        )}
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  iconContainer: {
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  message: {
    ...typography.bodyBold,
    fontSize: 14,
  },
  timestamp: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
