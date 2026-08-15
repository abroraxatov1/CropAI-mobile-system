import { FEATURE_SCHEMA } from '../data/featureSchema';
import { categoryListFor } from './featureUtils';

const SCHEMA_BY_MODEL_KEY = FEATURE_SCHEMA.reduce((acc, f) => {
  acc[f.modelKey] = f;
  return acc;
}, {});

/**
 * Converts a schema-id-keyed feature value object (e.g. { ph: 6.9, ec: 0.63,
 * qatlam: '0-30', ... }) into a raw numeric vector in the exact order the
 * model was trained on (modelData.feature_names). Categorical values are
 * mapped to their OrdinalEncoder integer code; anything missing or invalid
 * falls back to the training median for that feature so a prediction can
 * always be produced.
 */
export function buildRawVector(featureValues, modelData) {
  return modelData.feature_names.map((modelKey) => {
    const found = SCHEMA_BY_MODEL_KEY[modelKey];
    const raw = featureValues[found.id];

    if (found.type === 'categorical') {
      const categories = categoryListFor(modelData, found.id);
      const code = categories.indexOf(raw);
      return code === -1 ? modelData.medians[modelKey] : code;
    }

    const num = typeof raw === 'string' ? parseFloat(raw) : raw;
    return typeof num === 'number' && !Number.isNaN(num) ? num : modelData.medians[modelKey];
  });
}

/** Min-max scales a raw feature vector to [0,1] using the stored scaler
 * bounds, exactly mirroring sklearn's MinMaxScaler.transform(). Values
 * outside the training range are NOT clipped (matching sklearn's default
 * behaviour) so unusually high/low sensor readings still influence the
 * result sensibly instead of being silently capped. */
export function scaleVector(rawVector, modelData) {
  return rawVector.map((v, i) => {
    const min = modelData.data_min[i];
    const max = modelData.data_max[i];
    if (max === min) return 0;
    return (v - min) / (max - min);
  });
}

export function buildScaledVector(featureValues, modelData) {
  const raw = buildRawVector(featureValues, modelData);
  return scaleVector(raw, modelData);
}
