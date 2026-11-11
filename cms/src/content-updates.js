'use strict';

// One-time changes to existing content (the seed only fills an empty site).
// Each update runs once; the CMS remembers it in its store, so editors can change
// or remove the result afterwards without it coming back.
const { sdkAnnouncement, sdkNavLink, SDK_REPO } = require('./seed/announcements');
const { sdkPage, homeSdkBlock, navSdk, footerSdk } = require('./seed/sdk');

const GLOBAL = 'api::global.global';
const PAGE = 'api::page.page';

/** Media objects → ids, so populated content can be written back. */
const mediaToIds = (value) =>
  Array.isArray(value)
    ? value.map(mediaToIds)
    : value && typeof value === 'object'
      ? value.mime && value.url
        ? value.id
        : Object.fromEntries(Object.entries(value).map(([k, v]) => [k, mediaToIds(v)]))
      : value;

const INTEGRATION = 'api::integration.integration';

/** Technology, versions, licence, about text, features and description: only fills empty fields. */
async function addIntegrationDetails(strapi) {
  const DETAILS = require('./seed/integration-details.json');
  const items = await strapi.documents(INTEGRATION).findMany({ locale: 'en', status: 'draft', populate: ['features'], limit: 500 });
  let changed = 0;
  for (const item of items) {
    const d = DETAILS[item.slug];
    if (!d) continue;
    const data = {};
    for (const key of ['technology', 'supportedVersions', 'license', 'aboutSystem', 'description']) {
      if (!item[key] && d[key]) data[key] = d[key];
    }
    if (!(item.features || []).length && d.features?.length) data.features = d.features.map((text) => ({ text, included: true }));
    if (!Object.keys(data).length) continue;
    const published = await strapi.documents(INTEGRATION).findOne({ documentId: item.documentId, locale: 'en', status: 'published', fields: ['updatedAt'] });
    const edited = !published || new Date(item.updatedAt) - new Date(published.updatedAt) > 1000;
    await strapi.documents(INTEGRATION).update({ documentId: item.documentId, locale: 'en', data });
    if (!edited) await strapi.documents(INTEGRATION).publish({ documentId: item.documentId, locale: 'en' });
    changed++;
  }
  strapi.log.info(`[setup] Added details to ${changed} integrations`);
  return true;
}

/** HubSpot: new integration in the CMS category, between Grav and Joomla (published, live). */
async function addHubSpot(strapi) {
  const seed = require('./seed/integrations').find((i) => i.slug === 'hubspot');
  const [grav, joomla] = await Promise.all(
    ['grav', 'joomla'].map((slug) => strapi.documents(INTEGRATION).findFirst({ locale: 'en', filters: { slug }, fields: ['order'] }))
  );
  const order = grav?.order && joomla?.order ? Math.round((grav.order + joomla.order) / 2) : seed.order;
  const existing = await strapi.documents(INTEGRATION).findFirst({ locale: 'en', status: 'draft', filters: { slug: 'hubspot' }, fields: ['category', 'stage', 'order'] });
  if (!existing && seed) {
    await strapi.documents(INTEGRATION).create({ locale: 'en', data: { ...seed, order }, status: 'published' });
    strapi.log.info('[setup] Created the HubSpot integration');
  } else if (existing && existing.category !== 'cms') {
    // An earlier version of this update put it under Email marketing.
    await strapi.documents(INTEGRATION).update({ documentId: existing.documentId, locale: 'en', data: { category: 'cms', stage: 'live', order, integrationType: seed.integrationType, summary: seed.summary, description: seed.description } });
    await strapi.documents(INTEGRATION).publish({ documentId: existing.documentId, locale: 'en' });
  }
  return updateGlobal(strapi, (global) => {
    const navigation = stripIds(global.navigation || []);
    for (const group of navigation) {
      for (const l of group.links || []) {
        if (/category=email$/.test(l.url) && l.label === 'Marketing') Object.assign(l, { label: 'Email marketing', description: 'Mailchimp' });
        if (/category=cms$/.test(l.url) && l.description === 'WordPress, TYPO3, Strapi and 17 more') l.description = 'WordPress, TYPO3, Strapi, HubSpot and 17 more';
      }
    }
    return { navigation };
  });
}

const usesSdkLink = (value) => JSON.stringify(value || null).includes('"/en/sdk"');

/** Every block type, populated one level deep (enough for the start page's blocks). */
function blocksPopulate(strapi) {
  const zone = strapi.contentType(PAGE).attributes.blocks.components;
  return { on: Object.fromEntries(zone.map((uid) => [uid, { populate: '*' }])) };
}

async function addSdkPage(strapi) {
  const existing = await strapi.documents(PAGE).findFirst({ locale: 'en', filters: { slug: 'sdk' }, fields: ['id'] });
  if (!existing) {
    await strapi.documents(PAGE).create({ locale: 'en', data: sdkPage, status: 'published' });
    strapi.log.info('[setup] Created the SDK page');
  }

  // Start page: the SDK section right after the integration grid.
  const home = await strapi.documents(PAGE).findFirst({
    locale: 'en',
    status: 'draft',
    filters: { slug: 'home' },
    populate: { blocks: blocksPopulate(strapi) },
  });
  if (home && !usesSdkLink(home.blocks)) {
    const published = await strapi.documents(PAGE).findOne({ documentId: home.documentId, locale: 'en', status: 'published', fields: ['updatedAt'] });
    const edited = !published || new Date(home.updatedAt) - new Date(published.updatedAt) > 1000;
    const blocks = mediaToIds(home.blocks);
    const grid = blocks.findIndex((b) => b.__component === 'blocks.integration-grid');
    blocks.splice(grid >= 0 ? grid + 1 : blocks.length, 0, homeSdkBlock);
    await strapi.documents(PAGE).update({ documentId: home.documentId, locale: 'en', data: { blocks } });
    if (!edited) await strapi.documents(PAGE).publish({ documentId: home.documentId, locale: 'en' });
  }

  // Menu, footer and announcement point to the SDK page.
  return updateGlobal(strapi, (global) => {
    const navigation = stripIds(global.navigation || []);
    if (!navigation.some((g) => g.url === navSdk.url)) {
      const pricing = navigation.findIndex((g) => /\/pricing$/.test(g.url || ''));
      navigation.splice(pricing >= 0 ? pricing + 1 : navigation.length, 0, { ...navSdk });
    }
    for (const group of navigation) {
      for (const l of group.links || []) if (l.url === SDK_REPO) Object.assign(l, { url: sdkNavLink.url });
    }
    const footerColumns = stripIds(global.footerColumns || []);
    const column = footerColumns.find((c) => (c.links || []).some((l) => /\/integrations$/.test(l.url)));
    if (column && !usesSdkLink(column.links)) column.links = [...column.links, { ...footerSdk }];
    const announcement = global.announcement ? stripIds(global.announcement) : null;
    if (announcement?.link?.url === SDK_REPO) announcement.link = { ...announcement.link, url: '/en/sdk', newTab: false };
    return { navigation, footerColumns, ...(announcement && { announcement }) };
  });
}

