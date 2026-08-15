// Static metadata describing the 18 soil features the trained model expects.
// The ARRAY ORDER below matches `feature_names` inside assets/model/model_data.dat
// exactly (index 0..17). Screens should always look up numeric bounds
// (data_min / data_max) from the loaded model at runtime -- this file only
// carries UI/translation-related metadata so there is a single source of
// truth for the actual numeric ranges.
//
// isSensor === true  -> one of the 5 values the 8-in-1 soil sensor / "Soil
//                        Detector" export can supply (pH, EC, N, P, K).
// isSensor === false -> a secondary lab-style parameter the sensor cannot
//                        measure. The app estimates a sensible default for
//                        these from the 5 sensor values (see src/ml/defaults.js)
//                        but the user can always edit them by hand.

export const FEATURE_KEYS = [
  'qatlam',
  'mexanikTarkib',
  'dalaNam',
  'zichlik',
  'ph',
  'ec',
  'n',
  'p',
  'k',
  'gumus',
  'mg',
  's',
  'zn',
  'mn',
  'b',
  'fe',
  'cu',
  'mikroorganizmlar',
];

// value must exactly equal the corresponding entry of model_data.feature_names
export const FEATURE_SCHEMA = [
  {
    id: 'qatlam',
    modelKey: 'Qatlam (sm)',
    type: 'categorical',
    isSensor: false,
    icon: 'layers-outline',
    categoryValues: ['0-20', '0-30', '20-40', '40-60'],
  },
  {
    id: 'mexanikTarkib',
    modelKey: 'Mexanik tarkib',
    type: 'categorical',
    isSensor: false,
    icon: 'grid-outline',
    categoryValues: ['Gil', 'Loy', 'Loyqa', 'Qum', 'Qumoq', 'Yengil qum'],
  },
  {
    id: 'dalaNam',
    modelKey: 'Dala Nam Singdiruvchanlik (%)',
    type: 'numeric',
    isSensor: false,
    icon: 'water-outline',
    unit: '%',
    decimals: 1,
  },
  {
    id: 'zichlik',
    modelKey: 'Tuproq zichligi (g/cm³)',
    type: 'numeric',
    isSensor: false,
    icon: 'cube-outline',
    unit: 'g/cm³',
    decimals: 2,
  },
  {
    id: 'ph',
    modelKey: 'pH',
    type: 'numeric',
    isSensor: true,
    icon: 'flask-outline',
    unit: 'pH',
    decimals: 1,
  },
  {
    id: 'ec',
    modelKey: 'EC (mS/cm)',
    type: 'numeric',
    isSensor: true,
    icon: 'flash-outline',
    unit: 'mS/cm',
    // sensors/apps usually export conductivity in microsiemens; the input
    // field lets the person enter either unit (see unitConversion.js)
    sensorUnit: 'µS/cm',
    decimals: 3,
  },
  {
    id: 'n',
    modelKey: 'N (mg/kg)',
    type: 'numeric',
    isSensor: true,
    icon: 'leaf-outline',
    unit: 'mg/kg',
    decimals: 1,
  },
  {
    id: 'p',
    modelKey: 'P (mg/kg)',
    type: 'numeric',
    isSensor: true,
    icon: 'nutrition-outline',
    unit: 'mg/kg',
    decimals: 1,
  },
  {
    id: 'k',
    modelKey: 'K (mg/kg)',
    type: 'numeric',
    isSensor: true,
    icon: 'sparkles-outline',
    unit: 'mg/kg',
    decimals: 1,
  },
  {
    id: 'gumus',
    modelKey: 'Gumus (%)',
    type: 'numeric',
    isSensor: false,
    icon: 'leaf',
    unit: '%',
    decimals: 2,
  },
  {
    id: 'mg',
    modelKey: 'Mg (mg/kg)',
    type: 'numeric',
    isSensor: false,
    icon: 'ellipse-outline',
    unit: 'mg/kg',
    decimals: 1,
  },
  {
    id: 's',
    modelKey: 'S (mg/kg)',
    type: 'numeric',
    isSensor: false,
    icon: 'ellipse-outline',
    unit: 'mg/kg',
    decimals: 1,
  },
  {
    id: 'zn',
    modelKey: 'Zn (mg/kg)',
    type: 'numeric',
    isSensor: false,
    icon: 'ellipse-outline',
    unit: 'mg/kg',
    decimals: 2,
  },
  {
    id: 'mn',
    modelKey: 'Mn (mg/kg)',
    type: 'numeric',
    isSensor: false,
    icon: 'ellipse-outline',
    unit: 'mg/kg',
    decimals: 2,
  },
  {
    id: 'b',
    modelKey: 'B (mg/kg)',
    type: 'numeric',
    isSensor: false,
    icon: 'ellipse-outline',
    unit: 'mg/kg',
    decimals: 2,
  },
  {
    id: 'fe',
    modelKey: 'Fe (mg/kg)',
    type: 'numeric',
    isSensor: false,
    icon: 'ellipse-outline',
    unit: 'mg/kg',
    decimals: 2,
  },
  {
    id: 'cu',
    modelKey: 'Cu (mg/kg)',
    type: 'numeric',
    isSensor: false,
    icon: 'ellipse-outline',
    unit: 'mg/kg',
    decimals: 2,
  },
  {
    id: 'mikroorganizmlar',
    modelKey: 'Mikroorganizmlar(CFU/g)',
    type: 'numeric',
    isSensor: false,
    icon: 'bug-outline',
    unit: 'CFU/g',
    decimals: 0,
  },
];

export const SENSOR_FEATURE_IDS = FEATURE_SCHEMA.filter((f) => f.isSensor).map((f) => f.id);
export const DERIVED_FEATURE_IDS = FEATURE_SCHEMA.filter((f) => !f.isSensor).map((f) => f.id);

export function getFeatureById(id) {
  return FEATURE_SCHEMA.find((f) => f.id === id);
}

export default FEATURE_SCHEMA;
