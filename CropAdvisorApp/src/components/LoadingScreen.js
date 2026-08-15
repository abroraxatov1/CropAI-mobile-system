import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme/colors';

export default function LoadingScreen({ label, subLabel }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.iconWrap}>
        <Ionicons name="leaf" size={40} color={colors.primary} />
      </View>
      <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: spacing.lg }} />
      {!!label && <Text style={styles.label}>{label}</Text>}
      {!!subLabel && <Text style={styles.subLabel}>{subLabel}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primary + '1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { ...typography.bodyBold, color: colors.text, marginTop: spacing.lg, textAlign: 'center' },
  subLabel: { ...typography.small, color: colors.textMuted, marginTop: spacing.xs, textAlign: 'center' },
});
