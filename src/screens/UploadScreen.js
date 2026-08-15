import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../theme/colors';
import { useLanguage } from '../i18n/i18n';
import Card from '../components/Card';
import Button from '../components/Button';
import { parseSoilExcelFile } from '../utils/excelParser';

export default function UploadScreen({ navigation }) {
  const { t } = useLanguage();
  const [status, setStatus] = useState('idle'); // idle | parsing | picked | error
  const [fileName, setFileName] = useState('');
  const [rows, setRows] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          '*/*',
        ],
        copyToCacheDirectory: true,
        multiple: false,
      });
      if (result.canceled || !result.assets || !result.assets[0]) return;

      const file = result.assets[0];
      setFileName(file.name || '');
      setStatus('parsing');
      setErrorMsg('');

      const parsedRows = await parseSoilExcelFile(file.uri);

      if (!parsedRows || parsedRows.length === 0) {
        setStatus('error');
        setErrorMsg(t('upload.noRowsFound'));
        return;
      }

      setRows(parsedRows);
      setStatus('picked');
    } catch (e) {
      setStatus('error');
      setErrorMsg(t('upload.invalidFile'));
    }
  };

  const chooseRow = (row) => {
    navigation.navigate('Review', {
      sensorValues: {
        ph: row.ph,
        ec: row.ec_mScm,
        n: row.n,
        p: row.p,
        k: row.k,
      },
      sourceLabel: fileName,
      source: 'upload',
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Card style={styles.instructionsCard}>
        <View style={styles.instructionsHeader}>
          <Ionicons name="information-circle" size={20} color={colors.info} />
          <Text style={styles.instructionsTitle}>{t('upload.title')}</Text>
        </View>
        <Text style={styles.instructionsText}>{t('upload.instructions')}</Text>
      </Card>

      <Button
        title={rows.length > 0 ? t('upload.pickAgain') : t('upload.pickButton')}
        icon="document-attach-outline"
        onPress={pickFile}
        style={{ marginTop: spacing.lg }}
      />

      {status === 'parsing' && (
        <View style={styles.centerBlock}>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={styles.parsingText}>{t('upload.parsing')}</Text>
        </View>
      )}

      {status === 'error' && (
        <Card style={styles.errorCard}>
          <Ionicons name="alert-circle" size={22} color={colors.danger} />
          <Text style={styles.errorTitle}>{t('upload.invalidFileTitle')}</Text>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </Card>
      )}

      {status === 'picked' && rows.length > 0 && (
        <View style={{ marginTop: spacing.lg }}>
          <Text style={styles.sectionTitle}>
            {t('upload.rowsFoundTitle', { count: rows.length })}
          </Text>
          <Text style={styles.sectionDesc}>{t('upload.rowsFoundDesc')}</Text>

          {rows.map((row, idx) => (
            <Pressable key={idx} onPress={() => chooseRow(row)} style={({ pressed }) => [styles.rowCard, pressed && styles.rowCardPressed]}>
              <View style={styles.rowCardHeader}>
                <Text style={styles.rowCardTitle}>
                  {t('upload.rowLabel')} {idx + 1}
                </Text>
                {!!row.time && (
                  <Text style={styles.rowCardTime}>
                    {t('upload.timeLabel')}: {row.time}
                  </Text>
                )}
              </View>
              <View style={styles.rowValuesGrid}>
                <RowValue label="pH" value={row.ph} />
                <RowValue label="EC" value={row.ec_mScm != null ? `${row.ec_mScm.toFixed(3)} mS/cm` : '—'} />
                <RowValue label="N" value={row.n != null ? `${row.n} mg/kg` : '—'} />
                <RowValue label="P" value={row.p != null ? `${row.p} mg/kg` : '—'} />
                <RowValue label="K" value={row.k != null ? `${row.k} mg/kg` : '—'} />
              </View>
              <View style={styles.useRowBtn}>
                <Text style={styles.useRowBtnText}>{t('upload.useThisRow')}</Text>
                <Ionicons name="arrow-forward" size={16} color={colors.primary} />
              </View>
            </Pressable>
          ))}
        </View>
      )}

      <Card style={styles.formatHelpCard}>
        <Text style={styles.formatHelpTitle}>{t('upload.formatHelpTitle')}</Text>
        <Text style={styles.formatHelpText}>{t('upload.formatHelpText')}</Text>
      </Card>
    </ScrollView>
  );
}

function RowValue({ label, value }) {
  return (
    <View style={styles.rowValueItem}>
      <Text style={styles.rowValueLabel}>{label}</Text>
      <Text style={styles.rowValueValue}>{value ?? '—'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  instructionsCard: { backgroundColor: '#EAF4FB', borderColor: '#CFE6F5' },
  instructionsHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  instructionsTitle: { ...typography.bodyBold, color: colors.text, marginLeft: 8 },
  instructionsText: { ...typography.small, color: colors.textSecondary, lineHeight: 19 },

  centerBlock: { alignItems: 'center', marginTop: spacing.xl },
  parsingText: { ...typography.small, color: colors.textSecondary, marginTop: spacing.sm },

  errorCard: { marginTop: spacing.lg, alignItems: 'center', backgroundColor: '#FDECEA', borderColor: '#F5C6C0' },
  errorTitle: { ...typography.bodyBold, color: colors.danger, marginTop: 6 },
  errorText: { ...typography.small, color: colors.textSecondary, marginTop: 4, textAlign: 'center' },

  sectionTitle: { ...typography.h3, color: colors.text },
  sectionDesc: { ...typography.small, color: colors.textSecondary, marginTop: 2, marginBottom: spacing.sm },

  rowCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  rowCardPressed: { opacity: 0.8 },
  rowCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  rowCardTitle: { ...typography.bodyBold, color: colors.text },
  rowCardTime: { ...typography.tiny, color: colors.textMuted },
  rowValuesGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  rowValueItem: { width: '33%', marginBottom: spacing.sm },
  rowValueLabel: { ...typography.tiny, color: colors.textMuted },
  rowValueValue: { ...typography.bodyBold, color: colors.text, marginTop: 1 },
  useRowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    marginTop: 2,
  },
  useRowBtnText: { ...typography.small, color: colors.primary, fontWeight: '700', marginRight: 6 },

  formatHelpCard: { marginTop: spacing.xl, backgroundColor: colors.surfaceAlt },
  formatHelpTitle: { ...typography.bodyBold, color: colors.text, marginBottom: 4 },
  formatHelpText: { ...typography.small, color: colors.textSecondary, lineHeight: 19 },
});
