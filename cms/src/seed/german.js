'use strict';

// German content (November 2026), written for what people in Switzerland, Germany and Austria
// search for, instead of translated from English:
// - the Swiss German page (/swiss-german): English and German written separately, French and
//   Italian through the background translation of the English text;
// - German-first guides: articles in German only, published weekly next to the English guides;
// - two comparison articles as drafts, for review before they go live (they name competitors);
// - German titles and descriptions for the integration pages of the systems used most in the region.
// Swiss spelling throughout: "ss" instead of "ß", «Guillemets».

const API_KEY_URL = 'https://www.supertext.com/en/integrations/api';
const ACCOUNT_URL = 'https://www.supertext.com/person/en/account/signin';
const link = (label, url, style = 'primary', newTab = false) => ({ label, url, style, newTab });

// ——— The Swiss German page ———

const swissGermanEn = {
  title: 'Swiss German translation',
  slug: 'swiss-german',
  seo: {
    metaTitle: 'Translate into Swiss Standard German (de-CH)',
    metaDescription:
      'Swiss Standard German is not German from Germany: no ß, Swiss words, CHF and 1’000. How Supertext translates websites, shops and products for Switzerland.',
  },
  blocks: [
    {
      __component: 'blocks.hero',
      layout: 'centered',
      eyebrow: 'Made in Switzerland',
      title: 'Translations that sound Swiss',
      subtitle:
        'Swiss Standard German, Swiss French and Swiss Italian, even Zurich and Bernese German: Supertext AI writes the way Switzerland reads, right inside your CMS, shop or PIM.',
      primaryCta: link('Browse integrations', '/en/integrations'),
      secondaryCta: link('Get your API key', API_KEY_URL, 'secondary', true),
    },
    {
      __component: 'blocks.rich-text',
      width: 'narrow',
      body: [
        '## Swiss Standard German is not German from Germany',
        '',
        'Websites in German-speaking Switzerland are written in **Swiss Standard German** (*Schweizer Hochdeutsch*, language code **de-CH**). It is standard German, but readers notice straight away when a text was written for Germany:',
        '',
        '- **No ß:** Switzerland writes *Strasse*, *gross* and *Grüsse*, never *Straße*, *groß* or *Grüße*.',
        '- **Swiss words:** *Velo* instead of *Fahrrad*, *parkieren* instead of *parken*, *Spital* instead of *Krankenhaus*, *Rahm* instead of *Sahne*, *Billett* instead of *Fahrkarte*.',
        '- **Numbers and prices:** *CHF 1’250.50*, with an apostrophe between the thousands and a full stop for the decimals.',
        '- **Quotation marks:** «Guillemets» instead of „German quotation marks“.',
        '- **Tone:** formal *Sie* is the rule in business, but many brands address their customers with *du*. Both are a setting in Supertext.',
        '',
        'Machine translation trained mostly on texts from Germany gets these wrong, and every *ß* or *Fahrrad* on a Swiss page costs trust. Supertext was built for Switzerland and writes de-CH by default.',
        '',
        '## Dialect when you want it',
        '',
        'For a deliberately local tone, in a campaign, a social post or a newsletter, Supertext also writes **Swiss German dialect**: Zurich German and Bernese German. Hardly any other machine translation writes dialect.',
        '',
        '## Swiss French and Swiss Italian too',
        '',
        'Switzerland has its own French and Italian: *septante* and *nonante*, *natel*, *déjeuner* at lunchtime, Swiss Italian administrative terms. Supertext translates into **Swiss French** and **Swiss Italian**, and into **Romansh**.',
      ].join('\n'),
    },
    {
      __component: 'blocks.feature-cards',
      title: 'Why Swiss companies translate with Supertext',
      columns: 'three',
      cards: [
        { title: 'Written for Switzerland', text: 'de-CH, Swiss French, Swiss Italian, Romansh, Zurich and Bernese German. Your terminology and earlier translations are used.' },
        { title: 'Translated in Switzerland', text: 'Your texts are processed in Switzerland, deleted after translation and never used to train AI models (paid plans).' },
        { title: 'A translator when it matters', text: 'Add a professional review by a Swiss translator, or order a human translation, from the same plugin.' },
      ],
    },
    {
      __component: 'blocks.rich-text',
      width: 'narrow',
      body: [
        '## In your system, in de-CH',
        '',
        'The Supertext plugins translate where your content lives. Set the target language to **de-CH** once, and every translation is written in Swiss Standard German:',
        '',
        '- **CMS:** [TYPO3](/en/integrations/typo3), [WordPress](/en/integrations/wordpress), [Drupal](/en/integrations/drupal), [Contao](/en/integrations/contao), [Joomla](/en/integrations/joomla), [Neos](/en/integrations/neos), [Craft CMS](/en/integrations/craft-cms), [Strapi](/en/integrations/strapi) and [more](/en/integrations?category=cms)',
        '- **Shops:** [Shopify](/en/integrations/shopify), [Magento](/en/integrations/magento), [PrestaShop](/en/integrations/prestashop)',
        '- **Product data:** [Akeneo](/en/integrations/akeneo-pim), [Pimcore](/en/integrations/pimcore), [AtroPIM](/en/integrations/atropim)',
        '- **AI assistants:** [Claude, ChatGPT and Copilot](/en/integrations/claude-chatgpt-and-copilot) with the Supertext Translation MCP',
        '',
        'Step by step: [a TYPO3 site in Swiss German in 10 minutes](/en/news/guide-typo3-swiss-german).',
      ].join('\n'),
    },
    {
      __component: 'blocks.faq',
      title: 'Questions',
      items: [
        {
          question: 'What is the language code for Swiss Standard German?',
          answer: '**de-CH**. Most systems call it *German (Switzerland)*, often with the locale `de_CH`. In Supertext, de-CH is Swiss Standard German; Zurich German is `gsw-u-sd-chzh` and Bernese German `gsw-u-sd-chbe`.',
        },
        {
          question: 'Is Swiss Standard German the same as Swiss German?',
          answer: 'No. Swiss Standard German is written standard German with Swiss spelling and words, used on websites, in documents and in the media. Swiss German (Schweizerdeutsch) is the spoken dialects, written mainly in informal and local communication.',
        },
        {
          question: 'Does DeepL write Swiss Standard German?',
          answer: 'Since August 2026, DeepL offers Swiss Standard German as well. It does not write Swiss German dialect, Swiss French, Swiss Italian or Romansh, and processes texts outside Switzerland. [See the comparison](/en/compare).',
        },
        {
          question: 'Can I keep one German version for Germany and one for Switzerland?',
          answer: 'Yes. Add both languages (de-DE and de-CH) to your system and translate into each, or have Supertext adapt your German texts for Switzerland.',
        },
      ],
    },
    {
      __component: 'blocks.cta-band',
      tone: 'dark',
      title: 'Translate your site into de-CH today',
      text: 'Free plugins for 30+ systems. Create an account, add your API key, translate a page.',
      primaryCta: link('Browse integrations', '/en/integrations'),
      secondaryCta: link('Create an account', ACCOUNT_URL, 'secondary', true),
    },
  ],
};

