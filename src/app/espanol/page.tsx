import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Casas de Empeño en Estados Unidos — FindAPawnShop.com",
  description: "Encuentra las mejores casas de empeño cerca de ti. Directorio completo con direcciones, horarios, teléfonos y calificaciones en todo Estados Unidos.",
};

const CITIES = [
  { href: "/espanol/california/santa-ana", label: "Santa Ana", sub: "California" },
  { href: "/espanol/california/los-angeles", label: "Los Ángeles", sub: "California" },
  { href: "/espanol/illinois/chicago", label: "Chicago", sub: "Illinois" },
  { href: "/espanol/new-york/new-york-city", label: "Nueva York", sub: "Nueva York" },
];

export default function EspanolPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-amber-600">Home</Link>
        <span>/</span>
        <span className="text-gray-900">Español</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Casas de Empeño en Estados Unidos
      </h1>
      <p className="text-gray-600 mb-10 max-w-2xl">
        Encuentra casas de empeño verificadas cerca de ti. Nuestro directorio incluye direcciones,
        horarios, números de teléfono y calificaciones de clientes para ayudarte a encontrar
        la mejor casa de empeño en tu área.
      </p>

      <h2 className="text-xl font-semibold text-gray-900 mb-5">Ciudades Principales</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {CITIES.map(({ href, label, sub }) => (
          <Link
            key={href}
            href={href}
            className="border border-gray-200 rounded-lg p-5 hover:border-amber-400 hover:shadow-md transition-all group block"
          >
            <div className="font-semibold text-gray-900 group-hover:text-amber-600">{label}</div>
            <div className="text-sm text-gray-400 mt-0.5">{sub}</div>
            <div className="text-xs text-amber-600 mt-2">Ver casas de empeño →</div>
          </Link>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 max-w-2xl mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">¿Cómo funciona una casa de empeño?</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-3">
          En una casa de empeño, puedes obtener un préstamo a corto plazo usando tus objetos
          de valor como garantía — joyas, electrónicos, instrumentos musicales y más.
          También puedes vender artículos directamente o comprar productos de segunda mano
          a precios accesibles.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed">
          Todas las casas de empeño en nuestro directorio están verificadas y operan bajo
          las leyes estatales que protegen a los consumidores.
        </p>
      </div>

      <div style={{ backgroundColor: "#1a2744" }} className="rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-white">
          ¿Tienes una casa de empeño? Obtén mayor visibilidad por <span className="font-semibold text-amber-400">$29/mes</span>.
        </p>
        <Link
          href="/claim-listing"
          style={{ backgroundColor: "#f59e0b" }}
          className="shrink-0 text-gray-900 font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity text-xs whitespace-nowrap"
        >
          Registra tu Negocio
        </Link>
      </div>
    </div>
  );
}
