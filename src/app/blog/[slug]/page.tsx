import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles, getArticleBySlug } from "@/lib/articles";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: `${article.title} — FindAPawnShop.com`,
    description: article.description,
    alternates: { canonical: `https://www.findapawnshop.com/blog/${slug}` },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  if (slug !== "what-sells-for-the-most-at-a-pawn-shop") notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.datePublished,
    author: { "@type": "Organization", name: "FindAPawnShop.com" },
    publisher: { "@type": "Organization", name: "FindAPawnShop.com" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-amber-600">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-amber-600">Blog</Link>
          <span>/</span>
          <span className="text-gray-900 truncate">{article.title}</span>
        </nav>

        {/* Hero image */}
        <div className="relative w-full h-[400px] rounded-xl overflow-hidden mb-8">
          <Image
            src="https://images.unsplash.com/photo-1610375461246-83df859d849d?w=1200&q=80"
            alt="Jewelry and valuables laid out on a surface — common items sold at pawn shops"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Header */}
        <p className="text-xs text-gray-400 mb-3">{article.dateDisplay}</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-6">
          {article.title}
        </h1>

        {/* Article body */}
        <div className="prose-content">

          <p>
            Not all items are created equal at a pawn shop. Whether you&apos;re looking to sell
            outright or take a short-term loan, knowing which items command the highest offers can
            mean the difference between walking out with $50 or $500. Here&apos;s what pawn shops
            value most — and why.
          </p>

          <h2>1. Gold and Fine Jewelry</h2>
          <p>
            Gold is the king of pawn shop items. Unlike electronics that depreciate, gold holds its
            value based on weight and purity (measured in karats). A 14k gold chain, diamond ring,
            or gold bracelet will almost always get a strong offer. Silver and platinum jewelry also
            do well. Tips: clean your jewelry before bringing it in, know the karat weight, and check
            the current spot price of gold before your visit.
          </p>

          <h2>2. Luxury and Designer Watches</h2>
          <p>
            Rolex, Omega, Breitling, and Patek Philippe watches are among the most sought-after items
            at pawn shops. A genuine Rolex Submariner in good condition can fetch thousands. Even
            mid-tier brands like TAG Heuer and Movado get solid offers. Original box and papers
            significantly increase the value.
          </p>

          <h2>3. Firearms</h2>
          <p>
            Licensed pawn shops that deal in firearms can offer strong prices for handguns, rifles,
            and shotguns from reputable manufacturers like Glock, Smith &amp; Wesson, Sig Sauer, and
            Remington. Condition and documentation matter. Note: Illinois requires a FOID card for
            all firearm transactions.
          </p>

          <h2>4. High-End Electronics</h2>
          <p>
            Newer iPhones, MacBooks, iPads, and gaming consoles (PlayStation 5, Xbox Series X) get
            competitive offers — especially if they&apos;re recent models in good condition with
            original accessories. Older electronics drop off quickly in value, so timing matters.
          </p>

          <h2>5. Musical Instruments</h2>
          <p>
            Guitars, especially from brands like Gibson, Fender, and Martin, hold their value
            extremely well. Brass instruments, violins, and keyboards also do well. Vintage
            instruments can command premium prices. Always bring the case and any accessories.
          </p>

          <h2>6. Power Tools</h2>
          <p>
            Brand-name power tools from DeWalt, Milwaukee, and Makita are consistently in demand at
            pawn shops. Cordless drill sets, circular saws, and impact drivers in working condition
            sell quickly. Pawn shops in working-class neighborhoods often prioritize tools.
          </p>

          <h2>7. Collectibles and Coins</h2>
          <p>
            Rare coins, silver dollars, gold coins, and sports memorabilia can get strong offers from
            the right pawn shop. Value varies widely — do your research on current market prices
            before visiting. Not all pawn shops are equally knowledgeable about collectibles.
          </p>

          <h2>Tips for Getting the Best Price</h2>
          <ul>
            <li>Get quotes from multiple shops — prices vary significantly between pawnbrokers</li>
            <li>Clean and present your items well — first impressions affect offers</li>
            <li>Know the current market value before you go</li>
            <li>Bring documentation (receipts, appraisals, certificates of authenticity)</li>
            <li>Negotiate — initial offers are rarely final</li>
          </ul>

          <h2>Find a Pawn Shop Near You</h2>
          <p>
            Ready to visit a pawn shop? Browse our directory of verified pawn shops across{" "}
            <Link href="/illinois" className="text-amber-600 hover:underline">Illinois</Link>,
            including{" "}
            <Link href="/illinois/chicago" className="text-amber-600 hover:underline">
              pawn shops in Chicago
            </Link>
            . Each listing includes ratings, hours, addresses, and direct contact info so you can
            find the best shop near you before making the trip.
          </p>
        </div>
      </div>
    </>
  );
}
