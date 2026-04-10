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
import utahData from "../../data/pawn-shops-utah.json";
import connecticutData from "../../data/pawn-shops-connecticut.json";
import newMexicoData from "../../data/pawn-shops-new-mexico.json";
import iowaData from "../../data/pawn-shops-iowa.json";
import kansasData from "../../data/pawn-shops-kansas.json";
import westVirginiaData from "../../data/pawn-shops-west-virginia.json";
import delawareData from "../../data/pawn-shops-delaware.json";
import idahoData from "../../data/pawn-shops-idaho.json";
import nebraskaData from "../../data/pawn-shops-nebraska.json";
import mississippiData from "../../data/pawn-shops-mississippi.json";
import newHampshireData from "../../data/pawn-shops-new-hampshire.json";
import wyomingData from "../../data/pawn-shops-wyoming.json";
import southDakotaData from "../../data/pawn-shops-south-dakota.json";
import northDakotaData from "../../data/pawn-shops-north-dakota.json";
import newJerseyData from "../../data/pawn-shops-new-jersey.json";
import oregonData from "../../data/pawn-shops-oregon.json";
import massachusettsData from "../../data/pawn-shops-massachusetts.json";
import maineData from "../../data/pawn-shops-maine.json";
import rhodeIslandData from "../../data/pawn-shops-rhode-island.json";
import alaskaData from "../../data/pawn-shops-alaska.json";
import dcData from "../../data/pawn-shops-dc.json";

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

  // New JSON format: {"Monday": ["10AM-5PM"], "Tuesday": ["Closed"], ...}
  if (raw.trim().startsWith("{")) {
    try {
      const obj = JSON.parse(raw) as Record<string, string[]>;
      return Object.entries(obj)
        .filter(([, times]) => times[0] && times[0].toLowerCase() !== "closed")
        .map(([day, times]) => {
          const dashIdx = times[0].indexOf("-");
          const open = dashIdx !== -1 ? times[0].slice(0, dashIdx) : times[0];
          const close = dashIdx !== -1 ? times[0].slice(dashIdx + 1) : "";
          return { day, open, close };
        });
    } catch {
      // fall through to pipe format
    }
  }

  // Old pipe-delimited format: "Monday,9AM,6PM|Tuesday,9AM,6PM"
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

  // New JSON format
  if (raw.trim().startsWith("{")) {
    try {
      const obj = JSON.parse(raw) as Record<string, string[]>;
      return Object.entries(obj)
        .filter(([, times]) => times[0] && times[0].toLowerCase() !== "closed")
        .map(([day, times]) => {
          const dashIdx = times[0].indexOf("-");
          const open = dashIdx !== -1 ? times[0].slice(0, dashIdx) : times[0];
          const close = dashIdx !== -1 ? times[0].slice(dashIdx + 1) : "";
          const abbr = DAY_ABBR[day] ?? day;
          return `${abbr} ${to24h(open)}–${to24h(close)}`;
        });
    } catch {
      // fall through
    }
  }

  // Old pipe-delimited format
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

// ── Utah ──────────────────────────────────────────────────────────────────────

const UTAH_CITY_OVERRIDES: Record<string, string> = {
  "St. George": "St. George",
};

export const allUtahShops = deduplicateSlugs(utahData as PawnShop[]);

export function getAllUtahShops(): PawnShop[] {
  return allUtahShops;
}

export function getUtahShopsByCity(citySlug: string): PawnShop[] {
  return allUtahShops.filter((s) => s.citySlug === citySlug);
}

export function getUtahShopBySlug(citySlug: string, slug: string): PawnShop | undefined {
  return allUtahShops.find((s) => s.citySlug === citySlug && s.slug === slug);
}

