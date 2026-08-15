import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';

// The trained XGBoost model (2100 trees) is exported ahead of time (see the
// Python export script used during development) into a flat, index-based
// representation so it can be traversed quickly in plain JavaScript:
//
//   feature_names   -- the 18 feature names, in the exact order the scaler
//                       and the trees expect
//   data_min/data_max -- MinMaxScaler bounds per feature
//   medians         -- median training value per feature (encoded, unscaled)
//   qatlam_categories / mexanik_categories -- OrdinalEncoder categories
//   classes         -- the 7 crop names, in xgboost class-index order
//   base_score      -- per-class base margin
//   tree_offsets    -- start index of each tree inside the flat node arrays
//   node_feature/node_thresh/node_yes/node_no -- one entry per tree node;
//       node_feature === -1 marks a leaf (its value is stored in node_thresh)

const MODEL_ASSET = require('../../assets/model/model_data.dat');

let cachedModelPromise = null;

export function loadModelData() {
  if (!cachedModelPromise) {
    cachedModelPromise = (async () => {
      const asset = Asset.fromModule(MODEL_ASSET);
      if (!asset.localUri) {
        await asset.downloadAsync();
      }
      const uri = asset.localUri || asset.uri;
      const text = await FileSystem.readAsStringAsync(uri);
      const data = JSON.parse(text);
      return data;
    })();
  }
  return cachedModelPromise;
}
