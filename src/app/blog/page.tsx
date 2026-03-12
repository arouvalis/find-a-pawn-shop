import type { Metadata } from "next";
import Link from "next/link";
import { articles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Pawn Shop Blog — Tips, Guides & Insights — FindAPawnShop.com",
  description:
    "Pawn shop tips, guides, and insights to help you get the best price when buying, selling, or pawning valuables.",
};

export default function BlogIndexPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-amber-600">Home</Link>
        <span>/</span>
        <span className="text-gray-900">Blog</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Pawn Shop Blog</h1>
      <p className="text-gray-500 mb-10">Tips, guides, and insights for buyers and sellers.</p>

      <div className="space-y-6">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/blog/${article.slug}`}
            className="block border border-gray-200 rounded-xl p-6 hover:border-amber-400 hover:shadow-sm transition-all group"
          >
            <p className="text-xs text-gray-400 mb-2">{article.dateDisplay}</p>
            <h2 className="text-lg font-bold text-gray-900 group-hover:text-amber-600 mb-2 leading-snug">
              {article.title}
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">{article.description}</p>
            <span className="inline-block mt-4 text-sm font-semibold text-amber-600">
              Read article →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
