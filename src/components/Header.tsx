import Link from "next/link";

export default function Header() {
  return (
    <header style={{ backgroundColor: "#1a2744" }} className="text-white">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight hover:opacity-90 transition-opacity">
          FindAPawnShop<span style={{ color: "#f59e0b" }}>.com</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/illinois" className="hover:text-amber-400 transition-colors">
            Illinois
          </Link>
          <Link href="/blog" className="hover:text-amber-400 transition-colors">
            Blog
          </Link>
        </nav>
      </div>
    </header>
  );
}
