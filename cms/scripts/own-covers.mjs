// Raw images for the news covers that don't come from a plugin's guide: the code examples of
// the SDK articles and screenshots of this site's own pages. make-covers.py then puts them on
// the cover background.   node cms/scripts/own-covers.mjs <raw-dir>
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright'); // the session's preinstalled Playwright, or npx playwright
const KT = `val client = SupertextClient(System.getenv("SUPERTEXT_API_KEY"))
val german = client.translateTexts(
    mapOf(
        "title" to Segment.text("Hello & welcome"),
        "body" to Segment.html("<p>Our <b>new</b> shop opens on Monday.</p>"),
    ),
    targetLang = "de-CH",
    sourceLang = "en",
)`;
const TS = `import { SupertextClient } from 'supertext-sdk/v1'

const client = new SupertextClient(process.env.SUPERTEXT_API_KEY ?? '')

const translated = await client.translateTexts(
  {
    title: 'Hello & welcome',
    body: { text: '<p>Our <b>new</b> shop opens on Monday.</p>', html: true },
  },
  'de-CH',
  { sourceLang: 'en', politeness: 'more' },
)`;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function hl(code, kw) {
  return code.split('\n').map((line) => {
    let out = '', i = 0;
    const re = /("[^"]*"|'[^']*')|(\/\/.*$)|\b(\w+)\b/g; let m;
    while ((m = re.exec(line))) {
      out += esc(line.slice(i, m.index));
      if (m[1]) out += `<span class=s>${esc(m[1])}</span>`;
      else if (m[2]) out += `<span class=c>${esc(m[2])}</span>`;
      else if (kw.includes(m[3])) out += `<span class=k>${m[3]}</span>`;
      else if (/^[A-Z]/.test(m[3])) out += `<span class=t>${m[3]}</span>`;
      else out += m[3];
      i = m.index + m[0].length;
    }
    return out + esc(line.slice(i));
  }).join('\n');
}
const page = (label, code) => `<!doctype html><html><head><style>
body{margin:0;width:1280px;font-family:'DejaVu Sans Mono',monospace;background:transparent}
.win{background:#003230;border-radius:14px;overflow:hidden}
.bar{display:flex;align-items:center;gap:8px;padding:14px 18px;background:#1a4645;color:#c9d4d3;font:600 15px 'DejaVu Sans',sans-serif}
.dot{width:12px;height:12px;border-radius:50%;background:#2f5e5c}.bar span:last-child{margin-left:12px}
pre{margin:0;padding:26px 30px 30px;color:#e8f0ef;font-size:21px;line-height:1.55}
.k{color:#78ffaf}.s{color:#ffd88a}.c{color:#7f9a98}.t{color:#9fd4ff}
</style></head><body><div class=win><div class=bar><i class=dot></i><i class=dot></i><i class=dot></i><span>${label}</span></div><pre>${code}</pre></div></body></html>`;
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 600 } });
for (const [name, label, code, kw] of [
  ['kotlin-sdk', 'Kotlin · com.supertext:supertext-sdk-kotlin', KT, ['val', 'to', 'fun']],
  ['sdks', 'TypeScript · supertext-sdk', TS, ['import', 'from', 'const', 'new', 'await', 'true']],
]) {
  await p.setContent(page(label, hl(code, kw)));
  await p.locator('.win').screenshot({ path: `${process.argv[2]}/${name}.png`, omitBackground: true });
}
// This site's own pages.
const site = await b.newPage({ viewport: { width: 1280, height: 800 } });
const SITE = 'https://integrations.supertext.com/en';
await site.goto(`${SITE}/support`, { waitUntil: 'networkidle' });
await site.screenshot({ path: `${process.argv[2]}/support-page.png`, clip: { x: 0, y: 200, width: 1280, height: 760 } });
await site.goto(`${SITE}/roadmap`, { waitUntil: 'networkidle' });
await site.screenshot({ path: `${process.argv[2]}/roadmap.png`, clip: { x: 0, y: 230, width: 1280, height: 800 } });
const top = (await site.locator('h2', { hasText: 'On the roadmap' }).first().boundingBox()).y;
await site.screenshot({ path: `${process.argv[2]}/new-systems-on-the-roadmap.png`, fullPage: true, clip: { x: 455, y: top - 40, width: 790, height: 560 } });
await b.close();
