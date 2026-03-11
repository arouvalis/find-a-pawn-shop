import Link from "next/link";

export default function HomePage() {
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

      {/* Browse by State */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Browse by State</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <Link
            href="/illinois"
            className="border border-gray-200 rounded-lg p-5 hover:border-amber-400 hover:shadow-sm transition-all group"
          >
            <div className="text-3xl mb-2">🏛️</div>
            <div className="font-semibold text-gray-900 group-hover:text-amber-600">Illinois</div>
            <div className="text-sm text-gray-500 mt-0.5">151 listings</div>
          </Link>
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
