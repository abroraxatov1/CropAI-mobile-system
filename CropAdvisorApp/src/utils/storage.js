import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = 'cropadvisor.history.v1';
const MAX_HISTORY_ITEMS = 300;

export async function loadHistory() {
  try {
    const raw = await AsyncStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

/**
 * @param {object} entry - { id, createdAt, source: 'upload'|'manual', results: [{crop,probability,percent}], featureValues }
 */
export async function saveHistoryEntry(entry) {
  const history = await loadHistory();
  const updated = [entry, ...history].slice(0, MAX_HISTORY_ITEMS);
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  return updated;
}

export async function deleteHistoryEntry(id) {
  const history = await loadHistory();
  const updated = history.filter((h) => h.id !== id);
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  return updated;
}

export async function clearHistory() {
  await AsyncStorage.removeItem(HISTORY_KEY);
  return [];
}

export function makeHistoryId() {
  return `h_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
