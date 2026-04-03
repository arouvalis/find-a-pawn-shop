#!/usr/bin/env node
/**
 * generate-blog-posts.js
 *
 * Reads scripts/keyword-gaps-output.json, generates full blog posts via
 * the Anthropic API, then writes content into the codebase.
 *
 * Usage: node scripts/generate-blog-posts.js
 * Env:   ANTHROPIC_API_KEY must be set
 *
 * Writes to:
 *   src/lib/articles.ts          — adds Article metadata entry
 *   src/app/blog/[slug]/page.tsx — adds HERO_IMAGES entry + ArticleBody if-block
 */

'use strict';

const fs    = require('fs');
const path  = require('path');
const https = require('https');

const GAPS_PATH     = path.join(__dirname, 'keyword-gaps-output.json');
const ARTICLES_TS   = path.join(__dirname, '../src/lib/articles.ts');
const PAGE_TSX      = path.join(__dirname, '../src/app/blog/[slug]/page.tsx');
const MODEL         = 'claude-sonnet-4-20250514';
const MAX_TOKENS    = 4096;

// ─── Curated hero image pool ──────────────────────────────────────────────────
// Rotated by article index so consecutive posts get different images.

const HERO_IMAGES = [
  { url: 'https://images.unsplash.com/CHcoGbMq-vo?w=1200&q=80', alt: 'Pawn shop storefront' },
  { url: 'https://images.unsplash.com/PSyRo2P2Qbs?w=1200&q=80', alt: 'Jewelry and valuables at a pawn shop' },
  { url: 'https://images.unsplash.com/cB9k3TGFbag?w=1200&q=80', alt: 'Gold jewelry and coins' },
  { url: 'https://images.unsplash.com/BmyXMBBkuU0?w=1200&q=80', alt: 'Vintage items and collectibles' },
  { url: 'https://images.unsplash.com/KkTt0XCz49A?w=1200&q=80', alt: 'Cash and financial transaction' },
  { url: 'https://images.unsplash.com/6ksGE-3b8r8?w=1200&q=80', alt: 'Electronics and gadgets' },
];

function getHeroImage(index) {
  return HERO_IMAGES[index % HERO_IMAGES.length];
}

// ─── Anthropic API ────────────────────────────────────────────────────────────

function callClaude(prompt) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set.');

  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      messages: [{ role: 'user', content: prompt }],
    });

    const req = https.request(
      {
        hostname: 'api.anthropic.com',
        path:     '/v1/messages',
        method:   'POST',
        headers:  {
          'x-api-key':         apiKey,
          'anthropic-version': '2023-06-01',
          'content-type':      'application/json',
          'content-length':    Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            if (parsed.error) return reject(new Error(`API: ${parsed.error.message}`));
            resolve(parsed.content[0].text);
          } catch (e) {
            reject(new Error(`Parse error: ${e.message} — raw: ${data.slice(0, 300)}`));
          }
        });
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ─── Response parser ──────────────────────────────────────────────────────────
//
// Claude returns a structured text block:
//
//   DESCRIPTION: meta description under 160 chars
//
//   ---JSX---
//   <div className="prose-content">
//   ...
//   </div>
//   ---END---
//
// Images are no longer sourced from Claude — they come from the HERO_IMAGES pool.

function parseResponse(text) {
  const description = text.match(/^DESCRIPTION:\s*(.+)/m)?.[1]?.trim();
  const jsxMatch   = text.match(/---JSX---\r?\n([\s\S]*?)\r?\n---END---/);
  const jsxContent = jsxMatch?.[1]?.trim();

  const missing = [];
  if (!description) missing.push('DESCRIPTION');
  if (!jsxContent)  missing.push('JSX block (---JSX--- ... ---END---)');

  if (missing.length) {
    throw new Error(`Missing fields in Claude response: ${missing.join(', ')}\n\nResponse preview:\n${text.slice(0, 600)}`);
  }

  return { description, jsxContent };
}

// ─── Prompt builder ───────────────────────────────────────────────────────────

