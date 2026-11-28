'use strict';

/**
 * Names for German in Switzerland (November 2026). The rule (Remy): in running text de-CH is
 * "Swiss Standard German" (Schweizer Hochdeutsch, allemand standard suisse, tedesco standard
 * svizzero); in lists (language pickers, tables, plugin settings) it is "German (Switzerland)"
 * (Deutsch (Schweiz), allemand (Suisse), tedesco (Svizzera)), as in Supertext's language list
 * (GET features). "Swiss German" (Schweizerdeutsch, suisse allemand, svizzero tedesco) is the
 * spoken dialect, as Zurich and Bernese German.
 *
 * Three steps, each a content update applied once to the live content and also run over the
 * starter content and the reviewed translations: RULES (2026-11-swiss-terms) named de-CH
 * "German (Switzerland)" everywhere; GUIDE_TITLES (2026-11-guide-titles) retitled the four
 * guides; TEXT (2026-11-swiss-text) puts "Swiss Standard German" back into running text and
 * keeps the list name where a list is meant. A rule ['keep', pattern] protects matching text
 * from the rules after it. UI labels quoted from other systems stay as they are.
 */

const SECTION = {
  en: {
    from: '## Swiss Standard German or dialect?\n\nWebsites in German-speaking Switzerland are written in **Swiss Standard German**: standard German with "ss" instead of "ß" and Swiss words and spellings. In Supertext that is **de-CH**, and it is what this guide uses. For a deliberately local tone, Supertext also writes **Swiss German dialect**, Zurich or Bernese (gsw-u-sd-chzh, gsw-u-sd-chbe), something most machine translation can\'t do.',
    to: '## German (Switzerland) or Swiss German?\n\nWebsites in German-speaking Switzerland are written in **German (Switzerland)**: standard German with "ss" instead of "ß" and Swiss words and spellings. In Supertext that is **de-CH**, and it is what this guide uses.\n\n**Swiss German** is the spoken dialect. For a deliberately local tone, Supertext writes it too, as Zurich or Bernese German, something most machine translation can\'t do. To translate into dialect, choose **Swiss German (Zurich)** (`gsw-u-sd-chzh`) or **Swiss German (Bern)** (`gsw-u-sd-chbe`) where this guide chooses de-CH.',
  },
  de: {
    from: '## Schweizer Hochdeutsch oder Mundart?\n\nWebsites in der Deutschschweiz werden auf **Schweizer Hochdeutsch** geschrieben: Standarddeutsch mit „ss“ statt „ß“ sowie mit Schweizer Wörtern und Schreibweisen. In Supertext ist das **de-CH**, und das verwendet diese Anleitung. Für einen bewusst lokalen Ton schreibt Supertext auch **Schweizerdeutsch (Mundart)**, Zürich- oder Berndeutsch (gsw-u-sd-chzh, gsw-u-sd-chbe) – etwas, das die meisten maschinellen Übersetzungen nicht können.',
    to: '## Deutsch (Schweiz) oder Schweizerdeutsch?\n\nWebsites in der Deutschschweiz werden in **Deutsch (Schweiz)** geschrieben: Standarddeutsch mit „ss“ statt „ß“ sowie mit Schweizer Wörtern und Schreibweisen. In Supertext ist das **de-CH**, und das verwendet diese Anleitung.\n\n**Schweizerdeutsch** ist die gesprochene Mundart. Für einen bewusst lokalen Ton schreibt Supertext auch sie, als Zürich- oder Berndeutsch – etwas, das die meisten maschinellen Übersetzungen nicht können. Wählen Sie dafür **Schweizerdeutsch (Zürich)** (`gsw-u-sd-chzh`) oder **Schweizerdeutsch (Bern)** (`gsw-u-sd-chbe`), wo diese Anleitung de-CH wählt.',
  },
  fr: {
    from: '## Allemand standard de Suisse ou dialecte ?\n\nLes sites web de Suisse alémanique sont rédigés en **allemand standard de Suisse** : de l’allemand standard avec « ss » au lieu de « ß », ainsi que des mots et des graphies suisses. Dans Supertext, il s’agit de **de-CH**, et c’est ce qu’utilise ce guide. Pour un ton délibérément local, Supertext rédige aussi en **suisse allemand (dialecte)**, zurichois ou bernois (gsw-u-sd-chzh, gsw-u-sd-chbe), ce dont la plupart des traductions automatiques sont incapables.',
    to: '## Allemand (Suisse) ou suisse allemand ?\n\nLes sites web de Suisse alémanique sont rédigés en **allemand (Suisse)** : de l’allemand standard avec « ss » au lieu de « ß », ainsi que des mots et des graphies suisses. Dans Supertext, il s’agit de **de-CH**, et c’est ce qu’utilise ce guide.\n\nLe **suisse allemand** est le dialecte parlé. Pour un ton délibérément local, Supertext l’écrit aussi, en zurichois ou en bernois, ce dont la plupart des traductions automatiques sont incapables. Pour traduire en dialecte, choisissez **suisse allemand (Zurich)** (`gsw-u-sd-chzh`) ou **suisse allemand (Berne)** (`gsw-u-sd-chbe`) là où ce guide choisit de-CH.',
  },
  it: {
    from: '## Tedesco standard svizzero o dialetto?\n\nI siti web della Svizzera tedesca sono scritti in **tedesco standard svizzero**: tedesco standard con «ss» al posto di «ß» e con parole e grafie svizzere. In Supertext corrisponde a **de-CH**, ed è la variante usata in questa guida. Per un tono volutamente locale, Supertext scrive anche in **svizzero tedesco (dialetto)**, zurighese o bernese (gsw-u-sd-chzh, gsw-u-sd-chbe), cosa che la maggior parte delle traduzioni automatiche non sa fare.',
    to: '## Tedesco (Svizzera) o svizzero tedesco?\n\nI siti web della Svizzera tedesca sono scritti in **tedesco (Svizzera)**: tedesco standard con «ss» al posto di «ß» e con parole e grafie svizzere. In Supertext corrisponde a **de-CH**, ed è la variante usata in questa guida.\n\nLo **svizzero tedesco** è il dialetto parlato. Per un tono volutamente locale, Supertext scrive anche questo, in zurighese o bernese, cosa che la maggior parte delle traduzioni automatiche non sa fare. Per tradurre in dialetto, scelga **svizzero tedesco (Zurigo)** (`gsw-u-sd-chzh`) o **svizzero tedesco (Berna)** (`gsw-u-sd-chbe`) dove questa guida sceglie de-CH.',
  },
};