const swissGermanDe = {
  title: 'Schweizer Hochdeutsch übersetzen',
  slug: 'swiss-german',
  seo: {
    metaTitle: 'Schweizer Hochdeutsch übersetzen (de-CH)',
    metaDescription:
      'Schweizer Hochdeutsch ist kein Deutsch aus Deutschland: kein ß, Schweizer Wörter, CHF 1’000. So übersetzt Supertext Websites, Shops und Produkte für die Schweiz.',
  },
  blocks: [
    {
      __component: 'blocks.hero',
      layout: 'centered',
      eyebrow: 'Made in Switzerland',
      title: 'Übersetzungen, die schweizerisch klingen',
      subtitle:
        'Schweizer Hochdeutsch, Westschweizer Französisch und Schweizer Italienisch, sogar Züri- und Bärndütsch: Supertext AI schreibt, wie die Schweiz liest, direkt in Ihrem CMS, Shop oder PIM.',
      primaryCta: link('Integrationen ansehen', '/de/integrations'),
      secondaryCta: link('API-Key holen', API_KEY_URL, 'secondary', true),
    },
    {
      __component: 'blocks.rich-text',
      width: 'narrow',
      body: [
        '## Schweizer Hochdeutsch ist nicht Deutsch aus Deutschland',
        '',
        'Websites in der Deutschschweiz sind in **Schweizer Hochdeutsch** geschrieben (Sprachcode **de-CH**). Das ist Standarddeutsch, aber Leserinnen und Leser merken sofort, wenn ein Text für Deutschland geschrieben wurde:',
        '',
        '- **Kein ß:** In der Schweiz schreibt man *Strasse*, *gross* und *Grüsse*, nie *Straße*, *groß* oder *Grüße*.',
        '- **Schweizer Wörter:** *Velo* statt *Fahrrad*, *parkieren* statt *parken*, *Spital* statt *Krankenhaus*, *Rahm* statt *Sahne*, *Billett* statt *Fahrkarte*.',
        '- **Zahlen und Preise:** *CHF 1’250.50*, mit Apostroph als Tausendertrennzeichen und Punkt vor den Rappen.',
        '- **Anführungszeichen:** «Guillemets» statt „deutscher Anführungszeichen“.',
        '- **Ansprache:** Im Geschäftsleben ist *Sie* die Regel, viele Marken duzen ihre Kundschaft aber. Beides ist in Supertext eine Einstellung.',
        '',
        'Maschinelle Übersetzung, die vor allem mit Texten aus Deutschland trainiert wurde, macht hier Fehler, und jedes *ß* oder *Fahrrad* auf einer Schweizer Seite kostet Vertrauen. Supertext wurde für die Schweiz gebaut und schreibt standardmässig de-CH.',
        '',
        '## Mundart, wenn Sie wollen',
        '',
        'Für einen bewusst lokalen Ton, in einer Kampagne, einem Social-Media-Post oder einem Newsletter, schreibt Supertext auch **Schweizerdeutsch**: Zürich- und Berndeutsch. Kaum eine andere maschinelle Übersetzung schreibt Mundart.',
        '',
        '## Auch Französisch und Italienisch für die Schweiz',
        '',
        'Die Schweiz hat ihr eigenes Französisch und Italienisch: *septante* und *nonante*, *natel*, *déjeuner* am Mittag, Begriffe aus der Schweizer Verwaltung. Supertext übersetzt in **Westschweizer Französisch**, **Schweizer Italienisch** und **Rätoromanisch**.',
      ].join('\n'),
    },
    {
      __component: 'blocks.feature-cards',
      title: 'Warum Schweizer Unternehmen mit Supertext übersetzen',
      columns: 'three',
      cards: [
        { title: 'Für die Schweiz geschrieben', text: 'de-CH, Westschweizer Französisch, Schweizer Italienisch, Rätoromanisch, Züri- und Bärndütsch. Mit Ihrer Terminologie und Ihren früheren Übersetzungen.' },
        { title: 'In der Schweiz übersetzt', text: 'Ihre Texte werden in der Schweiz verarbeitet, nach der Übersetzung gelöscht und nie zum Training von KI-Modellen verwendet (kostenpflichtige Abos).' },
        { title: 'Ein Profi, wenn es darauf ankommt', text: 'Lassen Sie die KI-Übersetzung von einer Schweizer Fachperson prüfen oder bestellen Sie eine Humanübersetzung, aus demselben Plugin.' },
      ],
    },
    {
      __component: 'blocks.rich-text',
      width: 'narrow',
      body: [
        '## In Ihrem System, in de-CH',
        '',
        'Die Supertext-Plugins übersetzen dort, wo Ihre Inhalte sind. Stellen Sie die Zielsprache einmal auf **de-CH**, und jede Übersetzung ist in Schweizer Hochdeutsch:',
        '',
        '- **CMS:** [TYPO3](/de/integrations/typo3), [WordPress](/de/integrations/wordpress), [Drupal](/de/integrations/drupal), [Contao](/de/integrations/contao), [Joomla](/de/integrations/joomla), [Neos](/de/integrations/neos), [Craft CMS](/de/integrations/craft-cms), [Strapi](/de/integrations/strapi) und [weitere](/de/integrations?category=cms)',
        '- **Shops:** [Shopify](/de/integrations/shopify), [Magento](/de/integrations/magento), [PrestaShop](/de/integrations/prestashop)',
        '- **Produktdaten:** [Akeneo](/de/integrations/akeneo-pim), [Pimcore](/de/integrations/pimcore), [AtroPIM](/de/integrations/atropim)',
        '- **KI-Assistenten:** [Claude, ChatGPT und Copilot](/de/integrations/claude-chatgpt-and-copilot) mit dem Supertext Translation MCP',
        '',
        'Schritt für Schritt: [TYPO3 automatisch übersetzen](/de/news/typo3-automatisch-uebersetzen), [Contao übersetzen](/de/news/contao-uebersetzen), [Shopify-Shop übersetzen](/de/news/shopify-shop-uebersetzen).',
      ].join('\n'),
    },
    {
      __component: 'blocks.faq',
      title: 'Fragen',
      items: [
        {
          question: 'Wie lautet der Sprachcode für Schweizer Hochdeutsch?',
          answer: '**de-CH**. Die meisten Systeme nennen es *Deutsch (Schweiz)*, oft mit der Locale `de_CH`. In Supertext ist de-CH Schweizer Hochdeutsch; Zürichdeutsch ist `gsw-u-sd-chzh`, Berndeutsch `gsw-u-sd-chbe`.',
        },
        {
          question: 'Ist Schweizer Hochdeutsch dasselbe wie Schweizerdeutsch?',
          answer: 'Nein. Schweizer Hochdeutsch ist geschriebenes Standarddeutsch mit Schweizer Schreibweise und Wortschatz, wie auf Websites, in Dokumenten und in den Medien. Schweizerdeutsch sind die gesprochenen Mundarten, geschrieben vor allem in der informellen und lokalen Kommunikation.',
        },
        {
          question: 'Schreibt DeepL Schweizer Hochdeutsch?',
          answer: 'Seit August 2026 bietet auch DeepL Schweizer Hochdeutsch an. Mundart, Westschweizer Französisch, Schweizer Italienisch oder Rätoromanisch schreibt DeepL nicht, und die Texte werden ausserhalb der Schweiz verarbeitet. [Zum Vergleich](/de/compare).',
        },
        {
          question: 'Kann ich eine deutsche Version für Deutschland und eine für die Schweiz führen?',
          answer: 'Ja. Legen Sie in Ihrem System beide Sprachen an (de-DE und de-CH) und übersetzen Sie in beide, oder lassen Sie Ihre deutschen Texte von Supertext für die Schweiz anpassen.',
        },
      ],
    },
    {
      __component: 'blocks.cta-band',
      tone: 'dark',
      title: 'Übersetzen Sie Ihre Website noch heute in de-CH',
      text: 'Kostenlose Plugins für über 30 Systeme. Konto erstellen, API-Key eintragen, Seite übersetzen.',
      primaryCta: link('Integrationen ansehen', '/de/integrations'),
      secondaryCta: link('Konto erstellen', ACCOUNT_URL, 'secondary', true),
    },
  ],
};