function buildPrompt(gap) {
  const { city, state, state_slug, city_slug } = gap;
  const cityPath  = state_slug && city_slug ? `/${state_slug}/${city_slug}` : null;
  const statePath = state_slug ? `/${state_slug}` : null;
  const stateLabel = state || 'this state';
  const locationLabel = state ? `${city}, ${state}` : city;

  // Build the closing paragraph conditionally
  const closingLinks = cityPath
    ? `Browse our complete{" "}
    <Link href="${cityPath}" className="text-amber-600 hover:underline">
      ${city} pawn shop listings
    </Link>
    {" "}with verified addresses, phone numbers, hours, and ratings.${statePath ? ` Looking for shops elsewhere in ${stateLabel}? Explore our full{" "}
    <Link href="${statePath}" className="text-amber-600 hover:underline">
      ${stateLabel} pawn shop directory
    </Link>
    .` : ''}`
    : `Browse our complete pawn shop directory to find verified listings near you.`;

  return `You are writing content for FindAPawnShop.com, a US pawn shop directory.

Generate a detailed blog post about the best pawn shops in ${locationLabel}.

Respond in EXACTLY this format — no extra text, no markdown fences:

DESCRIPTION: [meta description, max 160 chars, starting with "Looking for the best pawn shops in ${city}?"]

---JSX---
<div className="prose-content">
  [FULL ARTICLE JSX HERE]
</div>
---END---

════════════════════════════════
ARTICLE STRUCTURE (follow exactly):
════════════════════════════════

Opening paragraph (3-4 sentences):
- Describe the ${city} pawn market — size, character, key neighborhoods
- Mention the state licensing framework
- Include this link: <Link href="${cityPath || '/blog'}" className="text-amber-600 hover:underline">${city} pawn shops</Link>

<h2>How Pawn Shops Work in ${city} (Fast Overview)</h2>
- Two paragraphs on ${stateLabel} pawn regulations (licensing act name, loan requirements, pawn ticket rules)
- Second paragraph: ID requirements, hold periods, stolen goods reporting

<h2>Best Pawn Shops by ${city} Neighborhood</h2>
- 4–5 <h3> subsections, one per neighborhood
- Each subsection: 1-2 paragraphs describing the neighborhood's pawn scene (types of items, clientele, shop character)
- Do NOT link to specific shop listings — only link to ${cityPath || 'the city'} or ${statePath || 'state'} pages

<h2>${city}-Specific Pawn Tips (2026)</h2>
<ul> with 5–6 <li> items of locally specific advice

<h2>Quick Neighborhood Snapshot</h2>
<ul> with 4–5 <li> items — one line each: "Neighborhood — characteristic description"

<h2>FAQ: Pawn Shops in ${locationLabel}</h2>

<h3>Do pawn shops in ${city} buy jewelry?</h3>
<p>...</p>

<h3>What's the best pawn shop in ${city}?</h3>
<p>... Browse the full <Link href="${cityPath || '/blog'}" className="text-amber-600 hover:underline">${city} pawn shop directory</Link> ...</p>

<h3>How do pawn shops work in ${stateLabel}?</h3>
<p>...</p>

<h3>Are pawn shops in ${city} safe and regulated?</h3>
<p>...</p>

<h3>How long do ${city} pawn shops hold items before selling them?</h3>
<p>...</p>

<h2>Find Pawn Shops in ${city}</h2>
<p>
  Ready to find a pawn shop in ${city}?{" "}
  ${closingLinks}
</p>

════════════════════════════════
JSX RULES (critical):
════════════════════════════════
- IMPORTANT: Do NOT use HTML entities like &ldquo; &rdquo; &mdash; &apos; &hellip; &lsquo; &rsquo; &ndash; etc. Use the literal characters instead: " " — ' … directly in the text.
- Apostrophes in text nodes: use a literal ' character (e.g., shop's)
- Ampersands in text nodes: use &amp; (this one IS valid in JSX)
- Spaces before/after JSX expressions: use {" "}
- Do NOT link to individual shop pages (e.g. /${state_slug}/${city_slug}/some-shop)
- Only link to: ${cityPath || 'city page'} and ${statePath || 'state page'}
- All content must be factually accurate for ${locationLabel}
- Use real neighborhood names for ${city}
- Mention the actual ${stateLabel} pawn statute by name
- Do NOT include any text outside the ---JSX--- block`;
}

// ─── Date helpers ─────────────────────────────────────────────────────────────

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

