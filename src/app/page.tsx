import type { Metadata } from "next";
import Link from "next/link";
import { getAllShops, getCities, getAllTexasShops, getTexasCities, getAllFloridaShops, getFloridaCities, getAllNewYorkShops, getNewYorkCities, getAllGeorgiaShops, getGeorgiaCities, getAllArizonaShops, getArizonaCities, getAllCaliforniaShops, getCaliforniaCities, getAllOhioShops, getOhioCities, getAllMichiganShops, getMichiganCities, getAllPennsylvaniaShops, getPennsylvaniaCities, getAllNorthCarolinaShops, getNorthCarolinaCities, getAllWashingtonShops, getWashingtonCities, getAllColoradoShops, getColoradoCities, getAllNevadaShops, getNevadaCities, getAllTennesseeShops, getTennesseeCities, getAllMissouriShops, getMissouriCities, getAllIndianaShops, getIndianaCities, getAllVirginiaShops, getVirginiaCities, getAllMarylandShops, getMarylandCities, getAllLouisianaShops, getLouisianaCities, getAllMinnesotaShops, getMinnesotaCities, getAllWisconsinShops, getWisconsinCities, getAllSouthCarolinaShops, getSouthCarolinaCities, getAllKentuckyShops, getKentuckyCities, getAllAlabamaShops, getAlabamaCities, getAllOklahomaShops, getOklahomaCities, getAllArkansasShops, getArkansasCities, getAllUtahShops, getUtahCities, getAllConnecticutShops, getConnecticutCities, getAllNewMexicoShops, getNewMexicoCities, getAllIowaShops, getIowaCities, getAllKansasShops, getKansasCities, getAllWestVirginiaShops, getWestVirginiaCities } from "@/lib/pawnShops";

export async function generateMetadata(): Promise<Metadata> {
  const total =
    getAllShops().length + getAllTexasShops().length + getAllFloridaShops().length +
    getAllNewYorkShops().length + getAllGeorgiaShops().length + getAllArizonaShops().length +
    getAllCaliforniaShops().length + getAllOhioShops().length + getAllMichiganShops().length +
    getAllPennsylvaniaShops().length + getAllNorthCarolinaShops().length + getAllWashingtonShops().length +
    getAllColoradoShops().length + getAllNevadaShops().length + getAllTennesseeShops().length +
    getAllMissouriShops().length + getAllIndianaShops().length + getAllVirginiaShops().length +
    getAllMarylandShops().length + getAllLouisianaShops().length + getAllMinnesotaShops().length +
    getAllWisconsinShops().length + getAllSouthCarolinaShops().length + getAllKentuckyShops().length +
    getAllAlabamaShops().length + getAllOklahomaShops().length + getAllArkansasShops().length +
    getAllUtahShops().length + getAllConnecticutShops().length + getAllNewMexicoShops().length +
    getAllIowaShops().length +
    getAllKansasShops().length +
    getAllWestVirginiaShops().length;
  return {
    title: "FindAPawnShop.com — Find Pawn Shops Near You",
    description: `Find a pawn shop near you. Browse ${total} verified pawn shops across 33 states — with addresses, hours, phone numbers, and ratings. The largest pawn shop directory in the US.`,
  };
}

const FEATURED_CITIES = ["chicago", "springfield", "rockford", "naperville", "aurora"];