const RULES = {
  en: [
    [SECTION.en.from, SECTION.en.to],
    // Guide titles and their SEO titles: both, the written standard and the dialect.
    [/into Swiss German( in 10 minutes| with TMGMT| \| Supertext)/g, 'into German (Switzerland) and Swiss German$1'],
    ["choose **Schweizer Hochdeutsch (de-CH)** in German's list", "choose **de-CH** in German's list"],
    ['Add Swiss German as a site language', 'Add German (Switzerland) as a site language'],
    ['No Swiss German language in Polylang yet?', 'No German (Switzerland) language in Polylang yet?'],
    ['Here is how to get a Swiss German store', 'Here is how to get a store in German (Switzerland)'],
    ['Add German and choose Swiss German', 'Add German and choose German (Switzerland)'],
    ['a TYPO3 site in Swiss German in 10 minutes', 'a TYPO3 site in German (Switzerland) in 10 minutes'],
    ['has no Swiss German or formal address', 'has no German (Switzerland) or formal address'],
    ['into Swiss German, French and Italian with formal address', 'into German, French and Italian for Switzerland with formal address'],
    // The Swiss German page.
    ["'Swiss German translation'", "'German (Switzerland) and Swiss German'"], // in the starter content's source
    [/^Swiss German translation$/, 'German (Switzerland) and Swiss German'], // the stored title
    ['Translate into Swiss Standard German (de-CH)', 'Translate into German (Switzerland) and Swiss German'],
    ['Swiss Standard German, Swiss French and Swiss Italian, even Zurich and Bernese German', 'German (Switzerland), Swiss French and Swiss Italian, even Swiss German dialect (Zurich and Bernese German)'],
    ['**Swiss Standard German** (*Schweizer Hochdeutsch*, language code **de-CH**)', '**German (Switzerland)** (*Deutsch (Schweiz)*, language code **de-CH**)'],
    ['In Supertext, de-CH is Swiss Standard German; Zurich German is `gsw-u-sd-chzh` and Bernese German `gsw-u-sd-chbe`.', 'Supertext calls it German (Switzerland) too. Swiss German is the dialect: Zurich German is `gsw-u-sd-chzh`, Bernese German `gsw-u-sd-chbe`.'],
    ['Supertext also writes **Swiss German dialect**: Zurich German and Bernese German', 'Supertext also writes **Swiss German**, the spoken dialect: Zurich German and Bernese German'],
    ['Swiss Standard German (de-CH)', 'German (Switzerland), de-CH'],
    ['Swiss Standard German', 'German (Switzerland)'],
  ],
  de: [
    [SECTION.de.from, SECTION.de.to],
    ['für die Deutschschweiz übersetzen', 'in Deutsch (Schweiz) und Schweizerdeutsch übersetzen'], // guide titles
    ['**Schweizer Hochdeutsch (de-CH)**', '**de-CH**'],
    ['Schweizer Hochdeutsch übersetzen (de-CH)', 'Deutsch (Schweiz) und Schweizerdeutsch übersetzen'],
    ['Schweizer Hochdeutsch übersetzen', 'Deutsch (Schweiz) und Schweizerdeutsch übersetzen'],
    ['Schweizer Hochdeutsch, Westschweizer Französisch und Schweizer Italienisch, sogar Züri- und Bärndütsch', 'Deutsch (Schweiz), Westschweizer Französisch und Schweizer Italienisch, sogar Schweizerdeutsch (Züri- und Bärndütsch)'],
    ['In Supertext ist de-CH Schweizer Hochdeutsch; Zürichdeutsch ist `gsw-u-sd-chzh`, Berndeutsch `gsw-u-sd-chbe`.', 'Auch Supertext nennt es Deutsch (Schweiz). Schweizerdeutsch ist die Mundart: Zürichdeutsch ist `gsw-u-sd-chzh`, Berndeutsch `gsw-u-sd-chbe`.'],
    ['Schweizer Hochdeutsch (de-CH)', 'Deutsch (Schweiz), de-CH'],
    ['auf Schweizer Hochdeutsch', 'in Deutsch (Schweiz)'],
    ['Schweizer Hochdeutsch', 'Deutsch (Schweiz)'],
  ],
  fr: [
    [SECTION.fr.from, SECTION.fr.to],
    [/en allemand de Suisse( en 10 minutes| avec TMGMT| \| Supertext)/g, 'en allemand (Suisse) et en suisse allemand$1'],
    ['**Schweizer Hochdeutsch (de-CH)**', '**de-CH**'],
    ['Traduire en allemand de Suisse', 'Traduire en allemand (Suisse) et en suisse allemand'],
    ['l’allemand de Suisse (de-CH)', 'l’allemand (Suisse, de-CH)'],
    ['l’allemand suisse (de-CH)', 'l’allemand (Suisse, de-CH)'],
    ['allemand suisse standard', 'allemand (Suisse)'],
    ['*Schweizer Hochdeutsch*', '*Deutsch (Schweiz)*'],
    ['Allemand standard suisse (de-CH)', 'Allemand (Suisse), de-CH'],
    ['allemand standard de Suisse', 'allemand (Suisse)'],
    ['allemand standard suisse', 'allemand (Suisse)'],
    ['allemand de Suisse', 'allemand (Suisse)'],
  ],
  it: [
    [SECTION.it.from, SECTION.it.to],
    [/in tedesco svizzero( in 10 minuti| con TMGMT| \| Supertext)/g, 'in tedesco (Svizzera) e svizzero tedesco$1'],
    ['**Schweizer Hochdeutsch (de-CH)**', '**de-CH**'],
    ['Tradurre in tedesco svizzero', 'Tradurre in tedesco (Svizzera) e svizzero tedesco'],
    ['il tedesco svizzero (de-CH)', 'il tedesco (Svizzera, de-CH)'],
    ['Tedesco standard svizzero (de-CH)', 'Tedesco (Svizzera), de-CH'],
    ['tedesco standard svizzero', 'tedesco (Svizzera)'],
    ['tedesco svizzero standard', 'tedesco (Svizzera)'],
    ['*Schweizer Hochdeutsch*', '*Deutsch (Schweiz)*'],
    ['Aggiunga il tedesco svizzero come lingua del sito', 'Aggiunga il tedesco (Svizzera) come lingua del sito'],
    ['scelga il tedesco svizzero', 'scelga il tedesco (Svizzera)'],
    ['un negozio in tedesco svizzero', 'un negozio in tedesco (Svizzera)'],
    ['né il tedesco svizzero', 'né il tedesco (Svizzera)'],
  ],
};

