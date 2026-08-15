import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { colors, spacing, typography } from '../theme/colors';
import { useLanguage } from '../i18n/i18n';
import MenuCard from '../components/MenuCard';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function HomeScreen({ navigation }) {
  const { t } = useLanguage();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <View style={styles.logoWrap}>
            <Text style={styles.logoEmoji}>🌱</Text>
          </View>
          <LanguageSwitcher compact />
        </View>

        <Text style={styles.title}>{t('home.title')}</Text>
        <Text style={styles.subtitle}>{t('home.subtitle')}</Text>

        <View style={styles.menu}>
          <MenuCard
            icon="cloud-upload-outline"
            iconColor={colors.info}
            title={t('home.uploadCard')}
            description={t('home.uploadCardDesc')}
            onPress={() => navigation.navigate('Upload')}
          />
          <MenuCard
            icon="create-outline"
            iconColor={colors.primary}
            title={t('home.manualCard')}
            description={t('home.manualCardDesc')}
            onPress={() => navigation.navigate('ManualEntry')}
          />
          <MenuCard
            icon="time-outline"
            iconColor={colors.secondary}
            title={t('home.historyCard')}
            description={t('home.historyCardDesc')}
            onPress={() => navigation.navigate('History')}
          />
          <MenuCard
            icon="leaf-outline"
            iconColor={colors.accent}
            title={t('home.cropInfoCard')}
            description={t('home.cropInfoCardDesc')}
            onPress={() => navigation.navigate('CropInfo')}
          />
          <MenuCard
            icon="settings-outline"
            iconColor={colors.textSecondary}
            title={t('home.settingsCard')}
            description={t('home.settingsCardDesc')}
            onPress={() => navigation.navigate('Settings')}
          />
        </View>

        <View style={styles.badgeWrap}>
          <Text style={styles.badgeText}>{t('home.modelBadge')}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  logoWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary + '1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmoji: { fontSize: 26 },
  title: { ...typography.h1, color: colors.text, marginTop: spacing.sm },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: 4, marginBottom: spacing.lg },
  menu: { marginTop: spacing.xs },
  badgeWrap: { alignItems: 'center', marginTop: spacing.lg },
  badgeText: { ...typography.tiny, color: colors.textMuted, textAlign: 'center' },
});
