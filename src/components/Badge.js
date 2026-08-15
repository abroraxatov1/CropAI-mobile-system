import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, typography } from '../theme/colors';

const VARIANTS = {
  info: { bg: '#E3F0FB', fg: colors.info },
  estimated: { bg: '#FFF3E0', fg: colors.warning },
  edited: { bg: '#E8F5E9', fg: colors.success },
  neutral: { bg: colors.surfaceAlt, fg: colors.textSecondary },
};

export default function Badge({ label, variant = 'neutral', style }) {
  const v = VARIANTS[variant] || VARIANTS.neutral;
  return (
    <View style={[styles.badge, { backgroundColor: v.bg }, style]}>
      <Text style={[styles.text, { color: v.fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  text: {
    ...typography.tiny,
    textTransform: 'none',
  },
});
