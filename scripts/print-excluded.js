const XLSX = require("xlsx");

const workbook = XLSX.readFile("data/pawn-shops-illinois.xlsx");
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

const BLOCKLIST = ["moon's sandwich shop", "bnsf", "metra", "state street apparel", "iconnect", "railroad"];

function isPawnShop(row) {
  const name = String(row["name"] ?? row["Name"] ?? "").toLowerCase();
  const category = String(row["category"] ?? row["Category"] ?? "").toLowerCase();
  const subtypes = String(row["subtypes"] ?? row["Subtypes"] ?? "").toLowerCase();

  if (BLOCKLIST.some((b) => name.includes(b))) return false;

  if (subtypes.includes("pawn shop") || category.includes("pawn")) return true;

  if (name.includes("pawn") || name.includes("loan") || name.includes("cash") ||
      name.includes("empe\u00f1o") || name.includes("empeno") ||
      name.includes("buyback") || name.includes("buy-back")) return true;

  if (name.includes("exchange") &&
      (name.includes("jewelry") || name.includes("gold") || name.includes("silver"))) return true;

  return false;
}

const excluded = rows.filter((r) => !isPawnShop(r));
excluded.forEach((r) => {
  console.log("NAME:    ", r["name"] || r["Name"]);
  console.log("category:", r["category"] || r["Category"] || "(none)");
  console.log("subtypes:", r["subtypes"] || r["Subtypes"] || "(none)");
  console.log();
});
console.log(`Total excluded: ${excluded.length}`);
