import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography, cropPalette } from '../theme/colors';
import { useLanguage } from '../i18n/i18n';

const CROP_KEYS = ["Bug'doy", 'Kartoshka', 'Loviya', "Makkajo'xori", 'Paxta', 'Qalampir', 'Sabzi'];
const CROP_ICONS = {
  "Bug'doy": '🌾',
  Kartoshka: '🥔',
  Loviya: '🫘',
  "Makkajo'xori": '🌽',
  Paxta: '☁️',
  Qalampir: '🌶️',
  Sabzi: '🥕',
};

export default function CropInfoScreen({ navigation }) {
  const { t } = useLanguage();

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.subtitle}>{t('cropInfo.subtitle')}</Text>

      {CROP_KEYS.map((key) => (
        <Pressable
          key={key}
          onPress={() => navigation.navigate('CropDetail', { cropKey: key })}
          style={({ pressed }) => [styles.card, pressed && styles.pressed]}
        >
          <View style={[styles.iconWrap, { backgroundColor: (cropPalette[key] || colors.primary) + '33' }]}>
            <Text style={styles.emoji}>{CROP_ICONS[key]}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{t(`crops.${key}.name`)}</Text>
            <Text style={styles.desc} numberOfLines={2}>
              {t(`crops.${key}.description`)}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  subtitle: { ...typography.small, color: colors.textSecondary, marginBottom: spacing.md },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  pressed: { opacity: 0.85 },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  emoji: { fontSize: 26 },
  name: { ...typography.h3, color: colors.text },
  desc: { ...typography.small, color: colors.textSecondary, marginTop: 2 },
});
