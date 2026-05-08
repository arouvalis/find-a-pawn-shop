import type { Metadata } from "next";
import Link from "next/link";
import { getCaliforniaShopsByCity, formatAddress } from "@/lib/pawnShops";

export const metadata: Metadata = {
  title: "Casas de Empeño en Santa Ana, California — FindAPawnShop.com",
  description: "Encuentra las mejores casas de empeño en Santa Ana, CA. Directorio completo con direcciones, horarios y teléfonos. Joyería de empeño, electrónicos y más.",
};

const FAQS = [
  { q: "¿Qué aceptan las casas de empeño en Santa Ana?", a: "La mayoría aceptan joyas de oro y plata, electrónicos, teléfonos celulares, instrumentos musicales y herramientas." },
  { q: "¿Cómo funciona el empeño?", a: "Llevas tu artículo, recibes una oferta de préstamo y dejas el artículo como garantía. Tienes generalmente 30 días para recuperarlo pagando el préstamo más intereses." },
  { q: "¿Necesito identificación para empeñar?", a: "Sí, todas las casas de empeño en California requieren una identificación con foto válida emitida por el gobierno." },
];

export default function SantaAnaEspanolPage() {
  const shops = getCaliforniaShopsByCity("santa-ana");
  const sorted = [...shops].sort((a, b) => (b.reviews ?? -1) - (a.reviews ?? -1));

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-amber-600">Home</Link>
        <span>/</span>
        <Link href="/espanol" className="hover:text-amber-600">Español</Link>
        <span>/</span>
        <span className="text-gray-900">Santa Ana</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Casas de Empeño en Santa Ana, California</h1>
      <p className="text-gray-500 mb-4">{shops.length} negocios encontrados</p>
      <p className="text-gray-600 mb-10 max-w-2xl">
        Encuentra casas de empeño y joyerías de empeño en Santa Ana. Obtén préstamos rápidos
        usando tus joyas, electrónicos o artículos de valor como garantía.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {sorted.map((shop) => (
          <Link
            key={shop.slug}
            href={`/california/santa-ana/${shop.slug}`}
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
        <h2 className="text-xl font-bold text-gray-900 mb-4">Preguntas Frecuentes — Santa Ana</h2>
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
        <Link href="/california/santa-ana" className="text-amber-600 hover:underline">Ver en inglés</Link>
        {" · "}
        <Link href="/espanol/california/los-angeles" className="text-amber-600 hover:underline">Casas de empeño en Los Ángeles</Link>
        {" · "}
        <Link href="/espanol" className="text-amber-600 hover:underline">Todas las ciudades</Link>
      </div>
    </div>
  );
}
