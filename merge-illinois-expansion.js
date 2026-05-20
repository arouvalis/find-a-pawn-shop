#!/usr/bin/env node
// Run from repo root: node merge-illinois-expansion.js

const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const EXCEL_FILE = path.join(
  process.env.HOME,
  "Downloads",
  "Outscraper-20260520184618s40.xlsx"
);
const JSON_FILE = path.join(__dirname, "data", "pawn-shops-illinois.json");

// City name overrides — add any anomalies here
const CITY_OVERRIDES = {
  "Crest Hill": "Crest Hill",
  "Hometown": "Hometown",
  "Urbana": "Urbana",
};

function toSlug(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function parseWorkingHours(raw) {
  if (!raw || typeof raw !== "string") return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function normalizeCity(city) {
  if (!city) return "";
  return CITY_OVERRIDES[city] || city;
}

// Load existing data
const existing = JSON.parse(fs.readFileSync(JSON_FILE, "utf8"));
const existingIds = new Set(existing.map((s) => s.place_id));
console.log(`Existing Illinois shops: ${existing.length}`);

// Load Excel
const wb = XLSX.readFile(EXCEL_FILE);
const ws = wb.Sheets[wb.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(ws);

// Filter to pawn shops only
const pawnRows = rows.filter((r) => {
  const subtypes = (r.subtypes || r.category || "").toLowerCase();
  return subtypes.includes("pawn");
});

console.log(`New file rows: ${rows.length}, pawn shops: ${pawnRows.length}`);

// Dedupe against existing
const newShops = [];
let skipped = 0;

for (const row of pawnRows) {
  if (!row.place_id || existingIds.has(row.place_id)) {
    skipped++;
    continue;
  }

  const city = normalizeCity(row.city || "");
  const citySlug = toSlug(city);
  const nameSlug = toSlug(row.name || "");
  const slug = `${nameSlug}-${citySlug}`;

  newShops.push({
    place_id: row.place_id,
    name: row.name || "",
    slug,
    city,
    citySlug,
    street: row.street || "",
    zip: String(row.postal_code || ""),
    phone: row.phone || "",
    website: row.website || "",
    latitude: row.latitude ?? null,
    longitude: row.longitude ?? null,
    rating: row.rating ?? null,
    reviews: row.reviews ?? null,
    hours: parseWorkingHours(row.working_hours),
    googleMapsUrl: row.location_link || "",
    state: "Illinois",
    stateCode: "IL",
  });

  existingIds.add(row.place_id);
}

console.log(`New shops to add: ${newShops.length}`);
console.log(`Skipped (duplicates): ${skipped}`);

if (newShops.length === 0) {
  console.log("Nothing new to add.");
  process.exit(0);
}

// Preview
console.log("\nNew shops:");
newShops.forEach((s) => console.log(`  ${s.name} — ${s.city}`));

// Merge and write
const merged = [...existing, ...newShops];
fs.writeFileSync(JSON_FILE, JSON.stringify(merged, null, 2));
console.log(`\n✅ Done. Illinois now has ${merged.length} shops.`);
