'use strict';

const ARTICLE = 'api::article.article';
const ENTRY = 'api::calendar-entry.calendar-entry';
const LOCALES = ['en', 'de', 'fr', 'it'];

/**
 * The editorial calendar: calendar entries (news or improvement; idea, in_progress or done) and every
 * article once, with its English title (or the first language it has) and per language "published",
 * "modified" (published, with unpublished changes), "draft" (never published) or missing. An article
 * is in_progress while no language is published, scheduled while its date is still to come (the site
 * shows it from then), else published. Sorted by date, undated last.
 */
async function list(strapi, now = new Date()) {
  const byId = new Map();
  for (const locale of LOCALES) {
    for (const status of ['draft', 'published']) {
      const rows = await strapi.documents(ARTICLE).findMany({ locale, status, fields: ['title', 'slug', 'date', 'category', 'updatedAt'], limit: 1000 });
      for (const row of rows) {
        const item = byId.get(row.documentId) || { documentId: row.documentId, locales: {}, drafts: {}, published: {} };
        (status === 'draft' ? item.drafts : item.published)[locale] = row;
        byId.set(row.documentId, item);
      }
    }
  }
  const articles = [...byId.values()]
    .map(({ documentId, drafts, published }) => {
      const locales = {};
      for (const locale of LOCALES) {
        const d = drafts[locale];
        const p = published[locale];
        if (p) locales[locale] = d && new Date(d.updatedAt) - new Date(p.updatedAt) > 1000 ? 'modified' : 'published';
        else if (d) locales[locale] = 'draft';
      }
      const main = drafts.en || published.en || Object.values(drafts)[0] || Object.values(published)[0];
      const date = main.date || null;
      const live = !!(published.en || Object.keys(published).length);
      const state = !live ? 'in_progress' : date && new Date(date) > now ? 'scheduled' : 'published';
      return { kind: 'article', type: 'news', documentId, slug: main.slug, title: main.title, date, category: main.category, state, locales };
    })
  const entries = (await strapi.documents(ENTRY).findMany({ fields: ['title', 'type', 'stage', 'date', 'notes'], limit: 1000 })).map((e) => ({
    kind: 'entry', type: e.type, documentId: e.documentId, title: e.title, date: e.date, state: e.stage, notes: e.notes || null,
  }));
  const time = (item) => (item.date ? new Date(item.date).getTime() : Infinity);
  return [...entries, ...articles].sort((a, b) => time(a) - time(b));
}

module.exports = ({ strapi }) => ({ list: (now) => list(strapi, now) });
module.exports.list = list;
