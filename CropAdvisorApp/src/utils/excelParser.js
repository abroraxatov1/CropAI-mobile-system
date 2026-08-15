import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import { splitValueAndUnit, toMilliSiemensPerCm } from './unitConversion';

// Column-header aliases used by common "8-in-1" soil sensor export apps
// (e.g. "Soil Detector"). Matching is exact (case-insensitive, trimmed) so
// that single-letter headers like "N" don't accidentally match unrelated
// columns.
const HEADER_ALIASES = {
  ph: ['ph'],
  ec: ['conductivity', 'ec', 'ec(us/cm)', 'ec (us/cm)', 'ec(ms/cm)', "o'tkazuvchanlik", 'otkazuvchanlik'],
  n: ['n', 'azot'],
  p: ['p', 'fosfor'],
  k: ['k', 'kaliy'],
  time: ['time', 'sana', 'vaqt', 'date'],
  desc: ['desc', 'description', "tavsif"],
};

function normalizeHeader(h) {
  return String(h ?? '')
    .trim()
    .toLowerCase();
}

function matchHeaderIndex(headerRow, aliases) {
  for (let i = 0; i < headerRow.length; i++) {
    const h = normalizeHeader(headerRow[i]);
    if (aliases.includes(h)) return i;
  }
  return -1;
}

/**
 * Parses a workbook (already loaded as a base64 string) and returns every
 * data row that contains at least one recognisable soil-sensor value.
 * Only pH, EC (Conductivity), N, P and K are extracted -- every other
 * column (Temp, Moisture, Fertility, No., Desc, Time, ...) is ignored, per
 * spec, even though it may be present in the source file.
 */
export function parseSoilWorkbookFromBase64(base64) {
  const workbook = XLSX.read(base64, { type: 'base64' });
  const results = [];

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, defval: '' });

    let headerRowIdx = -1;
    let colIdx = {};
    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      if (!Array.isArray(row)) continue;
      const nIdx = matchHeaderIndex(row, HEADER_ALIASES.n);
      const pIdx = matchHeaderIndex(row, HEADER_ALIASES.p);
      const kIdx = matchHeaderIndex(row, HEADER_ALIASES.k);
      if (nIdx !== -1 && pIdx !== -1 && kIdx !== -1) {
        headerRowIdx = r;
        colIdx = {
          n: nIdx,
          p: pIdx,
          k: kIdx,
          ph: matchHeaderIndex(row, HEADER_ALIASES.ph),
          ec: matchHeaderIndex(row, HEADER_ALIASES.ec),
          time: matchHeaderIndex(row, HEADER_ALIASES.time),
          desc: matchHeaderIndex(row, HEADER_ALIASES.desc),
        };
        break;
      }
    }
    if (headerRowIdx === -1) continue; // this sheet isn't a sensor export

    for (let r = headerRowIdx + 1; r < rows.length; r++) {
      const row = rows[r];
      if (!Array.isArray(row) || row.every((c) => c === '' || c === undefined || c === null)) {
        continue;
      }
      const get = (idx) => (idx !== -1 && idx < row.length ? row[idx] : '');

      const phCell = splitValueAndUnit(get(colIdx.ph));
      const ecCell = splitValueAndUnit(get(colIdx.ec));
      const nCell = splitValueAndUnit(get(colIdx.n));
      const pCell = splitValueAndUnit(get(colIdx.p));
      const kCell = splitValueAndUnit(get(colIdx.k));

      const anyValue = [phCell.value, ecCell.value, nCell.value, pCell.value, kCell.value].some(
        (v) => v !== null
      );
      if (!anyValue) continue;

      results.push({
        rowIndex: r,
        sheetName,
        time: colIdx.time !== -1 ? String(get(colIdx.time)) : '',
        desc: colIdx.desc !== -1 ? String(get(colIdx.desc)) : '',
        ph: phCell.value,
        ec_mScm: toMilliSiemensPerCm(ecCell.value, ecCell.unit),
        ec_rawValue: ecCell.value,
        ec_rawUnit: ecCell.unit,
        n: nCell.value,
        p: pCell.value,
        k: kCell.value,
      });
    }
  }

  return results;
}

/**
 * Reads a .xls / .xlsx file picked via expo-document-picker (given its
 * local file:// uri) and returns the parsed sensor rows.
 */
export async function parseSoilExcelFile(uri) {
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return parseSoilWorkbookFromBase64(base64);
}
