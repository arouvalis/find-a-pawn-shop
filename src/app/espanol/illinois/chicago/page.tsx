import type { Metadata } from "next";
import Link from "next/link";
import { getShopsByCity, formatAddress } from "@/lib/pawnShops";

export const metadata: Metadata = {
  title: "Casas de Empeño en Chicago, Illinois — FindAPawnShop.com",
  description: "Encuentra las mejores casas de empeño en Chicago, IL. Directorio verificado con direcciones, horarios y teléfonos en Pilsen, Little Village y más.",
};

const FAQS = [
  { q: "¿Dónde están las casas de empeño en Chicago?", a: "Hay casas de empeño en varios vecindarios de Chicago, incluyendo Pilsen, Little Village, el South Side y el Northwest Side. Muchas sirven a las comunidades latinoamericanas con servicio en español." },
  { q: "¿Qué leyes regulan las casas de empeño en Illinois?", a: "En Illinois, las casas de empeño operan bajo la Ley de Regulación de Prestamistas (Pawnbroker Regulation Act), que establece tasas de interés máximas y requiere licencias estatales." },
  { q: "¿Puedo recuperar mi artículo después de empeñarlo?", a: "Sí, en Illinois tienes hasta un año para recuperar tu artículo pagando el préstamo más los intereses. Si no puedes pagar, la tienda puede vender el artículo pero no te cobra deuda adicional." },
];

export default function ChicagoEspanolPage() {
  const shops = getShopsByCity("chicago");
  const sorted = [...shops].sort((a, b) => (b.reviews ?? -1) - (a.reviews ?? -1));

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-amber-600">Home</Link>
        <span>/</span>
        <Link href="/espanol" className="hover:text-amber-600">Español</Link>
        <span>/</span>
        <span className="text-gray-900">Chicago</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Casas de Empeño en Chicago, Illinois</h1>
      <p className="text-gray-500 mb-4">{shops.length} negocios encontrados</p>
      <p className="text-gray-600 mb-10 max-w-2xl">
        Directorio completo de casas de empeño en Chicago. Encuentra tiendas en Pilsen,
        Little Village, South Side y otros vecindarios con servicio en español.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {sorted.map((shop) => (
          <Link
            key={shop.slug}
            href={`/illinois/chicago/${shop.slug}`}
            className="border border-gray-200 rounded-lg p-5 hover:border-amber-400 hover:shadow-md transition-all group block"
          >
            <h2 className="font-semibold text-gray-900 group-hover:text-amber-600 mb-2 leading-tight">{shop.name}</h2>
            {(shop.street || shop.city) && <p className="text-sm text-gray-500 mb-2">{formatAddress(shop)}</p>}
            {shop.phone && <p className="text-sm text-gray-600 mb-2">{shop.phone}</p>}
            {shop.rating !== null && (
              <div className="flex items-center gap-1.5 mt-3">
                <span className="text-amber-500 text-sm">★</span>
                <span className="text-sm font-medium text-gray-800">{shop.rating.toFixed(1)}</span>
                {shop.reviews !== null && <span className="text-xs text-gray-400">({shop.reviews} reseñas)</span>}
              </div>
            )}
          </Link>
        ))}
      </div>

      <div className="mt-12 max-w-2xl">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Preguntas Frecuentes — Chicago</h2>
        <div className="divide-y divide-gray-200 border border-gray-200 rounded-xl overflow-hidden">
          {FAQS.map(({ q, a }) => (
            <div key={q} className="p-5">
              <h3 className="font-semibold text-gray-900 mb-2">{q}</h3>
              <p className="text-gray-600 text-sm">{a}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
        <Link href="/illinois/chicago" className="text-amber-600 hover:underline">Ver en inglés</Link>
        {" · "}
        <Link href="/espanol/california/santa-ana" className="text-amber-600 hover:underline">Casas de empeño en Santa Ana</Link>
        {" · "}
        <Link href="/espanol" className="text-amber-600 hover:underline">Todas las ciudades</Link>
      </div>
    </div>
  );
}