export function getUtahCities(): { citySlug: string; city: string; count: number }[] {
  const map = new Map<string, { city: string; count: number }>();
  for (const shop of allUtahShops) {
    if (!shop.citySlug || !shop.city) continue;
    const city = UTAH_CITY_OVERRIDES[shop.city] ?? shop.city;
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

export function buildUtahSeoDescription(shop: PawnShop): string {
  const parts: string[] = [];
  const city = shop.city ? (UTAH_CITY_OVERRIDES[shop.city] ?? shop.city) : shop.city;
  const loc = [city, "Utah"].filter(Boolean).join(", ");
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

// ── Connecticut ───────────────────────────────────────────────────────────────

const CONNECTICUT_CITY_OVERRIDES: Record<string, string> = {};

export const allConnecticutShops = deduplicateSlugs(connecticutData as PawnShop[]);

export function getAllConnecticutShops(): PawnShop[] {
  return allConnecticutShops;
}

export function getConnecticutShopsByCity(citySlug: string): PawnShop[] {
  return allConnecticutShops.filter((s) => s.citySlug === citySlug);
}

export function getConnecticutShopBySlug(citySlug: string, slug: string): PawnShop | undefined {
  return allConnecticutShops.find((s) => s.citySlug === citySlug && s.slug === slug);
}

export function getConnecticutCities(): { citySlug: string; city: string; count: number }[] {
  const map = new Map<string, { city: string; count: number }>();
  for (const shop of allConnecticutShops) {
    if (!shop.citySlug || !shop.city) continue;
    const city = CONNECTICUT_CITY_OVERRIDES[shop.city] ?? shop.city;
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

export function buildConnecticutSeoDescription(shop: PawnShop): string {
  const parts: string[] = [];
  const city = shop.city ? (CONNECTICUT_CITY_OVERRIDES[shop.city] ?? shop.city) : shop.city;
  const loc = [city, "Connecticut"].filter(Boolean).join(", ");
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

// ── New Mexico ────────────────────────────────────────────────────────────────

const NEW_MEXICO_CITY_OVERRIDES: Record<string, string> = {
  "Española": "Espanola",
};

export const allNewMexicoShops = deduplicateSlugs(newMexicoData as PawnShop[]);

export function getAllNewMexicoShops(): PawnShop[] {
  return allNewMexicoShops;
}

export function getNewMexicoShopsByCity(citySlug: string): PawnShop[] {
  return allNewMexicoShops.filter((s) => s.citySlug === citySlug);
}

export function getNewMexicoShopBySlug(citySlug: string, slug: string): PawnShop | undefined {
  return allNewMexicoShops.find((s) => s.citySlug === citySlug && s.slug === slug);
}

export function getNewMexicoCities(): { citySlug: string; city: string; count: number }[] {
  const map = new Map<string, { city: string; count: number }>();
  for (const shop of allNewMexicoShops) {
    if (!shop.citySlug || !shop.city) continue;
    const city = NEW_MEXICO_CITY_OVERRIDES[shop.city] ?? shop.city;
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

export function buildNewMexicoSeoDescription(shop: PawnShop): string {
  const parts: string[] = [];
  const city = shop.city ? (NEW_MEXICO_CITY_OVERRIDES[shop.city] ?? shop.city) : shop.city;
  const loc = [city, "New Mexico"].filter(Boolean).join(", ");
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

// ── Iowa ──────────────────────────────────────────────────────────────────────

const IOWA_CITY_OVERRIDES: Record<string, string> = {};

export const allIowaShops = deduplicateSlugs(iowaData as PawnShop[]);

export function getAllIowaShops(): PawnShop[] {
  return allIowaShops;
}

export function getIowaShopsByCity(citySlug: string): PawnShop[] {
  return allIowaShops.filter((s) => s.citySlug === citySlug);
}

export function getIowaShopBySlug(citySlug: string, slug: string): PawnShop | undefined {
  return allIowaShops.find((s) => s.citySlug === citySlug && s.slug === slug);
}

export function getIowaCities(): { citySlug: string; city: string; count: number }[] {
  const map = new Map<string, { city: string; count: number }>();
  for (const shop of allIowaShops) {
    if (!shop.citySlug || !shop.city) continue;
    const city = IOWA_CITY_OVERRIDES[shop.city] ?? shop.city;
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

export function buildIowaSeoDescription(shop: PawnShop): string {
  const parts: string[] = [];
  const city = shop.city ? (IOWA_CITY_OVERRIDES[shop.city] ?? shop.city) : shop.city;
  const loc = [city, "Iowa"].filter(Boolean).join(", ");
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

// ── Kansas ────────────────────────────────────────────────────────────────────

const KANSAS_CITY_OVERRIDES: Record<string, string> = {};

export const allKansasShops = deduplicateSlugs(kansasData as PawnShop[]);

export function getAllKansasShops(): PawnShop[] {
  return allKansasShops;
}

export function getKansasShopsByCity(citySlug: string): PawnShop[] {
  return allKansasShops.filter((s) => s.citySlug === citySlug);
}

export function getKansasShopBySlug(citySlug: string, slug: string): PawnShop | undefined {
  return allKansasShops.find((s) => s.citySlug === citySlug && s.slug === slug);
}

export function getKansasCities(): { citySlug: string; city: string; count: number }[] {
  const map = new Map<string, { city: string; count: number }>();
  for (const shop of allKansasShops) {
    if (!shop.citySlug || !shop.city) continue;
    const city = KANSAS_CITY_OVERRIDES[shop.city] ?? shop.city;
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

export function buildKansasSeoDescription(shop: PawnShop): string {
  const parts: string[] = [];
  const city = shop.city ? (KANSAS_CITY_OVERRIDES[shop.city] ?? shop.city) : shop.city;
  const loc = [city, "Kansas"].filter(Boolean).join(", ");
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

// ── West Virginia ─────────────────────────────────────────────────────────────

const WEST_VIRGINIA_CITY_OVERRIDES: Record<string, string> = {
  "St Albans": "St. Albans",
};

export const allWestVirginiaShops = deduplicateSlugs(westVirginiaData as PawnShop[]);

export function getAllWestVirginiaShops(): PawnShop[] {
  return allWestVirginiaShops;
}

export function getWestVirginiaShopsByCity(citySlug: string): PawnShop[] {
  return allWestVirginiaShops.filter((s) => s.citySlug === citySlug);
}

export function getWestVirginiaShopBySlug(citySlug: string, slug: string): PawnShop | undefined {
  return allWestVirginiaShops.find((s) => s.citySlug === citySlug && s.slug === slug);
}

export function getWestVirginiaCities(): { citySlug: string; city: string; count: number }[] {
  const map = new Map<string, { city: string; count: number }>();
  for (const shop of allWestVirginiaShops) {
    if (!shop.citySlug || !shop.city) continue;
    const city = WEST_VIRGINIA_CITY_OVERRIDES[shop.city] ?? shop.city;
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

export function buildWestVirginiaSeoDescription(shop: PawnShop): string {
  const parts: string[] = [];
  const city = shop.city ? (WEST_VIRGINIA_CITY_OVERRIDES[shop.city] ?? shop.city) : shop.city;
  const loc = [city, "West Virginia"].filter(Boolean).join(", ");
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

// ── Delaware ──────────────────────────────────────────────────────────────────

const DELAWARE_CITY_OVERRIDES: Record<string, string> = {};

export const allDelawareShops = deduplicateSlugs(delawareData as PawnShop[]);

export function getAllDelawareShops(): PawnShop[] {
  return allDelawareShops;
}

export function getDelawareShopsByCity(citySlug: string): PawnShop[] {
  return allDelawareShops.filter((s) => s.citySlug === citySlug);
}

export function getDelawareShopBySlug(citySlug: string, slug: string): PawnShop | undefined {
  return allDelawareShops.find((s) => s.citySlug === citySlug && s.slug === slug);
}

export function getDelawareCities(): { citySlug: string; city: string; count: number }[] {
  const map = new Map<string, { city: string; count: number }>();
  for (const shop of allDelawareShops) {
    if (!shop.citySlug || !shop.city) continue;
    const city = DELAWARE_CITY_OVERRIDES[shop.city] ?? shop.city;
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

export function buildDelawareSeoDescription(shop: PawnShop): string {
  const parts: string[] = [];
  const city = shop.city ? (DELAWARE_CITY_OVERRIDES[shop.city] ?? shop.city) : shop.city;
  const loc = [city, "Delaware"].filter(Boolean).join(", ");
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

// ── Idaho ─────────────────────────────────────────────────────────────────────

const IDAHO_CITY_OVERRIDES: Record<string, string> = {};

export const allIdahoShops = deduplicateSlugs(idahoData as PawnShop[]);

export function getAllIdahoShops(): PawnShop[] {
  return allIdahoShops;
}

export function getIdahoShopsByCity(citySlug: string): PawnShop[] {
  return allIdahoShops.filter((s) => s.citySlug === citySlug);
}

export function getIdahoShopBySlug(citySlug: string, slug: string): PawnShop | undefined {
  return allIdahoShops.find((s) => s.citySlug === citySlug && s.slug === slug);
}

export function getIdahoCities(): { citySlug: string; city: string; count: number }[] {
  const map = new Map<string, { city: string; count: number }>();
  for (const shop of allIdahoShops) {
    if (!shop.citySlug || !shop.city) continue;
    const city = IDAHO_CITY_OVERRIDES[shop.city] ?? shop.city;
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

export function buildIdahoSeoDescription(shop: PawnShop): string {
  const parts: string[] = [];
  const city = shop.city ? (IDAHO_CITY_OVERRIDES[shop.city] ?? shop.city) : shop.city;
  const loc = [city, "Idaho"].filter(Boolean).join(", ");
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

// ── Nebraska ──────────────────────────────────────────────────────────────────

const NEBRASKA_CITY_OVERRIDES: Record<string, string> = {};

export const allNebraskaShops = deduplicateSlugs(nebraskaData as PawnShop[]);

export function getAllNebraskaShops(): PawnShop[] {
  return allNebraskaShops;
}

export function getNebraskaShopsByCity(citySlug: string): PawnShop[] {
  return allNebraskaShops.filter((s) => s.citySlug === citySlug);
}

export function getNebraskaShopBySlug(citySlug: string, slug: string): PawnShop | undefined {
  return allNebraskaShops.find((s) => s.citySlug === citySlug && s.slug === slug);
}

export function getNebraskaCities(): { citySlug: string; city: string; count: number }[] {
  const map = new Map<string, { city: string; count: number }>();
  for (const shop of allNebraskaShops) {
    if (!shop.citySlug || !shop.city) continue;
    const city = NEBRASKA_CITY_OVERRIDES[shop.city] ?? shop.city;
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

export function buildNebraskaSeoDescription(shop: PawnShop): string {
  const parts: string[] = [];
  const city = shop.city ? (NEBRASKA_CITY_OVERRIDES[shop.city] ?? shop.city) : shop.city;
  const loc = [city, "Nebraska"].filter(Boolean).join(", ");
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

// ── Mississippi ───────────────────────────────────────────────────────────────

const MISSISSIPPI_CITY_OVERRIDES: Record<string, string> = {};

export const allMississippiShops = deduplicateSlugs(mississippiData as PawnShop[]);

export function getAllMississippiShops(): PawnShop[] {
  return allMississippiShops;
}

export function getMississippiShopsByCity(citySlug: string): PawnShop[] {
  return allMississippiShops.filter((s) => s.citySlug === citySlug);
}

export function getMississippiShopBySlug(citySlug: string, slug: string): PawnShop | undefined {
  return allMississippiShops.find((s) => s.citySlug === citySlug && s.slug === slug);
}

export function getMississippiCities(): { citySlug: string; city: string; count: number }[] {
  const map = new Map<string, { city: string; count: number }>();
  for (const shop of allMississippiShops) {
    if (!shop.citySlug || !shop.city) continue;
    const city = MISSISSIPPI_CITY_OVERRIDES[shop.city] ?? shop.city;
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

export function buildMississippiSeoDescription(shop: PawnShop): string {
  const parts: string[] = [];
  const city = shop.city ? (MISSISSIPPI_CITY_OVERRIDES[shop.city] ?? shop.city) : shop.city;
  const loc = [city, "Mississippi"].filter(Boolean).join(", ");
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

// ── New Hampshire ─────────────────────────────────────────────────────────────

const NEW_HAMPSHIRE_CITY_OVERRIDES: Record<string, string> = {};

export const allNewHampshireShops = deduplicateSlugs(newHampshireData as PawnShop[]);

export function getAllNewHampshireShops(): PawnShop[] {
  return allNewHampshireShops;
}

export function getNewHampshireShopsByCity(citySlug: string): PawnShop[] {
  return allNewHampshireShops.filter((s) => s.citySlug === citySlug);
}

export function getNewHampshireShopBySlug(citySlug: string, slug: string): PawnShop | undefined {
  return allNewHampshireShops.find((s) => s.citySlug === citySlug && s.slug === slug);
}

export function getNewHampshireCities(): { citySlug: string; city: string; count: number }[] {
  const map = new Map<string, { city: string; count: number }>();
  for (const shop of allNewHampshireShops) {
    if (!shop.citySlug || !shop.city) continue;
    const city = NEW_HAMPSHIRE_CITY_OVERRIDES[shop.city] ?? shop.city;
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

export function buildNewHampshireSeoDescription(shop: PawnShop): string {
  const parts: string[] = [];
  const city = shop.city ? (NEW_HAMPSHIRE_CITY_OVERRIDES[shop.city] ?? shop.city) : shop.city;
  const loc = [city, "New Hampshire"].filter(Boolean).join(", ");
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

// ── Wyoming ───────────────────────────────────────────────────────────────────

const WYOMING_CITY_OVERRIDES: Record<string, string> = {};

export const allWyomingShops = deduplicateSlugs(wyomingData as PawnShop[]);

export function getAllWyomingShops(): PawnShop[] {
  return allWyomingShops;
}

export function getWyomingShopsByCity(citySlug: string): PawnShop[] {
  return allWyomingShops.filter((s) => s.citySlug === citySlug);
}

export function getWyomingShopBySlug(citySlug: string, slug: string): PawnShop | undefined {
  return allWyomingShops.find((s) => s.citySlug === citySlug && s.slug === slug);
}

export function getWyomingCities(): { citySlug: string; city: string; count: number }[] {
  const map = new Map<string, { city: string; count: number }>();
  for (const shop of allWyomingShops) {
    if (!shop.citySlug || !shop.city) continue;
    const city = WYOMING_CITY_OVERRIDES[shop.city] ?? shop.city;
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

export function buildWyomingSeoDescription(shop: PawnShop): string {
  const parts: string[] = [];
  const city = shop.city ? (WYOMING_CITY_OVERRIDES[shop.city] ?? shop.city) : shop.city;
  const loc = [city, "Wyoming"].filter(Boolean).join(", ");
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

// ── South Dakota ──────────────────────────────────────────────────────────────

const SOUTH_DAKOTA_CITY_OVERRIDES: Record<string, string> = {};

export const allSouthDakotaShops = deduplicateSlugs(southDakotaData as PawnShop[]);

export function getAllSouthDakotaShops(): PawnShop[] {
  return allSouthDakotaShops;
}

export function getSouthDakotaShopsByCity(citySlug: string): PawnShop[] {
  return allSouthDakotaShops.filter((s) => s.citySlug === citySlug);
}

export function getSouthDakotaShopBySlug(citySlug: string, slug: string): PawnShop | undefined {
  return allSouthDakotaShops.find((s) => s.citySlug === citySlug && s.slug === slug);
}

export function getSouthDakotaCities(): { citySlug: string; city: string; count: number }[] {
  const map = new Map<string, { city: string; count: number }>();
  for (const shop of allSouthDakotaShops) {
    if (!shop.citySlug || !shop.city) continue;
    const city = SOUTH_DAKOTA_CITY_OVERRIDES[shop.city] ?? shop.city;
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

export function buildSouthDakotaSeoDescription(shop: PawnShop): string {
  const parts: string[] = [];
  const city = shop.city ? (SOUTH_DAKOTA_CITY_OVERRIDES[shop.city] ?? shop.city) : shop.city;
  const loc = [city, "South Dakota"].filter(Boolean).join(", ");
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

const NORTH_DAKOTA_CITY_OVERRIDES: Record<string, string> = {};

export const allNorthDakotaShops = deduplicateSlugs(northDakotaData as PawnShop[]);

export function getAllNorthDakotaShops(): PawnShop[] {
  return allNorthDakotaShops;
}

export function getNorthDakotaShopsByCity(citySlug: string): PawnShop[] {
  return allNorthDakotaShops.filter((s) => s.citySlug === citySlug);
}

export function getNorthDakotaShopBySlug(citySlug: string, slug: string): PawnShop | undefined {
  return allNorthDakotaShops.find((s) => s.citySlug === citySlug && s.slug === slug);
}

export function getNorthDakotaCities(): { citySlug: string; city: string; count: number }[] {
  const map = new Map<string, { city: string; count: number }>();
  for (const shop of allNorthDakotaShops) {
    if (!shop.citySlug || !shop.city) continue;
    const city = NORTH_DAKOTA_CITY_OVERRIDES[shop.city] ?? shop.city;
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

export function buildNorthDakotaSeoDescription(shop: PawnShop): string {
  const parts: string[] = [];
  const city = shop.city ? (NORTH_DAKOTA_CITY_OVERRIDES[shop.city] ?? shop.city) : shop.city;
  const loc = [city, "North Dakota"].filter(Boolean).join(", ");
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

const NEW_JERSEY_CITY_OVERRIDES: Record<string, string> = {
  "Weehawken Township": "Weehawken",
  "Ewing Township": "Ewing",
};

export const allNewJerseyShops = deduplicateSlugs(newJerseyData as PawnShop[]);

export function getAllNewJerseyShops(): PawnShop[] {
  return allNewJerseyShops;
}

export function getNewJerseyShopsByCity(citySlug: string): PawnShop[] {
  return allNewJerseyShops.filter((s) => s.citySlug === citySlug);
}

export function getNewJerseyShopBySlug(citySlug: string, slug: string): PawnShop | undefined {
  return allNewJerseyShops.find((s) => s.citySlug === citySlug && s.slug === slug);
}

export function getNewJerseyCities(): { citySlug: string; city: string; count: number }[] {
  const map = new Map<string, { city: string; count: number }>();
  for (const shop of allNewJerseyShops) {
    if (!shop.citySlug || !shop.city) continue;
    const city = NEW_JERSEY_CITY_OVERRIDES[shop.city] ?? shop.city;
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

export function buildNewJerseySeoDescription(shop: PawnShop): string {
  const parts: string[] = [];
  const city = shop.city ? (NEW_JERSEY_CITY_OVERRIDES[shop.city] ?? shop.city) : shop.city;
  const loc = [city, "New Jersey"].filter(Boolean).join(", ");
  parts.push(`${shop.name} is a pawn shop${shop.street ? ` located at ${shop.street}` : ""} in ${loc}.`);
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

const OREGON_CITY_OVERRIDES: Record<string, string> = {};

export const allOregonShops = deduplicateSlugs(oregonData as PawnShop[]);

export function getAllOregonShops(): PawnShop[] {
  return allOregonShops;
}

export function getOregonShopsByCity(citySlug: string): PawnShop[] {
  return allOregonShops.filter((s) => s.citySlug === citySlug);
}

export function getOregonShopBySlug(citySlug: string, slug: string): PawnShop | undefined {
  return allOregonShops.find((s) => s.citySlug === citySlug && s.slug === slug);
}

export function getOregonCities(): { citySlug: string; city: string; count: number }[] {
  const map = new Map<string, { city: string; count: number }>();
  for (const shop of allOregonShops) {
    if (!shop.citySlug || !shop.city) continue;
    const city = OREGON_CITY_OVERRIDES[shop.city] ?? shop.city;
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

export function buildOregonSeoDescription(shop: PawnShop): string {
  const parts: string[] = [];
  const city = shop.city ? (OREGON_CITY_OVERRIDES[shop.city] ?? shop.city) : shop.city;
  const loc = [city, "Oregon"].filter(Boolean).join(", ");
  parts.push(`${shop.name} is a pawn shop${shop.street ? ` located at ${shop.street}` : ""} in ${loc}.`);
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

const MASSACHUSETTS_CITY_OVERRIDES: Record<string, string> = {};

export const allMassachusettsShops = deduplicateSlugs(massachusettsData as PawnShop[]);

export function getAllMassachusettsShops(): PawnShop[] {
  return allMassachusettsShops;
}

export function getMassachusettsShopsByCity(citySlug: string): PawnShop[] {
  return allMassachusettsShops.filter((s) => s.citySlug === citySlug);
}

export function getMassachusettsShopBySlug(citySlug: string, slug: string): PawnShop | undefined {
  return allMassachusettsShops.find((s) => s.citySlug === citySlug && s.slug === slug);
}

export function getMassachusettsCities(): { citySlug: string; city: string; count: number }[] {
  const map = new Map<string, { city: string; count: number }>();
  for (const shop of allMassachusettsShops) {
    if (!shop.citySlug || !shop.city) continue;
    const city = MASSACHUSETTS_CITY_OVERRIDES[shop.city] ?? shop.city;
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

export function buildMassachusettsSeoDescription(shop: PawnShop): string {
  const parts: string[] = [];
  const city = shop.city ? (MASSACHUSETTS_CITY_OVERRIDES[shop.city] ?? shop.city) : shop.city;
  const loc = [city, "Massachusetts"].filter(Boolean).join(", ");
  parts.push(`${shop.name} is a pawn shop${shop.street ? ` located at ${shop.street}` : ""} in ${loc}.`);
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

const MAINE_CITY_OVERRIDES: Record<string, string> = {};

export const allMaineShops = deduplicateSlugs(maineData as PawnShop[]);

export function getAllMaineShops(): PawnShop[] { return allMaineShops; }

export function getMaineShopsByCity(citySlug: string): PawnShop[] {
  return allMaineShops.filter((s) => s.citySlug === citySlug);
}

export function getMaineShopBySlug(citySlug: string, slug: string): PawnShop | undefined {
  return allMaineShops.find((s) => s.citySlug === citySlug && s.slug === slug);
}

export function getMaineCities(): { citySlug: string; city: string; count: number }[] {
  const map = new Map<string, { city: string; count: number }>();
  for (const shop of allMaineShops) {
    if (!shop.citySlug || !shop.city) continue;
    const city = MAINE_CITY_OVERRIDES[shop.city] ?? shop.city;
    const existing = map.get(shop.citySlug);
    if (existing) { existing.count++; } else { map.set(shop.citySlug, { city, count: 1 }); }
  }
  return Array.from(map.entries()).map(([citySlug, { city, count }]) => ({ citySlug, city, count })).sort((a, b) => b.count - a.count);
}

export function buildMaineSeoDescription(shop: PawnShop): string {
  const parts: string[] = [];
  const city = shop.city ? (MAINE_CITY_OVERRIDES[shop.city] ?? shop.city) : shop.city;
  const loc = [city, "Maine"].filter(Boolean).join(", ");
  parts.push(`${shop.name} is a pawn shop${shop.street ? ` located at ${shop.street}` : ""} in ${loc}.`);
  if (shop.website) parts.push(`Visit their website at ${shop.website}.`);
  const hours = parseHours(shop.hours);
  if (hours.length > 0) { const days = condenseDays(hours.map((h) => h.day)); parts.push(`They are open ${days}.`); }
  if (shop.rating !== null && shop.reviews !== null) { parts.push(`They have a ${shop.rating}-star rating based on ${shop.reviews} Google reviews.`); }
  return parts.join(" ");
}

const RHODE_ISLAND_CITY_OVERRIDES: Record<string, string> = {};

export const allRhodeIslandShops = deduplicateSlugs(rhodeIslandData as PawnShop[]);

export function getAllRhodeIslandShops(): PawnShop[] { return allRhodeIslandShops; }

export function getRhodeIslandShopsByCity(citySlug: string): PawnShop[] {
  return allRhodeIslandShops.filter((s) => s.citySlug === citySlug);
}

export function getRhodeIslandShopBySlug(citySlug: string, slug: string): PawnShop | undefined {
  return allRhodeIslandShops.find((s) => s.citySlug === citySlug && s.slug === slug);
}

export function getRhodeIslandCities(): { citySlug: string; city: string; count: number }[] {
  const map = new Map<string, { city: string; count: number }>();
  for (const shop of allRhodeIslandShops) {
    if (!shop.citySlug || !shop.city) continue;
    const city = RHODE_ISLAND_CITY_OVERRIDES[shop.city] ?? shop.city;
    const existing = map.get(shop.citySlug);
    if (existing) { existing.count++; } else { map.set(shop.citySlug, { city, count: 1 }); }
  }
  return Array.from(map.entries()).map(([citySlug, { city, count }]) => ({ citySlug, city, count })).sort((a, b) => b.count - a.count);
}

export function buildRhodeIslandSeoDescription(shop: PawnShop): string {
  const parts: string[] = [];
  const city = shop.city ? (RHODE_ISLAND_CITY_OVERRIDES[shop.city] ?? shop.city) : shop.city;
  const loc = [city, "Rhode Island"].filter(Boolean).join(", ");
  parts.push(`${shop.name} is a pawn shop${shop.street ? ` located at ${shop.street}` : ""} in ${loc}.`);
  if (shop.website) parts.push(`Visit their website at ${shop.website}.`);
  const hours = parseHours(shop.hours);
  if (hours.length > 0) { const days = condenseDays(hours.map((h) => h.day)); parts.push(`They are open ${days}.`); }
  if (shop.rating !== null && shop.reviews !== null) { parts.push(`They have a ${shop.rating}-star rating based on ${shop.reviews} Google reviews.`); }
  return parts.join(" ");
}

const ALASKA_CITY_OVERRIDES: Record<string, string> = {};

export const allAlaskaShops = deduplicateSlugs(alaskaData as PawnShop[]);

export function getAllAlaskaShops(): PawnShop[] { return allAlaskaShops; }

export function getAlaskaShopsByCity(citySlug: string): PawnShop[] {
  return allAlaskaShops.filter((s) => s.citySlug === citySlug);
}

export function getAlaskaShopBySlug(citySlug: string, slug: string): PawnShop | undefined {
  return allAlaskaShops.find((s) => s.citySlug === citySlug && s.slug === slug);
}

export function getAlaskaCities(): { citySlug: string; city: string; count: number }[] {
  const map = new Map<string, { city: string; count: number }>();
  for (const shop of allAlaskaShops) {
    if (!shop.citySlug || !shop.city) continue;
    const city = ALASKA_CITY_OVERRIDES[shop.city] ?? shop.city;
    const existing = map.get(shop.citySlug);
    if (existing) { existing.count++; } else { map.set(shop.citySlug, { city, count: 1 }); }
  }
  return Array.from(map.entries()).map(([citySlug, { city, count }]) => ({ citySlug, city, count })).sort((a, b) => b.count - a.count);
}

export function buildAlaskaSeoDescription(shop: PawnShop): string {
  const parts: string[] = [];
  const city = shop.city ? (ALASKA_CITY_OVERRIDES[shop.city] ?? shop.city) : shop.city;
  const loc = [city, "Alaska"].filter(Boolean).join(", ");
  parts.push(`${shop.name} is a pawn shop${shop.street ? ` located at ${shop.street}` : ""} in ${loc}.`);
  if (shop.website) parts.push(`Visit their website at ${shop.website}.`);
  const hours = parseHours(shop.hours);
  if (hours.length > 0) { const days = condenseDays(hours.map((h) => h.day)); parts.push(`They are open ${days}.`); }
  if (shop.rating !== null && shop.reviews !== null) { parts.push(`They have a ${shop.rating}-star rating based on ${shop.reviews} Google reviews.`); }
  return parts.join(" ");
}

export const allDcShops = deduplicateSlugs(dcData as PawnShop[]);

export function getAllDcShops(): PawnShop[] { return allDcShops; }

export function getDcShopsByCity(citySlug: string): PawnShop[] {
  return allDcShops.filter((s) => s.citySlug === citySlug);
}

export function getDcShopBySlug(citySlug: string, slug: string): PawnShop | undefined {
  return allDcShops.find((s) => s.citySlug === citySlug && s.slug === slug);
}

export function getDcCities(): { citySlug: string; city: string; count: number }[] {
  const map = new Map<string, { city: string; count: number }>();
  for (const shop of allDcShops) {
    if (!shop.citySlug || !shop.city) continue;
    const existing = map.get(shop.citySlug);
    if (existing) { existing.count++; } else { map.set(shop.citySlug, { city: shop.city, count: 1 }); }
  }
  return Array.from(map.entries()).map(([citySlug, { city, count }]) => ({ citySlug, city, count })).sort((a, b) => b.count - a.count);
}

export function buildDcSeoDescription(shop: PawnShop): string {
  const parts: string[] = [];
  parts.push(`${shop.name} is a pawn shop${shop.street ? ` located at ${shop.street}` : ""} in Washington, D.C.`);
  if (shop.website) parts.push(`Visit their website at ${shop.website}.`);
  const hours = parseHours(shop.hours);
  if (hours.length > 0) { const days = condenseDays(hours.map((h) => h.day)); parts.push(`They are open ${days}.`); }
  if (shop.rating !== null && shop.reviews !== null) { parts.push(`They have a ${shop.rating}-star rating based on ${shop.reviews} Google reviews.`); }
  return parts.join(" ");
}

import montanaData from "../../data/pawn-shops-montana.json";
const allMontanaShops: PawnShop[] = deduplicateSlugs(montanaData as PawnShop[]);
export function getAllMontanaShops(): PawnShop[] { return allMontanaShops; }
export function getMontanaShopsByCity(citySlug: string): PawnShop[] {
  return allMontanaShops.filter((s) => s.citySlug === citySlug);
}
export function getMontanaShopBySlug(citySlug: string, slug: string): PawnShop | undefined {
  return allMontanaShops.find((s) => s.citySlug === citySlug && s.slug === slug);
}
export function getMontanaCities(): { citySlug: string; city: string; count: number }[] {
  const map = new Map<string, { city: string; count: number }>();
  for (const shop of allMontanaShops) {
    if (!shop.citySlug || !shop.city) continue;
    const existing = map.get(shop.citySlug);
    if (existing) { existing.count++; } else { map.set(shop.citySlug, { city: shop.city, count: 1 }); }
  }
  return Array.from(map.entries()).map(([citySlug, { city, count }]) => ({ citySlug, city, count })).sort((a, b) => b.count - a.count);
}
export function buildMontanaSeoDescription(shop: PawnShop): string {
  const parts: string[] = [];
  parts.push(`${shop.name} is a pawn shop${shop.street ? ` located at ${shop.street}` : ""} in ${shop.city}, Montana.`);
  if (shop.website) parts.push(`Visit their website at ${shop.website}.`);
  const hours = parseHours(shop.hours);
  if (hours.length > 0) { const days = condenseDays(hours.map((h) => h.day)); parts.push(`They are open ${days}.`); }
  if (shop.rating !== null && shop.reviews !== null) { parts.push(`They have a ${shop.rating}-star rating based on ${shop.reviews} Google reviews.`); }
  return parts.join(" ");
}