export default function HomePage() {
  const allShops = getAllShops();
  const cities = getCities();
  const texasShops = getAllTexasShops();
  const texasCities = getTexasCities();
  const floridaShops = getAllFloridaShops();
  const floridaCities = getFloridaCities();
  const newYorkShops = getAllNewYorkShops();
  const newYorkCities = getNewYorkCities();
  const georgiaShops = getAllGeorgiaShops();
  const georgiaCities = getGeorgiaCities();
  const arizonaShops = getAllArizonaShops();
  const arizonaCities = getArizonaCities();
  const californiaShops = getAllCaliforniaShops();
  const californiaCities = getCaliforniaCities();
  const ohioShops = getAllOhioShops();
  const ohioCities = getOhioCities();
  const michiganShops = getAllMichiganShops();
  const michiganCities = getMichiganCities();
  const pennsylvaniaShops = getAllPennsylvaniaShops();
  const pennsylvaniaCities = getPennsylvaniaCities();
  const northCarolinaShops = getAllNorthCarolinaShops();
  const northCarolinaCities = getNorthCarolinaCities();
  const washingtonShops = getAllWashingtonShops();
  const washingtonCities = getWashingtonCities();
  const coloradoShops = getAllColoradoShops();
  const coloradoCities = getColoradoCities();
  const nevadaShops = getAllNevadaShops();
  const nevadaCities = getNevadaCities();
  const tennesseeShops = getAllTennesseeShops();
  const tennesseeCities = getTennesseeCities();
  const missouriShops = getAllMissouriShops();
  const missouriCities = getMissouriCities();
  const indianaShops = getAllIndianaShops();
  const indianaCities = getIndianaCities();
  const virginiaShops = getAllVirginiaShops();
  const virginiaCities = getVirginiaCities();
  const marylandShops = getAllMarylandShops();
  const marylandCities = getMarylandCities();
  const louisianaShops = getAllLouisianaShops();
  const louisianaCities = getLouisianaCities();
  const minnesotaShops = getAllMinnesotaShops();
  const minnesotaCities = getMinnesotaCities();
  const wisconsinShops = getAllWisconsinShops();
  const wisconsinCities = getWisconsinCities();
  const southCarolinaShops = getAllSouthCarolinaShops();
  const southCarolinaCities = getSouthCarolinaCities();
  const kentuckyShops = getAllKentuckyShops();
  const kentuckyCities = getKentuckyCities();
  const alabamaShops = getAllAlabamaShops();
  const alabamaCities = getAlabamaCities();
  const oklahomaShops = getAllOklahomaShops();
  const oklahomaCities = getOklahomaCities();
  const arkansasShops = getAllArkansasShops();
  const arkansasCities = getArkansasCities();
  const utahShops = getAllUtahShops();
  const utahCities = getUtahCities();
  const connecticutShops = getAllConnecticutShops();
  const connecticutCities = getConnecticutCities();
  const newMexicoShops = getAllNewMexicoShops();
  const newMexicoCities = getNewMexicoCities();
  const iowaShops = getAllIowaShops();
  const iowaCities = getIowaCities();
  const kansasShops = getAllKansasShops();
  const kansasCities = getKansasCities();
  const westVirginiaShops = getAllWestVirginiaShops();
  const westVirginiaCities = getWestVirginiaCities();
  const totalShops = allShops.length + texasShops.length + floridaShops.length + newYorkShops.length + georgiaShops.length + arizonaShops.length + californiaShops.length + ohioShops.length + michiganShops.length + pennsylvaniaShops.length + northCarolinaShops.length + washingtonShops.length + coloradoShops.length + nevadaShops.length + tennesseeShops.length + missouriShops.length + indianaShops.length + virginiaShops.length + marylandShops.length + louisianaShops.length + minnesotaShops.length + wisconsinShops.length + southCarolinaShops.length + kentuckyShops.length + alabamaShops.length + oklahomaShops.length + arkansasShops.length + utahShops.length + connecticutShops.length + newMexicoShops.length + iowaShops.length + kansasShops.length + westVirginiaShops.length;
  const totalCities = cities.length + texasCities.length + floridaCities.length + newYorkCities.length + georgiaCities.length + arizonaCities.length + californiaCities.length + ohioCities.length + michiganCities.length + pennsylvaniaCities.length + northCarolinaCities.length + washingtonCities.length + coloradoCities.length + nevadaCities.length + tennesseeCities.length + missouriCities.length + indianaCities.length + virginiaCities.length + marylandCities.length + louisianaCities.length + minnesotaCities.length + wisconsinCities.length + southCarolinaCities.length + kentuckyCities.length + alabamaCities.length + oklahomaCities.length + arkansasCities.length + utahCities.length + connecticutCities.length + newMexicoCities.length + iowaCities.length + kansasCities.length + westVirginiaCities.length;

  const featuredCities = FEATURED_CITIES.flatMap((slug) => {
    const found = cities.find((c) => c.citySlug === slug);
    return found ? [found] : [];
  });

  return (
    <>
      {/* Hero */}
      <section style={{ backgroundColor: "#1a2744" }} className="text-white py-20 px-4 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          Find a Pawn Shop Near You
        </h1>
        <p className="text-gray-300 text-lg max-w-xl mx-auto">
          Browse verified pawn shop listings by state and city. Compare ratings, hours, and contact info.
        </p>
      </section>

      {/* Stats bar */}
      <section style={{ backgroundColor: "#f59e0b" }} className="py-5 px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-8 text-gray-900">
          <div className="text-center">
            <span className="text-2xl font-bold">{totalShops}</span>
            <span className="ml-2 font-medium">Pawn Shops Listed</span>
          </div>
          <div className="text-center">
            <span className="text-2xl font-bold">{totalCities}</span>
            <span className="ml-2 font-medium">Cities Covered</span>
          </div>
          <div className="text-center">
            <span className="text-2xl font-bold">33 States</span>
            <span className="ml-2 font-medium">&amp; Growing</span>
          </div>
        </div>
      </section>

      {/* Browse by State */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Browse by State</h2>
        <p className="text-gray-500 mb-8">Currently serving Illinois, Texas, Florida, New York, Georgia, Arizona, California, Ohio, Michigan, Pennsylvania, North Carolina, Washington, Colorado, Nevada, Tennessee, Missouri, Indiana, Virginia, Maryland, Louisiana, Minnesota, Wisconsin, South Carolina, Kentucky, Alabama, Oklahoma, Arkansas, Utah, Connecticut, New Mexico, Iowa, Kansas, and West Virginia — expanding nationwide in 2026.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {/* Active */}
          <Link
            href="/illinois"
            className="border-2 border-amber-400 bg-amber-50 rounded-lg p-5 hover:shadow-md transition-all group"
          >
            <div className="font-semibold text-gray-900 group-hover:text-amber-600 mb-1">Illinois</div>
            <div className="text-sm text-gray-500">{allShops.length} listings</div>
          </Link>
          <Link
            href="/texas"
            className="border-2 border-amber-400 bg-amber-50 rounded-lg p-5 hover:shadow-md transition-all group"
          >
            <div className="font-semibold text-gray-900 group-hover:text-amber-600 mb-1">Texas</div>
            <div className="text-sm text-gray-500">{texasShops.length} listings</div>
          </Link>
          <Link
            href="/florida"
            className="border-2 border-amber-400 bg-amber-50 rounded-lg p-5 hover:shadow-md transition-all group"
          >
            <div className="font-semibold text-gray-900 group-hover:text-amber-600 mb-1">Florida</div>
            <div className="text-sm text-gray-500">{floridaShops.length} listings</div>
          </Link>
          <Link
            href="/new-york"
            className="border-2 border-amber-400 bg-amber-50 rounded-lg p-5 hover:shadow-md transition-all group"
          >
            <div className="font-semibold text-gray-900 group-hover:text-amber-600 mb-1">New York</div>
            <div className="text-sm text-gray-500">{newYorkShops.length} listings</div>
          </Link>
          <Link
            href="/georgia"
            className="border-2 border-amber-400 bg-amber-50 rounded-lg p-5 hover:shadow-md transition-all group"
          >
            <div className="font-semibold text-gray-900 group-hover:text-amber-600 mb-1">Georgia</div>
            <div className="text-sm text-gray-500">{georgiaShops.length} listings</div>
          </Link>
          <Link
            href="/arizona"
            className="border-2 border-amber-400 bg-amber-50 rounded-lg p-5 hover:shadow-md transition-all group"
          >
            <div className="font-semibold text-gray-900 group-hover:text-amber-600 mb-1">Arizona</div>
            <div className="text-sm text-gray-500">{arizonaShops.length} listings</div>
          </Link>
          <Link
            href="/california"
            className="border-2 border-amber-400 bg-amber-50 rounded-lg p-5 hover:shadow-md transition-all group"
          >
            <div className="font-semibold text-gray-900 group-hover:text-amber-600 mb-1">California</div>
            <div className="text-sm text-gray-500">{californiaShops.length} listings</div>
          </Link>
          <Link
            href="/ohio"
            className="border-2 border-amber-400 bg-amber-50 rounded-lg p-5 hover:shadow-md transition-all group"
          >
            <div className="font-semibold text-gray-900 group-hover:text-amber-600 mb-1">Ohio</div>
            <div className="text-sm text-gray-500">{ohioShops.length} listings</div>
          </Link>
          <Link
            href="/michigan"
            className="border-2 border-amber-400 bg-amber-50 rounded-lg p-5 hover:shadow-md transition-all group"
          >
            <div className="font-semibold text-gray-900 group-hover:text-amber-600 mb-1">Michigan</div>
            <div className="text-sm text-gray-500">{michiganShops.length} listings</div>
          </Link>
          <Link
            href="/pennsylvania"
            className="border-2 border-amber-400 bg-amber-50 rounded-lg p-5 hover:shadow-md transition-all group"
          >
            <div className="font-semibold text-gray-900 group-hover:text-amber-600 mb-1">Pennsylvania</div>
            <div className="text-sm text-gray-500">{pennsylvaniaShops.length} listings</div>
          </Link>
          <Link
            href="/north-carolina"
            className="border-2 border-amber-400 bg-amber-50 rounded-lg p-5 hover:shadow-md transition-all group"
          >
            <div className="font-semibold text-gray-900 group-hover:text-amber-600 mb-1">North Carolina</div>
            <div className="text-sm text-gray-500">{northCarolinaShops.length} listings</div>
          </Link>
          <Link
            href="/washington"
            className="border-2 border-amber-400 bg-amber-50 rounded-lg p-5 hover:shadow-md transition-all group"
          >
            <div className="font-semibold text-gray-900 group-hover:text-amber-600 mb-1">Washington</div>
            <div className="text-sm text-gray-500">{washingtonShops.length} listings</div>
          </Link>
          <Link
            href="/colorado"
            className="border-2 border-amber-400 bg-amber-50 rounded-lg p-5 hover:shadow-md transition-all group"
          >
            <div className="font-semibold text-gray-900 group-hover:text-amber-600 mb-1">Colorado</div>
            <div className="text-sm text-gray-500">{coloradoShops.length} listings</div>
          </Link>
          <Link
            href="/nevada"
            className="border-2 border-amber-400 bg-amber-50 rounded-lg p-5 hover:shadow-md transition-all group"
          >
            <div className="font-semibold text-gray-900 group-hover:text-amber-600 mb-1">Nevada</div>
            <div className="text-sm text-gray-500">{nevadaShops.length} listings</div>
          </Link>
          <Link
            href="/tennessee"
            className="border-2 border-amber-400 bg-amber-50 rounded-lg p-5 hover:shadow-md transition-all group"
          >
            <div className="font-semibold text-gray-900 group-hover:text-amber-600 mb-1">Tennessee</div>
            <div className="text-sm text-gray-500">{tennesseeShops.length} listings</div>
          </Link>
          <Link
            href="/missouri"
            className="border-2 border-amber-400 bg-amber-50 rounded-lg p-5 hover:shadow-md transition-all group"
          >
            <div className="font-semibold text-gray-900 group-hover:text-amber-600 mb-1">Missouri</div>
            <div className="text-sm text-gray-500">{missouriShops.length} listings</div>
          </Link>
          <Link
            href="/indiana"
            className="border-2 border-amber-400 bg-amber-50 rounded-lg p-5 hover:shadow-md transition-all group"
          >
            <div className="font-semibold text-gray-900 group-hover:text-amber-600 mb-1">Indiana</div>
            <div className="text-sm text-gray-500">{indianaShops.length} listings</div>
          </Link>
          <Link
            href="/virginia"
            className="border-2 border-amber-400 bg-amber-50 rounded-lg p-5 hover:shadow-md transition-all group"
          >
            <div className="font-semibold text-gray-900 group-hover:text-amber-600 mb-1">Virginia</div>
            <div className="text-sm text-gray-500">{virginiaShops.length} listings</div>
          </Link>
          <Link
            href="/maryland"
            className="border-2 border-amber-400 bg-amber-50 rounded-lg p-5 hover:shadow-md transition-all group"
          >
            <div className="font-semibold text-gray-900 group-hover:text-amber-600 mb-1">Maryland</div>
            <div className="text-sm text-gray-500">{marylandShops.length} listings</div>
          </Link>
          <Link
            href="/louisiana"
            className="border-2 border-amber-400 bg-amber-50 rounded-lg p-5 hover:shadow-md transition-all group"
          >
            <div className="font-semibold text-gray-900 group-hover:text-amber-600 mb-1">Louisiana</div>
            <div className="text-sm text-gray-500">{louisianaShops.length} listings</div>
          </Link>
          <Link
            href="/minnesota"
            className="border-2 border-amber-400 bg-amber-50 rounded-lg p-5 hover:shadow-md transition-all group"
          >
            <div className="font-semibold text-gray-900 group-hover:text-amber-600 mb-1">Minnesota</div>
            <div className="text-sm text-gray-500">{minnesotaShops.length} listings</div>
          </Link>
          <Link
            href="/wisconsin"
            className="border-2 border-amber-400 bg-amber-50 rounded-lg p-5 hover:shadow-md transition-all group"
          >
            <div className="font-semibold text-gray-900 group-hover:text-amber-600 mb-1">Wisconsin</div>
            <div className="text-sm text-gray-500">{wisconsinShops.length} listings</div>
          </Link>
          <Link
            href="/south-carolina"
            className="border-2 border-amber-400 bg-amber-50 rounded-lg p-5 hover:shadow-md transition-all group"
          >
            <div className="font-semibold text-gray-900 group-hover:text-amber-600 mb-1">South Carolina</div>
            <div className="text-sm text-gray-500">{southCarolinaShops.length} listings</div>
          </Link>
          <Link
            href="/kentucky"
            className="border-2 border-amber-400 bg-amber-50 rounded-lg p-5 hover:shadow-md transition-all group"
          >
            <div className="font-semibold text-gray-900 group-hover:text-amber-600 mb-1">Kentucky</div>
            <div className="text-sm text-gray-500">{kentuckyShops.length} listings</div>
          </Link>
          <Link
            href="/alabama"
            className="border-2 border-amber-400 bg-amber-50 rounded-lg p-5 hover:shadow-md transition-all group"
          >
            <div className="font-semibold text-gray-900 group-hover:text-amber-600 mb-1">Alabama</div>
            <div className="text-sm text-gray-500">{alabamaShops.length} listings</div>
          </Link>
          <Link
            href="/oklahoma"
            className="border-2 border-amber-400 bg-amber-50 rounded-lg p-5 hover:shadow-md transition-all group"
          >
            <div className="font-semibold text-gray-900 group-hover:text-amber-600 mb-1">Oklahoma</div>
            <div className="text-sm text-gray-500">{oklahomaShops.length} listings</div>
          </Link>
          <Link
            href="/arkansas"
            className="border-2 border-amber-400 bg-amber-50 rounded-lg p-5 hover:shadow-md transition-all group"
          >
            <div className="font-semibold text-gray-900 group-hover:text-amber-600 mb-1">Arkansas</div>
            <div className="text-sm text-gray-500">{arkansasShops.length} listings</div>
          </Link>
          <Link
            href="/utah"
            className="border-2 border-amber-400 bg-amber-50 rounded-lg p-5 hover:shadow-md transition-all group"
          >
            <div className="font-semibold text-gray-900 group-hover:text-amber-600 mb-1">Utah</div>
            <div className="text-sm text-gray-500">{utahShops.length} listings</div>
          </Link>
          <Link
            href="/connecticut"
            className="border-2 border-amber-400 bg-amber-50 rounded-lg p-5 hover:shadow-md transition-all group"
          >
            <div className="font-semibold text-gray-900 group-hover:text-amber-600 mb-1">Connecticut</div>
            <div className="text-sm text-gray-500">{connecticutShops.length} listings</div>
          </Link>
          <Link
            href="/new-mexico"
            className="border-2 border-amber-400 bg-amber-50 rounded-lg p-5 hover:shadow-md transition-all group"
          >
            <div className="font-semibold text-gray-900 group-hover:text-amber-600 mb-1">New Mexico</div>
            <div className="text-sm text-gray-500">{newMexicoShops.length} listings</div>
          </Link>
          <Link
            href="/iowa"
            className="border-2 border-amber-400 bg-amber-50 rounded-lg p-5 hover:shadow-md transition-all group"
          >
            <div className="font-semibold text-gray-900 group-hover:text-amber-600 mb-1">Iowa</div>
            <div className="text-sm text-gray-500">{iowaShops.length} listings</div>
          </Link>
          <Link
            href="/kansas"
            className="border-2 border-amber-400 bg-amber-50 rounded-lg p-5 hover:shadow-md transition-all group"
          >
            <div className="font-semibold text-gray-900 group-hover:text-amber-600 mb-1">Kansas</div>
            <div className="text-sm text-gray-500">{kansasShops.length} listings</div>
          </Link>
          <Link
            href="/west-virginia"
            className="border-2 border-amber-400 bg-amber-50 rounded-lg p-5 hover:shadow-md transition-all group"
          >
            <div className="font-semibold text-gray-900 group-hover:text-amber-600 mb-1">West Virginia</div>
            <div className="text-sm text-gray-500">{westVirginiaShops.length} listings</div>
          </Link>
          {/* Coming Soon */}
          {[].map((state) => (
            <div
              key={state}
              className="border border-gray-200 bg-gray-50 rounded-lg p-5 opacity-70"
            >
              <div className="font-semibold text-gray-400 mb-1">{state}</div>
              <span className="inline-block text-xs text-gray-400 bg-gray-200 rounded-full px-2 py-0.5">
                Coming Soon
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Cities */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Cities</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {featuredCities.map(({ citySlug, city, count }) => (
              <Link
                key={citySlug}
                href={`/illinois/${citySlug}`}
                className="border border-gray-200 bg-white rounded-lg p-5 hover:border-amber-400 hover:shadow-md transition-all group text-center"
              >
                <div className="font-semibold text-gray-900 group-hover:text-amber-600 mb-1">{city}</div>
                <div
                  style={{ backgroundColor: "#f59e0b" }}
                  className="inline-block text-xs font-bold text-gray-900 rounded-full px-2 py-0.5 mt-1"
                >
                  {count} shop{count !== 1 ? "s" : ""}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Use FindAPawnShop.com */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Why Use FindAPawnShop.com?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-xl p-6">
            <div className="text-3xl mb-3">✅</div>
            <h3 className="font-bold text-gray-900 mb-2">Free &amp; Verified Listings</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Browse hundreds of pawn shops with real addresses, phone numbers, and hours.
            </p>
          </div>
          <div className="border border-gray-200 rounded-xl p-6">
            <div className="text-3xl mb-3">⭐</div>
            <h3 className="font-bold text-gray-900 mb-2">Ratings &amp; Reviews</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              See Google ratings so you can find the best-rated shop near you.
            </p>
          </div>
          <div className="border border-gray-200 rounded-xl p-6">
            <div className="text-3xl mb-3">📞</div>
            <h3 className="font-bold text-gray-900 mb-2">Direct Contact Info</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Call or visit any shop directly — no middleman, no fees.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
        <div className="divide-y divide-gray-200 border border-gray-200 rounded-xl overflow-hidden">
          {[
            {
              q: "How do pawn shops work?",
              a: "Pawn shops offer short-term loans using your valuables as collateral. You bring in an item, the pawnbroker appraises it and offers you a loan. If you repay the loan plus interest within the agreed period, you get your item back. If not, the pawn shop keeps the item and sells it.",
            },
            {
              q: "What items do pawn shops accept?",
              a: "Most pawn shops accept jewelry, gold and silver, electronics, musical instruments, tools, firearms (where licensed), and sporting goods. High-value items like diamond rings, name-brand watches, and newer electronics tend to get the best offers.",
            },
            {
              q: "How much will a pawn shop give me for my item?",
              a: "Pawn shops typically offer 25–60% of an item's resale value. Jewelry and gold are valued based on weight and purity. Electronics are assessed by age, condition, and current market demand. Getting quotes from multiple shops is always a good idea.",
            },
            {
              q: "What's the difference between pawning and selling?",
              a: "When you pawn an item, you're taking a loan with the item as collateral — you can get it back by repaying the loan. When you sell, you transfer ownership permanently in exchange for cash. Selling usually gets you more money upfront.",
            },
            {
              q: "Are pawn shop loans regulated in Illinois?",
              a: "Yes. Illinois pawn shops are regulated by the Illinois Pawnbroker Regulation Act. Interest rates and loan terms are capped by state law. Pawnbrokers are required to be licensed and to report transactions to local law enforcement.",
            },
            {
              q: "How do I find the best pawn shop near me?",
              a: "Look for shops with high Google ratings and many reviews — this indicates consistent, trustworthy service. Check their hours, confirm they accept the type of item you have, and consider getting quotes from 2-3 shops before committing.",
            },
          ].map(({ q, a }) => (
            <details key={q} className="group bg-white">
              <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer list-none">
                <span className="font-semibold text-gray-900 text-sm sm:text-base">{q}</span>
                <span className="text-amber-500 font-bold text-xl shrink-0 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="px-6 pb-5 text-gray-600 text-sm leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About FindAPawnShop.com</h2>
          <p className="text-gray-600 leading-relaxed">
            FindAPawnShop.com is a free directory of pawn shops across the United States. Whether
            you&apos;re looking to sell, buy, or get a loan on valuables, we help you find nearby
            pawn shops with verified listings including ratings, hours, contact information, and
            direct links to Google Maps. Start by selecting your state above.
          </p>
        </div>
      </section>
    </>
  );
}
