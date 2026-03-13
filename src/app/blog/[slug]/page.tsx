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

// Per-article hero images
const HERO_IMAGES: Record<string, { src: string; alt: string }> = {
  "what-sells-for-the-most-at-a-pawn-shop": {
    src: "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=1200&q=80",
    alt: "Jewelry and valuables laid out on a surface — common items sold at pawn shops",
  },
  "what-will-a-pawn-shop-not-buy": {
    src: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=1200&q=80",
    alt: "Rejected or broken items that pawn shops typically won't accept",
  },
  "how-to-get-the-best-price-when-pawning-jewelry": {
    src: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&q=80",
    alt: "Gold and diamond jewelry laid out — tips for getting the best pawn shop price",
  },
  "best-pawn-shops-in-houston": {
    src: "https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=1200&q=80",
    alt: "Houston city skyline — guide to the best pawn shops in Houston, Texas",
  },
};

// Per-article body content
function ArticleBody({ slug }: { slug: string }) {
  if (slug === "what-sells-for-the-most-at-a-pawn-shop") {
    return (
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
    );
  }

  if (slug === "what-will-a-pawn-shop-not-buy") {
    return (
      <div className="prose-content">
        <p>
          Pawn shops will buy a surprisingly wide range of items — but not everything. Showing up
          with something a pawn shop won&apos;t accept wastes your time and theirs. Here&apos;s a
          rundown of items most pawn shops will turn down, and why.
        </p>

        <h2>1. Recalled or Unsafe Products</h2>
        <p>
          Pawn shops won&apos;t accept items that have been recalled by the manufacturer or that
          pose a safety risk. This includes certain older baby items, defective electronics, and
          products banned from resale. Pawnbrokers can face legal liability for reselling unsafe
          goods.
        </p>

        <h2>2. Items Without Proof of Ownership</h2>
        <p>
          Most pawn shops require a valid government ID and will run serial numbers on electronics
          and other items against stolen goods databases. If an item comes back as reported stolen,
          the pawn shop is required to hold it and notify police. Items with removed or altered
          serial numbers will be refused.
        </p>

        <h2>3. Counterfeit or Fake Goods</h2>
        <p>
          Fake designer handbags, counterfeit watches, and replica jewelry will be rejected — and
          experienced pawnbrokers are often skilled at spotting fakes. Attempting to pawn
          counterfeit goods can have legal consequences.
        </p>

        <h2>4. Most Clothing and Shoes</h2>
        <p>
          With rare exceptions (vintage designer pieces, high-end streetwear), pawn shops
          don&apos;t deal in clothing. The resale market is too fragmented and the items too
          difficult to value and store. Take clothing to consignment shops or sell on Poshmark
          instead.
        </p>

        <h2>5. Furniture and Large Appliances</h2>
        <p>
          Most pawn shops don&apos;t have the space or logistics to handle large furniture,
          mattresses, or major appliances like washers and dryers. A few specialty shops may take
          high-end items, but this is the exception.
        </p>

        <h2>6. Heavily Damaged or Broken Items</h2>
        <p>
          A cracked iPhone screen, a guitar with a broken neck, or a watch that doesn&apos;t run
          will get a very low offer or outright rejection. Pawn shops need to resell what they buy
          — if repair costs exceed resale value, they&apos;ll pass.
        </p>

        <h2>7. Out-of-Date Electronics</h2>
        <p>
          A first-generation iPad, an early flat-screen TV, or a decade-old laptop will likely be
          turned away. The market for obsolete electronics is too thin for most pawnbrokers to
          bother with.
        </p>

        <h2>8. Books, DVDs, and CDs</h2>
        <p>
          Physical media has collapsed in value. Most pawn shops stopped accepting books, DVDs, and
          CDs years ago. A few will take limited quantities of newer releases but don&apos;t count
          on it.
        </p>

        <h2>9. Firearms Without Proper Documentation (Illinois)</h2>
        <p>
          In Illinois, buying or selling a firearm requires a valid FOID card (Firearm
          Owner&apos;s Identification Card). Pawn shops that are licensed firearms dealers
          won&apos;t complete a transaction without one. Out-of-state ID won&apos;t substitute.
        </p>

        <h2>10. Items of Purely Sentimental Value</h2>
        <p>
          Handmade crafts, family heirlooms with no market value, custom-made items, or anything
          whose value is entirely personal won&apos;t interest a pawn shop. They need to resell
          what they buy — if there&apos;s no secondary market, there&apos;s no offer.
        </p>

        <h2>What To Do If a Pawn Shop Won&apos;t Take Your Item</h2>
        <ul>
          <li>Try a different shop — policies vary between pawnbrokers</li>
          <li>Consider Facebook Marketplace, eBay, or Craigslist for items with niche demand</li>
          <li>Consignment shops work well for clothing, furniture, and collectibles</li>
          <li>Donate for a tax deduction if resale value is minimal</li>
        </ul>

        <h2>Find a Pawn Shop Near You</h2>
        <p>
          Looking for a pawn shop that might take your item? Browse our verified listings across{" "}
          <Link href="/illinois" className="text-amber-600 hover:underline">Illinois</Link>,
          including{" "}
          <Link href="/illinois/chicago" className="text-amber-600 hover:underline">
            pawn shops in Chicago
          </Link>
          . Each listing includes ratings, hours, and contact info so you can call ahead before
          making the trip.
        </p>
      </div>
    );
  }

  if (slug === "how-to-get-the-best-price-when-pawning-jewelry") {
    return (
      <div className="prose-content">
        <p>
          Pawn shops make money on the spread between what they pay and what they sell for — which
          means your opening offer is rarely their best offer. With a little preparation, you can
          significantly increase what you walk out with. Here&apos;s how to get the most money when
          pawning or selling jewelry.
        </p>

        <h2>1. Know What You Have Before You Go</h2>
        <p>
          Before walking into any pawn shop, do your homework. Look up the current spot price of
          gold and silver at kitco.com or goldprice.org. Know the karat weight of your piece
          (stamped inside rings, on clasps). Weigh it if you can — a kitchen scale works fine. For
          diamond jewelry, pull any GIA or appraisal certificates you have. The more you know going
          in, the harder it is for a pawnbroker to lowball you.
        </p>

        <h2>2. Clean Your Jewelry First</h2>
        <p>
          Presentation matters. A dirty or tarnished piece looks like it&apos;s worth less — even
          if it isn&apos;t. Use a soft cloth and mild soap to clean gold and silver. For diamonds,
          a jewelry cleaning solution or a toothbrush with dish soap works well. Don&apos;t use
          harsh chemicals on pieces with softer stones like opals, emeralds, or pearls.
        </p>

        <h2>3. Bring Documentation</h2>
        <p>
          Appraisals, receipts, GIA certificates, and original packaging all increase your
          negotiating power. They prove authenticity and give the pawnbroker confidence in the
          item&apos;s value. A Rolex with original box and papers is worth dramatically more than
          one without.
        </p>

        <h2>4. Get Quotes from Multiple Shops</h2>
        <p>
          This is the single most effective thing you can do. Pawn shop offers vary widely —
          sometimes by 30–50% for the same item. Visit at least 2–3 shops before accepting any
          offer. Once you have competing quotes, you can use them as leverage: &ldquo;The shop on
          Milwaukee Ave offered me $X — can you beat that?&rdquo;
        </p>

        <h2>5. Understand the Difference Between Pawning and Selling</h2>
        <p>
          When you pawn jewelry, you&apos;re taking a short-term loan using the piece as
          collateral. You get the item back when you repay the loan plus interest. When you sell,
          you transfer ownership permanently for a one-time cash payment. Selling typically gets
          you more cash upfront. Pawning makes sense if you expect to want the piece back.
        </p>

        <h2>6. Time Your Visit Strategically</h2>
        <p>
          Gold and silver prices fluctuate daily. When spot prices are high, pawn shops can offer
          more and still make their margin. Check the current gold price before you go — if prices
          have spiked recently, it&apos;s a good time to sell. Avoid going right before a holiday
          when shops are busiest and staff are less focused on individual negotiations.
        </p>

        <h2>7. Negotiate — Always</h2>
        <p>
          The first offer is almost never the final offer. A simple &ldquo;Is that the best you
          can do?&rdquo; will often move the number. If you have documentation, competing quotes,
          or knowledge of the spot price, use them. Stay calm and professional — pawnbrokers deal
          with negotiations all day and respond better to informed, respectful customers than to
          pressure tactics.
        </p>

        <h2>8. Consider Your Alternatives</h2>
        <p>
          If the offers you&apos;re getting feel too low, consider alternatives: selling on eBay
          or Etsy (higher prices, more work), estate jewelry buyers, consignment with a jewelry
          store, or Facebook Marketplace for branded pieces. For gold specifically, some coin
          dealers and refiners pay closer to spot price than pawn shops.
        </p>

        <h2>Find Pawn Shops Near You</h2>
        <p>
          Ready to shop around for the best offer? Compare verified pawn shops across{" "}
          <Link href="/illinois" className="text-amber-600 hover:underline">Illinois</Link>,
          including{" "}
          <Link href="/illinois/chicago" className="text-amber-600 hover:underline">
            pawn shops in Chicago
          </Link>
          . Browse ratings and contact info to find reputable shops near you before making the
          trip — getting multiple quotes is the single best thing you can do to maximize your
          payout.
        </p>
      </div>
    );
  }

  if (slug === "best-pawn-shops-in-houston") {
    return (
      <div className="prose-content">
        <p>
          Houston is one of the largest cities in the United States — and it has one of the most
          active pawn shop markets to match. Whether you&apos;re looking to get a quick loan, sell
          jewelry, or find a deal on electronics or tools, Houston has hundreds of pawn shops to
          choose from. Here&apos;s a guide to finding the best ones.
        </p>

        <h2>What Makes a Great Pawn Shop in Houston?</h2>
        <p>
          Not all pawn shops are equal. The best ones have high Google ratings (4.5+), hundreds of
          reviews, clear posted hours, and staff who are knowledgeable about what they&apos;re
          buying. In Houston, the top shops tend to specialize — some focus on jewelry and gold,
          others on electronics and tools, others on firearms. Knowing what you&apos;re bringing in
          helps you find the right shop.
        </p>

        <h2>Top-Rated Houston Pawn Shops by Area</h2>

        <h3>Northwest Houston</h3>
        <p>
          Northwest Houston along FM 1960 and the Highway 290 corridor has a high concentration of
          pawn shops. Look for shops with strong review counts in the Cypress, Katy, and Spring
          areas.
        </p>

        <h3>Southwest Houston</h3>
        <p>
          The Braeswood, Meyerland, and Westheimer corridors have several well-established pawn
          shops that specialize in jewelry and gold. These areas tend to have higher-end merchandise
          and more experienced buyers.
        </p>

        <h3>East Houston / Pasadena</h3>
        <p>
          The Pasadena and east Houston area has a strong blue-collar tradition and pawn shops here
          often specialize in tools, firearms, and electronics. Good area for power tools and
          sporting goods.
        </p>

        <h3>Downtown / Midtown</h3>
        <p>
          Closer to downtown you&apos;ll find shops that deal heavily in jewelry, watches, and
          musical instruments. Foot traffic is higher and competition between shops can work in your
          favor when negotiating.
        </p>

        <h2>Tips for Pawning or Selling in Houston</h2>
        <ul>
          <li>
            Houston has no city-specific pawn regulations beyond Texas state law — all licensed
            shops must comply with the Texas Pawnshop Act
          </li>
          <li>All pawn transactions require a valid government-issued ID</li>
          <li>
            Houston pawn shops report all transactions to the Houston Police Department to prevent
            stolen goods from entering the market
          </li>
          <li>Interest rates on pawn loans are capped by Texas state law</li>
          <li>
            Always get quotes from at least 2–3 shops — prices vary significantly across
            Houston&apos;s competitive market
          </li>
        </ul>

        <h2>What Sells Best at Houston Pawn Shops?</h2>
        <p>
          Gold and silver jewelry, firearms (with valid Texas ID), newer iPhones and electronics,
          name-brand power tools (DeWalt, Milwaukee, Makita), and designer watches. Houston&apos;s
          oil and gas economy means high-end watches and jewelry move well here.
        </p>

        <h2>How to Find the Best Pawn Shop Near You in Houston</h2>
        <p>
          The fastest way to find a top-rated pawn shop in Houston is to browse verified listings
          with real ratings, hours, and contact info. Visit our{" "}
          <Link href="/texas/houston" className="text-amber-600 hover:underline">
            Houston pawn shops directory
          </Link>{" "}
          to see every shop in the area, sorted by review count. You can also browse the full{" "}
          <Link href="/texas" className="text-amber-600 hover:underline">
            Texas pawn shop directory
          </Link>{" "}
          if you&apos;re outside Houston or looking in the surrounding suburbs. Every listing
          includes the address, phone number, hours, and a direct link to Google Maps.
        </p>
      </div>
    );
  }

  return null;
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const hero = HERO_IMAGES[slug];
  if (!hero) notFound();

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
            src={hero.src}
            alt={hero.alt}
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

        <ArticleBody slug={slug} />
      </div>
    </>
  );
}
