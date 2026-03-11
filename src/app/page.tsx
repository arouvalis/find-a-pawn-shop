import Link from "next/link";
import { getAllShops, getCities } from "@/lib/pawnShops";

const FEATURED_CITIES = ["chicago", "springfield", "rockford", "naperville", "aurora"];

export default function HomePage() {
  const allShops = getAllShops();
  const cities = getCities();
  const totalShops = allShops.length;
  const totalCities = cities.length;

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
        <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
          Browse verified pawn shop listings by state and city. Compare ratings, hours, and contact info.
        </p>
        <div className="max-w-lg mx-auto flex gap-2">
          <input
            type="text"
            placeholder="Enter your city or zip code..."
            className="flex-1 px-4 py-3 rounded-lg text-gray-900 text-sm outline-none"
            readOnly
          />
          <button
            style={{ backgroundColor: "#f59e0b" }}
            className="px-6 py-3 rounded-lg font-semibold text-gray-900 hover:opacity-90 transition-opacity text-sm"
          >
            Search
          </button>
        </div>
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
            <span className="text-2xl font-bold">Illinois</span>
            <span className="ml-2 font-medium">&amp; Growing</span>
          </div>
        </div>
      </section>

      {/* Browse by State */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Browse by State</h2>
        <p className="text-gray-500 mb-8">Currently serving Illinois — expanding nationwide in 2026.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {/* Active */}
          <Link
            href="/illinois"
            className="border-2 border-amber-400 bg-amber-50 rounded-lg p-5 hover:shadow-md transition-all group"
          >
            <div className="font-semibold text-gray-900 group-hover:text-amber-600 mb-1">Illinois</div>
            <div className="text-sm text-gray-500">{totalShops} listings</div>
          </Link>
          {/* Coming Soon */}
          {[
            "Texas", "Florida", "California", "New York", "Ohio",
            "Michigan", "Pennsylvania", "Georgia", "Arizona", "Colorado",
            "Nevada", "Washington", "Missouri", "Indiana",
          ].map((state) => (
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