const stripIds = (value) =>
  Array.isArray(value)
    ? value.map(stripIds)
    : value && typeof value === 'object'
      ? Object.fromEntries(Object.entries(value).filter(([k]) => k !== 'id').map(([k, v]) => [k, stripIds(v)]))
      : value;

async function updateGlobal(strapi, change) {
  const draft = await strapi.documents(GLOBAL).findFirst({
    locale: 'en',
    status: 'draft',
    populate: { announcement: { populate: '*' }, navigation: { populate: '*' }, footerColumns: { populate: '*' } },
  });
  if (!draft) return false;
  const published = await strapi.documents(GLOBAL).findFirst({ locale: 'en', status: 'published', fields: ['updatedAt'] });
  const editedSincePublish = !published || new Date(draft.updatedAt) - new Date(published.updatedAt) > 1000;
  const data = change(draft);
  if (!data) return true;
  await strapi.documents(GLOBAL).update({ documentId: draft.documentId, locale: 'en', data });
  // Publish right away unless an editor has unpublished changes waiting.
  if (!editedSincePublish) await strapi.documents(GLOBAL).publish({ documentId: draft.documentId, locale: 'en' });
  return true;
}


// SEO pass (October 2026): titles, descriptions and H1s around how people search, with
// Supertext in every title. Only values that are still the seed's are changed.
const SEO_PAGES = {
  home: {
    'seo.metaTitle': ['Supertext integrations', 'AI translation plugins for CMS, PIM and shops | Supertext'],
    'seo.metaDescription': [
      'Supertext AI translation inside the CMS, PIM, shop and design tools you already use.',
      'Supertext AI translation inside TYPO3, WordPress, Shopify, Strapi and 25+ other systems. Swiss quality, free plugins, optional support and localization.',
    ],
    hero: ['Translate where your content lives', 'AI translation where your content lives'],
  },
  integrations: {
    'seo.metaTitle': ['Integrations | Supertext', 'Translation plugins for CMS, PIM and shops | Supertext'],
    'seo.metaDescription': [
      'All Supertext plugins for CMS, PIM, e-commerce, email marketing and design files.',
      'All Supertext translation plugins: TYPO3, WordPress, Drupal, Shopify, Magento, Akeneo, HubSpot and more. Free and open source, translate in your system.',
    ],
    hero: ['All Supertext integrations', 'All Supertext translation plugins'],
  },
  pricing: {
    'seo.metaTitle': ['Plans | Supertext integrations', 'Plugin support and localization plans | Supertext'],
    'seo.metaDescription': [
      'Support and localization subscriptions for the Supertext plugins.',
      'Support and localization subscriptions for the Supertext translation plugins: setup, update checks and answers for your platform. The plugins stay free.',
    ],
    faq: [
      {
        question: 'Which platforms does a subscription cover?',
        answer: 'One subscription covers one platform: choose it at checkout from the Supertext integrations. Running several platforms? [Talk to us](https://www.supertext.com/en/contact) about a plan for all of them.',
      },
      {
        question: 'What happens to the plugin if I cancel?',
        answer: 'It keeps working. The plugins are free and open source; only the support and services of your plan end.',
      },
    ],
  },
  sdk: {
    'seo.metaTitle': ['Supertext SDKs and integration guide', 'Translation API SDKs and integration guide | Supertext'],
  },
};

async function seoPages(strapi) {
  for (const [slug, change] of Object.entries(SEO_PAGES)) {
    const page = await strapi.documents(PAGE).findFirst({
      locale: 'en',
      status: 'draft',
      filters: { slug },
      populate: { seo: { populate: '*' }, blocks: blocksPopulate(strapi) },
    });
    if (!page) continue;
    const published = await strapi.documents(PAGE).findOne({ documentId: page.documentId, locale: 'en', status: 'published', fields: ['updatedAt'] });
    const edited = !published || new Date(page.updatedAt) - new Date(published.updatedAt) > 1000;
    const seo = page.seo ? stripIds(mediaToIds(page.seo)) : {};
    const blocks = stripIds(mediaToIds(page.blocks || []));
    let changed = false;
    for (const field of ['metaTitle', 'metaDescription']) {
      const pair = change[`seo.${field}`];
      if (pair && seo[field] === pair[0]) { seo[field] = pair[1]; changed = true; }
    }
    const hero = blocks.find((b) => b.__component === 'blocks.hero');
    if (change.hero && hero?.title === change.hero[0]) { hero.title = change.hero[1]; changed = true; }
    const faq = blocks.find((b) => b.__component === 'blocks.faq');
    if (change.faq && faq) {
      const known = new Set((faq.items || []).map((i) => i.question));
      const add = change.faq.filter((i) => !known.has(i.question));
      if (add.length) { faq.items = [...(faq.items || []), ...add]; changed = true; }
    }
    if (!changed) continue;
    await strapi.documents(PAGE).update({ documentId: page.documentId, locale: 'en', data: { seo, blocks } });
    if (!edited) await strapi.documents(PAGE).publish({ documentId: page.documentId, locale: 'en' });
  }
  return true;
}

