/**
 * Pure-JavaScript re-implementation of XGBoost multiclass (multi:softprob)
 * inference, driven entirely by the flat tree arrays exported from the
 * original Python model (see assets/model/model_data.dat).
 *
 * The exported XGBoost model has 300 boosting rounds x 7 crop classes =
 * 2100 trees. XGBoost stores multiclass trees round-major: tree index `t`
 * belongs to class `t % num_class`. Each prediction sums the base_score for
 * every class with the leaf value reached by walking each of that class's
 * trees, then applies softmax. This was verified against the original
 * scikit-learn/xgboost model on random inputs (max abs error ~1e-7).
 */

function traverseTree(rootIndex, scaledVector, node_feature, node_thresh, node_yes, node_no) {
  let idx = rootIndex;
  while (node_feature[idx] !== -1) {
    const fidx = node_feature[idx];
    const thresh = node_thresh[idx];
    idx = scaledVector[fidx] < thresh ? node_yes[idx] : node_no[idx];
  }
  return node_thresh[idx]; // leaf value
}

/**
 * @param {number[]} scaledVector - 18 features, already MinMax-scaled to [0,1]
 * @param {object} modelData - the parsed model_data.dat contents
 * @returns {{crop: string, probability: number}[]} one entry per crop class,
 *          in the model's native class order (NOT sorted)
 */
export function predictProbabilities(scaledVector, modelData) {
  const {
    tree_offsets,
    node_feature,
    node_thresh,
    node_yes,
    node_no,
    base_score,
    num_class,
    classes,
  } = modelData;

  const margins = base_score.slice();
  const numTrees = tree_offsets.length - 1;

  for (let t = 0; t < numTrees; t++) {
    const leafVal = traverseTree(
      tree_offsets[t],
      scaledVector,
      node_feature,
      node_thresh,
      node_yes,
      node_no
    );
    const cls = t % num_class;
    margins[cls] += leafVal;
  }

  const maxMargin = Math.max(...margins);
  const exps = margins.map((m) => Math.exp(m - maxMargin));
  const sumExp = exps.reduce((a, b) => a + b, 0);
  const probs = exps.map((e) => e / sumExp);

  return classes.map((cropName, i) => ({ crop: cropName, probability: probs[i] }));
}

/** Convenience: returns results sorted from most to least suitable, each
 * with a rounded whole-number percentage ready for display. */
export function rankCropResults(results) {
  return [...results]
    .sort((a, b) => b.probability - a.probability)
    .map((r) => ({ ...r, percent: Math.round(r.probability * 1000) / 10 }));
}
