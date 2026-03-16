import type { MetadataRoute } from "next";
import { getAllShops, getCities, getAllTexasShops, getTexasCities, getAllFloridaShops, getFloridaCities, getAllNewYorkShops, getNewYorkCities, getAllGeorgiaShops, getGeorgiaCities, getAllArizonaShops, getArizonaCities, getAllCaliforniaShops, getCaliforniaCities, getAllOhioShops, getOhioCities, getAllMichiganShops, getMichiganCities, getAllPennsylvaniaShops, getPennsylvaniaCities, getAllNorthCarolinaShops, getNorthCarolinaCities, getAllWashingtonShops, getWashingtonCities, getAllColoradoShops, getColoradoCities, getAllNevadaShops, getNevadaCities } from "@/lib/pawnShops";

const BASE_URL = "https://www.findapawnshop.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const cities = getCities();
  const shops = getAllShops();
  const texasCities = getTexasCities();
  const texasShops = getAllTexasShops();
  const floridaCities = getFloridaCities();
  const floridaShops = getAllFloridaShops();
  const newYorkCities = getNewYorkCities();
  const newYorkShops = getAllNewYorkShops();
  const georgiaCities = getGeorgiaCities();
  const georgiaShops = getAllGeorgiaShops();
  const arizonaCities = getArizonaCities();
  const arizonaShops = getAllArizonaShops();
  const californiaCities = getCaliforniaCities();
  const californiaShops = getAllCaliforniaShops();
  const ohioCities = getOhioCities();
  const ohioShops = getAllOhioShops();
  const michiganCities = getMichiganCities();
  const michiganShops = getAllMichiganShops();
  const pennsylvaniaCities = getPennsylvaniaCities();
  const pennsylvaniaShops = getAllPennsylvaniaShops();
  const northCarolinaCities = getNorthCarolinaCities();
  const northCarolinaShops = getAllNorthCarolinaShops();
  const washingtonCities = getWashingtonCities();
  const washingtonShops = getAllWashingtonShops();
  const coloradoCities = getColoradoCities();
  const coloradoShops = getAllColoradoShops();
  const nevadaCities = getNevadaCities();
  const nevadaShops = getAllNevadaShops();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "monthly", priority: 1.0 },
    { url: `${BASE_URL}/illinois`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/texas`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/florida`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/new-york`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/georgia`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/arizona`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/california`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/ohio`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/michigan`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/pennsylvania`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/north-carolina`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/washington`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/colorado`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/nevada`, changeFrequency: "monthly", priority: 0.9 },
  ];

  const illinoisCityPages: MetadataRoute.Sitemap = cities.map(({ citySlug }) => ({
    url: `${BASE_URL}/illinois/${citySlug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const illinoisListingPages: MetadataRoute.Sitemap = shops.map((shop) => ({
    url: `${BASE_URL}/illinois/${shop.citySlug}/${shop.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const texasCityPages: MetadataRoute.Sitemap = texasCities.map(({ citySlug }) => ({
    url: `${BASE_URL}/texas/${citySlug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const texasListingPages: MetadataRoute.Sitemap = texasShops.map((shop) => ({
    url: `${BASE_URL}/texas/${shop.citySlug}/${shop.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const floridaCityPages: MetadataRoute.Sitemap = floridaCities.map(({ citySlug }) => ({
    url: `${BASE_URL}/florida/${citySlug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const floridaListingPages: MetadataRoute.Sitemap = floridaShops.map((shop) => ({
    url: `${BASE_URL}/florida/${shop.citySlug}/${shop.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const newYorkCityPages: MetadataRoute.Sitemap = newYorkCities.map(({ citySlug }) => ({
    url: `${BASE_URL}/new-york/${citySlug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const newYorkListingPages: MetadataRoute.Sitemap = newYorkShops.map((shop) => ({
    url: `${BASE_URL}/new-york/${shop.citySlug}/${shop.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const georgiaCityPages: MetadataRoute.Sitemap = georgiaCities.map(({ citySlug }) => ({
    url: `${BASE_URL}/georgia/${citySlug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const georgiaListingPages: MetadataRoute.Sitemap = georgiaShops.map((shop) => ({
    url: `${BASE_URL}/georgia/${shop.citySlug}/${shop.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const arizonaCityPages: MetadataRoute.Sitemap = arizonaCities.map(({ citySlug }) => ({
    url: `${BASE_URL}/arizona/${citySlug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const arizonaListingPages: MetadataRoute.Sitemap = arizonaShops.map((shop) => ({
    url: `${BASE_URL}/arizona/${shop.citySlug}/${shop.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const californiaCityPages: MetadataRoute.Sitemap = californiaCities.map(({ citySlug }) => ({
    url: `${BASE_URL}/california/${citySlug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const californiaListingPages: MetadataRoute.Sitemap = californiaShops.map((shop) => ({
    url: `${BASE_URL}/california/${shop.citySlug}/${shop.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const ohioCityPages: MetadataRoute.Sitemap = ohioCities.map(({ citySlug }) => ({
    url: `${BASE_URL}/ohio/${citySlug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const ohioListingPages: MetadataRoute.Sitemap = ohioShops.map((shop) => ({
    url: `${BASE_URL}/ohio/${shop.citySlug}/${shop.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const michiganCityPages: MetadataRoute.Sitemap = michiganCities.map(({ citySlug }) => ({
    url: `${BASE_URL}/michigan/${citySlug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const michiganListingPages: MetadataRoute.Sitemap = michiganShops.map((shop) => ({
    url: `${BASE_URL}/michigan/${shop.citySlug}/${shop.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const pennsylvaniaCityPages: MetadataRoute.Sitemap = pennsylvaniaCities.map(({ citySlug }) => ({
    url: `${BASE_URL}/pennsylvania/${citySlug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const pennsylvaniaListingPages: MetadataRoute.Sitemap = pennsylvaniaShops.map((shop) => ({
    url: `${BASE_URL}/pennsylvania/${shop.citySlug}/${shop.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const northCarolinaCityPages: MetadataRoute.Sitemap = northCarolinaCities.map(({ citySlug }) => ({
    url: `${BASE_URL}/north-carolina/${citySlug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const northCarolinaListingPages: MetadataRoute.Sitemap = northCarolinaShops.map((shop) => ({
    url: `${BASE_URL}/north-carolina/${shop.citySlug}/${shop.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const washingtonCityPages: MetadataRoute.Sitemap = washingtonCities.map(({ citySlug }) => ({
    url: `${BASE_URL}/washington/${citySlug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const washingtonListingPages: MetadataRoute.Sitemap = washingtonShops.map((shop) => ({
    url: `${BASE_URL}/washington/${shop.citySlug}/${shop.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const coloradoCityPages: MetadataRoute.Sitemap = coloradoCities.map(({ citySlug }) => ({
    url: `${BASE_URL}/colorado/${citySlug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const coloradoListingPages: MetadataRoute.Sitemap = coloradoShops.map((shop) => ({
    url: `${BASE_URL}/colorado/${shop.citySlug}/${shop.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const nevadaCityPages: MetadataRoute.Sitemap = nevadaCities.map(({ citySlug }) => ({
    url: `${BASE_URL}/nevada/${citySlug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const nevadaListingPages: MetadataRoute.Sitemap = nevadaShops.map((shop) => ({
    url: `${BASE_URL}/nevada/${shop.citySlug}/${shop.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...illinoisCityPages,
    ...illinoisListingPages,
    ...texasCityPages,
    ...texasListingPages,
    ...floridaCityPages,
    ...floridaListingPages,
    ...newYorkCityPages,
    ...newYorkListingPages,
    ...georgiaCityPages,
    ...georgiaListingPages,
    ...arizonaCityPages,
    ...arizonaListingPages,
    ...californiaCityPages,
    ...californiaListingPages,
    ...ohioCityPages,
    ...ohioListingPages,
    ...michiganCityPages,
    ...michiganListingPages,
    ...pennsylvaniaCityPages,
    ...pennsylvaniaListingPages,
    ...northCarolinaCityPages,
    ...northCarolinaListingPages,
    ...washingtonCityPages,
    ...washingtonListingPages,
    ...coloradoCityPages,
    ...coloradoListingPages,
    ...nevadaCityPages,
    ...nevadaListingPages,
  ];
}
