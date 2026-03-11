import type { MetadataRoute } from "next";
import { getAllShops, getCities } from "@/lib/pawnShops";

const BASE_URL = "https://www.findapawnshop.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const cities = getCities();
  const shops = getAllShops();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "monthly", priority: 1.0 },
    { url: `${BASE_URL}/illinois`, changeFrequency: "monthly", priority: 0.9 },
  ];

  const cityPages: MetadataRoute.Sitemap = cities.map(({ citySlug }) => ({
    url: `${BASE_URL}/illinois/${citySlug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const listingPages: MetadataRoute.Sitemap = shops.map((shop) => ({
    url: `${BASE_URL}/illinois/${shop.citySlug}/${shop.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...cityPages, ...listingPages];
}
