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
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
