#!/usr/bin/env node
/**
 * run-pipeline.js
 *
 * Master runner: resolve input → find keyword gaps → generate posts → git commit & push
 *
 * Usage:
 *   node scripts/run-pipeline.js ~/Downloads/Queries.csv
 *   node scripts/run-pipeline.js ~/Downloads/gsc-export.zip
 *
 * Env:
 *   ANTHROPIC_API_KEY   required for Step 2
 */

'use strict';

const fs         = require('fs');
const os         = require('os');
const path       = require('path');
const { execSync, spawnSync } = require('child_process');

const SCRIPTS_DIR   = __dirname;
const PROJECT_ROOT  = path.join(SCRIPTS_DIR, '..');
const ARTICLES_TS   = path.join(PROJECT_ROOT, 'src/lib/articles.ts');

// ─── Logging helpers ──────────────────────────────────────────────────────────

function banner(title) {
  const line = '─'.repeat(60);
  console.log(`\n${line}`);
  console.log(`  ${title}`);
  console.log(line);
}

function run(cmd) {
  console.log(`  $ ${cmd}`);
  const result = spawnSync(cmd, { shell: true, stdio: 'inherit', cwd: PROJECT_ROOT });
  if (result.status !== 0) {
    throw new Error(`Command exited with code ${result.status}: ${cmd}`);
  }
}

function exec(cmd) {
  return execSync(cmd, { encoding: 'utf8', cwd: PROJECT_ROOT }).trim();
}

// ─── Step 0: Resolve CSV from .zip or .csv ────────────────────────────────────

function resolveCSV(input) {
  const inputPath = input.replace(/^~/, os.homedir());

  if (!fs.existsSync(inputPath)) {
    throw new Error(`File not found: ${inputPath}`);
  }

  const ext = path.extname(inputPath).toLowerCase();

  if (ext === '.csv') {
    console.log(`  Using CSV directly: ${inputPath}`);
    return inputPath;
  }

  if (ext === '.zip') {
    console.log(`  Extracting from zip: ${inputPath}`);
    const tmpDir = path.join(os.tmpdir(), `gsc-extract-${Date.now()}`);
    fs.mkdirSync(tmpDir, { recursive: true });
    execSync(`unzip -o "${inputPath}" -d "${tmpDir}"`, { stdio: 'pipe' });

    // Search recursively for a file with "quer" in the name
    const found = execSync(`find "${tmpDir}" -iname "*quer*.csv"`, { encoding: 'utf8' })
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean);

    if (!found.length) {
      // Fall back to any .csv
      const any = execSync(`find "${tmpDir}" -name "*.csv"`, { encoding: 'utf8' })
        .split('\n')
        .map(l => l.trim())
        .filter(Boolean);
      if (!any.length) throw new Error('No CSV files found inside the zip.');
      console.log(`  Warning: could not find Queries.csv by name — using ${path.basename(any[0])}`);
      return any[0];
    }

    console.log(`  Extracted: ${path.basename(found[0])}`);
    return found[0];
  }

  throw new Error(`Unsupported extension: ${ext}  (expected .csv or .zip)`);
}

// ─── Step 3: Git commit and push ─────────────────────────────────────────────

function gitCommitAndPush() {
  // Check for changes
  const status = exec('git status --porcelain');
  if (!status) {
    console.log('  No changes to commit.');
    return;
  }

  console.log('  Changed files:');
  status.split('\n').forEach(l => console.log('    ' + l));

  // Determine which new slugs were added during this run
  const gapsPath = path.join(SCRIPTS_DIR, 'keyword-gaps-output.json');
  let newSlugs = [];
  if (fs.existsSync(gapsPath)) {
    const gaps = JSON.parse(fs.readFileSync(gapsPath, 'utf8'));
    const articlesContent = fs.readFileSync(ARTICLES_TS, 'utf8');
    newSlugs = gaps
      .map(g => g.suggested_slug)
      .filter(s => articlesContent.includes(`"${s}"`));
  }

  const commitMsg = newSlugs.length === 0
    ? 'Update blog pipeline output'
    : newSlugs.length === 1
      ? `Add blog post: ${newSlugs[0]}`
      : `Add ${newSlugs.length} blog posts: ${newSlugs.slice(0, 3).join(', ')}${newSlugs.length > 3 ? '...' : ''}`;

  // Stage only the files this pipeline touches
  run(`git add "${path.relative(PROJECT_ROOT, ARTICLES_TS)}" "src/app/blog/[slug]/page.tsx" "scripts/keyword-gaps-output.json"`);
  run(`git commit -m "${commitMsg}"`);
  run('git push');

  console.log(`\n  Committed: "${commitMsg}"`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  if (!args[0]) {
    console.error('Usage: node scripts/run-pipeline.js <Queries.csv | gsc-export.zip>');
    process.exit(1);
  }

  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║        FindAPawnShop.com — Blog Content Pipeline         ║');
  console.log('╚══════════════════════════════════════════════════════════╝');

  // ── Step 0: Resolve input ───────────────────────────────────────────────────
  banner('Step 0 — Resolving input file');
  let csvPath;
  try {
    csvPath = resolveCSV(args[0]);
  } catch (err) {
    console.error(`  ERROR: ${err.message}`);
    process.exit(1);
  }

  // ── Step 1: Find keyword gaps ───────────────────────────────────────────────
  banner('Step 1 — Finding keyword gaps');
  try {
    run(`node "${path.join(SCRIPTS_DIR, 'find-keyword-gaps.js')}" "${csvPath}"`);
  } catch (err) {
    console.error(`  FAILED: ${err.message}`);
    process.exit(1);
  }

  const gapsPath = path.join(SCRIPTS_DIR, 'keyword-gaps-output.json');
  const gaps = JSON.parse(fs.readFileSync(gapsPath, 'utf8'));

  if (gaps.length === 0) {
    console.log('\n  No new keyword opportunities found — nothing to generate.');
    process.exit(0);
  }

  console.log(`\n  Found ${gaps.length} opportunity(-ies) to generate.`);

  // ── Step 2: Generate blog posts ─────────────────────────────────────────────
  banner(`Step 2 — Generating ${gaps.length} blog post(s) via Anthropic API`);
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('  ERROR: ANTHROPIC_API_KEY is not set.');
    console.error('  Run:  export ANTHROPIC_API_KEY=sk-ant-...');
    process.exit(1);
  }

  try {
    run(`node "${path.join(SCRIPTS_DIR, 'generate-blog-posts.js')}"`);
  } catch (err) {
    // generate-blog-posts exits with code 1 only on all-failed; partial success is ok
    console.error(`  WARNING: Some posts may have failed — ${err.message}`);
  }

  // ── Step 3: Git commit and push ─────────────────────────────────────────────
  banner('Step 3 — Committing and pushing to git');
  try {
    gitCommitAndPush();
  } catch (err) {
    console.error(`  FAILED: ${err.message}`);
    process.exit(1);
  }

  banner('Pipeline complete ✓');
  const final = JSON.parse(fs.readFileSync(gapsPath, 'utf8'));
  const articlesContent = fs.readFileSync(ARTICLES_TS, 'utf8');
  const published = final.filter(g => articlesContent.includes(`"${g.suggested_slug}"`));
  console.log(`  Published: ${published.length} new blog post(s)`);
  published.forEach(g => console.log(`    - ${g.suggested_slug}`));
}

main().catch(err => {
  console.error('\nFatal pipeline error:', err.message);
  process.exit(1);
});