/** Questions for an integration's page, built from its own fields. */
function integrationFaq(item) {
  const s = item.system;
  const design = item.category === 'design';
  const list = (item.features || []).map((f) => f.text.replace(/\.$/, '')).filter(Boolean);
  const items = [];
  const needs = [
    item.supportedVersions && `${item.supportedVersions}.`,
    item.integrationType && `Type of integration: ${item.integrationType.replace(/\.?$/, '.')}`,
    design
      ? 'No Supertext account is needed for the XLIFF export and import itself; send the file to Supertext or any translator or CAT tool.'
      : 'You also need a Supertext account and an API key: generate it at [supertext.com → Integrations → API](https://www.supertext.com/en/integrations/api) (requires the Admin role).',
  ].filter(Boolean);
  items.push({ question: `What do I need to use Supertext with ${s}?`, answer: needs.join(' ') });
  if (list.length) {
    items.push({ question: `What does Supertext translate in ${s}?`, answer: list.map((f) => `- ${f}`).join('\n') });
  }
  items.push(
    design
      ? { question: 'Which languages are supported?', answer: 'Any language: the XLIFF 1.2 files work with every CAT tool and translator, and the import puts the translated text back with its formatting.' }
      : {
          question: 'Which languages are supported?',
          answer: `All Supertext languages, with regional variants such as Swiss German (de-CH), French (fr-CH) and Italian (it-CH) and, where the language has one, formal or informal address. Editors review the result in ${s} before publishing.`,
        }
  );
  items.push({
    question: `Is the ${s} plugin free?`,
    answer: [
      `Yes. The plugin is free and open source${item.license ? ` (${item.license})` : ''}.`,
      design ? '' : 'Translations are done with your Supertext account.',
      'Support and localization services are available as [subscriptions](/en/pricing).',
    ].filter(Boolean).join(' '),
  });
  return { __component: 'blocks.faq', title: `Questions about Supertext for ${s}`, items };
}

async function addIntegrationFaqs(strapi) {
  const zone = strapi.contentType(INTEGRATION).attributes.blocks.components;
  const items = await strapi.documents(INTEGRATION).findMany({
    locale: 'en',
    status: 'draft',
    populate: { features: true, blocks: { on: Object.fromEntries(zone.map((uid) => [uid, { populate: '*' }])) } },
    limit: 500,
  });
  let changed = 0;
  for (const item of items) {
    if ((item.blocks || []).some((b) => b.__component === 'blocks.faq')) continue;
    const published = await strapi.documents(INTEGRATION).findOne({ documentId: item.documentId, locale: 'en', status: 'published', fields: ['updatedAt'] });
    const edited = !published || new Date(item.updatedAt) - new Date(published.updatedAt) > 1000;
    const blocks = [...stripIds(mediaToIds(item.blocks || [])), integrationFaq(item)];
    await strapi.documents(INTEGRATION).update({ documentId: item.documentId, locale: 'en', data: { blocks } });
    if (!edited) await strapi.documents(INTEGRATION).publish({ documentId: item.documentId, locale: 'en' });
    changed++;
  }
  strapi.log.info(`[setup] Added questions to ${changed} integrations`);
  return true;
}

/** Reviewed translations (English text → translation) for content added after the first translation. */
const translationsFor = (locale) => {
  try {
    return require(`./seed/translations/${locale}.json`);
  } catch {
    return {};
  }
};

/**
 * Comparisons (October 2026): the /compare page, "Compared with built-in translation" on every
 * integration (English and, where the language version exists, its reviewed translation) and a
 * footer link in every language.
 */
async function addComparisons(strapi) {
  const { comparePage, builtIn, footerCompare } = require('./seed/comparison');
  const LOCALES = ['de', 'fr', 'it'];

  if (!(await strapi.documents(PAGE).findFirst({ locale: 'en', filters: { slug: 'compare' }, fields: ['id'] }))) {
    await strapi.documents(PAGE).create({ locale: 'en', data: comparePage, status: 'published' });
    strapi.log.info('[setup] Created the comparison page');
  }

  const items = await strapi.documents(INTEGRATION).findMany({ locale: 'en', status: 'draft', fields: ['slug', 'builtInTranslation', 'updatedAt'], limit: 500 });
  for (const item of items) {
    const text = item.builtInTranslation || builtIn[item.slug];
    if (!text) continue;
    const published = await strapi.documents(INTEGRATION).findOne({ documentId: item.documentId, locale: 'en', status: 'published', fields: ['updatedAt'] });
    if (!item.builtInTranslation) {
      const edited = !published || new Date(item.updatedAt) - new Date(published.updatedAt) > 1000;
      await strapi.documents(INTEGRATION).update({ documentId: item.documentId, locale: 'en', data: { builtInTranslation: text } });
      if (!edited) await strapi.documents(INTEGRATION).publish({ documentId: item.documentId, locale: 'en' });
    }
    for (const locale of LOCALES) {
      const translated = translationsFor(locale)[text];
      if (!translated) continue;
      const version = await strapi.documents(INTEGRATION).findOne({ documentId: item.documentId, locale, status: 'draft', fields: ['builtInTranslation', 'updatedAt'] });
      if (!version || version.builtInTranslation) continue;
      const live = await strapi.documents(INTEGRATION).findOne({ documentId: item.documentId, locale, status: 'published', fields: ['updatedAt'] });
      const edited = live && new Date(version.updatedAt) - new Date(live.updatedAt) > 1000;
      await strapi.documents(INTEGRATION).update({ documentId: item.documentId, locale, data: { builtInTranslation: translated } });
      if (live && !edited) await strapi.documents(INTEGRATION).publish({ documentId: item.documentId, locale });
    }
  }

  // Footer: the comparison next to the SDK link, in every language that has its own Global.
  for (const locale of ['en', ...LOCALES]) {
    const label = locale === 'en' ? footerCompare.label : translationsFor(locale)[footerCompare.label];
    if (!label) continue;
    const draft = await strapi.documents(GLOBAL).findFirst({ locale, status: 'draft', populate: { footerColumns: { populate: '*' } } });
    if (!draft) continue;
    const footerColumns = stripIds(draft.footerColumns || []);
    const column = footerColumns.find((c) => (c.links || []).some((l) => /\/(integrations|sdk)$/.test(l.url)));
    if (!column || column.links.some((l) => l.url === footerCompare.url)) continue;
    column.links = [...column.links, { label, url: footerCompare.url }];
    const live = await strapi.documents(GLOBAL).findFirst({ locale, status: 'published', fields: ['updatedAt'] });
    const edited = !live || new Date(draft.updatedAt) - new Date(live.updatedAt) > 1000;
    await strapi.documents(GLOBAL).update({ documentId: draft.documentId, locale, data: { footerColumns } });
    if (!edited) await strapi.documents(GLOBAL).publish({ documentId: draft.documentId, locale });
  }
  return true;
}

