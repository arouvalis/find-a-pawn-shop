const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const INPUT = path.join(__dirname, "../data/pawn-shops-illinois.xlsx");
const OUTPUT = path.join(__dirname, "../data/pawn-shops-illinois.json");

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

const workbook = XLSX.readFile(INPUT);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

const records = rows.map((row) => {
  const name = clean(row["name"] ?? row["Name"]);
  const city = clean(row["city"] ?? row["City"]);

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
    placeId: clean(row["placeId"] ?? row["place_id"] ?? row["Place ID"]),
    googleMapsUrl: clean(row["googleMapsUrl"] ?? row["google_maps_url"] ?? row["Google Maps URL"]),
  };
});

fs.writeFileSync(OUTPUT, JSON.stringify(records, null, 2));
console.log(`Converted ${records.length} records → ${OUTPUT}`);
