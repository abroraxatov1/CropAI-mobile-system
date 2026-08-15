import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { LanguageProvider, useLanguage } from './src/i18n/i18n';
import { ModelProvider, useModel } from './src/context/ModelContext';
import AppNavigator from './src/navigation/AppNavigator';
import LoadingScreen from './src/components/LoadingScreen';
import { colors, spacing, typography } from './src/theme/colors';

function AppContent() {
  const { modelData, isLoading, error } = useModel();
  const { t, ready } = useLanguage();

  if (error) {
    return (
      <View style={styles.errorWrap}>
        <Ionicons name="warning-outline" size={40} color={colors.danger} />
        <Text style={styles.errorTitle}>{t('common.error')}</Text>
        <Text style={styles.errorText}>{String(error.message || error)}</Text>
      </View>
    );
  }

  if (isLoading || !ready || !modelData) {
    return <LoadingScreen label={t('common.loading')} subLabel={t('home.modelBadge')} />;
  }

  return <AppNavigator />;
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <LanguageProvider>
          <ModelProvider>
            <StatusBar style="dark" />
            <AppContent />
          </ModelProvider>
        </LanguageProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  errorWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  errorTitle: { ...typography.h3, color: colors.danger, marginTop: spacing.md },
  errorText: { ...typography.small, color: colors.textSecondary, marginTop: spacing.xs, textAlign: 'center' },
});
