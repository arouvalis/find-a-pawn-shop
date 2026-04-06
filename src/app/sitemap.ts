import type { MetadataRoute } from "next";
import { getAllShops, getCities, getAllTexasShops, getTexasCities, getAllFloridaShops, getFloridaCities, getAllNewYorkShops, getNewYorkCities, getAllGeorgiaShops, getGeorgiaCities, getAllArizonaShops, getArizonaCities, getAllCaliforniaShops, getCaliforniaCities, getAllOhioShops, getOhioCities, getAllMichiganShops, getMichiganCities, getAllPennsylvaniaShops, getPennsylvaniaCities, getAllNorthCarolinaShops, getNorthCarolinaCities, getAllWashingtonShops, getWashingtonCities, getAllColoradoShops, getColoradoCities, getAllNevadaShops, getNevadaCities, getAllTennesseeShops, getTennesseeCities, getAllMissouriShops, getMissouriCities, getAllIndianaShops, getIndianaCities, getAllVirginiaShops, getVirginiaCities, getAllMarylandShops, getMarylandCities, getAllLouisianaShops, getLouisianaCities, getAllMinnesotaShops, getMinnesotaCities, getAllWisconsinShops, getWisconsinCities, getAllSouthCarolinaShops, getSouthCarolinaCities, getAllKentuckyShops, getKentuckyCities, getAllAlabamaShops, getAlabamaCities, getAllOklahomaShops, getOklahomaCities, getAllArkansasShops, getArkansasCities, getAllUtahShops, getUtahCities, getAllConnecticutShops, getConnecticutCities } from "@/lib/pawnShops";

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
  const tennesseeCities = getTennesseeCities();
  const tennesseeShops = getAllTennesseeShops();
  const missouriCities = getMissouriCities();
  const missouriShops = getAllMissouriShops();
  const indianaCities = getIndianaCities();
  const indianaShops = getAllIndianaShops();
  const virginiaCities = getVirginiaCities();
  const virginiaShops = getAllVirginiaShops();
  const marylandCities = getMarylandCities();
  const marylandShops = getAllMarylandShops();
  const louisianaCities = getLouisianaCities();
  const louisianaShops = getAllLouisianaShops();
  const minnesotaCities = getMinnesotaCities();
  const minnesotaShops = getAllMinnesotaShops();
  const wisconsinCities = getWisconsinCities();
  const wisconsinShops = getAllWisconsinShops();
  const southCarolinaCities = getSouthCarolinaCities();
  const southCarolinaShops = getAllSouthCarolinaShops();
  const kentuckyCities = getKentuckyCities();
  const kentuckyShops = getAllKentuckyShops();
  const alabamaCities = getAlabamaCities();
  const alabamaShops = getAllAlabamaShops();
  const oklahomaCities = getOklahomaCities();
  const oklahomaShops = getAllOklahomaShops();
  const arkansasCities = getArkansasCities();
  const arkansasShops = getAllArkansasShops();
  const utahCities = getUtahCities();
  const utahShops = getAllUtahShops();
  const connecticutCities = getConnecticutCities();
  const connecticutShops = getAllConnecticutShops();

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
    { url: `${BASE_URL}/tennessee`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/missouri`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/indiana`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/virginia`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/maryland`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/louisiana`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/minnesota`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/wisconsin`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/south-carolina`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/kentucky`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/alabama`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/oklahoma`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/arkansas`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/utah`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/connecticut`, changeFrequency: "monthly", priority: 0.9 },
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

  const tennesseeCityPages: MetadataRoute.Sitemap = tennesseeCities.map(({ citySlug }) => ({
    url: `${BASE_URL}/tennessee/${citySlug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const tennesseeListingPages: MetadataRoute.Sitemap = tennesseeShops.map((shop) => ({
    url: `${BASE_URL}/tennessee/${shop.citySlug}/${shop.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const missouriCityPages: MetadataRoute.Sitemap = missouriCities.map(({ citySlug }) => ({
    url: `${BASE_URL}/missouri/${citySlug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const missouriListingPages: MetadataRoute.Sitemap = missouriShops.map((shop) => ({
    url: `${BASE_URL}/missouri/${shop.citySlug}/${shop.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const indianaCityPages: MetadataRoute.Sitemap = indianaCities.map(({ citySlug }) => ({
    url: `${BASE_URL}/indiana/${citySlug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const indianaListingPages: MetadataRoute.Sitemap = indianaShops.map((shop) => ({
    url: `${BASE_URL}/indiana/${shop.citySlug}/${shop.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const virginiaCityPages: MetadataRoute.Sitemap = virginiaCities.map(({ citySlug }) => ({
    url: `${BASE_URL}/virginia/${citySlug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const virginiaListingPages: MetadataRoute.Sitemap = virginiaShops.map((shop) => ({
    url: `${BASE_URL}/virginia/${shop.citySlug}/${shop.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const marylandCityPages: MetadataRoute.Sitemap = marylandCities.map(({ citySlug }) => ({
    url: `${BASE_URL}/maryland/${citySlug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const marylandListingPages: MetadataRoute.Sitemap = marylandShops.map((shop) => ({
    url: `${BASE_URL}/maryland/${shop.citySlug}/${shop.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const louisianaCityPages: MetadataRoute.Sitemap = louisianaCities.map(({ citySlug }) => ({
    url: `${BASE_URL}/louisiana/${citySlug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const louisianaListingPages: MetadataRoute.Sitemap = louisianaShops.map((shop) => ({
    url: `${BASE_URL}/louisiana/${shop.citySlug}/${shop.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const minnesotaCityPages: MetadataRoute.Sitemap = minnesotaCities.map(({ citySlug }) => ({
    url: `${BASE_URL}/minnesota/${citySlug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const minnesotaListingPages: MetadataRoute.Sitemap = minnesotaShops.map((shop) => ({
    url: `${BASE_URL}/minnesota/${shop.citySlug}/${shop.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const wisconsinCityPages: MetadataRoute.Sitemap = wisconsinCities.map(({ citySlug }) => ({
    url: `${BASE_URL}/wisconsin/${citySlug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const wisconsinListingPages: MetadataRoute.Sitemap = wisconsinShops.map((shop) => ({
    url: `${BASE_URL}/wisconsin/${shop.citySlug}/${shop.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const southCarolinaCityPages: MetadataRoute.Sitemap = southCarolinaCities.map(({ citySlug }) => ({
    url: `${BASE_URL}/south-carolina/${citySlug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const southCarolinaListingPages: MetadataRoute.Sitemap = southCarolinaShops.map((shop) => ({
    url: `${BASE_URL}/south-carolina/${shop.citySlug}/${shop.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const kentuckyCityPages: MetadataRoute.Sitemap = kentuckyCities.map(({ citySlug }) => ({
    url: `${BASE_URL}/kentucky/${citySlug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const kentuckyListingPages: MetadataRoute.Sitemap = kentuckyShops.map((shop) => ({
    url: `${BASE_URL}/kentucky/${shop.citySlug}/${shop.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const alabamaCityPages: MetadataRoute.Sitemap = alabamaCities.map(({ citySlug }) => ({
    url: `${BASE_URL}/alabama/${citySlug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const alabamaListingPages: MetadataRoute.Sitemap = alabamaShops.map((shop) => ({
    url: `${BASE_URL}/alabama/${shop.citySlug}/${shop.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const oklahomaCityPages: MetadataRoute.Sitemap = oklahomaCities.map(({ citySlug }) => ({
    url: `${BASE_URL}/oklahoma/${citySlug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const oklahomaListingPages: MetadataRoute.Sitemap = oklahomaShops.map((shop) => ({
    url: `${BASE_URL}/oklahoma/${shop.citySlug}/${shop.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const arkansasCityPages: MetadataRoute.Sitemap = arkansasCities.map(({ citySlug }) => ({
    url: `${BASE_URL}/arkansas/${citySlug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const arkansasListingPages: MetadataRoute.Sitemap = arkansasShops.map((shop) => ({
    url: `${BASE_URL}/arkansas/${shop.citySlug}/${shop.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const utahCityPages: MetadataRoute.Sitemap = utahCities.map(({ citySlug }) => ({
    url: `${BASE_URL}/utah/${citySlug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const utahListingPages: MetadataRoute.Sitemap = utahShops.map((shop) => ({
    url: `${BASE_URL}/utah/${shop.citySlug}/${shop.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const connecticutCityPages: MetadataRoute.Sitemap = connecticutCities.map(({ citySlug }) => ({
    url: `${BASE_URL}/connecticut/${citySlug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const connecticutListingPages: MetadataRoute.Sitemap = connecticutShops.map((shop) => ({
    url: `${BASE_URL}/connecticut/${shop.citySlug}/${shop.slug}`,
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
    ...tennesseeCityPages,
    ...tennesseeListingPages,
    ...missouriCityPages,
    ...missouriListingPages,
    ...indianaCityPages,
    ...indianaListingPages,
    ...virginiaCityPages,
    ...virginiaListingPages,
    ...marylandCityPages,
    ...marylandListingPages,
    ...louisianaCityPages,
    ...louisianaListingPages,
    ...minnesotaCityPages,
    ...minnesotaListingPages,
    ...wisconsinCityPages,
    ...wisconsinListingPages,
    ...southCarolinaCityPages,
    ...southCarolinaListingPages,
    ...kentuckyCityPages,
    ...kentuckyListingPages,
    ...alabamaCityPages,
    ...alabamaListingPages,
    ...oklahomaCityPages,
    ...oklahomaListingPages,
    ...arkansasCityPages,
    ...arkansasListingPages,
    ...utahCityPages,
    ...utahListingPages,
    ...connecticutCityPages,
    ...connecticutListingPages,
  ];
}