/**
 * Titles of the four Swiss German guides (and their SEO titles), as Remy worded them: "Localise a
 * Shopify store for German-speaking Switzerland in 10 minutes". The guides explain German
 * (Switzerland) and Swiss German themselves. Content update 2026-11-guide-titles.
 */
const GUIDE_TITLES = {
  en: [[/Translate ([^'"\n]+?) into German \(Switzerland\) and Swiss German/g, 'Localise $1 for German-speaking Switzerland']],
  de: [[/ in Deutsch \(Schweiz\) und Schweizerdeutsch übersetzen/g, ' für die Deutschschweiz lokalisieren']],
  fr: [[/Traduire ([^'"\n]+?) en allemand \(Suisse\) et en suisse allemand/g, 'Localiser $1 pour la Suisse alémanique']],
  it: [[/Tradurre ([^'"\n]+?) in tedesco \(Svizzera\) e svizzero tedesco/g, 'Localizzare $1 per la Svizzera tedesca']],
};

/**
 * Running text: Swiss Standard German. Kept: table rows ("German (Switzerland), de-CH"), names
 * quoted from a language list or screen (*Deutsch (Schweiz)*, Polylang's "Deutsch (Schweiz)
 * (de-CH)", TYPO3's language menu, Shopify's regional language) and sentences about that name.
 */
const TEXT = {
  en: [
    ['keep', /(?<!\*)\*German \(Switzerland\)\*(?!\*)/], // italic: a name quoted from a list, not bold text
    ['keep', /^German \(Switzerland\), de-CH$/],
    ['keep', "{ label: 'German (Switzerland), de-CH'"],
    ['Supertext calls it German (Switzerland) too.', "Supertext's language list calls it *German (Switzerland)* too."],
    ['keep', "Supertext's language list calls it *German (Switzerland)* too."],
    ['(*Deutsch (Schweiz)*, language code **de-CH**)', '(*Schweizer Hochdeutsch*, language code **de-CH**)'],
    ['German (Switzerland)', 'Swiss Standard German'],
  ],
  de: [
    ['keep', /(?<!\*)\*Deutsch \(Schweiz\)\*(?!\*)/],
    ['keep', '**Deutsch (Schweiz) (de-CH)**'],
    ['keep', 'Deutsch (Schweiz) (de-CH)'],
    ['keep', 'den Eintrag **Deutsch (Schweiz)**'],
    ['keep', 'etwa Deutsch (Schweiz) für den Markt Schweiz'],
    ['keep', /^Deutsch \(Schweiz\), de-CH$/],
    ['Auch Supertext nennt es Deutsch (Schweiz).', 'Auch die Sprachliste von Supertext nennt es *Deutsch (Schweiz)*.'],
    ['keep', 'Auch die Sprachliste von Supertext nennt es *Deutsch (Schweiz)*.'],
    ['Deutsch (Schweiz), de-CH, Westschweizer', 'Schweizer Hochdeutsch (de-CH), Westschweizer'],
    ['Deutsch (Schweiz)', 'Schweizer Hochdeutsch'],
  ],
  fr: [
    ['keep', /^Allemand \(Suisse\), de-CH$/],
    ['Allemand (Suisse) ou', 'Allemand standard suisse ou'],
    ['l’allemand (Suisse, de-CH)', 'l’allemand standard suisse (de-CH)'],
    ['allemand (Suisse)', 'allemand standard suisse'],
  ],
  it: [
    ['keep', /^Tedesco \(Svizzera\), de-CH$/],
    ['Tedesco (Svizzera) o', 'Tedesco standard svizzero o'],
    ['il tedesco (Svizzera, de-CH)', 'il tedesco standard svizzero (de-CH)'],
    ['tedesco (Svizzera)', 'tedesco standard svizzero'],
  ],
};

/** The text with the language's rules applied (unchanged when none match); RULES unless others are given. */
function swissTerms(text, locale, rules = RULES) {
  if (typeof text !== 'string') return text;
  const kept = [];
  // nosemgrep: detect-non-literal-regexp -- patterns from the fixed Swiss terms list; strings are escaped first
  const keep = (t, pattern) => t.replace(typeof pattern === 'string' ? new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g') : new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g'), (m) => `\u0000${kept.push(m) - 1}\u0000`);
  const out = (rules[locale] || []).reduce((t, [from, to]) => {
    if (from === 'keep') return keep(t, to);
    return typeof from === 'string' ? t.split(from).join(to) : t.replace(from, to);
  }, text);
  return out.replace(/\u0000(\d+)\u0000/g, (_, i) => kept[Number(i)]);
}

/** Every string in a value (objects, arrays), with the rules applied. */
function swissTermsDeep(value, locale, rules = RULES) {
  if (typeof value === 'string') return swissTerms(value, locale, rules);
  if (Array.isArray(value)) return value.map((v) => swissTermsDeep(v, locale, rules));
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, swissTermsDeep(v, locale, rules)]));
  return value;
}

module.exports = { RULES, GUIDE_TITLES, TEXT, swissTerms, swissTermsDeep };