/** Support (October 2026): "Support" in the main menu (after SDK) and in the footer, every language. */
async function addSupportLinks(strapi) {
  const LABELS = { en: 'Support', de: 'Support', fr: 'Support', it: 'Supporto' };
  const url = '/en/support';
  for (const [locale, label] of Object.entries(LABELS)) {
    const draft = await strapi.documents(GLOBAL).findFirst({
      locale,
      status: 'draft',
      populate: { navigation: { populate: '*' }, footerColumns: { populate: '*' } },
    });
    if (!draft) continue;
    const navigation = stripIds(draft.navigation || []);
    const footerColumns = stripIds(draft.footerColumns || []);
    let changed = false;
    if (!navigation.some((g) => g.url === url)) {
      const sdk = navigation.findIndex((g) => /\/sdk$/.test(g.url || ''));
      navigation.splice(sdk >= 0 ? sdk + 1 : navigation.length, 0, { label, url });
      changed = true;
    }
    const column = footerColumns.find((c) => (c.links || []).some((l) => /integrations\/api|account\/signin/.test(l.url || ''))) || footerColumns[0];
    if (column && !(column.links || []).some((l) => l.url === url)) {
      column.links = [...(column.links || []), { label, url }];
      changed = true;
    }
    if (!changed) continue;
    const live = await strapi.documents(GLOBAL).findFirst({ locale, status: 'published', fields: ['updatedAt'] });
    const edited = !live || new Date(draft.updatedAt) - new Date(live.updatedAt) > 1000;
    await strapi.documents(GLOBAL).update({ documentId: draft.documentId, locale, data: { navigation, footerColumns } });
    if (!edited) await strapi.documents(GLOBAL).publish({ documentId: draft.documentId, locale });
  }
  return true;
}

/**
 * XLIFF and HTML export (October 2026): the fields behind /integrations/<slug>/files, in English
 * and, where the language version exists, its reviewed translation. Only empty fields are filled.
 */
async function addFileExchange(strapi) {
  const FILES = require('./seed/file-exchange.json');
  const SHARED = ['fileFormats', 'fileReleased', 'fileDocs'];
  const TEXTS = ['fileIntro', 'fileExport', 'fileImport', 'fileKeeps', 'fileLimits'];
  const items = await strapi.documents(INTEGRATION).findMany({ locale: 'en', status: 'draft', fields: ['slug', 'updatedAt', ...SHARED, ...TEXTS], limit: 500 });
  for (const item of items) {
    const f = FILES[item.slug];
    if (!f) continue;
    const data = {};
    for (const key of [...SHARED, ...TEXTS]) if ((item[key] === null || item[key] === undefined || item[key] === '') && f[key] !== undefined) data[key] = f[key];
    const published = await strapi.documents(INTEGRATION).findOne({ documentId: item.documentId, locale: 'en', status: 'published', fields: ['updatedAt'] });
    if (Object.keys(data).length) {
      const edited = !published || new Date(item.updatedAt) - new Date(published.updatedAt) > 1000;
      await strapi.documents(INTEGRATION).update({ documentId: item.documentId, locale: 'en', data });
      if (!edited) await strapi.documents(INTEGRATION).publish({ documentId: item.documentId, locale: 'en' });
    }
    for (const locale of ['de', 'fr', 'it']) {
      const dict = translationsFor(locale);
      const version = await strapi.documents(INTEGRATION).findOne({ documentId: item.documentId, locale, status: 'draft', fields: ['updatedAt', ...TEXTS] });
      if (!version) continue;
      const local = {};
      for (const key of TEXTS) {
        const english = item[key] || f[key];
        if (!version[key] && english && dict[english]) local[key] = dict[english];
      }
      if (!Object.keys(local).length) continue;
      const live = await strapi.documents(INTEGRATION).findOne({ documentId: item.documentId, locale, status: 'published', fields: ['updatedAt'] });
      const edited = live && new Date(version.updatedAt) - new Date(live.updatedAt) > 1000;
      await strapi.documents(INTEGRATION).update({ documentId: item.documentId, locale, data: local });
      if (live && !edited) await strapi.documents(INTEGRATION).publish({ documentId: item.documentId, locale });
    }
  }
  return true;
}

/**
 * Plugin status and roadmap (November 2026): the systems without a plugin yet (on the roadmap
 * or open for requests), the roadmap page, draft roadmap items and a footer link in every language.
 */
async function addRoadmap(strapi) {
  const seeds = require('./seed/integrations').filter((i) => i.stage === 'roadmap' || i.stage === 'request');
  const { roadmapPage, roadmapItems, footerRoadmap } = require('./seed/roadmap');
  let created = 0;
  for (const seed of seeds) {
    if (await strapi.documents(INTEGRATION).findFirst({ locale: 'en', filters: { slug: seed.slug }, fields: ['id'] })) continue;
    await strapi.documents(INTEGRATION).create({ locale: 'en', data: seed, status: 'published' });
    created++;
  }
  if (created) strapi.log.info(`[setup] Added ${created} systems on the roadmap or open for requests`);

  if (!(await strapi.documents(PAGE).findFirst({ locale: 'en', filters: { slug: 'roadmap' }, fields: ['id'] }))) {
    await strapi.documents(PAGE).create({ locale: 'en', data: roadmapPage, status: 'published' });
    strapi.log.info('[setup] Created the roadmap page');
  }

  const ITEM = 'api::roadmap-item.roadmap-item';
  if ((await strapi.documents(ITEM).count({ locale: 'en' })) === 0) {
    // Drafts: an editor publishes the ones that should be public.
    for (const data of roadmapItems) await strapi.documents(ITEM).create({ locale: 'en', data });
  }

  for (const locale of ['en', 'de', 'fr', 'it']) {
    const label = locale === 'en' ? footerRoadmap.label : translationsFor(locale)[footerRoadmap.label] || footerRoadmap.label;
    const draft = await strapi.documents(GLOBAL).findFirst({ locale, status: 'draft', populate: { footerColumns: { populate: '*' } } });
    if (!draft) continue;
    const footerColumns = stripIds(draft.footerColumns || []);
    const column = footerColumns.find((c) => (c.links || []).some((l) => /\/(integrations|sdk|compare)$/.test(l.url)));
    if (!column || column.links.some((l) => l.url === footerRoadmap.url)) continue;
    column.links = [...column.links, { label, url: footerRoadmap.url }];
    const live = await strapi.documents(GLOBAL).findFirst({ locale, status: 'published', fields: ['updatedAt'] });
    const edited = !live || new Date(draft.updatedAt) - new Date(live.updatedAt) > 1000;
    await strapi.documents(GLOBAL).update({ documentId: draft.documentId, locale, data: { footerColumns } });
    if (!edited) await strapi.documents(GLOBAL).publish({ documentId: draft.documentId, locale });
  }
  return true;
}

