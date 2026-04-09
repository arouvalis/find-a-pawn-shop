import type { Metadata } from "next";
import Link from "next/link";
import { getColoradoCities, getAllColoradoShops } from "@/lib/pawnShops";

export function generateMetadata(): Metadata {
  const cities = getColoradoCities().sort((a, b) => b.count - a.count);
  const total = getAllColoradoShops().length;
  const top = cities.slice(0, 3).map((c) => c.city);
  return {
    title: "Pawn Shops in Colorado — FindAPawnShop.com",
    description: `Browse ${total} verified pawn shops across Colorado — find addresses, hours, phone numbers, and ratings for pawn shops in ${top.join(", ")} and more.`,
  };
}

export default function ColoradoPage() {
  const cities = getColoradoCities();
  const total = getAllColoradoShops().length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-amber-600">Home</Link>
        <span>/</span>
        <span className="text-gray-900">Colorado</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Pawn Shops in Colorado</h1>
      <p className="text-gray-500 mb-10">{total} listings across {cities.length} cities</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {cities.map(({ citySlug, city, count }) => (
          <Link
            key={citySlug}
            href={`/colorado/${citySlug}`}
            className="border border-gray-200 rounded-lg px-4 py-3 hover:border-amber-400 hover:shadow-sm transition-all group"
          >
            <div className="font-medium text-gray-900 group-hover:text-amber-600 text-sm leading-tight">
              {city}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">{count} shop{count !== 1 ? "s" : ""}</div>
          </Link>
        ))}
      </div>

      {/* Owner callout */}
      <div style={{ backgroundColor: "#1a2744" }} className="mt-10 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-white">
          Own a pawn shop in <span className="font-semibold text-amber-400">Colorado</span>? Get featured placement for $29/month.
        </p>
        <Link
          href="/claim-listing"
          style={{ backgroundColor: "#f59e0b" }}
          className="shrink-0 text-gray-900 font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity text-xs whitespace-nowrap"
        >
          Claim Your Listing
        </Link>
      </div>
    </div>
  );
}
