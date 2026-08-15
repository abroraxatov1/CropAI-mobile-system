import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography, cropPalette } from '../theme/colors';

export default function CropResultBar({
  cropName,
  displayName,
  percent,
  rank,
  isTop = false,
  recommendedLabel,
  onPress,
}) {
  const barColor = cropPalette[cropName] || colors.primary;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.wrap, isTop && styles.topWrap, pressed && styles.pressed]}
    >
      <View style={styles.headerRow}>
        <View style={styles.nameRow}>
          <Text style={styles.rank}>{rank}</Text>
          <Text style={[styles.name, isTop && styles.topName]} numberOfLines={1}>
            {displayName}
          </Text>
          {isTop && (
            <View style={styles.recommendedPill}>
              <Ionicons name="star" size={11} color={colors.white} />
              <Text style={styles.recommendedPillText}>{recommendedLabel}</Text>
            </View>
          )}
        </View>
        <Text style={[styles.percentText, isTop && styles.topPercentText]}>{percent}%</Text>
      </View>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            { width: `${Math.max(percent, 2)}%`, backgroundColor: barColor },
          ]}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  topWrap: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  pressed: { opacity: 0.7 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', flexShrink: 1 },
  rank: { ...typography.small, color: colors.textMuted, width: 20 },
  name: { ...typography.bodyBold, color: colors.text },
  topName: { color: colors.primaryDark },
  recommendedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: spacing.sm,
  },
  recommendedPillText: {
    ...typography.tiny,
    color: colors.white,
    marginLeft: 3,
  },
  percentText: { ...typography.bodyBold, color: colors.textSecondary },
  topPercentText: { color: colors.primaryDark, fontSize: 18 },
  track: {
    height: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.pill,
  },
});