/**
 * News and the MCP (November 2026): the first news articles, "News" in the menu and footer of
 * every language, and Claude, ChatGPT and Copilot as one live integration (the Supertext
 * Translation MCP) instead of three systems on the roadmap or open for requests.
 */
async function addNewsAndMcp(strapi) {
  const ARTICLE = 'api::article.article';
  for (const slug of ['claude', 'chatgpt', 'microsoft-copilot']) {
    const doc = await strapi.documents(INTEGRATION).findFirst({ locale: 'en', status: 'draft', filters: { slug }, fields: ['stage'] });
    if (doc && (doc.stage === 'roadmap' || doc.stage === 'request')) {
      await strapi.documents(INTEGRATION).delete({ documentId: doc.documentId, locale: '*' });
      strapi.log.info(`[setup] Removed ${slug}: served by the Supertext Translation MCP`);
    }
  }
  const mcp = require('./seed/integrations').find((i) => i.slug === 'claude-chatgpt-and-copilot');
  if (mcp && !(await strapi.documents(INTEGRATION).findFirst({ locale: 'en', filters: { slug: mcp.slug }, fields: ['id'] }))) {
    const data = {
      ...mcp,
      seo: {
        metaTitle: 'Supertext in Claude, ChatGPT and Copilot (MCP) | Supertext',
        metaDescription: 'The Supertext Translation MCP brings your terminology and expert review into Claude, ChatGPT, Copilot and LangDock. Swiss servers, for Supertext Advanced and Enterprise.',
      },
    };
    await strapi.documents(INTEGRATION).create({ locale: 'en', data, status: 'published' });
    strapi.log.info('[setup] Created the Supertext Translation MCP integration');
  }

  let created = 0;
  for (const data of require('./seed/news')) {
    if (await strapi.documents(ARTICLE).findFirst({ locale: 'en', filters: { slug: data.slug }, fields: ['id'] })) continue;
    await strapi.documents(ARTICLE).create({ locale: 'en', data, status: 'published' });
    created++;
  }
  if (created) strapi.log.info(`[setup] Created ${created} news articles`);

  const LABELS = { en: 'News', de: 'News', fr: 'Actualités', it: 'Novità' };
  const url = '/en/news';
  for (const [locale, label] of Object.entries(LABELS)) {
    const draft = await strapi.documents(GLOBAL).findFirst({
      locale,
      status: 'draft',
      populate: { navigation: { populate: '*' }, footerColumns: { populate: '*' } },
    });
    if (!draft) continue;
    const navigation = stripIds(draft.navigation || []);
    const footerColumns = stripIds(draft.footerColumns || []);
    let changed = false;
    if (!navigation.some((g) => g.url === url)) {
      const support = navigation.findIndex((g) => /\/support$/.test(g.url || ''));
      navigation.splice(support >= 0 ? support + 1 : navigation.length, 0, { label, url });
      changed = true;
    }
    const column = footerColumns.find((c) => (c.links || []).some((l) => /\/(integrations|sdk|compare|roadmap)$/.test(l.url || '')));
    if (column && !(column.links || []).some((l) => l.url === url)) {
      column.links = [...column.links, { label, url }];
      changed = true;
    }
    if (!changed) continue;
    const live = await strapi.documents(GLOBAL).findFirst({ locale, status: 'published', fields: ['updatedAt'] });
    const edited = !live || new Date(draft.updatedAt) - new Date(live.updatedAt) > 1000;
    await strapi.documents(GLOBAL).update({ documentId: draft.documentId, locale, data: { navigation, footerColumns } });
    if (!edited) await strapi.documents(GLOBAL).publish({ documentId: draft.documentId, locale });
  }
  return true;
}

/** Roadmap in the menu (November 2026): last link of the Integrations menu, every language. */
async function addRoadmapMenu(strapi) {
  const LINKS = {
    en: { label: 'Roadmap', description: 'In development, planned next, and what you can request' },
    de: { label: 'Roadmap', description: 'In Entwicklung, als Nächstes geplant und was Sie sich wünschen können' },
    fr: { label: 'Feuille de route', description: 'En développement, prévus ensuite et ce que vous pouvez demander' },
    it: { label: 'Roadmap', description: 'In sviluppo, previsti a seguire e ciò che può richiedere' },
  };
  const url = '/en/roadmap';
  for (const [locale, link] of Object.entries(LINKS)) {
    const draft = await strapi.documents(GLOBAL).findFirst({ locale, status: 'draft', populate: { navigation: { populate: '*' } } });
    if (!draft) continue;
    const navigation = stripIds(draft.navigation || []);
    const group = navigation.find((g) => /\/integrations$/.test(g.url || '') && Array.isArray(g.links));
    if (!group || group.links.some((l) => l.url === url)) continue;
    group.links = [...group.links, { ...link, url }];
    const live = await strapi.documents(GLOBAL).findFirst({ locale, status: 'published', fields: ['updatedAt'] });
    const edited = !live || new Date(draft.updatedAt) - new Date(live.updatedAt) > 1000;
    await strapi.documents(GLOBAL).update({ documentId: draft.documentId, locale, data: { navigation } });
    if (!edited) await strapi.documents(GLOBAL).publish({ documentId: draft.documentId, locale });
  }
  return true;
}

