import { FEATURE_SCHEMA, getFeatureById } from '../data/featureSchema';
import { clamp } from '../utils/unitConversion';

export function featureIndex(modelData, modelKey) {
  return modelData.feature_names.indexOf(modelKey);
}

/** Returns { min, max, median } for a schema feature id, reading straight
 * from the loaded model so there is exactly one source of truth for ranges. */
export function getFeatureBounds(modelData, id) {
  const schema = getFeatureById(id);
  const i = featureIndex(modelData, schema.modelKey);
  return {
    min: modelData.data_min[i],
    max: modelData.data_max[i],
    median: modelData.medians[schema.modelKey],
    index: i,
  };
}

export function normalizedPosition(value, min, max) {
  if (max === min) return 0.5;
  return clamp((value - min) / (max - min), 0, 1);
}

export function categoryListFor(modelData, id) {
  if (id === 'qatlam') return modelData.qatlam_categories;
  if (id === 'mexanikTarkib') return modelData.mexanik_categories;
  return null;
}

/** Returns a schema-id-keyed object with every one of the 18 features set
 * to its median training value (categorical features resolved to their
 * median-coded category name). Useful as a "reset to defaults" baseline. */
export function getMedianFeatureSet(modelData) {
  const out = {};
  for (const schema of FEATURE_SCHEMA) {
    if (schema.type === 'categorical') {
      const categories = categoryListFor(modelData, schema.id);
      const medianCode = Math.round(modelData.medians[schema.modelKey]);
      const safeIdx = clamp(medianCode, 0, categories.length - 1);
      out[schema.id] = categories[safeIdx];
    } else {
      out[schema.id] = modelData.medians[schema.modelKey];
    }
  }
  return out;
}
