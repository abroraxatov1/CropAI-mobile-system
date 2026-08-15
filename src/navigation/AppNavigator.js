import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { useLanguage } from '../i18n/i18n';

import HomeScreen from '../screens/HomeScreen';
import UploadScreen from '../screens/UploadScreen';
import ReviewScreen from '../screens/ReviewScreen';
import ManualEntryScreen from '../screens/ManualEntryScreen';
import ResultsScreen from '../screens/ResultsScreen';
import HistoryScreen from '../screens/HistoryScreen';
import CropInfoScreen from '../screens/CropInfoScreen';
import CropDetailScreen from '../screens/CropDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: colors.surface },
  headerTitleStyle: { color: colors.text, fontWeight: '700' },
  headerTintColor: colors.primary,
  headerShadowVisible: true,
  contentStyle: { backgroundColor: colors.background },
};

export default function AppNavigator() {
  const { t } = useLanguage();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={screenOptions}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Upload" component={UploadScreen} options={{ title: t('upload.title') }} />
        <Stack.Screen name="Review" component={ReviewScreen} options={{ title: t('manualEntry.title') }} />
        <Stack.Screen
          name="ManualEntry"
          component={ManualEntryScreen}
          options={{ title: t('manualEntry.title') }}
        />
        <Stack.Screen
          name="Results"
          component={ResultsScreen}
          options={{ title: t('results.title'), headerBackVisible: false }}
        />
        <Stack.Screen name="History" component={HistoryScreen} options={{ title: t('history.title') }} />
        <Stack.Screen name="CropInfo" component={CropInfoScreen} options={{ title: t('cropInfo.title') }} />
        <Stack.Screen
          name="CropDetail"
          component={CropDetailScreen}
          options={({ route }) => ({ title: route.params?.cropKey ? t(`crops.${route.params.cropKey}.name`) : '' })}
        />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: t('settings.title') }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
