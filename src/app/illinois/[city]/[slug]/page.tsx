import type { Metadata } from "next";
import Link from "next/link";
import { getAllShops, getShopBySlug, parseHours, formatAddress } from "@/lib/pawnShops";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ city: string; slug: string }>;
}

export async function generateStaticParams() {
  return getAllShops().map((shop) => ({
    city: shop.citySlug,
    slug: shop.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city, slug } = await params;
  const shop = getShopBySlug(city, slug);
  if (!shop) return {};
  return {
    title: `${shop.name} — ${shop.city}, Illinois — FindAPawnShop.com`,
    description: `${shop.name} is a pawn shop in ${shop.city}, Illinois. ${shop.rating ? `Rated ${shop.rating}/5 from ${shop.reviews} reviews. ` : ""}View address, hours, and contact info.`,
  };
}

export default async function ListingPage({ params }: Props) {
  const { city: citySlug, slug } = await params;
  const shop = getShopBySlug(citySlug, slug);
  if (!shop) notFound();

  const hours = parseHours(shop.hours);
  const address = formatAddress(shop);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-amber-600">Home</Link>
        <span>/</span>
        <Link href="/illinois" className="hover:text-amber-600">Illinois</Link>
        <span>/</span>
        <Link href={`/illinois/${citySlug}`} className="hover:text-amber-600">{shop.city}</Link>
        <span>/</span>
        <span className="text-gray-900">{shop.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{shop.name}</h1>
        {shop.rating !== null && (
          <div className="flex items-center gap-2">
            <span className="text-amber-500">★</span>
            <span className="font-semibold text-gray-800">{shop.rating.toFixed(1)}</span>
            {shop.reviews !== null && (
              <span className="text-sm text-gray-400">({shop.reviews} reviews)</span>
            )}
          </div>
        )}
      </div>

      {/* Details card */}
      <div className="border border-gray-200 rounded-xl p-6 space-y-5 mb-8">
        {address && (
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Address</div>
            <p className="text-gray-800">{address}</p>
          </div>
        )}

        {shop.phone && (
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Phone</div>
            <a href={`tel:${shop.phone}`} className="text-gray-800 hover:text-amber-600 transition-colors">
              {shop.phone}
            </a>
          </div>
        )}

        {shop.website && (
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Website</div>
            <a
              href={shop.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-600 hover:underline break-all"
            >
              {shop.website}
            </a>
          </div>
        )}

        {hours.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Hours</div>
            <table className="text-sm w-full">
              <tbody>
                {hours.map(({ day, open, close }) => (
                  <tr key={day} className="border-b border-gray-100 last:border-0">
                    <td className="py-1.5 pr-6 text-gray-600 font-medium w-32">{day}</td>
                    <td className="py-1.5 text-gray-800">{open} – {close}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Google Maps link */}
      {shop.googleMapsUrl && (
        <a
          href={shop.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ backgroundColor: "#1a2744" }}
          className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity text-sm"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          View on Google Maps
        </a>
      )}
    </div>
  );
}