const footerSwiss = {
  url: '/en/swiss-german',
  label: { en: 'Swiss German translation', de: 'Schweizer Hochdeutsch übersetzen', fr: 'Traduire en allemand de Suisse', it: 'Tradurre in tedesco svizzero' },
};

// ——— German-first articles ———

const article = (slug, date, systems, title, excerpt, body, seo) => ({
  slug,
  date,
  category: 'guides',
  systems: systems.join(','),
  title,
  excerpt,
  body: body.trim(),
  seo: { metaTitle: seo.title, metaDescription: seo.description || excerpt },
});

const apiKey = `[Melden Sie sich bei Supertext an oder erstellen Sie ein Konto](${ACCOUNT_URL}) und erzeugen Sie unter [Integrations → API](${API_KEY_URL}) einen API-Key. Dafür brauchen Sie die Admin-Rolle in Ihrem Supertext-Konto; sonst fragen Sie die Person, die Ihr Konto verwaltet.`;

const swissNote = `> **Schweizer Hochdeutsch:** Wählen Sie als Zielsprache **de-CH**, dann schreibt Supertext «Strasse» statt «Straße», «Velo» statt «Fahrrad» und Preise als «CHF 1’250.50». Mehr dazu: [Schweizer Hochdeutsch übersetzen](/de/swiss-german).`;

