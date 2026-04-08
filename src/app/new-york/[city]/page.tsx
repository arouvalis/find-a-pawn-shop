import type { Metadata } from "next";
import Link from "next/link";
import { getNewYorkCities, getNewYorkShopsByCity, formatAddress } from "@/lib/pawnShops";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ city: string }>;
}

export async function generateStaticParams() {
  return getNewYorkCities().map(({ citySlug }) => ({ city: citySlug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: citySlug } = await params;
  const shops = getNewYorkShopsByCity(citySlug);
  if (!shops.length) return {};
  const cityName = shops[0].city;
  return {
    title: `Pawn Shops in ${cityName}, New York — FindAPawnShop.com`,
    description: `Find the best pawn shops in ${cityName}, New York. Browse ${shops.length} verified listings with addresses, hours, phone numbers, and ratings. Compare pawn shops near you.`,
  };
}

export default async function NewYorkCityPage({ params }: Props) {
  const { city: citySlug } = await params;
  const shops = getNewYorkShopsByCity(citySlug);
  if (!shops.length) notFound();

  const cityName = shops[0].city;
  const sorted = [...shops].sort((a, b) => (b.reviews ?? -1) - (a.reviews ?? -1));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Pawn Shops in ${cityName}, New York`,
    description: `Directory of pawn shops in ${cityName}, New York`,
    numberOfItems: shops.length,
    itemListElement: sorted.map((shop, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: shop.name,
      url: `https://www.findapawnshop.com/new-york/${citySlug}/${shop.slug}`,
    })),
  };

  const isNyc = ["new-york-city", "bronx", "brooklyn", "queens", "staten-island"].includes(citySlug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-amber-600">Home</Link>
          <span>/</span>
          <Link href="/new-york" className="hover:text-amber-600">New York</Link>
          <span>/</span>
          <span className="text-gray-900">{cityName}</span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Pawn Shops in {cityName}, New York
        </h1>
        <p className="text-gray-500 mb-10">{shops.length} listing{shops.length !== 1 ? "s" : ""} found</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sorted.map((shop) => (
            <Link
              key={shop.slug}
              href={`/new-york/${citySlug}/${shop.slug}`}
              className="border border-gray-200 rounded-lg p-5 hover:border-amber-400 hover:shadow-md transition-all group block"
            >
              <h2 className="font-semibold text-gray-900 group-hover:text-amber-600 mb-2 leading-tight">
                {shop.name}
              </h2>
              {(shop.street || shop.city) && (
                <p className="text-sm text-gray-500 mb-2">{formatAddress(shop)}</p>
              )}
              {shop.phone && (
                <p className="text-sm text-gray-600 mb-2">{shop.phone}</p>
              )}
              {shop.rating !== null && (
                <div className="flex items-center gap-1.5 mt-3">
                  <span className="text-amber-500 text-sm">★</span>
                  <span className="text-sm font-medium text-gray-800">{shop.rating.toFixed(1)}</span>
                  {shop.reviews !== null && (
                    <span className="text-xs text-gray-400">({shop.reviews} reviews)</span>
                  )}
                </div>
              )}
            </Link>
          ))}
        </div>

        {isNyc && (
          <div className="mt-16 max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">FAQs About Pawn Shops in New York City</h2>
            <div className="divide-y divide-gray-200 border border-gray-200 rounded-xl overflow-hidden">
              {[
                {
                  q: "How many pawn shops are in New York City?",
                  a: "New York City has dozens of pawn shops spread across all five boroughs — Manhattan, Brooklyn, the Bronx, Queens, and Staten Island. Concentrations are highest in the Bronx, Jamaica (Queens), and areas of Brooklyn. FindAPawnShop.com lists verified pawn shops across all NYC neighborhoods.",
                },
                {
                  q: "Are pawn shops in New York City licensed and regulated?",
                  a: "Yes — all pawn shops in New York City must be licensed by the New York City Sheriff's Office and comply with both city and state regulations. All transactions must be reported to the NYPD, and pawnbrokers are required to hold purchased items for a mandatory period to allow law enforcement to check for stolen goods.",
                },
                {
                  q: "What neighborhoods in NYC have the most pawn shops?",
                  a: "The Bronx, Jamaica and Flushing in Queens, Flatbush and Crown Heights in Brooklyn, and Harlem in Manhattan tend to have the highest concentration of pawn shops. Many shops in these neighborhoods specialize in gold, jewelry, and electronics.",
                },
                {
                  q: "Can I sell gold and jewelry at a NYC pawn shop?",
                  a: "Yes — gold and jewelry are the most actively traded items at New York City pawn shops. NYC's dense population and competitive market mean you can often get multiple quotes in a single afternoon. Always check the current gold spot price before visiting and bring any documentation you have.",
                },
                {
                  q: "What are typical pawn shop hours in New York City?",
                  a: "Most NYC pawn shops are open Monday through Saturday, roughly 9AM to 6PM. Some shops in high-traffic areas keep extended hours. Always check the individual listing page for exact hours before making the trip.",
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
          </div>
        )}

        {/* Owner callout */}
        <div className="mt-10 border border-gray-200 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50">
          <p className="text-sm text-gray-600">
            Own a pawn shop in <span className="font-semibold text-gray-900">{cityName}</span>? Get featured placement at the top of this page for $29/month.
          </p>
          <Link
            href="/claim-listing"
            style={{ backgroundColor: "#1a2744" }}
            className="shrink-0 text-white font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity text-xs whitespace-nowrap"
          >
            Claim Your Listing
          </Link>
        </div>
      </div>
    </>
  );
}
