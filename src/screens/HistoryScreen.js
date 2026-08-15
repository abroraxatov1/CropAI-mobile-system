import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../theme/colors';
import { useLanguage } from '../i18n/i18n';
import { loadHistory, deleteHistoryEntry, clearHistory } from '../utils/storage';
import EmptyState from '../components/EmptyState';

function formatDate(iso, locale) {
  try {
    const d = new Date(iso);
    return d.toLocaleString(locale === 'uz' ? 'uz-UZ' : locale === 'ru' ? 'ru-RU' : 'en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (e) {
    return iso;
  }
}

export default function HistoryScreen({ navigation }) {
  const { t, language } = useLanguage();
  const [history, setHistory] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      loadHistory().then((h) => {
        if (mounted) {
          setHistory(h);
          setLoaded(true);
        }
      });
      return () => {
        mounted = false;
      };
    }, [])
  );

  const handleDelete = (id) => {
    deleteHistoryEntry(id).then(setHistory);
  };

  const handleClearAll = () => {
    Alert.alert(t('history.confirmClearTitle'), t('history.confirmClearText'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('history.clearAll'),
        style: 'destructive',
        onPress: () => clearHistory().then(setHistory),
      },
    ]);
  };

  if (loaded && history.length === 0) {
    return (
      <View style={styles.emptyWrap}>
        <EmptyState icon="time-outline" title={t('history.empty')} hint={t('history.emptyHint')} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          history.length > 0 ? (
            <View style={styles.listHeader}>
              <Text style={styles.count}>{t('history.itemsCount', { count: history.length })}</Text>
              <Pressable onPress={handleClearAll}>
                <Text style={styles.clearAllText}>{t('history.clearAll')}</Text>
              </Pressable>
            </View>
          ) : null
        }
        renderItem={({ item }) => {
          const top = item.results && item.results[0];
          return (
            <Pressable
              style={({ pressed }) => [styles.card, pressed && styles.pressed]}
              onPress={() =>
                navigation.navigate('Results', {
                  results: item.results,
                  featureValues: item.featureValues,
                  entryId: item.id,
                })
              }
            >
              <View style={{ flex: 1 }}>
                <View style={styles.rowTop}>
                  <Ionicons
                    name={item.source === 'upload' ? 'cloud-upload-outline' : 'create-outline'}
                    size={14}
                    color={colors.textMuted}
                  />
                  <Text style={styles.sourceText}>
                    {item.source === 'upload' ? t('history.sourceUpload') : t('history.sourceManual')}
                  </Text>
                </View>
                <Text style={styles.date}>{formatDate(item.createdAt, language)}</Text>
                {!!top && (
                  <Text style={styles.topResult}>
                    {t(`crops.${top.crop}.name`)} · {top.percent}%
                  </Text>
                )}
              </View>
              <Pressable hitSlop={10} onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
                <Ionicons name="trash-outline" size={20} color={colors.danger} />
              </Pressable>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  emptyWrap: { flex: 1, backgroundColor: colors.background },
  listContent: { padding: spacing.lg, paddingBottom: spacing.xxl },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  count: { ...typography.small, color: colors.textMuted },
  clearAllText: { ...typography.small, color: colors.danger, fontWeight: '700' },
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
  rowTop: { flexDirection: 'row', alignItems: 'center' },
  sourceText: { ...typography.tiny, color: colors.textMuted, marginLeft: 4 },
  date: { ...typography.small, color: colors.textSecondary, marginTop: 2 },
  topResult: { ...typography.bodyBold, color: colors.primaryDark, marginTop: 4 },
  deleteBtn: { padding: 6 },
});
