import type { Metadata } from "next";
import Link from "next/link";
import { getSouthCarolinaCities, getAllSouthCarolinaShops } from "@/lib/pawnShops";

export function generateMetadata(): Metadata {
  const cities = getSouthCarolinaCities().sort((a, b) => b.count - a.count);
  const total = getAllSouthCarolinaShops().length;
  const top = cities.slice(0, 3).map((c) => c.city);
  return {
    title: "Pawn Shops in South Carolina — FindAPawnShop.com",
    description: `Browse ${total} verified pawn shops across South Carolina — find addresses, hours, phone numbers, and ratings for pawn shops in ${top.join(", ")} and more.`,
  };
}

export default function SouthCarolinaPage() {
  const cities = getSouthCarolinaCities();
  const total = getAllSouthCarolinaShops().length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-amber-600">Home</Link>
        <span>/</span>
        <span className="text-gray-900">South Carolina</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Pawn Shops in South Carolina</h1>
      <p className="text-gray-500 mb-10">{total} listings across {cities.length} cities</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {cities.map(({ citySlug, city, count }) => (
          <Link
            key={citySlug}
            href={`/south-carolina/${citySlug}`}
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
