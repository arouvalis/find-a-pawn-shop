import data from "../../data/pawn-shops-illinois.json";
import texasData from "../../data/pawn-shops-texas.json";
import floridaData from "../../data/pawn-shops-florida.json";
import newYorkData from "../../data/pawn-shops-newyork.json";
import georgiaData from "../../data/pawn-shops-georgia.json";

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

export const allShops = data as PawnShop[];

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

// ── Texas ────────────────────────────────────────────────────────────────────

const TEXAS_CITY_OVERRIDES: Record<string, string> = {
  "Mckinney": "McKinney",
};

export const allTexasShops = texasData as PawnShop[];

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

export const allFloridaShops = floridaData as PawnShop[];

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

export const allNewYorkShops = newYorkData as PawnShop[];

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

export const allGeorgiaShops = georgiaData as PawnShop[];

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