/**
 * Pages for systems without a plugin yet (November 2026): "How to translate it today", where still
 * empty. The language versions are queued for the background translation (Supertext), which then
 * re-applies the reviewed wording of the other texts; versions an editor is working on are left alone.
 */
async function addPlannedToday(strapi) {
  const today = require('./seed/planned-today.json');
  const store = strapi.store({ type: 'plugin', name: 'site-setup' });
  const state = (await store.get({ key: 'autoTranslations' })) || {};
  const edited = (draft, live) => !live || new Date(draft.updatedAt) - new Date(live.updatedAt) > 1000;
  const docs = strapi.documents(INTEGRATION);
  for (const [slug, translateToday] of Object.entries(today)) {
    const doc = await docs.findFirst({ locale: 'en', status: 'draft', filters: { slug }, fields: ['translateToday', 'updatedAt'] });
    if (!doc || doc.translateToday) continue;
    const live = await docs.findFirst({ locale: 'en', status: 'published', filters: { slug }, fields: ['updatedAt'] });
    const wasEdited = edited(doc, live);
    await docs.update({ documentId: doc.documentId, locale: 'en', data: { translateToday } });
    if (wasEdited) continue;
    await docs.publish({ documentId: doc.documentId, locale: 'en' });
    for (const locale of ['de', 'fr', 'it']) {
      const target = await docs.findOne({ documentId: doc.documentId, locale, status: 'draft', fields: ['updatedAt'] });
      const published = await docs.findOne({ documentId: doc.documentId, locale, status: 'published', fields: ['updatedAt'] });
      if (target && published && edited(target, published)) continue;
      state[`${INTEGRATION}:${doc.documentId}:${locale}`] = 'started';
    }
  }
  await store.set({ key: 'autoTranslations', value: state });
  return true;
}

/**
 * German content (November 2026): the Swiss German page (English and German written separately),
 * German-first guides, two comparison drafts, German titles and descriptions for the main systems.
 */
async function addGermanContent(strapi) {
  const ARTICLE = 'api::article.article';
  const { swissGermanEn, swissGermanDe, footerSwiss, germanArticles, germanDrafts, germanSeo } = require('./seed/german');
  const edited = (draft, live) => !live || new Date(draft.updatedAt) - new Date(live.updatedAt) > 1000;

  // The page: English first, then the German version (published, so the background translation
  // leaves it alone and only French and Italian are machine-translated).
  let page = await strapi.documents(PAGE).findFirst({ locale: 'en', filters: { slug: swissGermanEn.slug }, fields: ['id'] });
  if (!page) page = await strapi.documents(PAGE).create({ locale: 'en', data: swissGermanEn, status: 'published' });
  const de = await strapi.documents(PAGE).findOne({ documentId: page.documentId, locale: 'de', fields: ['id'] });
  if (!de) {
    await strapi.documents(PAGE).update({ documentId: page.documentId, locale: 'de', data: swissGermanDe });
    await strapi.documents(PAGE).publish({ documentId: page.documentId, locale: 'de' });
  }

  // Footer: next to the comparison link.
  for (const locale of ['en', 'de', 'fr', 'it']) {
    const draft = await strapi.documents(GLOBAL).findFirst({ locale, status: 'draft', populate: { footerColumns: { populate: '*' } } });
    if (!draft) continue;
    const footerColumns = stripIds(draft.footerColumns || []);
    const column = footerColumns.find((c) => (c.links || []).some((l) => /\/compare$/.test(l.url)));
    if (!column || column.links.some((l) => l.url === footerSwiss.url)) continue;
    const at = column.links.findIndex((l) => /\/compare$/.test(l.url)) + 1;
    column.links.splice(at, 0, { label: footerSwiss.label[locale], url: footerSwiss.url });
    const live = await strapi.documents(GLOBAL).findFirst({ locale, status: 'published', fields: ['updatedAt'] });
    await strapi.documents(GLOBAL).update({ documentId: draft.documentId, locale, data: { footerColumns } });
    if (!edited(draft, live)) await strapi.documents(GLOBAL).publish({ documentId: draft.documentId, locale });
  }

  // German-only articles: the guides published (each appears on its date), the comparisons as drafts.
  for (const [list, status] of [[germanArticles, 'published'], [germanDrafts, 'draft']]) {
    for (const data of list) {
      if (await strapi.documents(ARTICLE).findFirst({ locale: 'de', filters: { slug: data.slug }, fields: ['id'] })) continue;
      await strapi.documents(ARTICLE).create({ locale: 'de', data, ...(status === 'published' ? { status } : {}) });
    }
  }

  // German titles and descriptions, where the German version has none of its own yet.
  for (const [slug, [metaTitle, metaDescription]] of Object.entries(germanSeo)) {
    const draft = await strapi.documents(INTEGRATION).findFirst({ locale: 'de', status: 'draft', filters: { slug }, populate: { seo: { populate: '*' } } });
    if (!draft || draft.seo?.metaTitle) continue;
    const live = await strapi.documents(INTEGRATION).findFirst({ locale: 'de', status: 'published', filters: { slug }, fields: ['updatedAt'] });
    const seo = { ...mediaToIds(stripIds(draft.seo || {})), metaTitle, metaDescription };
    await strapi.documents(INTEGRATION).update({ documentId: draft.documentId, locale: 'de', data: { seo } });
    if (!edited(draft, live)) await strapi.documents(INTEGRATION).publish({ documentId: draft.documentId, locale: 'de' });
  }
  return true;
}