const germanArticles = [
  article(
    'typo3-automatisch-uebersetzen',
    '2026-11-09T07:00:00.000Z',
    ['typo3'],
    'TYPO3 automatisch übersetzen: die Möglichkeiten im Überblick',
    'Von Hand, mit einer DeepL-Extension oder mit Supertext: So übersetzen Sie TYPO3-Seiten automatisch, und worauf es bei Schweizer Hochdeutsch ankommt.',
    `
Mehrsprachige Websites gehören zu den Stärken von TYPO3. Das Übersetzen selbst bleibt aber Handarbeit, solange keine Extension hilft: TYPO3 legt im Übersetzungsassistenten Kopien der Inhalte an, die Redaktion übersetzt sie Feld für Feld. Dieser Artikel zeigt, welche Möglichkeiten es gibt, TYPO3 automatisch zu übersetzen, und wie Sie mit Supertext in wenigen Minuten startklar sind.

## So funktioniert Mehrsprachigkeit in TYPO3

Jede Sprache ist in TYPO3 eine **Site-Sprache** (unter **Sites → Setup**, Reiter *Languages*) mit eigener Locale, zum Beispiel \`de_CH.UTF-8\` für Deutsch (Schweiz). Übersetzt wird im Seitenmodul: **Neue Übersetzung erstellen**, Inhaltselemente auswählen, dann im **Übersetzungsassistenten** zwischen zwei Modi wählen:

- **Übersetzen (verbundener Modus):** Die Übersetzung bleibt mit dem Original verbunden, Struktur und Reihenfolge kommen aus der Standardsprache. Das ist die übliche Wahl.
- **Kopieren (freier Modus):** Die Inhalte werden unabhängig vom Original kopiert, etwa wenn eine Sprachversion eigene Elemente braucht.

Neue Übersetzungen sind in TYPO3 zuerst verborgen. So können Sie sie prüfen, bevor die Besucherinnen und Besucher sie sehen.

## Drei Wege, TYPO3 automatisch zu übersetzen

**1. Von Hand oder per Copy-and-paste.** Funktioniert für einzelne Seiten, wird aber schnell aufwendig und fehleranfällig: Seitentitel, SEO-Texte, Bildunterschriften und Tabellen gehen leicht vergessen.

**2. Mit einer DeepL-Extension.** Im TYPO3 Extension Repository gibt es mehrere Extensions, die DeepL an den Übersetzungsassistenten anbinden, zum Beispiel *deepltranslate_core* oder *dd_deepl*. Sie brauchen dafür ein DeepL-API-Konto, und die Texte werden bei DeepL verarbeitet.

**3. Mit der Supertext-Extension.** Supertext hängt sich ebenfalls in den gewohnten Übersetzungsassistenten ein, ohne neue Oberfläche. Der Unterschied liegt in der Übersetzung selbst:

- **Für die Schweiz geschrieben:** Schweizer Hochdeutsch (de-CH), Westschweizer Französisch und Schweizer Italienisch, auf Wunsch sogar Züri- oder Bärndütsch.
- **In der Schweiz verarbeitet:** Die Texte werden in der Schweiz übersetzt und danach gelöscht (kostenpflichtige Abos).
- **Ganze Seiten auf einmal:** Supertext übersetzt eine Seite mit allen Elementen als ein Dokument pro Sprache, mit Seitentitel, SEO-Texten, Überschriften, Rich Text, Bildunterschriften und Tabellen. Die Slugs werden aus dem übersetzten Titel neu gebildet.
- **Ein Profi, wenn es darauf ankommt:** Wichtige Seiten lassen Sie zusätzlich von einer Fachperson prüfen.

## TYPO3 mit Supertext übersetzen: die Kurzfassung

**Sie brauchen:** TYPO3 13.4 LTS oder 14.3 LTS (mit Composer installiert), PHP 8.2 oder neuer und ein Supertext-Konto.

1. **API-Key holen.** ${apiKey}
2. **Extension installieren.** Die Extension ist noch nicht auf Packagist; fügen Sie das GitHub-Repository hinzu:

\`\`\`bash
composer config repositories.supertext-typo3 vcs https://github.com/Supertext/Typo3-Supertext-Translation
composer require supertext/typo3-translation:dev-main
vendor/bin/typo3 extension:setup -e supertext_translation
\`\`\`

3. **Key eintragen.** Unter **System → Settings → Extension Configuration → supertext_translation** (TYPO3 13: Admin Tools → Settings) oder als Umgebungsvariable \`SUPERTEXT_API_KEY\`. Der Statusblock oben zeigt, ob die Verbindung steht.
4. **Sprache einstellen.** Unter **Sites → Setup** bei der Site-Sprache mit Locale \`de_CH.UTF-8\` im Bereich *Supertext* die Sprache (*de-CH* ist vorausgewählt) und die Ansprache (*Sie* oder *du*) wählen.
5. **Übersetzen.** Im Seitenmodul wie gewohnt **Neue Übersetzung erstellen**, Elemente auswählen, **Übersetzen** wählen und auf **Lokalisieren** klicken. Nach wenigen Sekunden bestätigt eine grüne Meldung, was übersetzt wurde.
6. **Prüfen und freischalten.** Die Übersetzung ist verborgen. Kontrollieren Sie sie in der Vorschau und blenden Sie Seite und Elemente dann ein.

${swissNote}

Die ausführliche Anleitung mit allen Einstellungen finden Sie in [TYPO3 in 10 Minuten auf Schweizer Hochdeutsch](/de/news/guide-typo3-swiss-german) und auf der [Seite der TYPO3-Extension](/de/integrations/typo3).

## Häufige Fragen

**Kostet die TYPO3-Extension etwas?** Die Extension ist kostenlos und Open Source. Sie bezahlen nur die Übersetzungen über Ihr Supertext-Abo.

**Kann ich bestehende Übersetzungen aktualisieren?** Ja. Übersetzen Sie ein Element erneut, wird die vorhandene Übersetzung überschrieben; Änderungen von Hand machen Sie wie gewohnt im Seitenmodul.

**Funktioniert das auch über die Kommandozeile?** Ja. Die Extension arbeitet mit dem DataHandler von TYPO3 und übersetzt deshalb auch, wenn Sie über das Listenmodul oder die CLI lokalisieren.
`,
    {
      title: 'TYPO3 automatisch übersetzen: die Möglichkeiten',
      description: 'TYPO3 automatisch übersetzen: Übersetzungsassistent, DeepL-Extensions oder Supertext mit Schweizer Hochdeutsch. Überblick und Anleitung in 6 Schritten.',
    }
  ),

  article(
    'contao-uebersetzen',
    '2026-11-12T07:00:00.000Z',
    ['contao'],
    'Contao übersetzen: Seiten, Artikel und Inhaltselemente automatisch in andere Sprachen',
    'Contao-Websites mehrsprachig machen, ohne Inhalte von Hand zu kopieren: So übersetzen Sie Seiten, ganze Zweige oder die komplette Website mit Supertext.',
    `
Contao ist im deutschsprachigen Raum eines der beliebtesten Open-Source-CMS, gerade bei Agenturen in der Schweiz, in Deutschland und Österreich. Mehrsprachigkeit ist in Contao gut gelöst, das Übersetzen selbst aber aufwendig: Seiten, Artikel und Inhaltselemente müssen in jede Sprache kopiert und Feld für Feld übersetzt werden. Mit dem Supertext-Bundle erledigt das ein Klick.

## So funktioniert Mehrsprachigkeit in Contao

In Contao hat jede Sprache einen eigenen **Website-Startpunkt** in der Seitenstruktur, mit eigener Sprache (zum Beispiel \`de-CH\`) und derselben Domain oder einer eigenen. Ein Startpunkt ist als **Sprachen-Fallback** markiert. Die Seiten der Sprachen werden miteinander verknüpft, damit der Sprachwechsler von jeder Seite zur passenden Übersetzung führt.

Ohne Hilfe heisst Übersetzen in Contao: Seiten kopieren, in den richtigen Startpunkt verschieben, jedes Inhaltselement öffnen und den Text ersetzen. Bei einer Website mit hundert Seiten sind das Tage.

## Contao mit Supertext übersetzen

Das Supertext-Bundle fügt der Seitenstruktur ein grünes Übersetzen-Symbol hinzu:

- **Eine Seite, ein Zweig oder die ganze Website:** Klicken Sie auf das Symbol einer Seite oder eines Startpunkts, wählen Sie die Zielsprachen und auf Wunsch *Auch alle Unterseiten übersetzen*.
- **Alles in einem Durchgang:** Supertext kopiert die Seiten mit ihren Artikeln und Inhaltselementen in die anderen Startpunkte und übersetzt die Texte. Formatierungen, Links und Insert-Tags bleiben erhalten.
- **Zur Kontrolle unveröffentlicht:** Neue Seiten werden unveröffentlicht angelegt. Sie prüfen sie und veröffentlichen sie dann.
- **Aktualisieren statt neu anlegen:** Wird erneut übersetzt, aktualisiert Supertext die bestehenden Übersetzungen. Frühere Fassungen bleiben in der Versionsverwaltung und lassen sich wiederherstellen.
- **Sprachwechsler inklusive:** Die Übersetzungen werden mit dem Original verknüpft.

## Schritt für Schritt

**Sie brauchen:** Contao 5.7 oder 6.0, PHP 8.3 oder neuer, Composer oder den Contao Manager und ein Supertext-Konto.

1. **API-Key holen.** ${apiKey}
2. **Bundle installieren** mit Composer oder dem Contao Manager. Die genauen Befehle stehen auf der [Seite des Contao-Bundles](/de/integrations/contao).
3. **Key eintragen** in den Einstellungen des Bundles.
4. **Startpunkte anlegen.** Legen Sie für jede Zielsprache einen Website-Startpunkt an, etwa *Deutsch (Schweiz)* mit der Sprache \`de-CH\`.
5. **Übersetzen.** In **Inhalte → Seiten** auf das grüne Übersetzen-Symbol der Seite oder des Startpunkts klicken, Sprachen wählen, bestätigen.
6. **Prüfen und veröffentlichen.** Die neuen Seiten sind unveröffentlicht. Kontrollieren Sie sie in der Vorschau und schalten Sie sie frei.

${swissNote}

## Häufige Fragen

**Was passiert mit Insert-Tags wie {{link::12}}?** Sie bleiben unverändert. Supertext übersetzt nur den Text drumherum.

**Kann ich nur einzelne Seiten neu übersetzen?** Ja. Das Symbol gibt es bei jeder Seite; ohne *Unterseiten* wird nur diese Seite übersetzt.

**Kostet das Bundle etwas?** Das Bundle ist kostenlos und Open Source. Sie bezahlen nur die Übersetzungen über Ihr Supertext-Abo.
`,
    {
      title: 'Contao übersetzen: Seiten automatisch übersetzen',
      description: 'Contao mehrsprachig machen: Seiten, Artikel und Inhaltselemente mit einem Klick übersetzen, auch in Schweizer Hochdeutsch. Anleitung in 6 Schritten.',
    }
  ),

  article(
    'shopify-shop-uebersetzen',
    '2026-11-19T07:00:00.000Z',
    ['shopify'],
    'Shopify-Shop übersetzen: Produkte, Kollektionen und Seiten in mehreren Sprachen',
    'Sprachen anlegen, Märkte zuordnen, Inhalte übersetzen: So machen Sie Ihren Shopify-Shop mehrsprachig, mit Übersetzungen für die Schweiz.',
    `
Wer in der Schweiz verkauft, braucht mindestens Deutsch und Französisch, oft auch Italienisch und Englisch. Shopify bringt die Grundlagen für mehrsprachige Shops mit; die Übersetzungen selbst müssen aber irgendwo herkommen. Dieser Artikel zeigt, wie Shopify mit Sprachen umgeht und wie Sie Produkte, Kollektionen und Seiten mit Supertext in einem Durchgang übersetzen.

## So funktioniert Mehrsprachigkeit in Shopify

- **Sprachen:** Unter **Einstellungen → Sprachen** fügen Sie Sprachen hinzu. Sichtbar werden sie erst, wenn Sie sie veröffentlichen.
- **Märkte:** Unter **Einstellungen → Märkte** legen Sie fest, welche Sprachen in welchem Markt angeboten werden, zum Beispiel Deutsch, Französisch und Italienisch für die Schweiz.
- **Übersetzungsspeicher:** Shopify speichert Übersetzungen pro Feld. Sie sehen und bearbeiten sie in der kostenlosen App **Translate & Adapt** von Shopify.
- **Theme-Texte:** Texte des Themes wie «In den Warenkorb» sind in den meisten Themes für viele Sprachen schon übersetzt.

## Was übersetzt werden muss

Der grösste Teil der Arbeit sind Ihre eigenen Inhalte: **Produkte** (Titel, Beschreibungen, SEO-Texte), **Kollektionen**, **Seiten** und **Blogbeiträge**. Bei einem Shop mit ein paar hundert Produkten sind das schnell Zehntausende Wörter, die konsequent gleich übersetzt sein wollen: Ihre Produktnamen, Materialien und Grössenangaben.

## Shopify mit Supertext übersetzen

Die App **Supertext Translation** übersetzt Ihre Inhalte im Hintergrund, in alle Sprachen des Shops auf einmal:

1. **API-Key holen.** ${apiKey}
2. **App installieren** und den Key eintragen. Details auf der [Seite der Shopify-App](/de/integrations/shopify).
3. **Inhalte wählen.** Unter **Apps → Supertext Translation** wählen Sie Produkte, Kollektionen, Seiten, Blogbeiträge oder Blogs, markieren die gewünschten Einträge und die Zielsprachen.
4. **Übersetzen.** Klicken Sie auf **Translate with Supertext**. Unter *Recent translations* sehen Sie den Fortschritt, bis *Done* erscheint.
5. **Prüfen.** Die Übersetzungen liegen im Übersetzungsspeicher von Shopify. Kontrollieren und korrigieren Sie sie in **Translate & Adapt**.
6. **Veröffentlichen.** Sobald eine Sprache unter **Einstellungen → Sprachen** veröffentlicht ist, sehen Ihre Kundinnen und Kunden sie.

Beschreibungen behalten ihre Überschriften, Listen, Fettungen, Links und Bilder. Felder mit bestehender Übersetzung bleiben unverändert, ausser Sie wählen *Overwrite existing translations*.

${swissNote}

## Häufige Fragen

**Brauche ich einen bestimmten Shopify-Plan?** Nein. Die App funktioniert mit jedem Shopify-Plan.

**Was passiert, wenn ich eine Produktbeschreibung ändere?** Veraltete Übersetzungen erkennt Supertext und aktualisiert sie beim nächsten Durchgang.

**Kann ich Deutsch für Deutschland und für die Schweiz getrennt führen?** Ja, wenn Sie in Shopify regionale Sprachen verwenden, etwa Deutsch (Schweiz) für den Markt Schweiz.
`,
    {
      title: 'Shopify-Shop übersetzen: Anleitung',
      description: 'Shopify-Shop mehrsprachig machen: Sprachen, Märkte und Translate & Adapt erklärt, Produkte und Seiten mit Supertext in alle Sprachen übersetzen.',
    }
  ),

  article(
    'wordpress-mehrsprachig',
    '2026-11-26T07:00:00.000Z',
    ['wordpress'],
    'WordPress mehrsprachig: Polylang, WPML oder Weglot, und wie die Übersetzung hineinkommt',
    'Welches Mehrsprachigkeits-Plugin passt zu Ihrer WordPress-Website, und wie übersetzen Sie Beiträge und Seiten automatisch? Ein Überblick mit Anleitung für Polylang Pro und Supertext.',
    `
WordPress ist von Haus aus einsprachig. Für eine mehrsprachige Website brauchen Sie ein Plugin, das die Sprachversionen verwaltet, und einen Weg, die Inhalte zu übersetzen. Dieser Artikel vergleicht die drei verbreitetsten Ansätze und zeigt, wie Sie mit Polylang Pro und Supertext automatisch übersetzen.

## Die drei verbreitetsten Lösungen

**Polylang (und Polylang Pro):** Jede Sprache ist ein eigener Beitrag bzw. eine eigene Seite, verknüpft mit dem Original. Die Übersetzungen liegen in Ihrer WordPress-Datenbank, URLs und SEO-Angaben sind pro Sprache steuerbar. Polylang Pro bietet zusätzlich maschinelle Übersetzung über angebundene Dienste.

**WPML:** Ebenfalls ein WordPress-Plugin mit eigenen Sprachversionen in Ihrer Datenbank, mit einem eigenen Übersetzungseditor und Anbindungen an Übersetzungsdienste und Agenturen.

**Weglot:** Ein Cloud-Dienst. Die Übersetzungen werden bei Weglot gespeichert und ausgeliefert; abgerechnet wird nach Anzahl Wörtern und Sprachen.

Welche Lösung passt, hängt von Ihrer Website ab. Wenn Sie die Übersetzungen in Ihrer eigenen Datenbank behalten möchten, sind Polylang und WPML die naheliegende Wahl.

## WordPress mit Polylang Pro und Supertext übersetzen

Das Supertext-Plugin fügt sich in Polylang Pro als Übersetzungsdienst ein. Sie übersetzen mit den gewohnten Polylang-Schaltflächen, die das Supertext-Logo tragen:

- **Einzelne Beiträge und Seiten:** Klicken Sie in der Liste auf die Übersetzen-Schaltfläche der Zielsprache. Supertext erstellt die verknüpfte Übersetzung.
- **Viele auf einmal:** Markieren Sie mehrere Einträge, wählen Sie die Massenaktion **Supertext AI Translation** und die Zielsprache.
- **Was übersetzt wird:** Gutenberg- und klassischer Editor, ACF-Felder, Kategorien und Schlagwörter sowie SEO-Angaben über die Übersetzungspipeline von Polylang. Für YOOtheme Pro und Gravity Forms bringt das Plugin eigene Unterstützung mit.
- **Mit Profi:** Für wichtige Texte wählen Sie **Supertext Human Translation**, sehen den Preis direkt in WordPress und erhalten die Übersetzung automatisch als Entwurf oder veröffentlicht zurück.

## Schritt für Schritt

**Sie brauchen:** WordPress 6.0 oder neuer, PHP 8.1 oder neuer, Polylang Pro mit maschineller Übersetzung und ein Supertext-Konto.

1. **API-Key holen.** ${apiKey}
2. **Plugin installieren** und den Key eintragen. Details auf der [Seite des WordPress-Plugins](/de/integrations/wordpress).
3. **Sprachen anlegen** in Polylang unter **Sprachen**, zum Beispiel *Deutsch (Schweiz)* mit der Locale \`de_CH\`.
4. **Übersetzen** über die Polylang-Schaltflächen oder die Massenaktion.
5. **Prüfen und veröffentlichen.**

${swissNote}

## Häufige Fragen

**Kann ich DeepL weiter nutzen?** Ja. In Polylang Pro steht Supertext neben DeepL. So können Sie beide mit Ihren eigenen Inhalten vergleichen.

**Kostet das Plugin etwas?** Das Supertext-Plugin ist kostenlos und Open Source. Polylang Pro ist kostenpflichtig, die Übersetzungen bezahlen Sie über Ihr Supertext-Abo.
`,
    {
      title: 'WordPress mehrsprachig: Polylang, WPML, Weglot',
      description: 'WordPress mehrsprachig machen: Polylang, WPML und Weglot im Überblick, und wie Sie mit Polylang Pro und Supertext automatisch übersetzen, auch in de-CH.',
    }
  ),

  article(
    'joomla-automatisch-uebersetzen',
    '2026-12-03T07:00:00.000Z',
    ['joomla'],
    'Joomla automatisch übersetzen: mehrsprachige Beiträge mit wenigen Klicks',
    'Joomla kann von Haus aus mehrsprachig, aber das Übersetzen bleibt Handarbeit. So übersetzen Sie Beiträge aus der Beitragsliste oder dem Editor automatisch.',
    `
Joomla bringt alles für mehrsprachige Websites mit, ohne zusätzliche Erweiterung für die Sprachverwaltung. Was fehlt, ist die Übersetzung selbst: Jeder Beitrag muss für jede Sprache neu angelegt, übersetzt und mit dem Original verknüpft werden. Mit dem Supertext-Plugin geht das aus der Beitragsliste heraus.

## So funktioniert Mehrsprachigkeit in Joomla

- **Sprachpakete und Inhaltssprachen:** Unter **System → Sprachen** installieren Sie die Sprachpakete und legen die Inhaltssprachen an, zum Beispiel *Deutsch (Schweiz)*.
- **Sprachfilter:** Das Plugin *System – Sprachfilter* sorgt dafür, dass Besucherinnen und Besucher die Inhalte ihrer Sprache sehen.
- **Zuordnungen:** Beiträge, Kategorien und Menüeinträge werden über **Mehrsprachige Zuordnungen** mit ihren Übersetzungen verknüpft, damit der Sprachwechsler funktioniert.

## Joomla mit Supertext übersetzen

- **Aus der Liste oder dem Editor:** Markieren Sie in **Inhalt → Beiträge** einen oder mehrere Beiträge, oder öffnen Sie einen Beitrag, und klicken Sie in der Werkzeugleiste auf **Supertext**.
- **Alles, was dazugehört:** Supertext übersetzt den Text mit Formatierung, Links und Listen, dazu Metadaten, Alternativtexte, Bildunterschriften und eigene Felder. Plugin-Tags wie \`{loadmodule}\` bleiben unverändert.
- **Verknüpft und unveröffentlicht:** Jede Übersetzung ist ein neuer Beitrag, über die Zuordnungen von Joomla mit dem Original verknüpft und zunächst unveröffentlicht.
- **Sie oder du:** Die Ansprache wählen Sie in den Einstellungen.

## Schritt für Schritt

**Sie brauchen:** Joomla 5.4 oder 6.1 und ein Supertext-Konto.

1. **API-Key holen.** ${apiKey}
2. **Plugin installieren** (ZIP-Paket über **System → Installieren → Erweiterungen**) und den Key in den Plugin-Einstellungen eintragen. Details auf der [Seite des Joomla-Plugins](/de/integrations/joomla).
3. **Sprachen einrichten:** Inhaltssprachen anlegen und den Sprachfilter aktivieren.
4. **Übersetzen:** Beiträge markieren, **Supertext** klicken, Zielsprachen wählen, **Übersetzen**. Der Dialog listet jede neue Übersetzung mit einem Link zum Öffnen.
5. **Prüfen und veröffentlichen:** Übersetzung kontrollieren, Status auf *Veröffentlicht* setzen.

${swissNote}

## Häufige Fragen

**Werden bestehende Übersetzungen überschrieben?** Nein, nur wenn Sie das ausdrücklich wählen.

**Kostet das Plugin etwas?** Das Plugin ist kostenlos und Open Source. Sie bezahlen nur die Übersetzungen über Ihr Supertext-Abo.
`,
    {
      title: 'Joomla automatisch übersetzen: Anleitung',
      description: 'Joomla mehrsprachig: Sprachen, Sprachfilter und Zuordnungen erklärt, und wie Sie Beiträge mit Supertext automatisch übersetzen, auch in Schweizer Hochdeutsch.',
    }
  ),
];

