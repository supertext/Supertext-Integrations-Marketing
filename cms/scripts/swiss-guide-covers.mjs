// Covers for the "Localise … for German-speaking Switzerland" guides: the system's logo
// (Simple Icons, from web/src/lib/system-icons.js), a Swiss flag, the Alps and a "de-CH" chip,
// in the site's colours. No words: one cover serves every language.
//   node cms/scripts/swiss-guide-covers.mjs <out-dir>
import { createRequire } from 'node:module';
import { SYSTEM_ICONS } from '../../web/src/lib/system-icons.js';
const { chromium } = createRequire(import.meta.url)('playwright');

const GUIDES = { 'guide-typo3-swiss-german': 'typo3', 'guide-wordpress-swiss-german': 'wordpress-polylang', 'guide-shopify-swiss-german': 'shopify', 'guide-drupal-swiss-german': 'drupal' };

const svg = (icon) => `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="800" viewBox="0 0 1600 800">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e9f9ef"/><stop offset="1" stop-color="#f2f2f2"/></linearGradient>
    <filter id="sh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="14" stdDeviation="18" flood-color="#003230" flood-opacity=".18"/></filter>
  </defs>
  <rect width="1600" height="800" fill="url(#bg)"/>
  <!-- The Alps, with the Matterhorn on the right -->
  <path d="M0 610 L150 540 L250 580 L380 520 L520 575 L700 540 L860 590 L1000 520 L1130 560 L1250 470 L1330 300 L1372 330 L1395 318 L1450 440 L1530 480 L1600 455 L1600 800 L0 800 Z" fill="#1a4645"/>
  <path d="M1330 300 L1372 330 L1395 318 L1418 368 L1392 352 L1366 378 L1340 350 L1310 372 Z" fill="#e8f0ef"/>
  <path d="M0 690 L220 630 L420 665 L640 615 L860 660 L1060 620 L1260 660 L1440 625 L1600 650 L1600 800 L0 800 Z" fill="#003230"/>
  <!-- The system's logo on a tile -->
  <g filter="url(#sh)"><rect x="330" y="150" width="300" height="300" rx="44" fill="#fff"/></g>
  <svg x="390" y="210" width="180" height="180" viewBox="0 0 24 24"><path d="${icon.path}" fill="#${icon.hex}"/></svg>
  <!-- Arrow -->
  <path d="M668 300 h84 m-26 -26 l26 26 l-26 26" stroke="#003230" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Swiss flag -->
  <g filter="url(#sh)"><rect x="790" y="150" width="300" height="300" rx="44" fill="#da291c"/></g>
  <path d="M910 200 h60 v70 h70 v60 h-70 v70 h-60 v-70 h-70 v-60 h70 Z" fill="#fff"/>
  <!-- de-CH chip -->
  <g filter="url(#sh)"><rect x="845" y="480" width="190" height="72" rx="36" fill="#78ffaf"/></g>
  <text x="940" y="528" text-anchor="middle" font-family="DejaVu Sans Mono, monospace" font-weight="700" font-size="34" fill="#003230">de-CH</text>
</svg>`;

const out = process.argv[2];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1600, height: 800 } });
for (const [slug, system] of Object.entries(GUIDES)) {
  await p.setContent(`<html><body style="margin:0">${svg(SYSTEM_ICONS[system])}</body></html>`);
  await p.screenshot({ path: `${out}/${slug}.png` });
}
await b.close();
