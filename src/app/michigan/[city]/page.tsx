import type { Metadata } from "next";
import Link from "next/link";
import { getMichiganCities, getMichiganShopsByCity, formatAddress } from "@/lib/pawnShops";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ city: string }>;
}

export async function generateStaticParams() {
  return getMichiganCities().map(({ citySlug }) => ({ city: citySlug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: citySlug } = await params;
  const shops = getMichiganShopsByCity(citySlug);
  if (!shops.length) return {};
  const cityName = shops[0].city;
  return {
    title: `Pawn Shops in ${cityName}, Michigan — FindAPawnShop.com`,
    description: `Find the best pawn shops in ${cityName}, Michigan. Browse ${shops.length} verified listings with addresses, hours, phone numbers, and ratings. Compare pawn shops near you.`,
  };
}

export default async function MichiganCityPage({ params }: Props) {
  const { city: citySlug } = await params;
  const shops = getMichiganShopsByCity(citySlug);
  if (!shops.length) notFound();

  const cityName = shops[0].city;
  const sorted = [...shops].sort((a, b) => (b.reviews ?? -1) - (a.reviews ?? -1));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Pawn Shops in ${cityName}, Michigan`,
    description: `Directory of pawn shops in ${cityName}, Michigan`,
    numberOfItems: shops.length,
    itemListElement: sorted.map((shop, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: shop.name,
      url: `https://www.findapawnshop.com/michigan/${citySlug}/${shop.slug}`,
    })),
  };

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
          <Link href="/michigan" className="hover:text-amber-600">Michigan</Link>
          <span>/</span>
          <span className="text-gray-900">{cityName}</span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Pawn Shops in {cityName}, Michigan
        </h1>
        <p className="text-gray-500 mb-10">{shops.length} listing{shops.length !== 1 ? "s" : ""} found</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sorted.map((shop) => (
            <Link
              key={shop.slug}
              href={`/michigan/${citySlug}/${shop.slug}`}
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

        {citySlug === "detroit" && (
          <div className="mt-16 max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">FAQs About Pawn Shops in Detroit</h2>
            <div className="divide-y divide-gray-200 border border-gray-200 rounded-xl overflow-hidden">
              {[
                {
                  q: "How many pawn shops are in Detroit?",
                  a: "Detroit and the greater metro area — including suburbs like Hamtramck, Highland Park, Dearborn Heights, and surrounding Wayne County communities — have dozens of pawn shops. Detroit's large and diverse population supports an active pawn market. FindAPawnShop.com lists verified shops across Detroit neighborhoods and surrounding suburbs.",
                },
                {
                  q: "Are pawn shops in Detroit licensed and regulated?",
                  a: "Yes — all pawn shops in Michigan must be licensed under the Michigan Pawnbrokers Act (MCL 446.201 et seq.) and comply with local city ordinances. Pawnbrokers are required to report all transactions to local law enforcement, hold purchased items for a mandatory waiting period, and keep detailed records to prevent the resale of stolen goods.",
                },
                {
                  q: "What neighborhoods in Detroit have the most pawn shops?",
                  a: "Pawn shops in Detroit are spread across the city, with concentrations along major commercial corridors including Grand River Avenue, Michigan Avenue, and Seven Mile Road. The east side, west side, and areas near Downtown and Midtown all have accessible pawn shop options.",
                },
                {
                  q: "Can I sell gold and jewelry at a Detroit pawn shop?",
                  a: "Yes — gold, silver, and jewelry are among the most actively traded items at Detroit-area pawn shops. Always check the current gold spot price before visiting and get quotes from multiple shops. Many shops in the Detroit metro area specialize in jewelry, precious metals, and electronics.",
                },
                {
                  q: "What are typical pawn shop hours in Detroit?",
                  a: "Most Detroit pawn shops are open Monday through Saturday, roughly 9AM to 6PM. Hours vary by location and neighborhood. Always check the individual listing page for exact hours before making the trip.",
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
