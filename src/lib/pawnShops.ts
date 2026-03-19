import data from "../../data/pawn-shops-illinois.json";
import texasData from "../../data/pawn-shops-texas.json";
import floridaData from "../../data/pawn-shops-florida.json";
import newYorkData from "../../data/pawn-shops-newyork.json";
import georgiaData from "../../data/pawn-shops-georgia.json";
import arizonaData from "../../data/pawn-shops-arizona.json";
import californiaData from "../../data/pawn-shops-california.json";
import ohioData from "../../data/pawn-shops-ohio.json";
import michiganData from "../../data/pawn-shops-michigan.json";
import pennsylvaniaData from "../../data/pawn-shops-pennsylvania.json";
import northCarolinaData from "../../data/pawn-shops-northcarolina.json";
import washingtonData from "../../data/pawn-shops-washington.json";
import coloradoData from "../../data/pawn-shops-colorado.json";
import nevadaData from "../../data/pawn-shops-nevada.json";
import tennesseeData from "../../data/pawn-shops-tennessee.json";
import missouriData from "../../data/pawn-shops-missouri.json";
import indianaData from "../../data/pawn-shops-indiana.json";
import virginiaData from "../../data/pawn-shops-virginia.json";
import marylandData from "../../data/pawn-shops-maryland.json";
import louisianaData from "../../data/pawn-shops-louisiana.json";
import minnesotaData from "../../data/pawn-shops-minnesota.json";
import wisconsinData from "../../data/pawn-shops-wisconsin.json";
import southCarolinaData from "../../data/pawn-shops-southcarolina.json";
import kentuckyData from "../../data/pawn-shops-kentucky.json";
import alabamaData from "../../data/pawn-shops-alabama.json";
import oklahomaData from "../../data/pawn-shops-oklahoma.json";
import arkansasData from "../../data/pawn-shops-arkansas.json";

export interface PawnShop {
  slug: string;
  citySlug: string;
  name: string | null;
  phone: string | null;
  website: string | null;
  address: string | null;
  street: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  rating: number | null;
  reviews: number | null;
  hours: string | null;
  latitude: number | null;
  longitude: number | null;
  placeId: string | null;
  googleMapsUrl: string | null;
}

export const allShops = deduplicateSlugs(data as PawnShop[]);

export function getAllShops(): PawnShop[] {
  return allShops;
}

export function getShopsByCity(citySlug: string): PawnShop[] {
  return allShops.filter((s) => s.citySlug === citySlug);
}

export function getShopBySlug(citySlug: string, slug: string): PawnShop | undefined {
  return allShops.find((s) => s.citySlug === citySlug && s.slug === slug);
}

export function getCities(): { citySlug: string; city: string; count: number }[] {
  const map = new Map<string, { city: string; count: number }>();
  for (const shop of allShops) {
    if (!shop.citySlug || !shop.city) continue;
    const existing = map.get(shop.citySlug);
    if (existing) {
      existing.count++;
    } else {
      map.set(shop.citySlug, { city: shop.city, count: 1 });
    }
  }
  return Array.from(map.entries())
    .map(([citySlug, { city, count }]) => ({ citySlug, city, count }))
    .sort((a, b) => b.count - a.count);
}

export function parseHours(raw: string | null): { day: string; open: string; close: string }[] {
  if (!raw) return [];
  return raw.split("|").map((segment) => {
    const [day, open, close] = segment.split(",");
    return { day: day ?? "", open: open ?? "", close: close ?? "" };
  });
}

const DAY_ABBR: Record<string, string> = {
  Monday: "Mo", Tuesday: "Tu", Wednesday: "We", Thursday: "Th",
  Friday: "Fr", Saturday: "Sa", Sunday: "Su",
};

