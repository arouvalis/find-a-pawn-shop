'use strict';
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '../src/app/blog/[slug]/page.tsx');

let content = fs.readFileSync(FILE, 'utf8');

const replacements = [
  ['&ldquo;',  '\u201C'],  // "  left double quote
  ['&rdquo;',  '\u201D'],  // "  right double quote
  ['&mdash;',  '\u2014'],  // —  em dash
  ['&lsquo;',  '\u2018'],  // '  left single quote
  ['&rsquo;',  '\u2019'],  // '  right single quote
  ['&hellip;', '\u2026'],  // …  ellipsis
  ['&ndash;',  '\u2013'],  // –  en dash
  ['&apos;',   "'"],       // '  apostrophe
  // &amp; is valid JSX — intentionally left alone
];

let total = 0;
for (const [entity, char] of replacements) {
  let count = 0;
  const replaced = content.split(entity).join(char);
  count = content.split(entity).length - 1;
  content = replaced;
  if (count > 0) {
    console.log('  ' + String(count).padStart(5) + 'x  ' + entity + '  →  ' + char);
    total += count;
  }
}

// Fix {char} patterns where a single special Unicode char is the sole content
// of a JSX expression — e.g. {"\u201C"} or {—} — which are invalid JS.
// These came from AI writing {&ldquo;} or {&mdash;} as delimiters.
const bracePattern = /\{[\u201C\u201D\u2014\u2018\u2019\u2026\u2013]\}/g;
const braceMatches = content.match(bracePattern) || [];
if (braceMatches.length > 0) {
  content = content.replace(bracePattern, (m) => m.slice(1, -1));
  console.log('  ' + String(braceMatches.length).padStart(5) + 'x  {special-char}  →  bare char (braces removed)');
  total += braceMatches.length;
}

fs.writeFileSync(FILE, content);
console.log('\nTotal: ' + total + ' replacements written to page.tsx');