// Comparisons: drafts in German only. They name competitors, so someone checks the claims
// against the vendors' current documentation before publishing them in the CMS.
const germanDrafts = [
  article(
    'weglot-alternative',
    '2026-12-10T07:00:00.000Z',
    ['wordpress', 'shopify', 'typo3'],
    'Weglot-Alternative für Schweizer Websites: Übersetzungen in Ihrem eigenen CMS',
    'Weglot übersetzt Websites als Cloud-Dienst. Wer die Übersetzungen im eigenen CMS behalten und für die Schweiz schreiben will, hat Alternativen.',
    `
Weglot ist beliebt, weil es schnell eingerichtet ist: Ein Plugin oder ein Code-Schnipsel, und die Website erscheint in mehreren Sprachen. Für manche Websites ist das genau richtig. Für andere zählen andere Dinge: wo die Übersetzungen liegen, wie sie für die Schweiz klingen und was sie auf Dauer kosten.

## Wie Weglot funktioniert

Weglot erkennt die Texte Ihrer Website, übersetzt sie maschinell und speichert die Übersetzungen in seiner Cloud. Ausgeliefert werden die Sprachversionen über Weglot. Abgerechnet wird nach der Anzahl übersetzter Wörter und Sprachen.

## Wann eine Alternative sinnvoll ist

- **Ihre Übersetzungen sollen Ihnen gehören.** Mit einem Supertext-Plugin liegen die Übersetzungen als normale Sprachversionen in Ihrem CMS, ob TYPO3, WordPress, Drupal oder Shopify. Wechseln Sie den Dienst, bleiben sie da.
- **Sie schreiben für die Schweiz.** Supertext schreibt Schweizer Hochdeutsch, Westschweizer Französisch und Schweizer Italienisch, auf Wunsch Mundart. [Mehr zu Schweizer Hochdeutsch](/de/swiss-german).
- **Ihre Texte sollen in der Schweiz bleiben.** Supertext übersetzt in der Schweiz und löscht die Texte danach (kostenpflichtige Abos).
- **Ihre Redaktion arbeitet im CMS.** Übersetzungen werden im gewohnten Editor geprüft und veröffentlicht, mit dem Workflow Ihres Systems.

## Supertext in Ihrem System

Supertext-Plugins gibt es für über 30 Systeme, darunter [TYPO3](/de/integrations/typo3), [WordPress mit Polylang](/de/integrations/wordpress), [Drupal](/de/integrations/drupal), [Contao](/de/integrations/contao) und [Shopify](/de/integrations/shopify). [Alle Integrationen ansehen](/de/integrations).
`,
    { title: 'Weglot-Alternative für Schweizer Websites' }
  ),
  article(
    'wpml-alternative',
    '2026-12-17T07:00:00.000Z',
    ['wordpress'],
    'WPML-Alternative: WordPress mehrsprachig mit Polylang Pro und Supertext',
    'WPML ist das bekannteste Mehrsprachigkeits-Plugin für WordPress. Polylang Pro mit Supertext ist eine schlanke Alternative, mit Übersetzungen für die Schweiz.',
    `
WPML ist seit Jahren das bekannteste Plugin für mehrsprachige WordPress-Websites. Es kann sehr viel, und entsprechend umfangreich ist es. Wer eine schlankere Lösung sucht, landet oft bei **Polylang**. Mit Polylang Pro und dem Supertext-Plugin kommt die automatische Übersetzung dazu.

## Polylang und WPML im Vergleich

Beide Plugins speichern jede Sprachversion als eigenen Beitrag in Ihrer WordPress-Datenbank und verknüpfen die Übersetzungen. Beide unterstützen Sprach-URLs, übersetzte Menüs und SEO-Angaben pro Sprache.

Die Unterschiede liegen im Umfang und in der Arbeitsweise: WPML bringt einen eigenen Übersetzungseditor und ein eigenes Übersetzungsmanagement mit. Polylang bleibt näher am normalen WordPress-Editor: Eine Übersetzung ist ein Beitrag, den Sie wie jeden anderen bearbeiten.

## Automatisch übersetzen mit Polylang Pro und Supertext

Das Supertext-Plugin erscheint in Polylang Pro als Übersetzungsdienst:

- Einzelne Beiträge über die Polylang-Schaltflächen übersetzen, viele über die Massenaktion **Supertext AI Translation**.
- Gutenberg, klassischer Editor, ACF, Kategorien und SEO-Angaben werden mitübersetzt.
- Für wichtige Seiten eine Humanübersetzung bestellen, mit Preis direkt in WordPress.
- Schweizer Hochdeutsch, Westschweizer Französisch und Schweizer Italienisch. [Mehr zu Schweizer Hochdeutsch](/de/swiss-german).

Die Anleitung: [WordPress mehrsprachig mit Polylang Pro und Supertext](/de/news/wordpress-mehrsprachig). Das Plugin: [Supertext für WordPress](/de/integrations/wordpress).
`,
    { title: 'WPML-Alternative: Polylang Pro mit Supertext' }
  ),
];

