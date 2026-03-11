import data from "../../data/pawn-shops-illinois.json";

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

export function buildSeoDescription(shop: PawnShop): string {
  const parts: string[] = [];
  const loc = [shop.city, "Illinois"].filter(Boolean).join(", ");
  parts.push(
    `${shop.name} is a pawn shop${shop.street ? ` located at ${shop.street}` : ""} in ${loc}.`
  );
  if (shop.website) parts.push(`Visit their website at ${shop.website}.`);
  const hours = parseHours(shop.hours);
  if (hours.length > 0) {
    const days = hours.map((h) => h.day).join(", ");
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