function to24h(time: string): string {
  const match = time.match(/^(\d+)(?::(\d+))?(AM|PM)$/i);
  if (!match) return time;
  let h = parseInt(match[1]);
  const m = match[2] ? parseInt(match[2]) : 0;
  const period = match[3].toUpperCase();
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function toOpeningHoursSchema(raw: string | null): string[] {
  if (!raw) return [];
  return raw.split("|").map((segment) => {
    const [day, open, close] = segment.split(",");
    const abbr = DAY_ABBR[day ?? ""] ?? day;
    return `${abbr} ${to24h(open ?? "")}–${to24h(close ?? "")}`;
  });
}

const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function condenseDays(days: string[]): string {
  if (days.length === 0) return "";
  const indices = days.map((d) => DAY_ORDER.indexOf(d)).filter((i) => i !== -1);
  if (indices.length === 0) return days.join(", ");

  // Group into consecutive runs
  const ranges: string[] = [];
  let start = indices[0];
  let prev = indices[0];

  for (let i = 1; i <= indices.length; i++) {
    const curr = indices[i];
    if (curr === prev + 1) {
      prev = curr;
    } else {
      ranges.push(
        start === prev
          ? DAY_ORDER[start]
          : `${DAY_ORDER[start]}–${DAY_ORDER[prev]}`
      );
      start = curr;
      prev = curr;
    }
  }

  return ranges.join(", ");
}

export function buildSeoDescription(shop: PawnShop): string {
  const parts: string[] = [];
  const loc = [shop.city, "Illinois"].filter(Boolean).join(", ");
  parts.push(
    `${shop.name} is a pawn shop${shop.street ? ` located at ${shop.street}` : ""} in ${loc}.`
  );
  if (shop.website) parts.push(`Visit their website at ${shop.website}.`);
  const hours = parseHours(shop.hours);
  if (hours.length > 0) {
    const days = condenseDays(hours.map((h) => h.day));
    parts.push(`They are open ${days}.`);
  }
  if (shop.rating !== null && shop.reviews !== null) {
    parts.push(`They have a ${shop.rating}-star rating based on ${shop.reviews} Google reviews.`);
  }
  return parts.join(" ");
}

export function formatAddress(shop: PawnShop): string {
  const parts = [shop.street, shop.city, shop.state, shop.zip].filter(Boolean);
  return parts.join(", ");
}

function deduplicateSlugs(shops: PawnShop[]): PawnShop[] {
  const counts = new Map<string, number>();
  return shops.map((shop) => {
    const key = `${shop.citySlug}/${shop.slug}`;
    const n = counts.get(key) ?? 0;
    counts.set(key, n + 1);
    if (n === 0) return shop;
    return { ...shop, slug: `${shop.slug}-${n + 1}` };
  });
}

// ── Texas ────────────────────────────────────────────────────────────────────

const TEXAS_CITY_OVERRIDES: Record<string, string> = {
  "Mckinney": "McKinney",
};

export const allTexasShops = deduplicateSlugs(texasData as PawnShop[]);

export function getAllTexasShops(): PawnShop[] {
  return allTexasShops;
}

export function getTexasShopsByCity(citySlug: string): PawnShop[] {
  return allTexasShops.filter((s) => s.citySlug === citySlug);
}

export function getTexasShopBySlug(citySlug: string, slug: string): PawnShop | undefined {
  return allTexasShops.find((s) => s.citySlug === citySlug && s.slug === slug);
}

export function getTexasCities(): { citySlug: string; city: string; count: number }[] {
  const map = new Map<string, { city: string; count: number }>();
  for (const shop of allTexasShops) {
    if (!shop.citySlug || !shop.city) continue;
    const city = TEXAS_CITY_OVERRIDES[shop.city] ?? shop.city;
    const existing = map.get(shop.citySlug);
    if (existing) {
      existing.count++;
    } else {
      map.set(shop.citySlug, { city, count: 1 });
    }
  }
  return Array.from(map.entries())
    .map(([citySlug, { city, count }]) => ({ citySlug, city, count }))
    .sort((a, b) => b.count - a.count);
}

export function buildTexasSeoDescription(shop: PawnShop): string {
  const parts: string[] = [];
  const city = shop.city ? (TEXAS_CITY_OVERRIDES[shop.city] ?? shop.city) : shop.city;
  const loc = [city, "Texas"].filter(Boolean).join(", ");
  parts.push(
    `${shop.name} is a pawn shop${shop.street ? ` located at ${shop.street}` : ""} in ${loc}.`
  );
  if (shop.website) parts.push(`Visit their website at ${shop.website}.`);
  const hours = parseHours(shop.hours);
  if (hours.length > 0) {
    const days = condenseDays(hours.map((h) => h.day));
    parts.push(`They are open ${days}.`);
  }
  if (shop.rating !== null && shop.reviews !== null) {
    parts.push(`They have a ${shop.rating}-star rating based on ${shop.reviews} Google reviews.`);
  }
  return parts.join(" ");
}

// ── Florida ──────────────────────────────────────────────────────────────────

const FLORIDA_CITY_OVERRIDES: Record<string, string> = {};

export const allFloridaShops = deduplicateSlugs(floridaData as PawnShop[]);

export function getAllFloridaShops(): PawnShop[] {
  return allFloridaShops;
}

export function getFloridaShopsByCity(citySlug: string): PawnShop[] {
  return allFloridaShops.filter((s) => s.citySlug === citySlug);
}

export function getFloridaShopBySlug(citySlug: string, slug: string): PawnShop | undefined {
  return allFloridaShops.find((s) => s.citySlug === citySlug && s.slug === slug);
}

export function getFloridaCities(): { citySlug: string; city: string; count: number }[] {
  const map = new Map<string, { city: string; count: number }>();
  for (const shop of allFloridaShops) {
    if (!shop.citySlug || !shop.city) continue;
    const city = FLORIDA_CITY_OVERRIDES[shop.city] ?? shop.city;
    const existing = map.get(shop.citySlug);
    if (existing) {
      existing.count++;
    } else {
      map.set(shop.citySlug, { city, count: 1 });
    }
  }
  return Array.from(map.entries())
    .map(([citySlug, { city, count }]) => ({ citySlug, city, count }))
    .sort((a, b) => b.count - a.count);
}

export function buildFloridaSeoDescription(shop: PawnShop): string {
  const parts: string[] = [];
  const city = shop.city ? (FLORIDA_CITY_OVERRIDES[shop.city] ?? shop.city) : shop.city;
  const loc = [city, "Florida"].filter(Boolean).join(", ");
  parts.push(
    `${shop.name} is a pawn shop${shop.street ? ` located at ${shop.street}` : ""} in ${loc}.`
  );
  if (shop.website) parts.push(`Visit their website at ${shop.website}.`);
  const hours = parseHours(shop.hours);
  if (hours.length > 0) {
    const days = condenseDays(hours.map((h) => h.day));
    parts.push(`They are open ${days}.`);
  }
  if (shop.rating !== null && shop.reviews !== null) {
    parts.push(`They have a ${shop.rating}-star rating based on ${shop.reviews} Google reviews.`);
  }
  return parts.join(" ");
}

// ── New York ──────────────────────────────────────────────────────────────────

const NEW_YORK_CITY_OVERRIDES: Record<string, string> = {
  "Mt Vernon": "Mount Vernon",
  "Tonawanda Town": "Tonawanda",
  "New York": "New York City",
};

export const allNewYorkShops = deduplicateSlugs(newYorkData as PawnShop[]);

export function getAllNewYorkShops(): PawnShop[] {
  return allNewYorkShops;
}

export function getNewYorkShopsByCity(citySlug: string): PawnShop[] {
  return allNewYorkShops.filter((s) => s.citySlug === citySlug);
}

export function getNewYorkShopBySlug(citySlug: string, slug: string): PawnShop | undefined {
  return allNewYorkShops.find((s) => s.citySlug === citySlug && s.slug === slug);
}

export function getNewYorkCities(): { citySlug: string; city: string; count: number }[] {
  const map = new Map<string, { city: string; count: number }>();
  for (const shop of allNewYorkShops) {
    if (!shop.citySlug || !shop.city) continue;
    const city = NEW_YORK_CITY_OVERRIDES[shop.city] ?? shop.city;
    const existing = map.get(shop.citySlug);
    if (existing) {
      existing.count++;
    } else {
      map.set(shop.citySlug, { city, count: 1 });
    }
  }
  return Array.from(map.entries())
    .map(([citySlug, { city, count }]) => ({ citySlug, city, count }))
    .sort((a, b) => b.count - a.count);
}

export function buildNewYorkSeoDescription(shop: PawnShop): string {
  const parts: string[] = [];
  const city = shop.city ? (NEW_YORK_CITY_OVERRIDES[shop.city] ?? shop.city) : shop.city;
  const loc = [city, "New York"].filter(Boolean).join(", ");
  parts.push(
    `${shop.name} is a pawn shop${shop.street ? ` located at ${shop.street}` : ""} in ${loc}.`
  );
  if (shop.website) parts.push(`Visit their website at ${shop.website}.`);
  const hours = parseHours(shop.hours);
  if (hours.length > 0) {
    const days = condenseDays(hours.map((h) => h.day));
    parts.push(`They are open ${days}.`);
  }
  if (shop.rating !== null && shop.reviews !== null) {
    parts.push(`They have a ${shop.rating}-star rating based on ${shop.reviews} Google reviews.`);
  }
  return parts.join(" ");
}

// ── Georgia ───────────────────────────────────────────────────────────────────

const GEORGIA_CITY_OVERRIDES: Record<string, string> = {
  "Mcdonough": "McDonough",
};

export const allGeorgiaShops = deduplicateSlugs(georgiaData as PawnShop[]);

export function getAllGeorgiaShops(): PawnShop[] {
  return allGeorgiaShops;
}

export function getGeorgiaShopsByCity(citySlug: string): PawnShop[] {
  return allGeorgiaShops.filter((s) => s.citySlug === citySlug);
}

export function getGeorgiaShopBySlug(citySlug: string, slug: string): PawnShop | undefined {
  return allGeorgiaShops.find((s) => s.citySlug === citySlug && s.slug === slug);
}

export function getGeorgiaCities(): { citySlug: string; city: string; count: number }[] {
  const map = new Map<string, { city: string; count: number }>();
  for (const shop of allGeorgiaShops) {
    if (!shop.citySlug || !shop.city) continue;
    const city = GEORGIA_CITY_OVERRIDES[shop.city] ?? shop.city;
    const existing = map.get(shop.citySlug);
    if (existing) {
      existing.count++;
    } else {
      map.set(shop.citySlug, { city, count: 1 });
    }
  }
  return Array.from(map.entries())
    .map(([citySlug, { city, count }]) => ({ citySlug, city, count }))
    .sort((a, b) => b.count - a.count);
}

export function buildGeorgiaSeoDescription(shop: PawnShop): string {
  const parts: string[] = [];
  const city = shop.city ? (GEORGIA_CITY_OVERRIDES[shop.city] ?? shop.city) : shop.city;
  const loc = [city, "Georgia"].filter(Boolean).join(", ");
  parts.push(
    `${shop.name} is a pawn shop${shop.street ? ` located at ${shop.street}` : ""} in ${loc}.`
  );
  if (shop.website) parts.push(`Visit their website at ${shop.website}.`);
  const hours = parseHours(shop.hours);
  if (hours.length > 0) {
    const days = condenseDays(hours.map((h) => h.day));
    parts.push(`They are open ${days}.`);
  }
  if (shop.rating !== null && shop.reviews !== null) {
    parts.push(`They have a ${shop.rating}-star rating based on ${shop.reviews} Google reviews.`);
  }
  return parts.join(" ");
}

// ── Arizona ───────────────────────────────────────────────────────────────────

const ARIZONA_CITY_OVERRIDES: Record<string, string> = {};

export const allArizonaShops = deduplicateSlugs(arizonaData as PawnShop[]);

export function getAllArizonaShops(): PawnShop[] {
  return allArizonaShops;
}

export function getArizonaShopsByCity(citySlug: string): PawnShop[] {
  return allArizonaShops.filter((s) => s.citySlug === citySlug);
}

export function getArizonaShopBySlug(citySlug: string, slug: string): PawnShop | undefined {
  return allArizonaShops.find((s) => s.citySlug === citySlug && s.slug === slug);
}

export function getArizonaCities(): { citySlug: string; city: string; count: number }[] {
  const map = new Map<string, { city: string; count: number }>();
  for (const shop of allArizonaShops) {
    if (!shop.citySlug || !shop.city) continue;
    const city = ARIZONA_CITY_OVERRIDES[shop.city] ?? shop.city;
    const existing = map.get(shop.citySlug);
    if (existing) {
      existing.count++;
    } else {
      map.set(shop.citySlug, { city, count: 1 });
    }
  }
  return Array.from(map.entries())
    .map(([citySlug, { city, count }]) => ({ citySlug, city, count }))
    .sort((a, b) => b.count - a.count);
}

export function buildArizonaSeoDescription(shop: PawnShop): string {
  const parts: string[] = [];
  const city = shop.city ? (ARIZONA_CITY_OVERRIDES[shop.city] ?? shop.city) : shop.city;
  const loc = [city, "Arizona"].filter(Boolean).join(", ");
  parts.push(
    `${shop.name} is a pawn shop${shop.street ? ` located at ${shop.street}` : ""} in ${loc}.`
  );
  if (shop.website) parts.push(`Visit their website at ${shop.website}.`);
  const hours = parseHours(shop.hours);
  if (hours.length > 0) {
    const days = condenseDays(hours.map((h) => h.day));
    parts.push(`They are open ${days}.`);
  }
  if (shop.rating !== null && shop.reviews !== null) {
    parts.push(`They have a ${shop.rating}-star rating based on ${shop.reviews} Google reviews.`);
  }
  return parts.join(" ");
}

// ── California ────────────────────────────────────────────────────────────────

const CALIFORNIA_CITY_OVERRIDES: Record<string, string> = {};

export const allCaliforniaShops = deduplicateSlugs(californiaData as PawnShop[]);

export function getAllCaliforniaShops(): PawnShop[] {
  return allCaliforniaShops;
}

export function getCaliforniaShopsByCity(citySlug: string): PawnShop[] {
  return allCaliforniaShops.filter((s) => s.citySlug === citySlug);
}

export function getCaliforniaShopBySlug(citySlug: string, slug: string): PawnShop | undefined {
  return allCaliforniaShops.find((s) => s.citySlug === citySlug && s.slug === slug);
}

export function getCaliforniaCities(): { citySlug: string; city: string; count: number }[] {
  const map = new Map<string, { city: string; count: number }>();
  for (const shop of allCaliforniaShops) {
    if (!shop.citySlug || !shop.city) continue;
    const city = CALIFORNIA_CITY_OVERRIDES[shop.city] ?? shop.city;
    const existing = map.get(shop.citySlug);
    if (existing) {
      existing.count++;
    } else {
      map.set(shop.citySlug, { city, count: 1 });
    }
  }
  return Array.from(map.entries())
    .map(([citySlug, { city, count }]) => ({ citySlug, city, count }))
    .sort((a, b) => b.count - a.count);
}

export function buildCaliforniaSeoDescription(shop: PawnShop): string {
  const parts: string[] = [];
  const city = shop.city ? (CALIFORNIA_CITY_OVERRIDES[shop.city] ?? shop.city) : shop.city;
  const loc = [city, "California"].filter(Boolean).join(", ");
  parts.push(
    `${shop.name} is a pawn shop${shop.street ? ` located at ${shop.street}` : ""} in ${loc}.`
  );
  if (shop.website) parts.push(`Visit their website at ${shop.website}.`);
  const hours = parseHours(shop.hours);
  if (hours.length > 0) {
    const days = condenseDays(hours.map((h) => h.day));
    parts.push(`They are open ${days}.`);
  }
  if (shop.rating !== null && shop.reviews !== null) {
    parts.push(`They have a ${shop.rating}-star rating based on ${shop.reviews} Google reviews.`);
  }
  return parts.join(" ");
}

// ── Ohio ──────────────────────────────────────────────────────────────────────

const OHIO_CITY_OVERRIDES: Record<string, string> = {};

export const allOhioShops = deduplicateSlugs(ohioData as PawnShop[]);

export function getAllOhioShops(): PawnShop[] {
  return allOhioShops;
}

export function getOhioShopsByCity(citySlug: string): PawnShop[] {
  return allOhioShops.filter((s) => s.citySlug === citySlug);
}

export function getOhioShopBySlug(citySlug: string, slug: string): PawnShop | undefined {
  return allOhioShops.find((s) => s.citySlug === citySlug && s.slug === slug);
}

export function getOhioCities(): { citySlug: string; city: string; count: number }[] {
  const map = new Map<string, { city: string; count: number }>();
  for (const shop of allOhioShops) {
    if (!shop.citySlug || !shop.city) continue;
    const city = OHIO_CITY_OVERRIDES[shop.city] ?? shop.city;
    const existing = map.get(shop.citySlug);
    if (existing) {
      existing.count++;
    } else {
      map.set(shop.citySlug, { city, count: 1 });
    }
  }
  return Array.from(map.entries())
    .map(([citySlug, { city, count }]) => ({ citySlug, city, count }))
    .sort((a, b) => b.count - a.count);
}

export function buildOhioSeoDescription(shop: PawnShop): string {
  const parts: string[] = [];
  const city = shop.city ? (OHIO_CITY_OVERRIDES[shop.city] ?? shop.city) : shop.city;
  const loc = [city, "Ohio"].filter(Boolean).join(", ");
  parts.push(
    `${shop.name} is a pawn shop${shop.street ? ` located at ${shop.street}` : ""} in ${loc}.`
  );
  if (shop.website) parts.push(`Visit their website at ${shop.website}.`);
  const hours = parseHours(shop.hours);
  if (hours.length > 0) {
    const days = condenseDays(hours.map((h) => h.day));
    parts.push(`They are open ${days}.`);
  }
  if (shop.rating !== null && shop.reviews !== null) {
    parts.push(`They have a ${shop.rating}-star rating based on ${shop.reviews} Google reviews.`);
  }
  return parts.join(" ");
}

// ── Michigan ──────────────────────────────────────────────────────────────────

const MICHIGAN_CITY_OVERRIDES: Record<string, string> = {
  "Mt Clemens": "Mount Clemens",
};

export const allMichiganShops = deduplicateSlugs(michiganData as PawnShop[]);

export function getAllMichiganShops(): PawnShop[] {
  return allMichiganShops;
}

export function getMichiganShopsByCity(citySlug: string): PawnShop[] {
  return allMichiganShops.filter((s) => s.citySlug === citySlug);
}

export function getMichiganShopBySlug(citySlug: string, slug: string): PawnShop | undefined {
  return allMichiganShops.find((s) => s.citySlug === citySlug && s.slug === slug);
}

export function getMichiganCities(): { citySlug: string; city: string; count: number }[] {
  const map = new Map<string, { city: string; count: number }>();
  for (const shop of allMichiganShops) {
    if (!shop.citySlug || !shop.city) continue;
    const city = MICHIGAN_CITY_OVERRIDES[shop.city] ?? shop.city;
    const existing = map.get(shop.citySlug);
    if (existing) {
      existing.count++;
    } else {
      map.set(shop.citySlug, { city, count: 1 });
    }
  }
  return Array.from(map.entries())
    .map(([citySlug, { city, count }]) => ({ citySlug, city, count }))
    .sort((a, b) => b.count - a.count);
}

export function buildMichiganSeoDescription(shop: PawnShop): string {
  const parts: string[] = [];
  const city = shop.city ? (MICHIGAN_CITY_OVERRIDES[shop.city] ?? shop.city) : shop.city;
  const loc = [city, "Michigan"].filter(Boolean).join(", ");
  parts.push(
    `${shop.name} is a pawn shop${shop.street ? ` located at ${shop.street}` : ""} in ${loc}.`
  );
  if (shop.website) parts.push(`Visit their website at ${shop.website}.`);
  const hours = parseHours(shop.hours);
  if (hours.length > 0) {
    const days = condenseDays(hours.map((h) => h.day));
    parts.push(`They are open ${days}.`);
  }
  if (shop.rating !== null && shop.reviews !== null) {
    parts.push(`They have a ${shop.rating}-star rating based on ${shop.reviews} Google reviews.`);
  }
  return parts.join(" ");
}

// ── Pennsylvania ──────────────────────────────────────────────────────────────

const PENNSYLVANIA_CITY_OVERRIDES: Record<string, string> = {
  "Mckees Rocks": "McKees Rocks",
  "North Versailles Township": "North Versailles",
  "Upper Darby Township": "Upper Darby",
  "Aston Township": "Aston",
};

export const allPennsylvaniaShops = deduplicateSlugs(pennsylvaniaData as PawnShop[]);

export function getAllPennsylvaniaShops(): PawnShop[] {
  return allPennsylvaniaShops;
}

export function getPennsylvaniaShopsByCity(citySlug: string): PawnShop[] {
  return allPennsylvaniaShops.filter((s) => s.citySlug === citySlug);
}

export function getPennsylvaniaShopBySlug(citySlug: string, slug: string): PawnShop | undefined {
  return allPennsylvaniaShops.find((s) => s.citySlug === citySlug && s.slug === slug);
}

export function getPennsylvaniaCities(): { citySlug: string; city: string; count: number }[] {
  const map = new Map<string, { city: string; count: number }>();
  for (const shop of allPennsylvaniaShops) {
    if (!shop.citySlug || !shop.city) continue;
    const city = PENNSYLVANIA_CITY_OVERRIDES[shop.city] ?? shop.city;
    const existing = map.get(shop.citySlug);
    if (existing) {
      existing.count++;
    } else {
      map.set(shop.citySlug, { city, count: 1 });
    }
  }
  return Array.from(map.entries())
    .map(([citySlug, { city, count }]) => ({ citySlug, city, count }))
    .sort((a, b) => b.count - a.count);
}

export function buildPennsylvaniaSeoDescription(shop: PawnShop): string {
  const parts: string[] = [];
  const city = shop.city ? (PENNSYLVANIA_CITY_OVERRIDES[shop.city] ?? shop.city) : shop.city;
  const loc = [city, "Pennsylvania"].filter(Boolean).join(", ");
  parts.push(
    `${shop.name} is a pawn shop${shop.street ? ` located at ${shop.street}` : ""} in ${loc}.`
  );
  if (shop.website) parts.push(`Visit their website at ${shop.website}.`);
  const hours = parseHours(shop.hours);
  if (hours.length > 0) {
    const days = condenseDays(hours.map((h) => h.day));
    parts.push(`They are open ${days}.`);
  }
  if (shop.rating !== null && shop.reviews !== null) {
    parts.push(`They have a ${shop.rating}-star rating based on ${shop.reviews} Google reviews.`);
  }
  return parts.join(" ");
}

// ── North Carolina ────────────────────────────────────────────────────────────

const NORTH_CAROLINA_CITY_OVERRIDES: Record<string, string> = {
  "Winston-salem": "Winston-Salem",
  "Mt Holly": "Mount Holly",
};

export const allNorthCarolinaShops = deduplicateSlugs(northCarolinaData as PawnShop[]);

export function getAllNorthCarolinaShops(): PawnShop[] {
  return allNorthCarolinaShops;
}

export function getNorthCarolinaShopsByCity(citySlug: string): PawnShop[] {
  return allNorthCarolinaShops.filter((s) => s.citySlug === citySlug);
}

export function getNorthCarolinaShopBySlug(citySlug: string, slug: string): PawnShop | undefined {
  return allNorthCarolinaShops.find((s) => s.citySlug === citySlug && s.slug === slug);
}

export function getNorthCarolinaCities(): { citySlug: string; city: string; count: number }[] {
  const map = new Map<string, { city: string; count: number }>();
  for (const shop of allNorthCarolinaShops) {
    if (!shop.citySlug || !shop.city) continue;
    const city = NORTH_CAROLINA_CITY_OVERRIDES[shop.city] ?? shop.city;
    const existing = map.get(shop.citySlug);
    if (existing) {
      existing.count++;
    } else {
      map.set(shop.citySlug, { city, count: 1 });
    }
  }
  return Array.from(map.entries())
    .map(([citySlug, { city, count }]) => ({ citySlug, city, count }))
    .sort((a, b) => b.count - a.count);
}

export function buildNorthCarolinaSeoDescription(shop: PawnShop): string {
  const parts: string[] = [];
  const city = shop.city ? (NORTH_CAROLINA_CITY_OVERRIDES[shop.city] ?? shop.city) : shop.city;
  const loc = [city, "North Carolina"].filter(Boolean).join(", ");
  parts.push(
    `${shop.name} is a pawn shop${shop.street ? ` located at ${shop.street}` : ""} in ${loc}.`
  );
  if (shop.website) parts.push(`Visit their website at ${shop.website}.`);
  const hours = parseHours(shop.hours);
  if (hours.length > 0) {
    const days = condenseDays(hours.map((h) => h.day));
    parts.push(`They are open ${days}.`);
  }
  if (shop.rating !== null && shop.reviews !== null) {
    parts.push(`They have a ${shop.rating}-star rating based on ${shop.reviews} Google reviews.`);
  }
  return parts.join(" ");
}

// ── Washington ────────────────────────────────────────────────────────────────

const WASHINGTON_CITY_OVERRIDES: Record<string, string> = {};

export const allWashingtonShops = deduplicateSlugs(washingtonData as PawnShop[]);

export function getAllWashingtonShops(): PawnShop[] {
  return allWashingtonShops;
}

export function getWashingtonShopsByCity(citySlug: string): PawnShop[] {
  return allWashingtonShops.filter((s) => s.citySlug === citySlug);
}

export function getWashingtonShopBySlug(citySlug: string, slug: string): PawnShop | undefined {
  return allWashingtonShops.find((s) => s.citySlug === citySlug && s.slug === slug);
}

export function getWashingtonCities(): { citySlug: string; city: string; count: number }[] {
  const map = new Map<string, { city: string; count: number }>();
  for (const shop of allWashingtonShops) {
    if (!shop.citySlug || !shop.city) continue;
    const city = WASHINGTON_CITY_OVERRIDES[shop.city] ?? shop.city;
    const existing = map.get(shop.citySlug);
    if (existing) {
      existing.count++;
    } else {
      map.set(shop.citySlug, { city, count: 1 });
    }
  }
  return Array.from(map.entries())
    .map(([citySlug, { city, count }]) => ({ citySlug, city, count }))
    .sort((a, b) => b.count - a.count);
}

export function buildWashingtonSeoDescription(shop: PawnShop): string {
  const parts: string[] = [];
  const city = shop.city ? (WASHINGTON_CITY_OVERRIDES[shop.city] ?? shop.city) : shop.city;
  const loc = [city, "Washington"].filter(Boolean).join(", ");
  parts.push(
    `${shop.name} is a pawn shop${shop.street ? ` located at ${shop.street}` : ""} in ${loc}.`
  );
  if (shop.website) parts.push(`Visit their website at ${shop.website}.`);
  const hours = parseHours(shop.hours);
  if (hours.length > 0) {
    const days = condenseDays(hours.map((h) => h.day));
    parts.push(`They are open ${days}.`);
  }
  if (shop.rating !== null && shop.reviews !== null) {
    parts.push(`They have a ${shop.rating}-star rating based on ${shop.reviews} Google reviews.`);
  }
  return parts.join(" ");
}

// ── Colorado ──────────────────────────────────────────────────────────────────

const COLORADO_CITY_OVERRIDES: Record<string, string> = {};

export const allColoradoShops = deduplicateSlugs(coloradoData as PawnShop[]);

export function getAllColoradoShops(): PawnShop[] {
  return allColoradoShops;
}

export function getColoradoShopsByCity(citySlug: string): PawnShop[] {
  return allColoradoShops.filter((s) => s.citySlug === citySlug);
}

export function getColoradoShopBySlug(citySlug: string, slug: string): PawnShop | undefined {
  return allColoradoShops.find((s) => s.citySlug === citySlug && s.slug === slug);
}

export function getColoradoCities(): { citySlug: string; city: string; count: number }[] {
  const map = new Map<string, { city: string; count: number }>();
  for (const shop of allColoradoShops) {
    if (!shop.citySlug || !shop.city) continue;
    const city = COLORADO_CITY_OVERRIDES[shop.city] ?? shop.city;
    const existing = map.get(shop.citySlug);
    if (existing) {
      existing.count++;
    } else {
      map.set(shop.citySlug, { city, count: 1 });
    }
  }
  return Array.from(map.entries())
    .map(([citySlug, { city, count }]) => ({ citySlug, city, count }))
    .sort((a, b) => b.count - a.count);
}

export function buildColoradoSeoDescription(shop: PawnShop): string {
  const parts: string[] = [];
  const city = shop.city ? (COLORADO_CITY_OVERRIDES[shop.city] ?? shop.city) : shop.city;
  const loc = [city, "Colorado"].filter(Boolean).join(", ");
  parts.push(
    `${shop.name} is a pawn shop${shop.street ? ` located at ${shop.street}` : ""} in ${loc}.`
  );
  if (shop.website) parts.push(`Visit their website at ${shop.website}.`);
  const hours = parseHours(shop.hours);
  if (hours.length > 0) {
    const days = condenseDays(hours.map((h) => h.day));
    parts.push(`They are open ${days}.`);
  }
  if (shop.rating !== null && shop.reviews !== null) {
    parts.push(`They have a ${shop.rating}-star rating based on ${shop.reviews} Google reviews.`);
  }
  return parts.join(" ");
}

// ── Nevada ────────────────────────────────────────────────────────────────────

const NEVADA_CITY_OVERRIDES: Record<string, string> = {};

export const allNevadaShops = deduplicateSlugs(nevadaData as PawnShop[]);

export function getAllNevadaShops(): PawnShop[] {
  return allNevadaShops;
}

export function getNevadaShopsByCity(citySlug: string): PawnShop[] {
  return allNevadaShops.filter((s) => s.citySlug === citySlug);
}

export function getNevadaShopBySlug(citySlug: string, slug: string): PawnShop | undefined {
  return allNevadaShops.find((s) => s.citySlug === citySlug && s.slug === slug);
}

export function getNevadaCities(): { citySlug: string; city: string; count: number }[] {
  const map = new Map<string, { city: string; count: number }>();
  for (const shop of allNevadaShops) {
    if (!shop.citySlug || !shop.city) continue;
    const city = NEVADA_CITY_OVERRIDES[shop.city] ?? shop.city;
    const existing = map.get(shop.citySlug);
    if (existing) {
      existing.count++;
    } else {
      map.set(shop.citySlug, { city, count: 1 });
    }
  }
  return Array.from(map.entries())
    .map(([citySlug, { city, count }]) => ({ citySlug, city, count }))
    .sort((a, b) => b.count - a.count);
}

export function buildNevadaSeoDescription(shop: PawnShop): string {
  const parts: string[] = [];
  const city = shop.city ? (NEVADA_CITY_OVERRIDES[shop.city] ?? shop.city) : shop.city;
  const loc = [city, "Nevada"].filter(Boolean).join(", ");
  parts.push(
    `${shop.name} is a pawn shop${shop.street ? ` located at ${shop.street}` : ""} in ${loc}.`
  );
  if (shop.website) parts.push(`Visit their website at ${shop.website}.`);
  const hours = parseHours(shop.hours);
  if (hours.length > 0) {
    const days = condenseDays(hours.map((h) => h.day));
    parts.push(`They are open ${days}.`);
  }
  if (shop.rating !== null && shop.reviews !== null) {
    parts.push(`They have a ${shop.rating}-star rating based on ${shop.reviews} Google reviews.`);
  }
  return parts.join(" ");
}

// ── Tennessee ─────────────────────────────────────────────────────────────────

const TENNESSEE_CITY_OVERRIDES: Record<string, string> = {};

export const allTennesseeShops = deduplicateSlugs(tennesseeData as PawnShop[]);

export function getAllTennesseeShops(): PawnShop[] {
  return allTennesseeShops;
}

export function getTennesseeShopsByCity(citySlug: string): PawnShop[] {
  return allTennesseeShops.filter((s) => s.citySlug === citySlug);
}

export function getTennesseeShopBySlug(citySlug: string, slug: string): PawnShop | undefined {
  return allTennesseeShops.find((s) => s.citySlug === citySlug && s.slug === slug);
}

export function getTennesseeCities(): { citySlug: string; city: string; count: number }[] {
  const map = new Map<string, { city: string; count: number }>();
  for (const shop of allTennesseeShops) {
    if (!shop.citySlug || !shop.city) continue;
    const city = TENNESSEE_CITY_OVERRIDES[shop.city] ?? shop.city;
    const existing = map.get(shop.citySlug);
    if (existing) {
      existing.count++;
    } else {
      map.set(shop.citySlug, { city, count: 1 });
    }
  }
  return Array.from(map.entries())
    .map(([citySlug, { city, count }]) => ({ citySlug, city, count }))
    .sort((a, b) => b.count - a.count);
}

export function buildTennesseeSeoDescription(shop: PawnShop): string {
  const parts: string[] = [];
  const city = shop.city ? (TENNESSEE_CITY_OVERRIDES[shop.city] ?? shop.city) : shop.city;
  const loc = [city, "Tennessee"].filter(Boolean).join(", ");
  parts.push(
    `${shop.name} is a pawn shop${shop.street ? ` located at ${shop.street}` : ""} in ${loc}.`
  );
  if (shop.website) parts.push(`Visit their website at ${shop.website}.`);
  const hours = parseHours(shop.hours);
  if (hours.length > 0) {
    const days = condenseDays(hours.map((h) => h.day));
    parts.push(`They are open ${days}.`);
  }
  if (shop.rating !== null && shop.reviews !== null) {
    parts.push(`They have a ${shop.rating}-star rating based on ${shop.reviews} Google reviews.`);
  }
  return parts.join(" ");
}

// ── Missouri ──────────────────────────────────────────────────────────────────

const MISSOURI_CITY_OVERRIDES: Record<string, string> = {
  "St Charles": "St. Charles",
  "St Joseph": "St. Joseph",
  "St Peters": "St. Peters",
  "St Robert": "St. Robert",
};

export const allMissouriShops = deduplicateSlugs(missouriData as PawnShop[]);

export function getAllMissouriShops(): PawnShop[] {
  return allMissouriShops;
}

export function getMissouriShopsByCity(citySlug: string): PawnShop[] {
  return allMissouriShops.filter((s) => s.citySlug === citySlug);
}

export function getMissouriShopBySlug(citySlug: string, slug: string): PawnShop | undefined {
  return allMissouriShops.find((s) => s.citySlug === citySlug && s.slug === slug);
}

export function getMissouriCities(): { citySlug: string; city: string; count: number }[] {
  const map = new Map<string, { city: string; count: number }>();
  for (const shop of allMissouriShops) {
    if (!shop.citySlug || !shop.city) continue;
    const city = MISSOURI_CITY_OVERRIDES[shop.city] ?? shop.city;
    const existing = map.get(shop.citySlug);
    if (existing) {
      existing.count++;
    } else {
      map.set(shop.citySlug, { city, count: 1 });
    }
  }
  return Array.from(map.entries())
    .map(([citySlug, { city, count }]) => ({ citySlug, city, count }))
    .sort((a, b) => b.count - a.count);
}

export function buildMissouriSeoDescription(shop: PawnShop): string {
  const parts: string[] = [];
  const city = shop.city ? (MISSOURI_CITY_OVERRIDES[shop.city] ?? shop.city) : shop.city;
  const loc = [city, "Missouri"].filter(Boolean).join(", ");
  parts.push(
    `${shop.name} is a pawn shop${shop.street ? ` located at ${shop.street}` : ""} in ${loc}.`
  );
  if (shop.website) parts.push(`Visit their website at ${shop.website}.`);
  const hours = parseHours(shop.hours);
  if (hours.length > 0) {
    const days = condenseDays(hours.map((h) => h.day));
    parts.push(`They are open ${days}.`);
  }
  if (shop.rating !== null && shop.reviews !== null) {
    parts.push(`They have a ${shop.rating}-star rating based on ${shop.reviews} Google reviews.`);
  }
  return parts.join(" ");
}

// ── Indiana ───────────────────────────────────────────────────────────────────

const INDIANA_CITY_OVERRIDES: Record<string, string> = {};

export const allIndianaShops = deduplicateSlugs(indianaData as PawnShop[]);

export function getAllIndianaShops(): PawnShop[] {
  return allIndianaShops;
}

export function getIndianaShopsByCity(citySlug: string): PawnShop[] {
  return allIndianaShops.filter((s) => s.citySlug === citySlug);
}

export function getIndianaShopBySlug(citySlug: string, slug: string): PawnShop | undefined {
  return allIndianaShops.find((s) => s.citySlug === citySlug && s.slug === slug);
}

export function getIndianaCities(): { citySlug: string; city: string; count: number }[] {
  const map = new Map<string, { city: string; count: number }>();
  for (const shop of allIndianaShops) {
    if (!shop.citySlug || !shop.city) continue;
    const city = INDIANA_CITY_OVERRIDES[shop.city] ?? shop.city;
    const existing = map.get(shop.citySlug);
    if (existing) {
      existing.count++;
    } else {
      map.set(shop.citySlug, { city, count: 1 });
    }
  }
  return Array.from(map.entries())
    .map(([citySlug, { city, count }]) => ({ citySlug, city, count }))
    .sort((a, b) => b.count - a.count);
}

export function buildIndianaSeoDescription(shop: PawnShop): string {
  const parts: string[] = [];
  const city = shop.city ? (INDIANA_CITY_OVERRIDES[shop.city] ?? shop.city) : shop.city;
  const loc = [city, "Indiana"].filter(Boolean).join(", ");
  parts.push(
    `${shop.name} is a pawn shop${shop.street ? ` located at ${shop.street}` : ""} in ${loc}.`
  );
  if (shop.website) parts.push(`Visit their website at ${shop.website}.`);
  const hours = parseHours(shop.hours);
  if (hours.length > 0) {
    const days = condenseDays(hours.map((h) => h.day));
    parts.push(`They are open ${days}.`);
  }
  if (shop.rating !== null && shop.reviews !== null) {
    parts.push(`They have a ${shop.rating}-star rating based on ${shop.reviews} Google reviews.`);
  }
  return parts.join(" ");
}

// ── Virginia ──────────────────────────────────────────────────────────────────

const VIRGINIA_CITY_OVERRIDES: Record<string, string> = {};

export const allVirginiaShops = deduplicateSlugs(virginiaData as PawnShop[]);

export function getAllVirginiaShops(): PawnShop[] {
  return allVirginiaShops;
}

export function getVirginiaShopsByCity(citySlug: string): PawnShop[] {
  return allVirginiaShops.filter((s) => s.citySlug === citySlug);
}

export function getVirginiaShopBySlug(citySlug: string, slug: string): PawnShop | undefined {
  return allVirginiaShops.find((s) => s.citySlug === citySlug && s.slug === slug);
}

export function getVirginiaCities(): { citySlug: string; city: string; count: number }[] {
  const map = new Map<string, { city: string; count: number }>();
  for (const shop of allVirginiaShops) {
    if (!shop.citySlug || !shop.city) continue;
    const city = VIRGINIA_CITY_OVERRIDES[shop.city] ?? shop.city;
    const existing = map.get(shop.citySlug);
    if (existing) {
      existing.count++;
    } else {
      map.set(shop.citySlug, { city, count: 1 });
    }
  }
  return Array.from(map.entries())
    .map(([citySlug, { city, count }]) => ({ citySlug, city, count }))
    .sort((a, b) => b.count - a.count);
}

export function buildVirginiaSeoDescription(shop: PawnShop): string {
  const parts: string[] = [];
  const city = shop.city ? (VIRGINIA_CITY_OVERRIDES[shop.city] ?? shop.city) : shop.city;
  const loc = [city, "Virginia"].filter(Boolean).join(", ");
  parts.push(
    `${shop.name} is a pawn shop${shop.street ? ` located at ${shop.street}` : ""} in ${loc}.`
  );
  if (shop.website) parts.push(`Visit their website at ${shop.website}.`);
  const hours = parseHours(shop.hours);
  if (hours.length > 0) {
    const days = condenseDays(hours.map((h) => h.day));
    parts.push(`They are open ${days}.`);
  }
  if (shop.rating !== null && shop.reviews !== null) {
    parts.push(`They have a ${shop.rating}-star rating based on ${shop.reviews} Google reviews.`);
  }
  return parts.join(" ");
}

// ── Maryland ──────────────────────────────────────────────────────────────────

const MARYLAND_CITY_OVERRIDES: Record<string, string> = {};

export const allMarylandShops = deduplicateSlugs(marylandData as PawnShop[]);

export function getAllMarylandShops(): PawnShop[] {
  return allMarylandShops;
}

export function getMarylandShopsByCity(citySlug: string): PawnShop[] {
  return allMarylandShops.filter((s) => s.citySlug === citySlug);
}

export function getMarylandShopBySlug(citySlug: string, slug: string): PawnShop | undefined {
  return allMarylandShops.find((s) => s.citySlug === citySlug && s.slug === slug);
}

export function getMarylandCities(): { citySlug: string; city: string; count: number }[] {
  const map = new Map<string, { city: string; count: number }>();
  for (const shop of allMarylandShops) {
    if (!shop.citySlug || !shop.city) continue;
    const city = MARYLAND_CITY_OVERRIDES[shop.city] ?? shop.city;
    const existing = map.get(shop.citySlug);
    if (existing) {
      existing.count++;
    } else {
      map.set(shop.citySlug, { city, count: 1 });
    }
  }
  return Array.from(map.entries())
    .map(([citySlug, { city, count }]) => ({ citySlug, city, count }))
    .sort((a, b) => b.count - a.count);
}

export function buildMarylandSeoDescription(shop: PawnShop): string {
  const parts: string[] = [];
  const city = shop.city ? (MARYLAND_CITY_OVERRIDES[shop.city] ?? shop.city) : shop.city;
  const loc = [city, "Maryland"].filter(Boolean).join(", ");
  parts.push(
    `${shop.name} is a pawn shop${shop.street ? ` located at ${shop.street}` : ""} in ${loc}.`
  );
  if (shop.website) parts.push(`Visit their website at ${shop.website}.`);
  const hours = parseHours(shop.hours);
  if (hours.length > 0) {
    const days = condenseDays(hours.map((h) => h.day));
    parts.push(`They are open ${days}.`);
  }
  if (shop.rating !== null && shop.reviews !== null) {
    parts.push(`They have a ${shop.rating}-star rating based on ${shop.reviews} Google reviews.`);
  }
  return parts.join(" ");
}

// ── Louisiana ─────────────────────────────────────────────────────────────────

const LOUISIANA_CITY_OVERRIDES: Record<string, string> = {
  "Laplace": "LaPlace",
};

export const allLouisianaShops = deduplicateSlugs(louisianaData as PawnShop[]);

export function getAllLouisianaShops(): PawnShop[] {
  return allLouisianaShops;
}

export function getLouisianaShopsByCity(citySlug: string): PawnShop[] {
  return allLouisianaShops.filter((s) => s.citySlug === citySlug);
}

export function getLouisianaShopBySlug(citySlug: string, slug: string): PawnShop | undefined {
  return allLouisianaShops.find((s) => s.citySlug === citySlug && s.slug === slug);
}

export function getLouisianaCities(): { citySlug: string; city: string; count: number }[] {
  const map = new Map<string, { city: string; count: number }>();
  for (const shop of allLouisianaShops) {
    if (!shop.citySlug || !shop.city) continue;
    const city = LOUISIANA_CITY_OVERRIDES[shop.city] ?? shop.city;
    const existing = map.get(shop.citySlug);
    if (existing) {
      existing.count++;
    } else {
      map.set(shop.citySlug, { city, count: 1 });
    }
  }
  return Array.from(map.entries())
    .map(([citySlug, { city, count }]) => ({ citySlug, city, count }))
    .sort((a, b) => b.count - a.count);
}

export function buildLouisianaSeoDescription(shop: PawnShop): string {
  const parts: string[] = [];
  const city = shop.city ? (LOUISIANA_CITY_OVERRIDES[shop.city] ?? shop.city) : shop.city;
  const loc = [city, "Louisiana"].filter(Boolean).join(", ");
  parts.push(
    `${shop.name} is a pawn shop${shop.street ? ` located at ${shop.street}` : ""} in ${loc}.`
  );
  if (shop.website) parts.push(`Visit their website at ${shop.website}.`);
  const hours = parseHours(shop.hours);
  if (hours.length > 0) {
    const days = condenseDays(hours.map((h) => h.day));
    parts.push(`They are open ${days}.`);
  }
  if (shop.rating !== null && shop.reviews !== null) {
    parts.push(`They have a ${shop.rating}-star rating based on ${shop.reviews} Google reviews.`);
  }
  return parts.join(" ");
}

// ── Minnesota ─────────────────────────────────────────────────────────────────

const MINNESOTA_CITY_OVERRIDES: Record<string, string> = {
  "St Paul": "St. Paul",
  "St Cloud": "St. Cloud",
  "West St Paul": "West St. Paul",
  "North St Paul": "North St. Paul",
  "St Louis Park": "St. Louis Park",
};

export const allMinnesotaShops = deduplicateSlugs(minnesotaData as PawnShop[]);

export function getAllMinnesotaShops(): PawnShop[] {
  return allMinnesotaShops;
}

export function getMinnesotaShopsByCity(citySlug: string): PawnShop[] {
  return allMinnesotaShops.filter((s) => s.citySlug === citySlug);
}

export function getMinnesotaShopBySlug(citySlug: string, slug: string): PawnShop | undefined {
  return allMinnesotaShops.find((s) => s.citySlug === citySlug && s.slug === slug);
}

export function getMinnesotaCities(): { citySlug: string; city: string; count: number }[] {
  const map = new Map<string, { city: string; count: number }>();
  for (const shop of allMinnesotaShops) {
    if (!shop.citySlug || !shop.city) continue;
    const city = MINNESOTA_CITY_OVERRIDES[shop.city] ?? shop.city;
    const existing = map.get(shop.citySlug);
    if (existing) {
      existing.count++;
    } else {
      map.set(shop.citySlug, { city, count: 1 });
    }
  }
  return Array.from(map.entries())
    .map(([citySlug, { city, count }]) => ({ citySlug, city, count }))
    .sort((a, b) => b.count - a.count);
}

export function buildMinnesotaSeoDescription(shop: PawnShop): string {
  const parts: string[] = [];
  const city = shop.city ? (MINNESOTA_CITY_OVERRIDES[shop.city] ?? shop.city) : shop.city;
  const loc = [city, "Minnesota"].filter(Boolean).join(", ");
  parts.push(
    `${shop.name} is a pawn shop${shop.street ? ` located at ${shop.street}` : ""} in ${loc}.`
  );
  if (shop.website) parts.push(`Visit their website at ${shop.website}.`);
  const hours = parseHours(shop.hours);
  if (hours.length > 0) {
    const days = condenseDays(hours.map((h) => h.day));
    parts.push(`They are open ${days}.`);
  }
  if (shop.rating !== null && shop.reviews !== null) {
    parts.push(`They have a ${shop.rating}-star rating based on ${shop.reviews} Google reviews.`);
  }
  return parts.join(" ");
}

// ── Wisconsin ─────────────────────────────────────────────────────────────────

const WISCONSIN_CITY_OVERRIDES: Record<string, string> = {};

export const allWisconsinShops = deduplicateSlugs(wisconsinData as PawnShop[]);

export function getAllWisconsinShops(): PawnShop[] {
  return allWisconsinShops;
}

export function getWisconsinShopsByCity(citySlug: string): PawnShop[] {
  return allWisconsinShops.filter((s) => s.citySlug === citySlug);
}

export function getWisconsinShopBySlug(citySlug: string, slug: string): PawnShop | undefined {
  return allWisconsinShops.find((s) => s.citySlug === citySlug && s.slug === slug);
}

export function getWisconsinCities(): { citySlug: string; city: string; count: number }[] {
  const map = new Map<string, { city: string; count: number }>();
  for (const shop of allWisconsinShops) {
    if (!shop.citySlug || !shop.city) continue;
    const city = WISCONSIN_CITY_OVERRIDES[shop.city] ?? shop.city;
    const existing = map.get(shop.citySlug);
    if (existing) {
      existing.count++;
    } else {
      map.set(shop.citySlug, { city, count: 1 });
    }
  }
  return Array.from(map.entries())
    .map(([citySlug, { city, count }]) => ({ citySlug, city, count }))
    .sort((a, b) => b.count - a.count);
}

export function buildWisconsinSeoDescription(shop: PawnShop): string {
  const parts: string[] = [];
  const city = shop.city ? (WISCONSIN_CITY_OVERRIDES[shop.city] ?? shop.city) : shop.city;
  const loc = [city, "Wisconsin"].filter(Boolean).join(", ");
  parts.push(
    `${shop.name} is a pawn shop${shop.street ? ` located at ${shop.street}` : ""} in ${loc}.`
  );
  if (shop.website) parts.push(`Visit their website at ${shop.website}.`);
  const hours = parseHours(shop.hours);
  if (hours.length > 0) {
    const days = condenseDays(hours.map((h) => h.day));
    parts.push(`They are open ${days}.`);
  }
  if (shop.rating !== null && shop.reviews !== null) {
    parts.push(`They have a ${shop.rating}-star rating based on ${shop.reviews} Google reviews.`);
  }
  return parts.join(" ");
}

// ── South Carolina ────────────────────────────────────────────────────────────

const SOUTH_CAROLINA_CITY_OVERRIDES: Record<string, string> = {
  "Mt Pleasant": "Mount Pleasant",
};

export const allSouthCarolinaShops = deduplicateSlugs(southCarolinaData as PawnShop[]);

export function getAllSouthCarolinaShops(): PawnShop[] {
  return allSouthCarolinaShops;
}

export function getSouthCarolinaShopsByCity(citySlug: string): PawnShop[] {
  return allSouthCarolinaShops.filter((s) => s.citySlug === citySlug);
}

export function getSouthCarolinaShopBySlug(citySlug: string, slug: string): PawnShop | undefined {
  return allSouthCarolinaShops.find((s) => s.citySlug === citySlug && s.slug === slug);
}

export function getSouthCarolinaCities(): { citySlug: string; city: string; count: number }[] {
  const map = new Map<string, { city: string; count: number }>();
  for (const shop of allSouthCarolinaShops) {
    if (!shop.citySlug || !shop.city) continue;
    const city = SOUTH_CAROLINA_CITY_OVERRIDES[shop.city] ?? shop.city;
    const existing = map.get(shop.citySlug);
    if (existing) {
      existing.count++;
    } else {
      map.set(shop.citySlug, { city, count: 1 });
    }
  }
  return Array.from(map.entries())
    .map(([citySlug, { city, count }]) => ({ citySlug, city, count }))
    .sort((a, b) => b.count - a.count);
}

export function buildSouthCarolinaSeoDescription(shop: PawnShop): string {
  const parts: string[] = [];
  const city = shop.city ? (SOUTH_CAROLINA_CITY_OVERRIDES[shop.city] ?? shop.city) : shop.city;
  const loc = [city, "South Carolina"].filter(Boolean).join(", ");
  parts.push(
    `${shop.name} is a pawn shop${shop.street ? ` located at ${shop.street}` : ""} in ${loc}.`
  );
  if (shop.website) parts.push(`Visit their website at ${shop.website}.`);
  const hours = parseHours(shop.hours);
  if (hours.length > 0) {
    const days = condenseDays(hours.map((h) => h.day));
    parts.push(`They are open ${days}.`);
  }
  if (shop.rating !== null && shop.reviews !== null) {
    parts.push(`They have a ${shop.rating}-star rating based on ${shop.reviews} Google reviews.`);
  }
  return parts.join(" ");
}

// ── Kentucky ──────────────────────────────────────────────────────────────────

const KENTUCKY_CITY_OVERRIDES: Record<string, string> = {};

export const allKentuckyShops = deduplicateSlugs(kentuckyData as PawnShop[]);

export function getAllKentuckyShops(): PawnShop[] {
  return allKentuckyShops;
}

export function getKentuckyShopsByCity(citySlug: string): PawnShop[] {
  return allKentuckyShops.filter((s) => s.citySlug === citySlug);
}

export function getKentuckyShopBySlug(citySlug: string, slug: string): PawnShop | undefined {
  return allKentuckyShops.find((s) => s.citySlug === citySlug && s.slug === slug);
}

export function getKentuckyCities(): { citySlug: string; city: string; count: number }[] {
  const map = new Map<string, { city: string; count: number }>();
  for (const shop of allKentuckyShops) {
    if (!shop.citySlug || !shop.city) continue;
    const city = KENTUCKY_CITY_OVERRIDES[shop.city] ?? shop.city;
    const existing = map.get(shop.citySlug);
    if (existing) {
      existing.count++;
    } else {
      map.set(shop.citySlug, { city, count: 1 });
    }
  }
  return Array.from(map.entries())
    .map(([citySlug, { city, count }]) => ({ citySlug, city, count }))
    .sort((a, b) => b.count - a.count);
}

export function buildKentuckySeoDescription(shop: PawnShop): string {
  const parts: string[] = [];
  const city = shop.city ? (KENTUCKY_CITY_OVERRIDES[shop.city] ?? shop.city) : shop.city;
  const loc = [city, "Kentucky"].filter(Boolean).join(", ");
  parts.push(
    `${shop.name} is a pawn shop${shop.street ? ` located at ${shop.street}` : ""} in ${loc}.`
  );
  if (shop.website) parts.push(`Visit their website at ${shop.website}.`);
  const hours = parseHours(shop.hours);
  if (hours.length > 0) {
    const days = condenseDays(hours.map((h) => h.day));
    parts.push(`They are open ${days}.`);
  }
  if (shop.rating !== null && shop.reviews !== null) {
    parts.push(`They have a ${shop.rating}-star rating based on ${shop.reviews} Google reviews.`);
  }
  return parts.join(" ");
}

// ── Alabama ───────────────────────────────────────────────────────────────────

const ALABAMA_CITY_OVERRIDES: Record<string, string> = {};

export const allAlabamaShops = deduplicateSlugs(alabamaData as PawnShop[]);

export function getAllAlabamaShops(): PawnShop[] {
  return allAlabamaShops;
}

export function getAlabamaShopsByCity(citySlug: string): PawnShop[] {
  return allAlabamaShops.filter((s) => s.citySlug === citySlug);
}

export function getAlabamaShopBySlug(citySlug: string, slug: string): PawnShop | undefined {
  return allAlabamaShops.find((s) => s.citySlug === citySlug && s.slug === slug);
}

export function getAlabamaCities(): { citySlug: string; city: string; count: number }[] {
  const map = new Map<string, { city: string; count: number }>();
  for (const shop of allAlabamaShops) {
    if (!shop.citySlug || !shop.city) continue;
    const city = ALABAMA_CITY_OVERRIDES[shop.city] ?? shop.city;
    const existing = map.get(shop.citySlug);
    if (existing) {
      existing.count++;
    } else {
      map.set(shop.citySlug, { city, count: 1 });
    }
  }
  return Array.from(map.entries())
    .map(([citySlug, { city, count }]) => ({ citySlug, city, count }))
    .sort((a, b) => b.count - a.count);
}

export function buildAlabamaSeoDescription(shop: PawnShop): string {
  const parts: string[] = [];
  const city = shop.city ? (ALABAMA_CITY_OVERRIDES[shop.city] ?? shop.city) : shop.city;
  const loc = [city, "Alabama"].filter(Boolean).join(", ");
  parts.push(
    `${shop.name} is a pawn shop${shop.street ? ` located at ${shop.street}` : ""} in ${loc}.`
  );
  if (shop.website) parts.push(`Visit their website at ${shop.website}.`);
  const hours = parseHours(shop.hours);
  if (hours.length > 0) {
    const days = condenseDays(hours.map((h) => h.day));
    parts.push(`They are open ${days}.`);
  }
  if (shop.rating !== null && shop.reviews !== null) {
    parts.push(`They have a ${shop.rating}-star rating based on ${shop.reviews} Google reviews.`);
  }
  return parts.join(" ");
}

// ── Oklahoma ──────────────────────────────────────────────────────────────────

const OKLAHOMA_CITY_OVERRIDES: Record<string, string> = {};

export const allOklahomaShops = deduplicateSlugs(oklahomaData as PawnShop[]);

export function getAllOklahomaShops(): PawnShop[] {
  return allOklahomaShops;
}

export function getOklahomaShopsByCity(citySlug: string): PawnShop[] {
  return allOklahomaShops.filter((s) => s.citySlug === citySlug);
}

export function getOklahomaShopBySlug(citySlug: string, slug: string): PawnShop | undefined {
  return allOklahomaShops.find((s) => s.citySlug === citySlug && s.slug === slug);
}

export function getOklahomaCities(): { citySlug: string; city: string; count: number }[] {
  const map = new Map<string, { city: string; count: number }>();
  for (const shop of allOklahomaShops) {
    if (!shop.citySlug || !shop.city) continue;
    const city = OKLAHOMA_CITY_OVERRIDES[shop.city] ?? shop.city;
    const existing = map.get(shop.citySlug);
    if (existing) {
      existing.count++;
    } else {
      map.set(shop.citySlug, { city, count: 1 });
    }
  }
  return Array.from(map.entries())
    .map(([citySlug, { city, count }]) => ({ citySlug, city, count }))
    .sort((a, b) => b.count - a.count);
}

export function buildOklahomaSeoDescription(shop: PawnShop): string {
  const parts: string[] = [];
  const city = shop.city ? (OKLAHOMA_CITY_OVERRIDES[shop.city] ?? shop.city) : shop.city;
  const loc = [city, "Oklahoma"].filter(Boolean).join(", ");
  parts.push(
    `${shop.name} is a pawn shop${shop.street ? ` located at ${shop.street}` : ""} in ${loc}.`
  );
  if (shop.website) parts.push(`Visit their website at ${shop.website}.`);
  const hours = parseHours(shop.hours);
  if (hours.length > 0) {
    const days = condenseDays(hours.map((h) => h.day));
    parts.push(`They are open ${days}.`);
  }
  if (shop.rating !== null && shop.reviews !== null) {
    parts.push(`They have a ${shop.rating}-star rating based on ${shop.reviews} Google reviews.`);
  }
  return parts.join(" ");
}

// ── Arkansas ──────────────────────────────────────────────────────────────────

const ARKANSAS_CITY_OVERRIDES: Record<string, string> = {};

export const allArkansasShops = deduplicateSlugs(arkansasData as PawnShop[]);

export function getAllArkansasShops(): PawnShop[] {
  return allArkansasShops;
}

export function getArkansasShopsByCity(citySlug: string): PawnShop[] {
  return allArkansasShops.filter((s) => s.citySlug === citySlug);
}

export function getArkansasShopBySlug(citySlug: string, slug: string): PawnShop | undefined {
  return allArkansasShops.find((s) => s.citySlug === citySlug && s.slug === slug);
}

export function getArkansasCities(): { citySlug: string; city: string; count: number }[] {
  const map = new Map<string, { city: string; count: number }>();
  for (const shop of allArkansasShops) {
    if (!shop.citySlug || !shop.city) continue;
    const city = ARKANSAS_CITY_OVERRIDES[shop.city] ?? shop.city;
    const existing = map.get(shop.citySlug);
    if (existing) {
      existing.count++;
    } else {
      map.set(shop.citySlug, { city, count: 1 });
    }
  }
  return Array.from(map.entries())
    .map(([citySlug, { city, count }]) => ({ citySlug, city, count }))
    .sort((a, b) => b.count - a.count);
}

export function buildArkansasSeoDescription(shop: PawnShop): string {
  const parts: string[] = [];
  const city = shop.city ? (ARKANSAS_CITY_OVERRIDES[shop.city] ?? shop.city) : shop.city;
  const loc = [city, "Arkansas"].filter(Boolean).join(", ");
  parts.push(
    `${shop.name} is a pawn shop${shop.street ? ` located at ${shop.street}` : ""} in ${loc}.`
  );
  if (shop.website) parts.push(`Visit their website at ${shop.website}.`);
  const hours = parseHours(shop.hours);
  if (hours.length > 0) {
    const days = condenseDays(hours.map((h) => h.day));
    parts.push(`They are open ${days}.`);
  }
  if (shop.rating !== null && shop.reviews !== null) {
    parts.push(`They have a ${shop.rating}-star rating based on ${shop.reviews} Google reviews.`);
  }
  return parts.join(" ");
}
