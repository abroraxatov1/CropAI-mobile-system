import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useModel } from '../context/ModelContext';
import { useLanguage } from '../i18n/i18n';
import {
  SENSOR_FEATURE_IDS,
  DERIVED_FEATURE_IDS,
  getFeatureById,
} from '../data/featureSchema';
import { getFeatureBounds, categoryListFor, getMedianFeatureSet } from '../ml/featureUtils';
import { estimateDerivedDefaults } from '../ml/defaults';
import { buildRawVector, scaleVector } from '../ml/preprocessing';
import { predictProbabilities, rankCropResults } from '../ml/predictor';
import { toMicroSiemensPerCm, formatNum } from '../utils/unitConversion';
import { saveHistoryEntry, makeHistoryId } from '../utils/storage';
import FeatureInput from '../components/FeatureInput';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Card from '../components/Card';
import { colors, spacing, typography } from '../theme/colors';

export default function SoilEntryForm({ navigation, initialSensorValues, source, sourceLabel }) {
  const { modelData } = useModel();
  const { t } = useLanguage();

  const [sensorText, setSensorText] = useState({ ph: '', ec: '', n: '', p: '', k: '' });
  const [derivedText, setDerivedText] = useState({});
  const [categoryValues, setCategoryValues] = useState({});
  const [editedDerived, setEditedDerivedState] = useState(new Set());
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const editedDerivedRef = useRef(new Set());
  const setEditedDerived = (updater) => {
    setEditedDerivedState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      editedDerivedRef.current = next;
      return next;
    });
  };

  // Initialize the form once the model is loaded (runs once).
  useEffect(() => {
    if (!modelData || initialized) return;
    const medians = getMedianFeatureSet(modelData);

    const initSensorRaw = {
      ph: initialSensorValues?.ph ?? medians.ph,
      ec: initialSensorValues?.ec ?? medians.ec, // mS/cm
      n: initialSensorValues?.n ?? medians.n,
      p: initialSensorValues?.p ?? medians.p,
      k: initialSensorValues?.k ?? medians.k,
    };

    setSensorText({
      ph: formatNum(initSensorRaw.ph, 1),
      ec: formatNum(toMicroSiemensPerCm(initSensorRaw.ec), 0),
      n: formatNum(initSensorRaw.n, 1),
      p: formatNum(initSensorRaw.p, 1),
      k: formatNum(initSensorRaw.k, 1),
    });

    const derived = estimateDerivedDefaults(initSensorRaw, modelData);
    const dText = {};
    for (const id of DERIVED_FEATURE_IDS) {
      const schema = getFeatureById(id);
      if (schema.type === 'numeric') dText[id] = formatNum(derived[id], schema.decimals);
    }
    setDerivedText(dText);
    setCategoryValues({ qatlam: derived.qatlam, mexanikTarkib: derived.mexanikTarkib });
    setInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelData, initialized]);

  const parsedSensor = useMemo(
    () => ({
      ph: parseFloat(sensorText.ph),
      ec: parseFloat(sensorText.ec), // µS/cm as typed
      n: parseFloat(sensorText.n),
      p: parseFloat(sensorText.p),
      k: parseFloat(sensorText.k),
    }),
    [sensorText]
  );

  // Live-recompute any NOT-manually-edited derived defaults whenever the
  // sensor readings change, so secondary values stay consistent with what
  // the person is entering (per spec: "boshqa qiymatlar ham o'zgarib
  // kelishi mumkin"), while never overwriting fields the user has touched.
  useEffect(() => {
    if (!modelData || !initialized) return;
    const { ph, ec, n, p, k } = parsedSensor;
    if ([ph, ec, n, p, k].some((v) => Number.isNaN(v))) return;

    const sensorForModel = { ph, ec: ec / 1000, n, p, k };
    const newDerived = estimateDerivedDefaults(sensorForModel, modelData);
    const edited = editedDerivedRef.current;

    setDerivedText((prev) => {
      const merged = { ...prev };
      for (const id of DERIVED_FEATURE_IDS) {
        const schema = getFeatureById(id);
        if (schema.type === 'numeric' && !edited.has(id)) {
          merged[id] = formatNum(newDerived[id], schema.decimals);
        }
      }
      return merged;
    });
    setCategoryValues((prev) => ({
      qatlam: edited.has('qatlam') ? prev.qatlam : newDerived.qatlam,
      mexanikTarkib: edited.has('mexanikTarkib') ? prev.mexanikTarkib : newDerived.mexanikTarkib,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsedSensor.ph, parsedSensor.ec, parsedSensor.n, parsedSensor.p, parsedSensor.k, modelData, initialized]);

  if (!modelData || !initialized) return null;

  const handleSensorChange = (id, text) => {
    setSensorText((prev) => ({ ...prev, [id]: text }));
    setErrors((prev) => ({ ...prev, [id]: undefined }));
  };

  const handleDerivedChange = (id, text) => {
    setDerivedText((prev) => ({ ...prev, [id]: text }));
    setEditedDerived((prev) => new Set(prev).add(id));
    setErrors((prev) => ({ ...prev, [id]: undefined }));
  };

  const handleCategoryChange = (id, value) => {
    setCategoryValues((prev) => ({ ...prev, [id]: value }));
    setEditedDerived((prev) => new Set(prev).add(id));
  };

  const handleResetAll = () => {
    setEditedDerived(new Set());
    const { ph, ec, n, p, k } = parsedSensor;
    if ([ph, ec, n, p, k].some((v) => Number.isNaN(v))) return;
    const sensorForModel = { ph, ec: ec / 1000, n, p, k };
    const newDerived = estimateDerivedDefaults(sensorForModel, modelData);
    const dText = {};
    for (const id of DERIVED_FEATURE_IDS) {
      const schema = getFeatureById(id);
      if (schema.type === 'numeric') dText[id] = formatNum(newDerived[id], schema.decimals);
    }
    setDerivedText(dText);
    setCategoryValues({ qatlam: newDerived.qatlam, mexanikTarkib: newDerived.mexanikTarkib });
  };

  const buildFeatureValuesOrShowErrors = () => {
    const newErrors = {};
    const sensorNums = {};
    for (const id of SENSOR_FEATURE_IDS) {
      const num = parseFloat(sensorText[id]);
      if (Number.isNaN(num)) newErrors[id] = t('manualEntry.invalidValueError');
      sensorNums[id] = num;
    }
    const derivedNums = {};
    for (const id of DERIVED_FEATURE_IDS) {
      const schema = getFeatureById(id);
      if (schema.type === 'categorical') {
        derivedNums[id] = categoryValues[id];
      } else {
        const num = parseFloat(derivedText[id]);
        if (Number.isNaN(num)) newErrors[id] = t('manualEntry.invalidValueError');
        derivedNums[id] = num;
      }
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return null;

    return {
      ...derivedNums,
      ph: sensorNums.ph,
      ec: sensorNums.ec / 1000,
      n: sensorNums.n,
      p: sensorNums.p,
      k: sensorNums.k,
    };
  };

  const handleAnalyze = async () => {
    const featureValues = buildFeatureValuesOrShowErrors();
    if (!featureValues) return;
    setSubmitting(true);
    try {
      const raw = buildRawVector(featureValues, modelData);
      const scaled = scaleVector(raw, modelData);
      const results = rankCropResults(predictProbabilities(scaled, modelData));

      const entry = {
        id: makeHistoryId(),
        createdAt: new Date().toISOString(),
        source,
        sourceLabel: sourceLabel || null,
        results,
        featureValues,
      };
      await saveHistoryEntry(entry);

      navigation.replace('Results', { results, featureValues, entryId: entry.id });
    } finally {
      setSubmitting(false);
    }
  };

  const warningFor = (id, value) => {
    if (Number.isNaN(value)) return undefined;
    const { min, max } = getFeatureBounds(modelData, id);
    if (value < min || value > max) {
      const schema = getFeatureById(id);
      return t('manualEntry.outOfRangeWarning', {
        min: formatNum(min, schema.decimals),
        max: formatNum(max, schema.decimals),
        unit: schema.unit || '',
      });
    }
    return undefined;
  };

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>{t('manualEntry.sensorSectionTitle')}</Text>
        <Text style={styles.sectionDesc}>{t('manualEntry.sensorSectionDesc')}</Text>

        {SENSOR_FEATURE_IDS.map((id) => {
          const schema = getFeatureById(id);
          const unit = id === 'ec' ? schema.sensorUnit : schema.unit;
          const value = id === 'ec' ? parsedSensor.ec / 1000 : parsedSensor[id];
          return (
            <FeatureInput
              key={id}
              label={t(`featureLabels.${id}`)}
              unit={unit}
              icon={schema.icon}
              isSensorField
              textValue={sensorText[id]}
              onChangeText={(text) => handleSensorChange(id, text)}
              error={errors[id]}
              warning={warningFor(id, value)}
            />
          );
        })}
      </Card>

      <Card style={[styles.sectionCard, { marginTop: spacing.md }]}>
        <View style={styles.derivedHeaderRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>{t('manualEntry.derivedSectionTitle')}</Text>
            <Text style={styles.sectionDesc}>{t('manualEntry.derivedSectionDesc')}</Text>
          </View>
        </View>

        <Button
          title={t('manualEntry.resetAllDefaults')}
          variant="outline"
          icon="refresh-outline"
          onPress={handleResetAll}
          style={{ marginBottom: spacing.md }}
        />

        {DERIVED_FEATURE_IDS.map((id) => {
          const schema = getFeatureById(id);
          const isEdited = editedDerived.has(id);
          const badge = (
            <Badge
              label={isEdited ? t('manualEntry.editedBadge') : t('manualEntry.estimatedBadge')}
              variant={isEdited ? 'edited' : 'estimated'}
            />
          );

          if (schema.type === 'categorical') {
            const categories = categoryListFor(modelData, id);
            const options = categories.map((val) => ({
              value: val,
              label: t(`categoryValues.${id}.${val}`),
            }));
            return (
              <FeatureInput
                key={id}
                label={t(`featureLabels.${id}`)}
                icon={schema.icon}
                type="categorical"
                categoryOptions={options}
                selectedValue={categoryValues[id]}
                onSelectCategory={(val) => handleCategoryChange(id, val)}
                badge={badge}
              />
            );
          }

          const numValue = parseFloat(derivedText[id]);
          return (
            <FeatureInput
              key={id}
              label={t(`featureLabels.${id}`)}
              unit={schema.unit}
              icon={schema.icon}
              textValue={derivedText[id] ?? ''}
              onChangeText={(text) => handleDerivedChange(id, text)}
              badge={badge}
              error={errors[id]}
              warning={warningFor(id, numValue)}
            />
          );
        })}
      </Card>

      <Button
        title={t('manualEntry.analyzeButton')}
        icon="analytics-outline"
        onPress={handleAnalyze}
        loading={submitting}
        style={{ marginTop: spacing.lg }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  sectionCard: {},
  sectionTitle: { ...typography.h3, color: colors.text },
  sectionDesc: { ...typography.small, color: colors.textSecondary, marginTop: 2, marginBottom: spacing.md },
  derivedHeaderRow: { flexDirection: 'row', alignItems: 'flex-start' },
});
