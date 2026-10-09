/**
 * Compares the app's design tokens against the values extracted from the
 * Figma REST API. Run with: node scripts/verify-theme.mjs
 *
 * The expected values are the authoritative hex strings from the file
 * (layered fills resolved to the last solid entry, cross-checked against
 * 2x pixel samples of the rendered frames).
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const themeSrc = readFileSync(
  resolve(import.meta.dirname, '..', 'src', 'constants', 'theme.ts'),
  'utf8',
);

/** Pull `key: '#HEX'` pairs out of the theme source. */
function tokens(source) {
  const out = {};
  const re = /(\w+):\s*'(#[0-9A-Fa-f]{6})'/g;
  for (const m of source.matchAll(re)) out[m[1]] = m[2].toUpperCase();
  return out;
}

const actual = tokens(themeSrc);

/** Values read directly from the Figma file. */
const expected = {
  // Surfaces
  bg: '#F5F5FB',
  card: '#FFFFFF',
  border: '#E8E8F2',
  divider: '#DDDDED',
  gridline: '#D6D6E8',
  radioBorder: '#CFD0E0',

  // Text
  text: '#1E1B3A',
  textSecondary: '#6B6F8A',
  ink: '#000000',
  onBrand: '#FFFFFF',

  // Indigo accent
  indigo: '#4F46E5',
  indigoSoft: '#E0E7FF',
  indigoLine: '#C7D2FE',

  // Greens
  green: '#389C76',
  greenDeep: '#2A7A5D',
  greenBright: '#16A34A',
  greenSoft: '#DCFCE7',
  greenMid: '#6EB59C',
  greenPale: '#AED7C7',
  greenFaint: '#BBDAD2',
  greenPeak: '#47A381',

  // Status
  amber: '#F59E0B',
  amberSoft: '#FEF3C7',
  rose: '#E11D48',
  roseSoft: '#FFE4E6',
  blue: '#0284C7',
};

let failures = 0;
for (const [key, want] of Object.entries(expected)) {
  const got = actual[key];
  if (!got) {
    console.log(`  MISSING  ${key} (expected ${want})`);
    failures++;
  } else if (got !== want) {
    console.log(`  MISMATCH ${key}: got ${got}, expected ${want}`);
    failures++;
  }
}

const checked = Object.keys(expected).length;
if (failures === 0) {
  console.log(`All ${checked} colour tokens match the Figma file.`);
} else {
  console.log(`\n${failures}/${checked} tokens do not match.`);
  process.exitCode = 1;
}