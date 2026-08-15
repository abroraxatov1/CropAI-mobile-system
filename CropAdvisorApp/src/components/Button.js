import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../theme/colors';

export default function Button({
  title,
  onPress,
  variant = 'primary', // primary | secondary | outline | danger | ghost
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  style,
  fullWidth = true,
}) {
  const variantStyle = styles[variant] || styles.primary;
  const textStyle = styles[`${variant}Text`] || styles.primaryText;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        variantStyle,
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        pressed && !disabled && !loading && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' || variant === 'danger' ? colors.white : colors.primary} />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' && (
            <Ionicons name={icon} size={18} color={textStyle.color} style={styles.iconLeft} />
          )}
          <Text style={[styles.textBase, textStyle]} numberOfLines={1}>
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <Ionicons name={icon} size={18} color={textStyle.color} style={styles.iconRight} />
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: { width: '100%' },
  content: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  iconLeft: { marginRight: spacing.sm },
  iconRight: { marginLeft: spacing.sm },
  textBase: { ...typography.bodyBold },
  pressed: { opacity: 0.8, transform: [{ scale: 0.99 }] },
  disabled: { opacity: 0.5 },

  primary: { backgroundColor: colors.primary },
  primaryText: { color: colors.white },

  secondary: { backgroundColor: colors.secondaryLight },
  secondaryText: { color: colors.secondary },

  outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary },
  outlineText: { color: colors.primary },

  danger: { backgroundColor: colors.danger },
  dangerText: { color: colors.white },

  ghost: { backgroundColor: 'transparent' },
  ghostText: { color: colors.textSecondary },
});