// German titles and descriptions for the integration pages people search for in German.
const germanSeo = {
  typo3: ['TYPO3 automatisch übersetzen: Extension für Supertext', 'TYPO3 automatisch übersetzen, direkt im Übersetzungsassistenten: ganze Seiten mit SEO-Texten, auch in Schweizer Hochdeutsch. Für TYPO3 13.4 und 14.3 LTS.'],
  contao: ['Contao übersetzen: Bundle für Supertext AI', 'Contao-Seiten, Artikel und Inhaltselemente mit einem Klick übersetzen, auch ganze Websites und in Schweizer Hochdeutsch. Für Contao 5.7 und 6.0.'],
  shopify: ['Shopify-Shop übersetzen: App für Supertext AI', 'Shopify-Shop übersetzen: Produkte, Kollektionen, Seiten und Blogs in alle Sprachen auf einmal, gespeichert für Translate & Adapt. Für jeden Shopify-Plan.'],
  wordpress: ['WordPress übersetzen mit Polylang Pro', 'WordPress mehrsprachig: Beiträge und Seiten mit Polylang Pro und Supertext automatisch übersetzen, mit ACF und SEO-Angaben, auch in Schweizer Hochdeutsch.'],
  joomla: ['Joomla automatisch übersetzen: Plugin', 'Joomla-Beiträge aus der Liste oder dem Editor übersetzen, mit Metadaten und eigenen Feldern, verknüpft und unveröffentlicht. Für Joomla 5.4 und 6.1.'],
  drupal: ['Drupal übersetzen mit TMGMT und Supertext', 'Drupal-Inhalte mit TMGMT und Supertext AI übersetzen, auch in Schweizer Hochdeutsch. Für Drupal 9, 10, 11 und 12. Kostenloses Open-Source-Modul.'],
  magento: ['Magento 2 übersetzen: Modul für Supertext', 'Magento-Produkte, Kategorien und CMS-Seiten in die Sprachen Ihrer Store Views übersetzen, auch in Schweizer Hochdeutsch. Kostenloses Open-Source-Modul.'],
  prestashop: ['PrestaShop übersetzen: Modul für Supertext', 'PrestaShop-Produkte, Kategorien und CMS-Seiten automatisch übersetzen, auch in Schweizer Hochdeutsch. Kostenloses Open-Source-Modul von Supertext.'],
  'akeneo-pim': ['Akeneo übersetzen: Produktdaten mit Supertext', 'Produktattribute in Akeneo PIM automatisch in alle Sprachen übersetzen, mit Ihrer Terminologie und in Schweizer Hochdeutsch. Kostenlos und Open Source.'],
  pimcore: ['Pimcore übersetzen: Bundle für Supertext', 'Pimcore-Objekte und Dokumente automatisch übersetzen, auch in Schweizer Hochdeutsch. Kostenloses Open-Source-Bundle von Supertext.'],
  neos: ['Neos CMS übersetzen mit Supertext', 'Neos-Seiten und Inhalte automatisch in andere Sprachen übersetzen, auch in Schweizer Hochdeutsch. Kostenloses Open-Source-Paket von Supertext.'],
  umbraco: ['Umbraco übersetzen mit Supertext', 'Umbraco-Inhalte automatisch in andere Sprachen übersetzen, auch in Schweizer Hochdeutsch. Kostenloses Open-Source-Paket von Supertext.'],
  'craft-cms': ['Craft CMS übersetzen: Plugin für Supertext', 'Einträge in Craft CMS automatisch für alle Sites und Sprachen übersetzen, auch in Schweizer Hochdeutsch. Kostenloses Open-Source-Plugin.'],
  strapi: ['Strapi übersetzen: Plugin für Supertext', 'Strapi-Inhalte mit i18n automatisch in alle Sprachen übersetzen, auch in Schweizer Hochdeutsch. Kostenloses Open-Source-Plugin von Supertext.'],
};

module.exports = { swissGermanEn, swissGermanDe, footerSwiss, germanArticles, germanDrafts, germanSeo };
