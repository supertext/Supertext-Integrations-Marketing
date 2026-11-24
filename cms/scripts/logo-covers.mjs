// Covers for articles about several systems and for those without an interface to show:
// the systems' logos (Simple Icons, from web/src/lib/system-icons.js, else the site's monogram
// tile), the Swiss languages, the Alps, in the site's colours. No words except codes and names
// that are the same in every language.   node cms/scripts/logo-covers.mjs <out-dir>
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { SYSTEM_ICONS } from '../../web/src/lib/system-icons.js';
const { chromium } = createRequire(import.meta.url)('playwright');
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const font = fs.readFileSync(path.join(root, 'web/public/fonts/ABCGintoNord-Regular.woff2')).toString('base64');
const logo = fs.readFileSync(path.join(root, 'web/public/supertext-logo.svg'), 'utf8');

// [slug, name] per system; the name gives the monogram when there's no icon.
const ROUNDUPS = {
  'typo3-contao-neos': [['typo3', 'TYPO3'], ['contao', 'Contao'], ['neos', 'Neos']],
  'wordpress-drupal-joomla': [['wordpress-polylang', 'WordPress'], ['drupal', 'Drupal'], ['joomla', 'Joomla']],
  'craft-silverstripe-grav': null,
  'wagtail-django-umbraco-orchard': [['wagtail', 'Wagtail'], ['django-cms', 'django CMS'], ['umbraco', 'Umbraco'], ['orchard-core', 'Orchard Core']],
  'adobe-experience-manager-magnolia': [['adobe-experience-manager', 'Adobe Experience Manager'], ['magnolia', 'Magnolia']],
  'magento-prestashop-shopify': [['magento', 'Magento'], ['prestashop', 'PrestaShop'], ['shopify', 'Shopify'], ['wix', 'Wix']],
  'strapi-payload-directus-ghost-apostrophe': [['strapi', 'Strapi'], ['payload-cms', 'Payload'], ['directus', 'Directus'], ['ghost', 'Ghost'], ['apostrophecms', 'ApostropheCMS']],
  'hubspot-mailchimp': [['hubspot', 'HubSpot'], ['mailchimp', 'Mailchimp']],
};

