const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const INPUTS = [
  path.join(process.env.HOME, "Downloads/Outscraper-20260315172700s46.xlsx"),
  path.join(process.env.HOME, "Downloads/Outscraper-20260315172722s4c.xlsx"),
  path.join(process.env.HOME, "Downloads/Outscraper-20260315222636s8c.xlsx"),
];
const OUTPUT = path.join(__dirname, "../data/pawn-shops-pennsylvania.json");

function toSlug(str) {
  if (!str) return "";
  return str
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function clean(val) {
  if (val === undefined || val === null || val === "") return null;
  return String(val).trim() || null;
}

function cleanNumber(val) {
  const n = parseFloat(val);
  return isNaN(n) ? null : n;
}

const CITY_OVERRIDES = {
  "Mckees Rocks": "McKees Rocks",
  "North Versailles Township": "North Versailles",
  "Upper Darby Township": "Upper Darby",
  "Aston Township": "Aston",
};

function toTitleCase(str) {
  if (!str) return str;
  const titled = str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
  return CITY_OVERRIDES[titled] ?? titled;
}

const BLOCKLIST = ["moon's sandwich shop", "bnsf", "metra", "state street apparel", "iconnect", "railroad"];

function isPawnShop(row) {
  const raw = String(row["name"] ?? row["Name"] ?? "");
  const name = raw.toLowerCase();
  const category = String(row["category"] ?? row["Category"] ?? "").toLowerCase();
  const subtypes = String(row["subtypes"] ?? row["Subtypes"] ?? "").toLowerCase();

  if (BLOCKLIST.some((b) => name.includes(b))) return false;

  if (subtypes.includes("pawn shop") || category.includes("pawn")) return true;

  if (
    name.includes("pawn") ||
    name.includes("loan") ||
    name.includes("cash") ||
    name.includes("empe\u00f1o") ||
    name.includes("empeno") ||
    name.includes("buyback") ||
    name.includes("buy-back")
  )
    return true;

  if (
    name.includes("exchange") &&
    (name.includes("jewelry") || name.includes("gold") || name.includes("silver"))
  )
    return true;

  return false;
}

function isPennsylvaniaRow(row) {
  const state = String(row["state"] ?? row["State"] ?? "").trim().toUpperCase();
  return state === "PA" || state === "PENNSYLVANIA";
}

// Read and merge all rows from all files
let allRows = [];
for (const input of INPUTS) {
  const workbook = XLSX.readFile(input);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
  console.log(`Read ${rows.length} rows from ${path.basename(input)}`);
  allRows = allRows.concat(rows);
}
console.log(`Total rows before dedup: ${allRows.length}`);

// Dedupe by place_id
const seen = new Set();
const deduped = allRows.filter((row) => {
  const id = clean(row["place_id"] ?? row["placeId"] ?? row["Place ID"]);
  if (!id) return true;
  if (seen.has(id)) return false;
  seen.add(id);
  return true;
});
console.log(`Rows after dedup: ${deduped.length}`);

// Filter to Pennsylvania only, then filter to pawn shops, then map
const pennsylvaniaRows = deduped.filter(isPennsylvaniaRow);
console.log(`Pennsylvania rows: ${pennsylvaniaRows.length}`);

const records = pennsylvaniaRows.filter(isPawnShop).map((row) => {
  const name = clean(row["name"] ?? row["Name"]);
  const rawCity = clean(row["city"] ?? row["City"]);
  const city = toTitleCase(rawCity);

  return {
    slug: toSlug(name),
    citySlug: toSlug(city),
    name,
    phone: clean(row["phone"] ?? row["Phone"]),
    website: clean(row["website"] ?? row["Website"]),
    address: clean(row["address"] ?? row["Address"]),
    street: clean(row["street"] ?? row["Street"]),
    city,
    state: clean(row["state"] ?? row["State"]),
    zip: clean(row["zip"] ?? row["Zip"] ?? row["postal_code"] ?? row["Postal Code"]),
    rating: cleanNumber(row["rating"] ?? row["Rating"]),
    reviews: cleanNumber(row["reviews"] ?? row["Reviews"]),
    hours: clean(row["hours"] ?? row["Hours"] ?? row["working_hours"]),
    latitude: cleanNumber(row["latitude"] ?? row["Latitude"]),
    longitude: cleanNumber(row["longitude"] ?? row["Longitude"]),
    placeId: clean(row["place_id"] ?? row["placeId"] ?? row["Place ID"]),
    googleMapsUrl: clean(row["googleMapsUrl"] ?? row["google_maps_url"] ?? row["Google Maps URL"]),
  };
});

fs.writeFileSync(OUTPUT, JSON.stringify(records, null, 2));
console.log(`Converted ${records.length} records → ${OUTPUT}`);

// Report city name distribution for anomaly review
const cityCounts = {};
for (const r of records) {
  cityCounts[r.city] = (cityCounts[r.city] ?? 0) + 1;
}
const sorted = Object.entries(cityCounts).sort((a, b) => b[1] - a[1]);
console.log("\nCity distribution:");
for (const [city, count] of sorted) {
  console.log(`  ${count.toString().padStart(3)}  ${city}`);
}
