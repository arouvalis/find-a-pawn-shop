export interface Article {
  slug: string;
  title: string;
  description: string;
  datePublished: string;
  dateDisplay: string;
}

export const articles: Article[] = [
  {
    slug: "what-sells-for-the-most-at-a-pawn-shop",
    title: "What Sells for the Most at a Pawn Shop in 2026",
    description:
      "Find out which items get the highest offers at pawn shops — from gold jewelry to designer watches. Real pawn shop insights to help you get the best price.",
    datePublished: "2026-01-15",
    dateDisplay: "January 15, 2026",
  },
  {
    slug: "what-will-a-pawn-shop-not-buy",
    title: "What Will a Pawn Shop Not Buy? Items They Usually Reject",
    description:
      "Before you make the trip, find out which items pawn shops typically won't accept — and why. Save yourself time with this complete guide.",
    datePublished: "2026-02-01",
    dateDisplay: "February 1, 2026",
  },
  {
    slug: "how-to-get-the-best-price-when-pawning-jewelry",
    title: "How to Get the Best Price When Pawning Jewelry",
    description:
      "Don't leave money on the table. Here's exactly how to prepare your jewelry, time your visit, and negotiate to get the highest offer at a pawn shop.",
    datePublished: "2026-02-15",
    dateDisplay: "February 15, 2026",
  },
  {
    slug: "best-pawn-shops-in-houston",
    title: "Best Pawn Shops in Houston, Texas (2026 Guide)",
    description:
      "Looking for the best pawn shops in Houston? We rounded up the top-rated pawn shops across Houston neighborhoods — with addresses, hours, and contact info.",
    datePublished: "2026-03-01",
    dateDisplay: "March 1, 2026",
  },
  {
    slug: "best-pawn-shops-in-chicago",
    title: "Best Pawn Shops in Chicago, Illinois (2026 Guide)",
    description:
      "Looking for the best pawn shops in Chicago? We rounded up the top-rated pawn shops across Chicago neighborhoods — with addresses, hours, and contact info.",
    datePublished: "2026-03-05",
    dateDisplay: "March 5, 2026",
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
