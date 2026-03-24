import type { Metadata } from "next";
import Link from "next/link";
import { getVirginiaCities, getAllVirginiaShops } from "@/lib/pawnShops";

export function generateMetadata(): Metadata {
  const cities = getVirginiaCities().sort((a, b) => b.count - a.count);
  const total = getAllVirginiaShops().length;
  const top = cities.slice(0, 3).map((c) => c.city);
  return {
    title: "Pawn Shops in Virginia — FindAPawnShop.com",
    description: `Browse ${total} verified pawn shops across Virginia — find addresses, hours, phone numbers, and ratings for pawn shops in ${top.join(", ")} and more.`,
  };
}

export default function VirginiaPage() {
  const cities = getVirginiaCities();
  const total = getAllVirginiaShops().length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-amber-600">Home</Link>
        <span>/</span>
        <span className="text-gray-900">Virginia</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Pawn Shops in Virginia</h1>
      <p className="text-gray-500 mb-10">{total} listings across {cities.length} cities</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {cities.map(({ citySlug, city, count }) => (
          <Link
            key={citySlug}
            href={`/virginia/${citySlug}`}
            className="border border-gray-200 rounded-lg px-4 py-3 hover:border-amber-400 hover:shadow-sm transition-all group"
          >
            <div className="font-medium text-gray-900 group-hover:text-amber-600 text-sm leading-tight">
              {city}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">{count} shop{count !== 1 ? "s" : ""}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
