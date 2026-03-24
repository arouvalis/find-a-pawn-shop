import type { Metadata } from "next";
import Link from "next/link";
import { getMinnesotaCities, getMinnesotaShopsByCity, formatAddress } from "@/lib/pawnShops";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ city: string }>;
}

export async function generateStaticParams() {
  return getMinnesotaCities().map(({ citySlug }) => ({ city: citySlug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: citySlug } = await params;
  const shops = getMinnesotaShopsByCity(citySlug);
  if (!shops.length) return {};
  const cityName = shops[0].city;
  return {
    title: `Pawn Shops in ${cityName}, Minnesota — FindAPawnShop.com`,
    description: `Find the best pawn shops in ${cityName}, Minnesota. Browse ${shops.length} verified listings with addresses, hours, phone numbers, and ratings. Compare pawn shops near you.`,
  };
}

export default async function MinnesotaCityPage({ params }: Props) {
  const { city: citySlug } = await params;
  const shops = getMinnesotaShopsByCity(citySlug);
  if (!shops.length) notFound();

  const cityName = shops[0].city;
  const sorted = [...shops].sort((a, b) => (b.reviews ?? -1) - (a.reviews ?? -1));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Pawn Shops in ${cityName}, Minnesota`,
    description: `Directory of pawn shops in ${cityName}, Minnesota`,
    numberOfItems: shops.length,
    itemListElement: sorted.map((shop, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: shop.name,
      url: `https://www.findapawnshop.com/minnesota/${citySlug}/${shop.slug}`,
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
          <Link href="/minnesota" className="hover:text-amber-600">Minnesota</Link>
          <span>/</span>
          <span className="text-gray-900">{cityName}</span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Pawn Shops in {cityName}, Minnesota
        </h1>
        <p className="text-gray-500 mb-10">{shops.length} listing{shops.length !== 1 ? "s" : ""} found</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sorted.map((shop) => (
            <Link
              key={shop.slug}
              href={`/minnesota/${citySlug}/${shop.slug}`}
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

        {citySlug === "minneapolis" && (
          <div className="mt-16 max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">FAQs About Pawn Shops in Minneapolis</h2>
            <div className="divide-y divide-gray-200 border border-gray-200 rounded-xl overflow-hidden">
              {[
                {
                  q: "How many pawn shops are in Minneapolis?",
                  a: "Minneapolis and the greater Twin Cities metro area — including St. Paul, Bloomington, Fridley, Burnsville, Richfield, and the western suburbs — have dozens of pawn shops. FindAPawnShop.com lists verified shops throughout the city and surrounding Hennepin and Ramsey counties.",
                },
                {
                  q: "Are pawn shops in Minneapolis licensed and regulated?",
                  a: "Yes — all pawn shops in Minnesota must be licensed under the Minnesota Pawnbroker Act. Minneapolis pawnbrokers are required to report all transactions to local law enforcement, hold purchased items for a mandatory waiting period, and maintain detailed transaction records to help prevent the resale of stolen goods.",
                },
                {
                  q: "What areas of Minneapolis have the most pawn shops?",
                  a: "Pawn shops in Minneapolis are spread across the city and suburbs, with concentrations along Lake Street, Central Avenue, and in inner-ring suburbs like Fridley, Richfield, and Crystal. The broader metro area — from Bloomington in the south to Coon Rapids in the north — has a well-distributed pawn market.",
                },
                {
                  q: "Can I sell gold and jewelry at a Minneapolis pawn shop?",
                  a: "Yes — gold, silver, and jewelry are among the most commonly traded items at Minneapolis pawn shops. Always check the current gold spot price before visiting and get quotes from multiple shops. Many Minneapolis pawn shops also buy electronics, tools, musical instruments, and sporting goods.",
                },
                {
                  q: "What are typical pawn shop hours in Minneapolis?",
                  a: "Most Minneapolis pawn shops are open Monday through Saturday, roughly 9AM to 6PM. Hours vary by location. Always check the individual listing page for exact hours before visiting.",
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
      </div>
    </>
  );
}
