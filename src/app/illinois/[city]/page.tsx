import type { Metadata } from "next";
import Link from "next/link";
import { getCities, getShopsByCity, formatAddress } from "@/lib/pawnShops";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ city: string }>;
}

export async function generateStaticParams() {
  return getCities().map(({ citySlug }) => ({ city: citySlug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: citySlug } = await params;
  const shops = getShopsByCity(citySlug);
  if (!shops.length) return {};
  const cityName = shops[0].city;
  return {
    title: `Pawn Shops in ${cityName}, Illinois — FindAPawnShop.com`,
    description: `Browse ${shops.length} pawn shop${shops.length !== 1 ? "s" : ""} in ${cityName}, Illinois. Ratings, hours, addresses, and contact info.`,
  };
}

export default async function CityPage({ params }: Props) {
  const { city: citySlug } = await params;
  const shops = getShopsByCity(citySlug);
  if (!shops.length) notFound();

  const cityName = shops[0].city;
  const sorted = [...shops].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-amber-600">Home</Link>
        <span>/</span>
        <Link href="/illinois" className="hover:text-amber-600">Illinois</Link>
        <span>/</span>
        <span className="text-gray-900">{cityName}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Pawn Shops in {cityName}, Illinois
      </h1>
      <p className="text-gray-500 mb-10">{shops.length} listing{shops.length !== 1 ? "s" : ""} found</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {sorted.map((shop) => (
          <Link
            key={shop.slug}
            href={`/illinois/${citySlug}/${shop.slug}`}
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
    </div>
  );
}
