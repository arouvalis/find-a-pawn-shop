'use strict';
/**
 * fix-hero-images.js
 *
 * Replaces AI-generated (often hallucinated) hero images in page.tsx with
 * the curated HERO_IMAGES pool, rotated by article index.
 * The original hand-curated articles (Houston, Chicago, Miami, etc.) are left alone.
 */

const fs   = require('fs');
const path = require('path');

const PAGE_TSX = path.join(__dirname, '../src/app/blog/[slug]/page.tsx');

const HERO_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=1200&q=80', alt: 'Pawn shop storefront' },
  { url: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1200&q=80', alt: 'Jewelry and valuables at a pawn shop' },
  { url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200&q=80', alt: 'Gold jewelry and coins' },
  { url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&q=80', alt: 'Vintage items and collectibles' },
  { url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80', alt: 'Cash and financial transaction' },
  { url: 'https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?w=1200&q=80', alt: 'Electronics and gadgets' },
];

// These 6 were hand-curated — leave them alone
const KEEP_SLUGS = new Set([
  'what-sells-for-the-most-at-a-pawn-shop',
  'what-will-a-pawn-shop-not-buy',
  'how-to-get-the-best-price-when-pawning-jewelry',
  'best-pawn-shops-in-houston',
  'best-pawn-shops-in-chicago',
  'best-pawn-shops-in-miami',
]);

let content = fs.readFileSync(PAGE_TSX, 'utf8');

// Extract all slugs from HERO_IMAGES in document order
const heroSlugRe = /^\s+"([^"]+)":\s*\{/gm;
const allSlugs = [...content.matchAll(heroSlugRe)].map(m => m[1]);

let poolIndex = 0;
let replaced  = 0;

for (const slug of allSlugs) {
  if (KEEP_SLUGS.has(slug)) continue;

  const hero = HERO_IMAGES[poolIndex % HERO_IMAGES.length];
  poolIndex++;

  // Replace the src and alt for this slug's entry
  // Matches the block:  "slug": {\n    src: "...",\n    alt: "...",\n  },
  const entryRe = new RegExp(
    `("${slug.replace(/[-]/g, '\\-')}":\\s*\\{\\s*\\n\\s*src:\\s*)"[^"]*"(,\\s*\\n\\s*alt:\\s*)"[^"]*"`,
  );

  const updated = content.replace(entryRe, `$1"${hero.url}"$2"${hero.alt}"`);

  if (updated === content) {
    console.warn(`  WARN: could not find/replace entry for "${slug}"`);
  } else {
    content = updated;
    replaced++;
  }
}

fs.writeFileSync(PAGE_TSX, content);
console.log(`Replaced ${replaced} hero images across ${allSlugs.length} total entries (${KEEP_SLUGS.size} kept).`);
