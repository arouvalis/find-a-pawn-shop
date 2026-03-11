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

export function formatAddress(shop: PawnShop): string {
  const parts = [shop.street, shop.city, shop.state, shop.zip].filter(Boolean);
  return parts.join(", ");
}
