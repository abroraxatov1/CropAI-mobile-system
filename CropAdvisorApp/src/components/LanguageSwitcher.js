import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/colors';
import { SUPPORTED_LANGUAGES, useLanguage } from '../i18n/i18n';

export default function LanguageSwitcher({ compact = false }) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <View style={[styles.row, compact && styles.rowCompact]}>
      {SUPPORTED_LANGUAGES.map((lang) => {
        const active = lang === language;
        return (
          <Pressable
            key={lang}
            onPress={() => setLanguage(lang)}
            style={[styles.pill, compact && styles.pillCompact, active && styles.pillActive]}
          >
            <Text style={[styles.pillText, compact && styles.pillTextCompact, active && styles.pillTextActive]}>
              {compact ? lang.toUpperCase() : t(`languages.${lang}`)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  rowCompact: {},
  pill: {
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginRight: spacing.sm,
    backgroundColor: colors.surface,
  },
  pillCompact: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 6,
  },
  pillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  pillText: { ...typography.bodyBold, color: colors.textSecondary },
  pillTextCompact: { fontSize: 12 },
  pillTextActive: { color: colors.white },
});