/** The statistics page (November 2026), linked in the footer next to the roadmap. */
async function addStatisticsPage(strapi) {
  const { statisticsPage, footerStatistics } = require('./seed/statistics');
  if (!(await strapi.documents(PAGE).findFirst({ locale: 'en', filters: { slug: statisticsPage.slug }, fields: ['id'] }))) {
    await strapi.documents(PAGE).create({ locale: 'en', data: statisticsPage, status: 'published' });
  }
  for (const locale of ['en', 'de', 'fr', 'it']) {
    const draft = await strapi.documents(GLOBAL).findFirst({ locale, status: 'draft', populate: { footerColumns: { populate: '*' } } });
    if (!draft) continue;
    const footerColumns = stripIds(draft.footerColumns || []);
    const column = footerColumns.find((c) => (c.links || []).some((l) => /\/roadmap$/.test(l.url)));
    if (!column || column.links.some((l) => l.url === footerStatistics.url)) continue;
    const at = column.links.findIndex((l) => /\/roadmap$/.test(l.url)) + 1;
    column.links.splice(at, 0, { label: footerStatistics.label[locale], url: footerStatistics.url });
    const live = await strapi.documents(GLOBAL).findFirst({ locale, status: 'published', fields: ['updatedAt'] });
    const edited = !live || new Date(draft.updatedAt) - new Date(live.updatedAt) > 1000;
    await strapi.documents(GLOBAL).update({ documentId: draft.documentId, locale, data: { footerColumns } });
    if (!edited) await strapi.documents(GLOBAL).publish({ documentId: draft.documentId, locale });
  }
  return true;
}

/**
 * Fields that are the same in every language (not localized) can drift when they were changed in one
 * language's rows only (the repository renames of November 2026 left the old names in de, fr and it).
 * Copies them from the English rows to the other languages, drafts to drafts and published to published.
 */
async function syncSharedIntegrationFields(strapi) {
  const attributes = strapi.contentType(INTEGRATION).attributes;
  const shared = Object.entries(attributes)
    .filter(([, a]) => a.pluginOptions?.i18n?.localized === false && !['relation', 'media', 'component', 'dynamiczone'].includes(a.type))
    .map(([name]) => name);
  const query = strapi.db.query(INTEGRATION);
  const english = await query.findMany({ where: { locale: 'en' }, select: ['documentId', 'publishedAt', ...shared] });
  let fixed = 0;
  for (const row of english) {
    const data = Object.fromEntries(shared.map((name) => [name, row[name]]));
    const others = await query.findMany({
      where: { documentId: row.documentId, locale: { $ne: 'en' }, publishedAt: row.publishedAt ? { $notNull: true } : { $null: true } },
      select: ['id', ...shared],
    });
    for (const other of others) {
      if (shared.every((name) => JSON.stringify(other[name] ?? null) === JSON.stringify(data[name] ?? null))) continue;
      await query.update({ where: { id: other.id }, data });
      fixed++;
    }
  }
  if (fixed) strapi.log.info(`[setup] Copied the shared integration fields (${shared.join(', ')}) to ${fixed} language versions`);
  return true;
}

/** Statistics page: count test and development installations too, for now (November 2026). */
async function statisticsIncludeLocal(strapi) {
  const answers = {
    en: 'For now, yes: until enough live sites report, the installation figures include test and development installations (localhost, .test and similar). A note on the page says so.',
    de: 'Vorerst ja: Bis genug Live-Websites melden, zählen Test- und Entwicklungsinstallationen (localhost, .test und ähnliche) mit. Ein Hinweis auf der Seite sagt das.',
    fr: 'Pour l’instant, oui : tant que trop peu de sites en production envoient leurs données, les installations de test et de développement (localhost, .test, etc.) sont comptées. Une note sur la page le signale.',
    it: 'Per ora sì: finché i siti in produzione sono pochi, contiamo anche le installazioni di test e di sviluppo (localhost, .test e simili). Una nota sulla pagina lo indica.',
  };
  for (const locale of ['en', 'de', 'fr', 'it']) {
    const draft = await strapi.documents(PAGE).findFirst({ locale, status: 'draft', filters: { slug: 'statistics' }, populate: { seo: { populate: '*' }, blocks: { on: { 'blocks.faq': { populate: '*' }, 'blocks.hero': { populate: '*' }, 'blocks.cta-band': { populate: '*' }, 'blocks.statistics': true } } } });
    if (!draft) continue;
    const blocks = stripIds(draft.blocks || []).map((b) => {
      if (b.__component === 'blocks.statistics') return { ...b, includeLocal: true };
      if (b.__component === 'blocks.faq' && b.items?.length >= 4) return { ...b, items: b.items.map((item, i) => (i === 3 ? { ...item, answer: answers[locale] } : item)) };
      return b;
    });
    await strapi.documents(PAGE).update({ documentId: draft.documentId, locale, data: { blocks: mediaToIds(blocks) } });
    await strapi.documents(PAGE).publish({ documentId: draft.documentId, locale });
  }
  return true;
}

/** Step-by-step guides (November 2026): four news articles, scheduled one a week by their date. */
async function addGuides(strapi) {
  const ARTICLE = 'api::article.article';
  for (const data of require('./seed/guides')) {
    if (await strapi.documents(ARTICLE).findFirst({ locale: 'en', filters: { slug: data.slug }, fields: ['id'] })) continue;
    await strapi.documents(ARTICLE).create({ locale: 'en', data, status: 'published' });
  }
  return true;
}

/** Pages for systems without a plugin yet (November 2026): their "About" text, where still empty. */
async function addPlannedAbout(strapi) {
  const about = require('./seed/planned-about.json');
  for (const [slug, aboutSystem] of Object.entries(about)) {
    const doc = await strapi.documents(INTEGRATION).findFirst({ locale: 'en', status: 'draft', filters: { slug }, fields: ['aboutSystem', 'updatedAt'] });
    if (!doc || doc.aboutSystem) continue;
    const live = await strapi.documents(INTEGRATION).findFirst({ locale: 'en', status: 'published', filters: { slug }, fields: ['updatedAt'] });
    const edited = !live || new Date(doc.updatedAt) - new Date(live.updatedAt) > 1000;
    await strapi.documents(INTEGRATION).update({ documentId: doc.documentId, locale: 'en', data: { aboutSystem } });
    if (edited) continue;
    await strapi.documents(INTEGRATION).publish({ documentId: doc.documentId, locale: 'en' });
    // Existing language versions get the reviewed wording of the new text (unless an editor is on them).
    const { applyReviewed, dictionary } = require('./translate-site');
    for (const locale of ['de', 'fr', 'it']) {
      const target = await strapi.documents(INTEGRATION).findOne({ documentId: doc.documentId, locale, status: 'draft', fields: ['updatedAt'] });
      const published = await strapi.documents(INTEGRATION).findOne({ documentId: doc.documentId, locale, status: 'published', fields: ['updatedAt'] });
      if (!target || (published && new Date(target.updatedAt) - new Date(published.updatedAt) > 1000)) continue;
      await applyReviewed(strapi, INTEGRATION, doc.documentId, locale, dictionary(locale));
    }
  }
  return true;
}

