import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../theme/colors';

export default function FeatureInput({
  label,
  unit,
  icon,
  type = 'numeric',
  textValue,
  onChangeText,
  categoryOptions,
  selectedValue,
  onSelectCategory,
  badge,
  error,
  warning,
  isSensorField = false,
}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.labelRow}>
        <View style={styles.labelLeft}>
          {icon && (
            <Ionicons
              name={icon}
              size={16}
              color={isSensorField ? colors.primary : colors.textSecondary}
              style={styles.icon}
            />
          )}
          <Text style={styles.label} numberOfLines={2}>
            {label}
          </Text>
        </View>
        {badge}
      </View>

      {type === 'numeric' ? (
        <View style={[styles.inputRow, error && styles.inputRowError]}>
          <TextInput
            style={styles.input}
            value={textValue}
            onChangeText={onChangeText}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={colors.textMuted}
          />
          {!!unit && <Text style={styles.unit}>{unit}</Text>}
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {categoryOptions.map((opt) => {
            const active = opt.value === selectedValue;
            return (
              <Pressable
                key={opt.value}
                onPress={() => onSelectCategory(opt.value)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{opt.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      )}

      {!!error && <Text style={styles.errorText}>{error}</Text>}
      {!error && !!warning && <Text style={styles.warningText}>{warning}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.md },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  labelLeft: { flexDirection: 'row', alignItems: 'center', flexShrink: 1, marginRight: spacing.sm },
  icon: { marginRight: 6 },
  label: { ...typography.small, color: colors.textSecondary, flexShrink: 1 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
  },
  inputRowError: { borderColor: colors.danger },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  unit: { ...typography.small, color: colors.textMuted, marginLeft: spacing.sm },
  chipRow: { paddingVertical: 2 },
  chip: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginRight: spacing.sm,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { ...typography.small, color: colors.textSecondary, fontWeight: '600' },
  chipTextActive: { color: colors.white },
  errorText: { ...typography.tiny, color: colors.danger, marginTop: 4 },
  warningText: { ...typography.tiny, color: colors.warning, marginTop: 4 },
});
