import React from 'react';
import { View, Text, ScrollView, StyleSheet, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../theme/colors';
import { useLanguage } from '../i18n/i18n';
import Card from '../components/Card';
import Button from '../components/Button';
import CropResultBar from '../components/CropResultBar';

export default function ResultsScreen({ navigation, route }) {
  const { results = [], featureValues = {} } = route.params || {};
  const { t } = useLanguage();

  const top = results[0];

  const shareResult = async () => {
    const lines = results.map((r, i) => `${i + 1}. ${t(`crops.${r.crop}.name`)} — ${r.percent}%`);
    try {
      await Share.share({
        message: `${t('results.title')}\n\n${lines.join('\n')}`,
      });
    } catch (e) {
      // user cancelled or share unavailable; ignore
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      {top && (
        <Card style={styles.topCard}>
          <View style={styles.topBadge}>
            <Ionicons name="trophy" size={16} color={colors.white} />
            <Text style={styles.topBadgeText}>{t('results.recommended')}</Text>
          </View>
          <Text style={styles.topCropName}>{t(`crops.${top.crop}.name`)}</Text>
          <Text style={styles.topPercent}>{top.percent}%</Text>
          <Text style={styles.topDesc} numberOfLines={3}>
            {t(`crops.${top.crop}.description`)}
          </Text>
          <Button
            title={t('results.viewCropInfo')}
            variant="outline"
            icon="arrow-forward-circle-outline"
            iconPosition="right"
            onPress={() => navigation.navigate('CropDetail', { cropKey: top.crop, featureValues })}
            style={{ marginTop: spacing.md }}
          />
        </Card>
      )}

      <Text style={styles.sectionTitle}>{t('results.subtitle')}</Text>
      <Card style={{ marginTop: spacing.xs }}>
        {results.map((r, idx) => (
          <CropResultBar
            key={r.crop}
            cropName={r.crop}
            displayName={t(`crops.${r.crop}.name`)}
            percent={r.percent}
            rank={idx + 1}
            isTop={idx === 0}
            recommendedLabel={t('results.recommended')}
            onPress={() => navigation.navigate('CropDetail', { cropKey: r.crop, featureValues })}
          />
        ))}
      </Card>

      <Text style={styles.disclaimer}>{t('results.disclaimerShort')}</Text>

      <View style={styles.actionsRow}>
        <Button title={t('results.shareResult')} variant="secondary" icon="share-social-outline" onPress={shareResult} style={{ flex: 1, marginRight: spacing.sm }} />
        <Button
          title={t('results.newAnalysis')}
          icon="add-circle-outline"
          onPress={() => navigation.navigate('Home')}
          style={{ flex: 1, marginLeft: spacing.sm }}
        />
      </View>
      <Button
        title={t('results.backHome')}
        variant="ghost"
        onPress={() => navigation.navigate('Home')}
        style={{ marginTop: spacing.sm }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  topCard: { backgroundColor: colors.primaryDark, alignItems: 'flex-start' },
  topBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: spacing.sm,
  },
  topBadgeText: { ...typography.tiny, color: colors.white, marginLeft: 5 },
  topCropName: { ...typography.h1, color: colors.white },
  topPercent: { fontSize: 40, fontWeight: '800', color: colors.white, marginTop: 2 },
  topDesc: { ...typography.small, color: 'rgba(255,255,255,0.85)', marginTop: spacing.sm, lineHeight: 19 },

  sectionTitle: { ...typography.h3, color: colors.text, marginTop: spacing.lg },

  disclaimer: {
    ...typography.tiny,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.lg,
    lineHeight: 16,
  },
  actionsRow: { flexDirection: 'row', marginTop: spacing.lg },
});
