'use strict';

// Step-by-step guides (category "guides"), one a week from 9 November 2026: the four most used
// systems first. An article with a date in the future stays off the website until that date.
// Facts from each plugin's INSTALLATION.md and USER_GUIDE.md (November 2026).

const guide = (slug, date, systems, title, excerpt, body, seo) => ({
  slug,
  date,
  category: 'guides',
  systems: systems.join(','),
  title,
  excerpt,
  body: body.trim(),
  seo: { metaTitle: seo.title, metaDescription: seo.description || excerpt },
});

const swissGerman = `
## Swiss Standard German or dialect?

Websites in German-speaking Switzerland are written in **Swiss Standard German**: standard German with "ss" instead of "ß" and Swiss words and spellings. In Supertext that is **de-CH**, and it is what this guide uses. For a deliberately local tone, Supertext also writes **Swiss German dialect**, Zurich or Bernese (gsw-u-sd-chzh, gsw-u-sd-chbe), something most machine translation can't do.
`;

module.exports = [
  guide(
    'guide-typo3-swiss-german',
    '2026-11-09T07:00:00.000Z',
    ['typo3'],
    'Translate a TYPO3 website into Swiss German in 10 minutes',
    'Install the Supertext extension, set de-CH for your German site language and translate a page with TYPO3’s own Localize wizard: a step-by-step guide.',
    `
With the Supertext extension, TYPO3 translates pages in the step you already know: the **Localize** wizard. This guide takes you from installation to a translated page in Swiss Standard German.

**You need:** TYPO3 13.4 or 14.3 LTS installed with Composer, a Supertext account and about ten minutes.
${swissGerman}
## 1. Get your API key

[Log in to Supertext or create an account](https://www.supertext.com/person/en/account/signin), then generate a key under [Integrations → API](https://www.supertext.com/en/integrations/api). This needs the Admin role in your Supertext account; otherwise ask your account's admin.

## 2. Install the extension

The extension isn't on Packagist yet, so add its GitHub repository and require it:

\`\`\`bash
composer config repositories.supertext-typo3 vcs https://github.com/Supertext/Typo3-Supertext-Translation
composer require supertext/typo3-translation:dev-main
vendor/bin/typo3 extension:setup -e supertext_translation
vendor/bin/typo3 cache:flush
\`\`\`

## 3. Enter the key

In the backend, open **System → Settings → Extension Configuration → supertext_translation** (TYPO3 13: Admin Tools → Settings) and paste the key into *Supertext API key*. On a server you can set the environment variable \`SUPERTEXT_API_KEY\` instead, which keeps the key out of the database. The **Status** block at the top confirms that the connection works.

## 4. Add Swiss German as a site language

Open **Sites → Setup**, edit your site and, on the **Languages** tab, add a language with the locale \`de_CH.UTF-8\` (for example *Deutsch (Schweiz)*). In its **Supertext** palette:

- **Supertext language:** *Default (de-CH)* is preselected for this locale. Keep it.
- **Supertext tone:** *Formal* for "Sie", or informal for "du".

Save. The default language of the site is the source.

## 5. Translate a page

1. Open **Content → Layout** and select the page in the page tree.
2. In the language menu at the top right, choose **Deutsch (Schweiz)** under **Create new translation**.
3. In the **Localize** wizard, keep all content elements selected, choose **Translate** (connected mode) and click **Localize**.

After a few seconds a green message confirms what Supertext translated, for example *"Supertext translated 30 field(s) in 14 record(s) into Deutsch (Schweiz) (de-CH)."* Page title, SEO texts, headers, rich text, captions, alt texts and tables are translated; the URL is rebuilt from the translated title, for example \`/about-us\` becomes \`/de/ueber-uns\`.

## 6. Review and publish

New translations are **hidden**, as usual in TYPO3. Read through the page, adjust anything you'd phrase differently and unhide the page translation and its content elements. Done.

## Next steps

- Content added later: translate it from **Display mode → Language Comparison** with the **Translate** button in the German column.
- Many pages at once, or your own translators: see the [TYPO3 integration page](/en/integrations/typo3) and its XLIFF and HTML export.
- French and Italian for Switzerland work the same way, with fr-CH and it-CH.
`,
    {
      title: 'Translate TYPO3 into Swiss German in 10 minutes | Supertext',
      description: 'Step by step: install the Supertext TYPO3 extension, add de-CH as a site language and translate a page with the Localize wizard. Formal address, SEO texts and URLs included.',
    }
  ),

  guide(
    'guide-wordpress-swiss-german',
    '2026-11-16T07:00:00.000Z',
    ['wordpress'],
    'Translate a WordPress website into Swiss German in 10 minutes',
    'Polylang Pro plus the Supertext plugin: set up Supertext as the machine translation service, map German to de-CH and translate posts one by one or in bulk.',
    `
If your WordPress site is multilingual with **Polylang Pro**, Supertext plugs into Polylang's own machine translation, next to DeepL. This guide gets you from installation to a translated page in Swiss Standard German.

**You need:** WordPress 6.0 or newer with PHP 8.1, Polylang Pro with its Machine Translation module, a Supertext account and about ten minutes.
${swissGerman}
## 1. Get your API key

[Log in to Supertext or create an account](https://www.supertext.com/person/en/account/signin), then generate an AI translation key under [Integrations → API](https://www.supertext.com/en/integrations/api) (Admin role required).

## 2. Install and activate the plugin

Download the plugin ZIP from the [plugin's GitHub page](https://github.com/Supertext/supertext-wordpress-polylang), upload it under **Plugins → Add New → Upload Plugin** and activate **Supertext for Polylang**. A **Supertext** menu appears in the sidebar.

## 3. Connect it to Polylang

Polylang Pro has no official way for other services to register, so the plugin adds one line to Polylang for you: open **Supertext → Settings** and click **Patch Polylang** under *Setup*. It keeps a backup, and you can run it again after a Polylang update; the status panel shows whether the patch is in place.

## 4. Choose Supertext and enter the key

1. Go to **Languages → Settings → Machine Translation**, turn machine translation on and choose **Supertext**.
2. Paste your **API key**.
3. Under **Language mapping**, set your German language to **Deutsch (Schweiz) (de-CH)**; a Polylang language with the locale \`de_CH\` is suggested as de-CH already. Set **Formality** to *Formal* for "Sie".
4. Save. The plugin checks the key straight away (free of charge) and confirms *API key checked: the connection to Supertext works.*

No Swiss German language in Polylang yet? Add it under **Languages** first, for example *Deutsch (Schweiz)* with the locale \`de_CH\`.

## 5. Translate

- **One post or page:** open it and use Polylang's **translate with Supertext** action (marked with the Supertext logo) in the languages box.
- **Many at once:** in **Posts** or **Pages**, select the items, choose **Supertext AI Translation** from *Bulk actions*, pick the target language and click **Apply**. Items that already have a translation are skipped.

Gutenberg blocks, the classic editor, ACF fields, categories, tags and SEO meta are translated through Polylang's own pipeline; YOOtheme Pro layouts and Gravity Forms are supported too.

## 6. Review and publish

Polylang creates the translation linked to the original. Read it through, adjust what you'd phrase differently and publish it.

## Next steps

- Need a professional translation for an important page? The plugin can order one from Supertext's linguists, with a price quote, right from WordPress.
- More on the [WordPress integration page](/en/integrations/wordpress), including the XLIFF and HTML export for your own translators.
`,
    {
      title: 'Translate WordPress into Swiss German in 10 minutes | Supertext',
      description: 'Step by step: Supertext as the machine translation service in Polylang Pro, German mapped to de-CH, posts translated one by one or in bulk. Formal address and SEO meta included.',
    }
  ),

  guide(
    'guide-shopify-swiss-german',
    '2026-11-23T07:00:00.000Z',
    ['shopify'],
    'Translate a Shopify store into Swiss German in 10 minutes',
    'Add German to your store, choose de-CH in the Supertext app and translate products, collections, pages and blog posts in one run, in the background.',
    `
Swiss shoppers notice when a shop writes "Straße" instead of "Strasse". The Supertext app translates your Shopify store's texts into all its languages and saves them where Shopify keeps translations. Here is how to get a Swiss German store in about ten minutes.

**You need:** a Shopify store on any plan, a Supertext account, and the app installed. The app is not in the Shopify App Store yet: [ask Supertext](https://www.supertext.com/en/contact) for the install link.
${swissGerman}
## 1. Get your API key

[Log in to Supertext or create an account](https://www.supertext.com/person/en/account/signin), then generate a key under [Integrations → API](https://www.supertext.com/en/integrations/api) (Admin role required).

## 2. Install the app

Open the install link while logged in to your store's admin and click **Install**. The app only asks to read products, content and languages, and to read and write translations: it can't change products, prices, orders or customers. It opens under **Apps → Supertext Translation**.

## 3. Enter the key

Open **Apps → Supertext Translation → Settings**, paste the key into **API key** and click **Save**. The app checks it right away, free of charge: *API key checked: the connection to Supertext works.*

## 4. Add German and choose Swiss German

1. In the Shopify admin, open **Settings → Languages**, click **Add language** and add **German**. You don't have to publish it yet.
2. Back in the app's **Settings → Languages**, choose **Schweizer Hochdeutsch (de-CH)** in German's list. Shopify calls the language simply \`de\`, so this is where you decide which German it gets.
3. Set **Form of address** to *Formal* for "Sie", and save.

## 5. Translate

1. Open **Apps → Supertext Translation**.
2. Choose **Products**, **Collections**, **Pages**, **Blog posts** or **Blogs** and tick the items (**Select all on this page** ticks the 50 shown).
3. Check that German is ticked; it shows *→ Supertext de-CH*.
4. Click **Translate … with Supertext**.

The translation runs in the background, and **Recent translations** shows the progress. You can leave the page and come back.

## 6. Review and publish

The translations are saved in Shopify's own translation store. Check and edit them in Shopify's free **Translate & Adapt** app, then publish German under **Settings → Languages**: only then do your customers see it.

## Next steps

- Changed a product description? Translate it again: outdated translations are refreshed, your edits elsewhere are kept.
- French and Italian for Switzerland work the same way, with fr-CH and it-CH.
- More on the [Shopify integration page](/en/integrations/shopify).
`,
    {
      title: 'Translate a Shopify store into Swiss German | Supertext',
      description: 'Step by step: add German to your Shopify store, choose de-CH in the Supertext app and translate products, collections, pages and blog posts in the background.',
    }
  ),

  guide(
    'guide-drupal-swiss-german',
    '2026-11-30T07:00:00.000Z',
    ['drupal'],
    'Translate a Drupal website into Swiss German with TMGMT',
    'Install the Supertext AI provider for TMGMT, map German to de-CH and translate content from TMGMT’s sources page, with its usual review step.',
    `
Drupal sites that translate a lot usually do it with the **Translation Management Tool** (TMGMT). The Supertext AI module adds Supertext as a translation provider, so your content goes to Supertext and comes back into TMGMT's review. This guide covers the setup and a first translation into Swiss Standard German.

**You need:** Drupal 9, 10, 11 or 12 with Composer, a multilingual site, a Supertext account and about fifteen minutes.
${swissGerman}
## 1. Get your API key

[Log in to Supertext or create an account](https://www.supertext.com/person/en/account/signin), then generate a key under [Integrations → API](https://www.supertext.com/en/integrations/api) (Admin role required).

## 2. Install the module

\`\`\`bash
composer require 'drupal/tmgmt_supertext_ai:^1.0'
drush en tmgmt_supertext_ai tmgmt_content
\`\`\`

This brings TMGMT with it. Content translation must be on for the content types you want to translate (**Configuration → Regional and language → Content language and translation**).

## 3. Add German (Switzerland)

Under **Configuration → Regional and language → Languages**, add German if your site doesn't have it yet. Drupal knows German as \`de\`; which German Supertext writes is set in the next step.

## 4. Set up the Supertext provider

1. Open **Translation → Providers** (\`/admin/tmgmt/translators\`) and add a provider of the type **Supertext AI**, or edit the Supertext AI provider if the list already has one.
2. Enter your **API key**.
3. Under **Remote languages mappings**, map German (\`de\`) to **de-CH**.
4. Save.

## 5. Translate content

1. Open **Translation → Sources** (Content), tick the pages or articles to translate and click **Request translation**.
2. Choose **German** as the target language and **Supertext AI** as the provider, then submit the job.
3. Supertext translates the content; the job items appear under **Translation → Jobs**.

## 6. Review and accept

Open the job items, check the translations side by side with the original, edit what you'd phrase differently and **accept** them. TMGMT then saves them as the German version of each page.

## Next steps

- The module is maintained by our partner MD Systems and published on [drupal.org](https://www.drupal.org/project/tmgmt_supertext_ai).
- More on the [Drupal integration page](/en/integrations/drupal).
- French and Italian for Switzerland work the same way, with fr-CH and it-CH.
`,
    {
      title: 'Translate Drupal into Swiss German with TMGMT | Supertext',
      description: 'Step by step: install the Supertext AI provider for TMGMT, map German to de-CH and translate pages from the sources page, with TMGMT’s review step before publishing.',
    }
  ),
];