// Official logos for systems without an icon (cms/src/seed/logos/<slug>.png), as on the site.
const LOGOS = path.join(root, 'cms/src/seed/logos');
const logoFile = (slug) => { const f = path.join(LOGOS, `${slug}.png`); return fs.existsSync(f) ? fs.readFileSync(f).toString('base64') : null; };
const initials = (name) => name.split(/[\s-]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
const isLight = (hex) => { const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255); return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.6; };
function tile([slug, name], size) {
  const png = logoFile(slug);
  if (png) return `<div class="tile" style="width:${size}px;height:${size}px"><img src="data:image/png;base64,${png}" width="${size}" height="${size}"></div>`;
  const icon = SYSTEM_ICONS[slug];
  if (!icon) return `<div class="tile mono" style="width:${size}px;height:${size}px;font-size:${size * 0.3}px">${initials(name)}</div>`;
  const light = isLight(icon.hex);
  return `<div class="tile" style="width:${size}px;height:${size}px;${light ? `background:#${icon.hex}` : ''}"><svg viewBox="0 0 24 24" width="${size * 0.56}" height="${size * 0.56}"><path d="${icon.path}" fill="${light ? '#15171a' : `#${icon.hex}`}"/></svg></div>`;
}
const ALPS = `<svg class="alps" viewBox="0 0 1600 800" width="1600" height="800"><path d="M0 660 L150 600 L250 630 L380 585 L520 625 L700 595 L860 635 L1000 585 L1130 615 L1250 560 L1330 450 L1372 470 L1395 462 L1450 545 L1530 570 L1600 555 L1600 800 L0 800 Z" fill="#1a4645"/><path d="M1330 450 L1372 470 L1395 462 L1414 497 L1392 486 L1368 504 L1344 486 L1318 503 Z" fill="#e8f0ef"/><path d="M0 720 L220 675 L420 700 L640 665 L860 695 L1060 668 L1260 696 L1440 672 L1600 688 L1600 800 L0 800 Z" fill="#003230"/></svg>`;
const chips = (codes) => `<div class="chips">${codes.map((c) => `<span>${c}</span>`).join('')}</div>`;
const page = (inner) => `<!doctype html><html><head><style>
@font-face{font-family:Ginto;src:url(data:font/woff2;base64,${font})}
body{margin:0;width:1600px;height:800px;position:relative;overflow:hidden;background:linear-gradient(135deg,#e9f9ef,#f2f2f2);font-family:'DejaVu Sans',sans-serif}
.alps{position:absolute;left:0;top:0}
.stage{position:absolute;left:0;right:0;top:175px;display:flex;flex-direction:column;align-items:center;gap:44px}
.row{display:flex;align-items:center;gap:36px}
.tile{display:flex;align-items:center;justify-content:center;background:#fff;border-radius:22%;box-shadow:0 14px 36px rgba(0,50,48,.18)}
.mono{background:#003230;color:#78ffaf;font-family:Ginto}
.chips{display:flex;gap:18px}.chips span{background:#78ffaf;color:#003230;font:700 30px 'DejaVu Sans Mono',monospace;padding:14px 26px;border-radius:40px;box-shadow:0 10px 24px rgba(0,50,48,.15)}
.arrow{width:84px;height:52px}
.win{width:860px;background:#fff;border-radius:22px;box-shadow:0 18px 44px rgba(0,50,48,.2);overflow:hidden}
.win .bar{height:44px;background:#f2f2f2;display:flex;gap:10px;align-items:center;padding:0 18px}.win .bar i{width:13px;height:13px;border-radius:50%;background:#dfe1df}
.msg{margin:22px 28px;border-radius:18px;padding:18px 22px;display:grid;gap:12px}
.msg b{display:block;height:14px;border-radius:7px;background:#c9d4d3}
.me{margin-left:300px;background:#e9f9ef}.me b{background:#9bd8b3}
.ai{margin-right:200px;background:#f2f2f2}
.tool{margin:0 28px 26px;display:flex;align-items:center;gap:18px;background:#003230;border-radius:16px;padding:16px 22px;color:#78ffaf;font:700 26px 'DejaVu Sans Mono',monospace}
.tool svg{height:34px;width:auto}
.file{width:200px;height:250px;background:#fff;border-radius:18px;box-shadow:0 14px 36px rgba(0,50,48,.18);position:relative;display:flex;align-items:flex-end;justify-content:center;padding-bottom:30px;box-sizing:border-box}
.file:before{content:'';position:absolute;top:0;right:0;width:56px;height:56px;background:linear-gradient(225deg,#e9f9ef 50%,#dfe1df 50%);border-top-right-radius:18px}
.file .lines{position:absolute;top:60px;left:30px;right:30px;display:grid;gap:12px}.file .lines b{height:10px;border-radius:5px;background:#dfe1df}
.file span{background:#78ffaf;color:#003230;font:700 30px 'DejaVu Sans Mono',monospace;padding:8px 18px;border-radius:30px}
</style></head><body>${ALPS}<div class="stage">${inner}</div></body></html>`;
const ARROW = `<svg class="arrow" viewBox="0 0 84 52"><path d="M6 26 h66 m-22 -20 l22 20 l-22 20" stroke="#003230" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const SWISS = chips(['de-CH', 'fr-CH', 'it-CH']);

const covers = {};
for (const [slug, systems] of Object.entries(ROUNDUPS)) {
  if (!systems) continue;
  const size = systems.length > 4 ? 190 : systems.length > 2 ? 220 : 250;
  covers[slug] = page(`<div class="row">${systems.map((s) => tile(s, size)).join('')}</div>${SWISS}`);
}
// Translation MCP: an assistant's chat with Supertext as its tool.
const bars = (widths) => widths.map((w) => `<b style="width:${w}%"></b>`).join('');
covers['translation-mcp'] = page(`<div class="win" style="margin-top:-30px"><div class="bar"><i></i><i></i><i></i></div>
  <div class="msg me">${bars([90, 60])}</div><div class="msg ai">${bars([95, 80, 40])}</div>
  <div class="tool">${logo.replace('<svg', '<svg preserveAspectRatio="xMinYMid meet"')}<span style="margin-left:auto">MCP</span></div></div>`);
// Design files: InDesign, Illustrator, CorelDRAW → an XLIFF file.
covers['design-files-xliff'] = page(`<div class="row">${[['adobe-indesign', 'InDesign'], ['adobe-illustrator', 'Illustrator'], ['coreldraw', 'CorelDRAW']].map((s) => tile(s, 200)).join('')}${ARROW}
  <div class="file"><div class="lines"><b></b><b style="width:80%"></b><b></b><b style="width:60%"></b></div><span>XLIFF</span></div></div>`);

const out = process.argv[2];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1600, height: 800 } });
for (const [slug, html] of Object.entries(covers)) {
  await p.setContent(html, { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: `${out}/${slug}.png` });
}
await b.close();
