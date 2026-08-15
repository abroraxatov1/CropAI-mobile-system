import { DERIVED_FEATURE_IDS, getFeatureById } from '../data/featureSchema';
import { getFeatureBounds, normalizedPosition, categoryListFor } from './featureUtils';
import { clamp } from '../utils/unitConversion';

// How strongly each measurable sensor value (pH, EC, N, P, K) nudges the
// *estimated default* of each secondary/lab-only feature, expressed as a
// fraction of that feature's own training range. These are general,
// well-established soil-science relationships used only to produce a more
// realistic starting point than a flat median -- every value remains fully
// editable in the UI.
//
//  - Gumus (humus/organic matter) tracks soil N closely, since organic
//    matter mineralisation is the main natural N source.
//  - S and Mikroorganizmlar (microbial biomass) also rise with organic
//    matter / N availability.
//  - Mg tends to rise with K and with pH (base-cation / CEC behaviour).
//  - Zn, Mn, Fe, Cu (micronutrient cations) become LESS available as pH
//    rises -- classic soil-chemistry relationship -- with a small positive
//    nudge from organic matter (chelation effect).
//  - Tuproq zichligi (bulk density) falls as organic matter/N rises
//    (looser, better-structured soil).
//  - Dala Nam Singdiruvchanlik (field moisture capacity) rises with organic
//    matter / N (better water retention).
const WEIGHTS = {
  dalaNam: { n: 0.3, ec: 0.1 },
  zichlik: { n: -0.3 },
  gumus: { n: 0.45, ec: 0.15, p: 0.1 },
  mg: { k: 0.25, ph: 0.2 },
  s: { n: 0.35 },
  zn: { ph: -0.35, n: 0.1 },
  mn: { ph: -0.35, n: 0.1 },
  fe: { ph: -0.4, n: 0.1 },
  cu: { ph: -0.3, n: 0.1 },
  b: { ph: -0.2, n: 0.1 },
  mikroorganizmlar: { n: 0.3, ec: -0.2 },
};

const KNOWN_IDS = ['ph', 'ec', 'n', 'p', 'k'];

/**
 * @param {{ph:number, ec:number, n:number, p:number, k:number}} sensorValues
 *        ec MUST already be in mS/cm (the model's unit).
 * @param {object} modelData
 * @returns {object} schema-id-keyed defaults for every one of the 13
 *          non-sensor features.
 */
export function estimateDerivedDefaults(sensorValues, modelData) {
  const dev = {};
  for (const id of KNOWN_IDS) {
    const { min, max, median } = getFeatureBounds(modelData, id);
    const value = sensorValues[id];
    const normVal = normalizedPosition(
      typeof value === 'number' && !Number.isNaN(value) ? value : median,
      min,
      max
    );
    const normMed = normalizedPosition(median, min, max);
    dev[id] = normVal - normMed;
  }

  const result = {};

  for (const id of DERIVED_FEATURE_IDS) {
    const schema = getFeatureById(id);

    if (schema.type === 'categorical') {
      // Soil texture / sampling depth are physical properties, not
      // reliably inferable from nutrient chemistry -- use the
      // training-median category as a stable, honest default.
      const categories = categoryListFor(modelData, id);
      const { median } = getFeatureBounds(modelData, id);
      const idx = clamp(Math.round(median), 0, categories.length - 1);
      result[id] = categories[idx];
      continue;
    }

    const { min, max, median } = getFeatureBounds(modelData, id);
    const normMed = normalizedPosition(median, min, max);
    const w = WEIGHTS[id] || {};

    let shift = 0;
    for (const kId of KNOWN_IDS) {
      shift += (w[kId] || 0) * dev[kId];
    }

    // Soil microbial activity peaks near neutral pH and falls off toward
    // both extremes -- add a small non-linear penalty for pH far from the
    // training median.
    if (id === 'mikroorganizmlar') {
      shift += -0.3 * Math.abs(dev.ph);
    }

    const normNew = clamp(normMed + shift, 0, 1);
    result[id] = min + normNew * (max - min);
  }

  return result;
}
