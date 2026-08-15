// Unit conversion helpers.
//
// The trained model was fit on EC expressed in mS/cm. Handheld soil probes
// and apps like "Soil Detector" commonly export electrical conductivity in
// microsiemens per centimetre (µS/cm / us/cm), which is 1000x smaller.
// Some lab reports instead use dS/m, which is numerically identical to
// mS/cm (1 dS/m = 1 mS/cm), so no scaling is required for that unit.

/**
 * Convert an electrical-conductivity reading to mS/cm (the unit the model
 * expects), automatically detecting the unit from a free-text unit string.
 * If no unit is recognised, values are assumed to already be in mS/cm when
 * they are small (< 20) and in µS/cm when they look like a raw sensor
 * reading (>= 20), since typical agricultural EC values in mS/cm rarely
 * exceed ~5.
 */
export function toMilliSiemensPerCm(value, unitHint) {
  if (value === null || value === undefined || Number.isNaN(value)) return null;
  const u = (unitHint || '').toLowerCase().replace(/\s/g, '');

  if (u.includes('ds/m') || u.includes('ds')) return value; // dS/m == mS/cm
  if (u.includes('ms/cm') || u === 'ms') return value;
  if (u.includes('us/cm') || u.includes('μs') || u.includes('µs') || u.includes('us')) {
    return value / 1000;
  }
  // No recognisable unit text: heuristically guess based on magnitude.
  if (value > 20) return value / 1000; // almost certainly µS/cm
  return value;
}

/** Convert mS/cm back to µS/cm for user-friendly sensor-style display. */
export function toMicroSiemensPerCm(valueMsPerCm) {
  if (valueMsPerCm === null || valueMsPerCm === undefined || Number.isNaN(valueMsPerCm)) return null;
  return valueMsPerCm * 1000;
}

/**
 * Extract the leading numeric portion and the trailing unit text from a
 * spreadsheet cell such as "790.0us/cm", "25.4℃", "41.5%" or "39mg/kg".
 * Returns { value: number|null, unit: string }.
 */
export function splitValueAndUnit(raw) {
  if (raw === null || raw === undefined) return { value: null, unit: '' };
  const str = String(raw).trim();
  const match = str.match(/-?\d+(?:[.,]\d+)?/);
  if (!match) return { value: null, unit: str.replace(/[\d.,\s-]/g, '') };
  const numeric = parseFloat(match[0].replace(',', '.'));
  const unit = str.slice(match.index + match[0].length).trim();
  return { value: Number.isNaN(numeric) ? null : numeric, unit };
}

export function clamp(value, min, max) {
  if (value === null || value === undefined || Number.isNaN(value)) return value;
  return Math.min(Math.max(value, min), max);
}

export function roundTo(value, decimals = 2) {
  if (value === null || value === undefined || Number.isNaN(value)) return value;
  const f = Math.pow(10, decimals);
  return Math.round(value * f) / f;
}

/** Formats a number for display in a text input, e.g. formatNum(6.9001, 1) -> "6.9".
 * Returns an empty string for null/NaN so inputs render blank instead of "NaN". */
export function formatNum(value, decimals = 2) {
  if (value === null || value === undefined || Number.isNaN(value)) return '';
  return roundTo(value, decimals).toString();
}