function getNextPublishDate() {
  const content = fs.readFileSync(ARTICLES_TS, 'utf8');
  const dates = [...content.matchAll(/datePublished:\s*["'](\d{4}-\d{2}-\d{2})["']/g)]
    .map(m => new Date(m[1] + 'T12:00:00'));

  const base = dates.length
    ? dates.reduce((a, b) => (a > b ? a : b))
    : new Date();

  const next = new Date(base);
  next.setDate(next.getDate() + 7);

  return {
    datePublished: next.toISOString().slice(0, 10),
    dateDisplay:   `${MONTH_NAMES[next.getMonth()]} ${next.getDate()}, ${next.getFullYear()}`,
  };
}

// ─── File patchers ────────────────────────────────────────────────────────────

function getExistingSlugs() {
  const content = fs.readFileSync(ARTICLES_TS, 'utf8');
  return new Set([...content.matchAll(/slug:\s*["']([^"']+)["']/g)].map(m => m[1]));
}

function patchArticlesTS(slug, title, description, datePublished, dateDisplay) {
  let content = fs.readFileSync(ARTICLES_TS, 'utf8');

  // Escape any double quotes in description (unlikely but safe)
  const safeDesc = description.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

  const entry =
    `  {\n` +
    `    slug: "${slug}",\n` +
    `    title: "${title}",\n` +
    `    description: "${safeDesc}",\n` +
    `    datePublished: "${datePublished}",\n` +
    `    dateDisplay: "${dateDisplay}",\n` +
    `  },\n`;

  const marker = '];\n\nexport function getArticleBySlug';
  if (!content.includes(marker)) {
    throw new Error('Cannot find insertion point in articles.ts (expected "];\n\nexport function getArticleBySlug")');
  }

  fs.writeFileSync(ARTICLES_TS, content.replace(marker, entry + marker));
}

function patchPageTSX(slug, imageUrl, imageAlt, jsxContent) {
  let content = fs.readFileSync(PAGE_TSX, 'utf8');

  // ── 1. Insert into HERO_IMAGES ──────────────────────────────────────────────
  const heroMarker = '};\n\n// Per-article body content';
  if (!content.includes(heroMarker)) {
    throw new Error('Cannot find HERO_IMAGES closing "}" in page.tsx');
  }

  const heroEntry =
    `  "${slug}": {\n` +
    `    src: "${imageUrl}",\n` +
    `    alt: "${imageAlt}",\n` +
    `  },\n`;

  content = content.replace(heroMarker, heroEntry + heroMarker);

  // ── 2. Insert ArticleBody if-block before "return null;" ────────────────────
  const bodyMarker = '\n  return null;\n}';
  if (!content.includes(bodyMarker)) {
    throw new Error('Cannot find "return null;" in ArticleBody function in page.tsx');
  }

  // Indent each line of the JSX content by 6 spaces (inside return (...))
  const indented = jsxContent
    .trim()
    .split('\n')
    .map(line => '      ' + line)
    .join('\n');

  const newBlock =
    `\n  if (slug === "${slug}") {\n` +
    `    return (\n` +
    `${indented}\n` +
    `    );\n` +
    `  }\n`;

  content = content.replace(bodyMarker, newBlock + bodyMarker);

  fs.writeFileSync(PAGE_TSX, content);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!fs.existsSync(GAPS_PATH)) {
    console.error(`${GAPS_PATH} not found — run find-keyword-gaps.js first.`);
    process.exit(1);
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY is not set.');
    process.exit(1);
  }

  const gaps = JSON.parse(fs.readFileSync(GAPS_PATH, 'utf8'));
  console.log(`Found ${gaps.length} keyword gap(s) to process.\n`);

  let generated = 0;
  let skipped   = 0;
  let failed    = 0;

  for (let i = 0; i < gaps.length; i++) {
    const gap = gaps[i];

    // Re-read slugs each iteration (we add to the file inside the loop)
    if (getExistingSlugs().has(gap.suggested_slug)) {
      console.log(`[${i + 1}/${gaps.length}] SKIP  ${gap.suggested_slug} (already exists)`);
      skipped++;
      continue;
    }

    const loc = gap.state ? `${gap.city}, ${gap.state}` : gap.city;
    console.log(`[${i + 1}/${gaps.length}] GEN   ${loc} — ${gap.suggested_slug}`);
    console.log(`       impressions: ${gap.impressions}  clicks: ${gap.clicks}`);

    let responseText;
    try {
      responseText = await callClaude(buildPrompt(gap));
    } catch (err) {
      console.error(`       ERROR (API): ${err.message}`);
      failed++;
      continue;
    }

    let parsed;
    try {
      parsed = parseResponse(responseText);
    } catch (err) {
      console.error(`       ERROR (parse): ${err.message}`);
      failed++;
      continue;
    }

    const dates = getNextPublishDate();

    try {
      patchArticlesTS(
        gap.suggested_slug,
        gap.suggested_title,
        parsed.description,
        dates.datePublished,
        dates.dateDisplay,
      );
      const hero = getHeroImage(generated);
      patchPageTSX(gap.suggested_slug, hero.url, hero.alt, parsed.jsxContent);
      console.log(`       ✓ Written — ${dates.dateDisplay}`);
      generated++;
    } catch (err) {
      console.error(`       ERROR (write): ${err.message}`);
      failed++;
      continue;
    }

    // Brief pause to respect rate limits
    if (i < gaps.length - 1) await new Promise(r => setTimeout(r, 1200));
  }

  console.log('\n── Summary ──────────────────────────────────────────────────');
  console.log(`  Generated : ${generated}`);
  console.log(`  Skipped   : ${skipped}`);
  console.log(`  Failed    : ${failed}`);

  if (failed > 0) process.exit(1);
}

main().catch(err => {
  console.error('\nFatal:', err.message);
  process.exit(1);
});
