import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography, cropPalette } from '../theme/colors';
import { useLanguage } from '../i18n/i18n';
import { toMicroSiemensPerCm } from '../utils/unitConversion';
import Card from '../components/Card';

const CROP_ICONS = {
  "Bug'doy": '🌾',
  Kartoshka: '🥔',
  Loviya: '🫘',
  "Makkajo'xori": '🌽',
  Paxta: '☁️',
  Qalampir: '🌶️',
  Sabzi: '🥕',
};

function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIconWrap}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

export default function CropDetailScreen({ route }) {
  const { cropKey, featureValues } = route.params || {};
  const { t } = useLanguage();

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={[styles.header, { backgroundColor: (cropPalette[cropKey] || colors.primary) + '2A' }]}>
        <Text style={styles.emoji}>{CROP_ICONS[cropKey] || '🌿'}</Text>
        <Text style={styles.name}>{t(`crops.${cropKey}.name`)}</Text>
      </View>

      <Text style={styles.description}>{t(`crops.${cropKey}.description`)}</Text>

      <Card style={{ marginTop: spacing.md }}>
        <InfoRow icon="water-outline" label={t('cropInfo.waterNeed')} value={t(`crops.${cropKey}.water`)} />
        <View style={styles.divider} />
        <InfoRow icon="calendar-outline" label={t('cropInfo.season')} value={t(`crops.${cropKey}.season`)} />
        <View style={styles.divider} />
        <InfoRow icon="nutrition-outline" label={t('cropInfo.keyNeeds')} value={t(`crops.${cropKey}.npk`)} />
        <View style={styles.divider} />
        <InfoRow icon="bulb-outline" label={t('cropInfo.notes')} value={t(`crops.${cropKey}.notes`)} />
      </Card>

      {!!featureValues && (
        <>
          <Text style={styles.sectionTitle}>{t('results.yourSoil')}</Text>
          <Card>
            <View style={styles.soilGrid}>
              <SoilChip label="pH" value={featureValues.ph} />
              <SoilChip label="EC" value={toMicroSiemensPerCm(featureValues.ec)} unit="µS/cm" />
              <SoilChip label="N" value={featureValues.n} unit="mg/kg" />
              <SoilChip label="P" value={featureValues.p} unit="mg/kg" />
              <SoilChip label="K" value={featureValues.k} unit="mg/kg" />
            </View>
          </Card>
        </>
      )}
    </ScrollView>
  );
}

function SoilChip({ label, value, unit }) {
  if (value === undefined || value === null || Number.isNaN(value)) return null;
  const display = typeof value === 'number' ? Math.round(value * 100) / 100 : value;
  return (
    <View style={styles.soilChip}>
      <Text style={styles.soilChipLabel}>{label}</Text>
      <Text style={styles.soilChipValue}>
        {display}
        {unit ? ` ${unit}` : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.xl,
    paddingVertical: spacing.xl,
    marginBottom: spacing.md,
  },
  emoji: { fontSize: 48, marginBottom: spacing.xs },
  name: { ...typography.h1, color: colors.text },
  description: { ...typography.body, color: colors.textSecondary, lineHeight: 21 },

  infoRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: spacing.sm },
  infoIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primary + '1A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  infoLabel: { ...typography.tiny, color: colors.textMuted },
  infoValue: { ...typography.bodyBold, color: colors.text, marginTop: 1 },
  divider: { height: 1, backgroundColor: colors.border },

  sectionTitle: { ...typography.h3, color: colors.text, marginTop: spacing.lg, marginBottom: spacing.xs },
  soilGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  soilChip: {
    width: '33%',
    paddingVertical: spacing.sm,
  },
  soilChipLabel: { ...typography.tiny, color: colors.textMuted },
  soilChipValue: { ...typography.bodyBold, color: colors.text, marginTop: 1 },
});
