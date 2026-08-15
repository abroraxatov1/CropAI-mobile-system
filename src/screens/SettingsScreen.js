import React from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme/colors';
import { useLanguage } from '../i18n/i18n';
import Card from '../components/Card';
import Button from '../components/Button';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { clearHistory } from '../utils/storage';

export default function SettingsScreen() {
  const { t } = useLanguage();

  const handleClearHistory = () => {
    Alert.alert(t('history.confirmClearTitle'), t('history.confirmClearText'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('history.clearAll'),
        style: 'destructive',
        onPress: () => clearHistory(),
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.groupTitle}>{t('settings.language')}</Text>
      <Card>
        <Text style={styles.groupDesc}>{t('settings.languageDesc')}</Text>
        <LanguageSwitcher />
      </Card>

      <Text style={styles.groupTitle}>{t('settings.about')}</Text>
      <Card>
        <View style={styles.rowBetween}>
          <Text style={styles.rowLabel}>{t('settings.aboutVersion')}</Text>
          <Text style={styles.rowValue}>1.0.0</Text>
        </View>
        <View style={styles.divider} />
        <Text style={styles.rowLabel}>{t('settings.aboutModel')}</Text>
        <Text style={styles.paragraph}>{t('settings.aboutModelText')}</Text>
      </Card>

      <Card style={styles.disclaimerCard}>
        <View style={styles.disclaimerHeader}>
          <Ionicons name="warning-outline" size={18} color={colors.warning} />
          <Text style={styles.disclaimerTitle}>{t('settings.disclaimer')}</Text>
        </View>
        <Text style={styles.paragraph}>{t('settings.disclaimerText')}</Text>
      </Card>

      <Text style={styles.groupTitle}>{t('upload.formatHelpTitle')}</Text>
      <Card>
        <Text style={styles.paragraph}>{t('upload.formatHelpText')}</Text>
      </Card>

      <Button
        title={t('settings.clearHistory')}
        variant="danger"
        icon="trash-outline"
        onPress={handleClearHistory}
        style={{ marginTop: spacing.lg }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  groupTitle: { ...typography.h3, color: colors.text, marginTop: spacing.lg, marginBottom: spacing.sm },
  groupDesc: { ...typography.small, color: colors.textSecondary, marginBottom: spacing.md },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: spacing.sm },
  rowLabel: { ...typography.bodyBold, color: colors.text },
  rowValue: { ...typography.body, color: colors.textSecondary },
  divider: { height: 1, backgroundColor: colors.border, marginBottom: spacing.sm },
  paragraph: { ...typography.small, color: colors.textSecondary, lineHeight: 20, marginTop: 4 },
  disclaimerCard: { marginTop: spacing.lg, backgroundColor: '#FFF8E1', borderColor: '#FCE8B0' },
  disclaimerHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  disclaimerTitle: { ...typography.bodyBold, color: colors.warning, marginLeft: 8 },
});
