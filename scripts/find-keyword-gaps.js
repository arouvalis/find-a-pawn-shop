#!/usr/bin/env node
/**
 * find-keyword-gaps.js
 *
 * Reads a GSC Queries.csv and finds location-specific pawn shop queries
 * that don't yet have a blog post. Ignores branded/shop-name queries.
 *
 * Usage: node scripts/find-keyword-gaps.js ~/Downloads/Queries.csv
 * Output: scripts/keyword-gaps-output.json
 */

'use strict';

const fs             = require('fs');
const os             = require('os');
const path           = require('path');
const { execSync }   = require('child_process');

const OUTPUT_PATH = path.join(__dirname, 'keyword-gaps-output.json');
const ARTICLES_TS_PATH = path.join(__dirname, '../src/lib/articles.ts');

// ─── State mappings ───────────────────────────────────────────────────────────

const STATE_ABBR_TO_NAME = {
  al: 'Alabama',     ak: 'Alaska',        az: 'Arizona',      ar: 'Arkansas',
  ca: 'California',  co: 'Colorado',      ct: 'Connecticut',  de: 'Delaware',
  fl: 'Florida',     ga: 'Georgia',       hi: 'Hawaii',       id: 'Idaho',
  il: 'Illinois',    in: 'Indiana',       ia: 'Iowa',         ks: 'Kansas',
  ky: 'Kentucky',    la: 'Louisiana',     me: 'Maine',        md: 'Maryland',
  ma: 'Massachusetts', mi: 'Michigan',    mn: 'Minnesota',    ms: 'Mississippi',
  mo: 'Missouri',    mt: 'Montana',       ne: 'Nebraska',     nv: 'Nevada',
  nh: 'New Hampshire', nj: 'New Jersey',  nm: 'New Mexico',   ny: 'New York',
  nc: 'North Carolina', nd: 'North Dakota', oh: 'Ohio',       ok: 'Oklahoma',
  or: 'Oregon',      pa: 'Pennsylvania',  ri: 'Rhode Island', sc: 'South Carolina',
  sd: 'South Dakota', tn: 'Tennessee',    tx: 'Texas',        ut: 'Utah',
  vt: 'Vermont',     va: 'Virginia',      wa: 'Washington',   wv: 'West Virginia',
  wi: 'Wisconsin',   wy: 'Wyoming',       dc: 'Washington DC',
};

const STATE_NAME_TO_SLUG = {
  'Alabama': 'alabama',           'Alaska': 'alaska',
  'Arizona': 'arizona',           'Arkansas': 'arkansas',
  'California': 'california',     'Colorado': 'colorado',
  'Connecticut': 'connecticut',   'Delaware': 'delaware',
  'Florida': 'florida',           'Georgia': 'georgia',
  'Hawaii': 'hawaii',             'Idaho': 'idaho',
  'Illinois': 'illinois',         'Indiana': 'indiana',
  'Iowa': 'iowa',                 'Kansas': 'kansas',
  'Kentucky': 'kentucky',         'Louisiana': 'louisiana',
  'Maine': 'maine',               'Maryland': 'maryland',
  'Massachusetts': 'massachusetts', 'Michigan': 'michigan',
  'Minnesota': 'minnesota',       'Mississippi': 'mississippi',
  'Missouri': 'missouri',         'Montana': 'montana',
  'Nebraska': 'nebraska',         'Nevada': 'nevada',
  'New Hampshire': 'new-hampshire', 'New Jersey': 'new-jersey',
  'New Mexico': 'new-mexico',     'New York': 'new-york',
  'North Carolina': 'north-carolina', 'North Dakota': 'north-dakota',
  'Ohio': 'ohio',                 'Oklahoma': 'oklahoma',
  'Oregon': 'oregon',             'Pennsylvania': 'pennsylvania',
  'Rhode Island': 'rhode-island', 'South Carolina': 'south-carolina',
  'South Dakota': 'south-dakota', 'Tennessee': 'tennessee',
  'Texas': 'texas',               'Utah': 'utah',
  'Vermont': 'vermont',           'Virginia': 'virginia',
  'Washington': 'washington',     'West Virginia': 'west-virginia',
  'Wisconsin': 'wisconsin',       'Wyoming': 'wyoming',
  'Washington DC': 'dc',
};

const STATE_ABBRS = new Set(Object.keys(STATE_ABBR_TO_NAME));