/** The WordPress repo was renamed (November 2026): its integration and the WordPress guide link to the new name. */
async function renameWordPressRepo(strapi) {
  const OLD = ['https://github.com/Supertext/supertext-wordpress-polylang', 'https://github.com/supertext/wordpress-polylang'];
  const NEW = 'https://github.com/Supertext/Wordpress-Polylang-Supertext-Translation';
  const ARTICLE = 'api::article.article';
  const swap = (text) => OLD.reduce((t, old) => t.split(old).join(NEW), text || '');
  // repo and url aren't localized: the English version carries them for all languages.
  for (const status of ['draft', 'published']) {
    const item = await strapi.documents(INTEGRATION).findFirst({ locale: 'en', status, filters: { slug: 'wordpress' }, fields: ['repo', 'url'] });
    if (!item || (item.repo === 'Supertext/Wordpress-Polylang-Supertext-Translation' && item.url === NEW)) continue;
    await strapi.db.query(INTEGRATION).update({ where: { id: item.id }, data: { repo: 'Supertext/Wordpress-Polylang-Supertext-Translation', url: NEW } });
  }
  // Article bodies (every language, draft and published rows), only the link changes.
  const rows = await strapi.db.query(ARTICLE).findMany({ select: ['id', 'body'], limit: 1000 });
  let changed = 0;
  for (const row of rows) {
    const body = swap(row.body);
    if (body === (row.body || '')) continue;
    await strapi.db.query(ARTICLE).update({ where: { id: row.id }, data: { body } });
    changed++;
  }
  strapi.log.info(`[setup] WordPress repo renamed: ${changed} article versions updated`);
  return true;
}

/** The WPML plugin (November 2026, in development): its own integration right after WordPress (Polylang). */
async function addWpml(strapi) {
  const seed = require('./seed/integrations').find((i) => i.slug === 'wordpress-wpml');
  const existing = await strapi.documents(INTEGRATION).findFirst({ locale: 'en', status: 'draft', filters: { slug: 'wordpress-wpml' }, fields: ['id'] });
  if (existing || !seed) return true;
  const wordpress = await strapi.documents(INTEGRATION).findFirst({ locale: 'en', filters: { slug: 'wordpress' }, fields: ['order'] });
  const order = wordpress?.order ? wordpress.order + 5 : seed.order;
  await strapi.documents(INTEGRATION).create({ locale: 'en', data: { ...seed, order, blocks: [integrationFaq(seed)] }, status: 'published' });
  strapi.log.info('[setup] Created the WordPress (WPML) integration');
  return true;
}

const UPDATES = [
  {
    id: '2026-10-sdk-announcement',
    run: (strapi) =>
      updateGlobal(strapi, (global) => {
        const navigation = stripIds(global.navigation || []);
        const resources = navigation.find((g) => /resources/i.test(g.label));
        if (resources && !(resources.links || []).some((l) => l.url === SDK_REPO || l.url === sdkNavLink.url)) {
          resources.links = [{ ...sdkNavLink }, ...(resources.links || [])];
        }
        return { announcement: global.announcement ? stripIds(global.announcement) : sdkAnnouncement, navigation };
      }),
  },
  { id: '2026-10-sdk-page', run: (strapi) => addSdkPage(strapi) },
  { id: '2026-10-integration-details', run: (strapi) => addIntegrationDetails(strapi) },
  { id: '2026-10-hubspot-cms', run: (strapi) => addHubSpot(strapi) },
  { id: '2026-10-seo-pages', run: (strapi) => seoPages(strapi) },
  { id: '2026-10-integration-faq', run: (strapi) => addIntegrationFaqs(strapi) },
  { id: '2026-10-comparisons', run: (strapi) => addComparisons(strapi) },
  { id: '2026-10-support-links', run: (strapi) => addSupportLinks(strapi) },
  { id: '2026-10-file-exchange', run: (strapi) => addFileExchange(strapi) },
  { id: '2026-11-roadmap', run: (strapi) => addRoadmap(strapi) },
  { id: '2026-11-news-mcp', run: (strapi) => addNewsAndMcp(strapi) },
  { id: '2026-11-roadmap-menu', run: (strapi) => addRoadmapMenu(strapi) },
  { id: '2026-11-guides', run: (strapi) => addGuides(strapi) },
  { id: '2026-11-planned-about', run: (strapi) => addPlannedAbout(strapi) },
  { id: '2026-11-planned-today', run: (strapi) => addPlannedToday(strapi) },
  { id: '2026-11-german', run: (strapi) => addGermanContent(strapi) },
  { id: '2026-11-statistics', run: (strapi) => addStatisticsPage(strapi) },
  { id: '2026-11-shared-fields', run: (strapi) => syncSharedIntegrationFields(strapi) },
  { id: '2026-11-statistics-local', run: (strapi) => statisticsIncludeLocal(strapi) },
  { id: '2026-11-wordpress-repo', run: (strapi) => renameWordPressRepo(strapi) },
  { id: '2026-11-wpml', run: (strapi) => addWpml(strapi) },
];

async function runContentUpdates(strapi) {
  const store = strapi.store({ type: 'plugin', name: 'site-setup' });
  const done = (await store.get({ key: 'contentUpdates' })) || [];
  for (const update of UPDATES) {
    if (done.includes(update.id)) continue;
    try {
      if (await update.run(strapi)) {
        done.push(update.id);
        await store.set({ key: 'contentUpdates', value: done });
        strapi.log.info(`[setup] Applied content update ${update.id}`);
      }
    } catch (error) {
      strapi.log.warn(`[setup] Content update ${update.id} failed: ${error.message}`);
    }
  }
}

module.exports = { runContentUpdates, integrationFaq };