// Generic words that appear before "pawn" in non-branded queries
const GENERIC_QUALIFIERS = new Set([
  'best', 'top', 'good', 'local', 'cheap', 'near', 'nearby', 'find', 'great',
  'trusted', 'reliable', 'affordable', 'reputable', 'licensed', 'fast',
  'nearest', 'closest', 'my', 'a', 'the',
]);

// Known pawn chain brand names — skip these queries
const CHAIN_BRANDS = [
  'ezpawn', 'ecoatm', 'firstcash', 'first cash', 'cashamerica', 'cash america',
  'pawnsmart', 'pawngo', 'valuepawn', 'value pawn', 'national pawn',
  'cashland', 'speedy cash', 'superpawn', 'moneymax', 'maxpawn',
  'ace cash express', 'advance america',
  'plus pawn', 'money mart', 'b&b pawn', 'b and b pawn',
];

// ─── CSV parser ───────────────────────────────────────────────────────────────

function parseCSVRow(line) {
  const cells = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      cells.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  cells.push(current.trim());
  return cells;
}

function parseCSV(content) {
  const lines = content.split('\n').map(l => l.trim()).filter(Boolean);

  // Find the header row (contains "quer" in some column)
  let headerIdx = -1;
  for (let i = 0; i < Math.min(lines.length, 10); i++) {
    if (/quer/i.test(lines[i])) {
      headerIdx = i;
      break;
    }
  }
  if (headerIdx === -1) {
    throw new Error(
      'Could not find header row. Expected a row containing "Top queries" or "Query".\n' +
      `First line was: ${lines[0]}`
    );
  }

  const headers = parseCSVRow(lines[headerIdx]).map(h => h.toLowerCase().trim());
  const queryIdx       = headers.findIndex(h => h.includes('quer'));
  const clicksIdx      = headers.findIndex(h => h.includes('click'));
  const impressionsIdx = headers.findIndex(h => h.includes('impression'));
  const positionIdx    = headers.findIndex(h => h.includes('position'));

  if (queryIdx === -1 || impressionsIdx === -1) {
    throw new Error(`Required columns not found. Headers: ${headers.join(', ')}`);
  }

  const rows = [];
  for (let i = headerIdx + 1; i < lines.length; i++) {
    const cells = parseCSVRow(lines[i]);
    const query = cells[queryIdx];
    if (!query) continue;

    const impressionsRaw = cells[impressionsIdx] || '0';
    const impressions = parseInt(impressionsRaw.replace(/[^0-9]/g, ''), 10) || 0;

    rows.push({
      query: query.toLowerCase().trim(),
      clicks:      parseInt((cells[clicksIdx] || '0').replace(/[^0-9]/g, ''), 10) || 0,
      impressions,
      position:    parseFloat(cells[positionIdx] || '0') || 0,
    });
  }

  return rows;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toSlug(str) {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function toTitleCase(str) {
  return str.replace(/\b\w/g, c => c.toUpperCase());
}

function getExistingSlugs() {
  try {
    const content = fs.readFileSync(ARTICLES_TS_PATH, 'utf8');
    return new Set([...content.matchAll(/slug:\s*["']([^"']+)["']/g)].map(m => m[1]));
  } catch {
    console.warn('Warning: Could not read articles.ts — assuming no existing slugs.');
    return new Set();
  }
}

// ─── Query classification ─────────────────────────────────────────────────────

function isBrandedQuery(q) {
  for (const brand of CHAIN_BRANDS) {
    if (q.includes(brand)) return true;
  }
  return false;
}

/**
 * Try to extract { city, state, stateSlug } from a pawn-shop query.
 * Returns null if no location can be confidently identified.
 */
function extractLocation(q) {
  let m;

  // 1. "pawn shops in [city] [state?]"  /  "pawn shop in [city] [state?]"
  m = q.match(/pawn\s+shops?\s+in\s+([a-z][a-z\s]{1,30}?)(?:\s+([a-z]{2}))?\s*$/);
  if (m) return buildLocation(m[1], m[2]);

  // 2. "pawn shop[s] [city] [state_abbr]"  — state abbr at end is mandatory here
  m = q.match(/pawn\s+shops?\s+([a-z][a-z\s]{1,30}?)\s+([a-z]{2})\s*$/);
  if (m && STATE_ABBRS.has(m[2])) return buildLocation(m[1], m[2]);

  // 3. "best/top/find/good/... pawn shops [in] [city] [state?]"
  m = q.match(
    /(?:best|top|find|good|local|cheap|affordable|trusted|reputable|licensed|nearest?)\s+pawn\s+shops?\s+(?:in\s+)?([a-z][a-z\s]{1,30}?)(?:\s+([a-z]{2}))?\s*$/
  );
  if (m) return buildLocation(m[1], m[2]);

  // 4. "[city] [state_abbr] pawn shops"  — city-first with required state abbr
  //    State abbr is mandatory here; without it "[word] pawn shop" is too ambiguous
  //    (shop names like "royal pawn shop", "sauls pawn shop" look identical to city queries)
  m = q.match(/^([a-z][a-z\s]{1,30}?)\s+([a-z]{2})\s+pawn\s+shops?\s*$/);
  if (m && STATE_ABBRS.has(m[2])) {
    const firstWord = m[1].trim().split(' ')[0];
    if (!GENERIC_QUALIFIERS.has(firstWord) && !isBrandPrefix(firstWord)) {
      return buildLocation(m[1], m[2]);
    }
  }

  // 5. "pawn shops near [city]"  (skip "near me")
  m = q.match(/pawn\s+shops?\s+near\s+([a-z][a-z\s]{1,30}?)(?:\s+([a-z]{2}))?\s*$/);
  if (m && !/\bme\b/.test(m[1])) return buildLocation(m[1], m[2]);

  // 6. "pawn [city] [state]"  (bare "pawn houston tx")
  m = q.match(/^pawn\s+([a-z][a-z\s]{1,25}?)\s+([a-z]{2})\s*$/);
  if (m && STATE_ABBRS.has(m[2])) return buildLocation(m[1], m[2]);

  return null;
}

function isBrandPrefix(word) {
  const brandPrefixes = new Set([
    'ace', 'capital', 'first', 'max', 'quick', 'easy', 'super', 'premier',
    'elite', 'american', 'national', 'eagle', 'gold', 'silver', 'diamond',
    'fast', 'big', 'metro', 'central', 'dollar', 'star', 'pro', 'plus',
    'express', 'king', 'crown', 'united', 'empire', 'bears', 'cash',
  ]);
  return brandPrefixes.has(word);
}

// Words that look like locations but aren't — checked against FULL city name
// and also against the FIRST word of multi-word extracted city names
const NOT_CITIES = new Set([
  // Navigation / proximity
  'near', 'nearby', 'me', 'my', 'here', 'local', 'open', 'hours',
  // Generic qualifiers that sometimes bleed into city capture
  'all', 'any', 'some', 'no', 'good', 'best', 'top', 'cheap', 'fast', 'new', 'old', 'big',
  // Service / item words that precede a real city in multi-part queries
  'jewelry', 'jewellery', 'jewelers', 'broker', 'brokers', 'pawnbroker',
  'loan', 'loans', 'gold', 'silver', 'cash', 'trading', 'exchange',
  'pros', 'cons', 'tips', 'reviews', 'hours',
  // Spanish pawn shop terms
  'casa', 'empeno', 'prestamo',
]);

function buildLocation(rawCity, stateAbbr) {
  const city = rawCity.trim();
  if (!city || city.length < 2) return null;

  // Check full name AND first word — catches "near me warner robins", "jewelry barberton", etc.
  const firstWord = city.toLowerCase().split(/\s+/)[0];
  if (NOT_CITIES.has(city.toLowerCase()) || NOT_CITIES.has(firstWord)) return null;

  let stateName = null;
  let stateSlug = null;

  if (stateAbbr) {
    const abbr = stateAbbr.toLowerCase();
    if (STATE_ABBRS.has(abbr)) {
      stateName = STATE_ABBR_TO_NAME[abbr];
      stateSlug = STATE_NAME_TO_SLUG[stateName] || toSlug(stateName);
    }
  }

  return {
    city:      toTitleCase(city),
    state:     stateName,
    stateSlug,
    citySlug:  toSlug(city),
  };
}

// ─── Input resolver (CSV or ZIP) ─────────────────────────────────────────────

function resolveCSV(input) {
  const inputPath = input.replace(/^~/, os.homedir());
  if (!fs.existsSync(inputPath)) throw new Error(`File not found: ${inputPath}`);

  const ext = path.extname(inputPath).toLowerCase();
  if (ext === '.csv') return inputPath;

  if (ext === '.zip') {
    console.log(`  Extracting CSV from zip: ${path.basename(inputPath)}`);
    const tmpDir = path.join(os.tmpdir(), `gsc-extract-${Date.now()}`);
    fs.mkdirSync(tmpDir, { recursive: true });
    execSync(`unzip -o "${inputPath}" -d "${tmpDir}"`, { stdio: 'pipe' });

    // Prefer files with "quer" in the name, fall back to any CSV
    const allCsvs = execSync(`find "${tmpDir}" -iname "*.csv"`, { encoding: 'utf8' })
      .split('\n').map(l => l.trim()).filter(Boolean);

    if (!allCsvs.length) throw new Error('No CSV files found inside the zip.');

    const queriesFile = allCsvs.find(f => /quer/i.test(path.basename(f))) || allCsvs[0];
    console.log(`  Using: ${path.basename(queriesFile)}`);
    return queriesFile;
  }

  throw new Error(`Unsupported file type: ${ext}  (expected .csv or .zip)`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main() {
  const args = process.argv.slice(2);
  if (!args[0]) {
    console.error('Usage: node scripts/find-keyword-gaps.js <Queries.csv | gsc-export.zip>');
    process.exit(1);
  }

  let csvPath;
  try {
    csvPath = resolveCSV(args[0]);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }

  console.log(`Reading ${csvPath}...`);
  const rows = parseCSV(fs.readFileSync(csvPath, 'utf8'));
  console.log(`  Parsed ${rows.length} queries from CSV`);

  const existingSlugs = getExistingSlugs();
  console.log(`  Found ${existingSlugs.size} existing article slugs`);

  // Track per-slug aggregates so duplicate city queries roll up
  const bySlug = new Map();
  const stats = { noPawn: 0, branded: 0, noLocation: 0, alreadyCovered: 0 };

  for (const row of rows) {
    const q = row.query;

    if (!/pawn/.test(q))    { stats.noPawn++;     continue; }
    if (isBrandedQuery(q))  { stats.branded++;    continue; }

    const loc = extractLocation(q);
    if (!loc)               { stats.noLocation++; continue; }

    const slug = `best-pawn-shops-in-${loc.citySlug}`;
    if (existingSlugs.has(slug)) { stats.alreadyCovered++; continue; }

    if (bySlug.has(slug)) {
      const entry = bySlug.get(slug);
      entry.impressions += row.impressions;
      entry.clicks      += row.clicks;
      entry.all_queries.push(q);
    } else {
      bySlug.set(slug, {
        query:               q,
        all_queries:         [q],
        impressions:         row.impressions,
        clicks:              row.clicks,
        position:            row.position,
        suggested_title:     `Best Pawn Shops in ${loc.city}${loc.state ? ', ' + loc.state : ''} (2026 Guide)`,
        suggested_slug:      slug,
        suggested_description:
          `Looking for the best pawn shops in ${loc.city}? We cover top-rated shops across ` +
          `${loc.city} neighborhoods — with addresses, hours, and contact info.`,
        city:       loc.city,
        state:      loc.state,
        state_slug: loc.stateSlug,
        city_slug:  loc.citySlug,
      });
    }
  }

  const opportunities = [...bySlug.values()].sort((a, b) => b.impressions - a.impressions);

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(opportunities, null, 2));

  console.log('\n── Results ──────────────────────────────────────────────────');
  console.log(`  Opportunities found : ${opportunities.length}`);
  console.log(`  Skipped (no "pawn") : ${stats.noPawn}`);
  console.log(`  Skipped (branded)   : ${stats.branded}`);
  console.log(`  Skipped (no location): ${stats.noLocation}`);
  console.log(`  Skipped (covered)   : ${stats.alreadyCovered}`);
  console.log(`  Output → ${OUTPUT_PATH}`);

  if (opportunities.length > 0) {
    console.log('\n── Top 10 opportunities ─────────────────────────────────────');
    opportunities.slice(0, 10).forEach((o, i) => {
      const loc = o.state ? `${o.city}, ${o.state}` : o.city;
      console.log(`  ${String(i + 1).padStart(2)}. ${loc.padEnd(30)} ${String(o.impressions).padStart(6)} impressions`);
    });
  }
}

main();
