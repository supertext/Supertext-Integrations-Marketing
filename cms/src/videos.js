'use strict';

const VIDEOS = require('./seed/videos');

const UID = 'api::integration.integration';
const FIELDS = ['demoVideo', 'installVideo'];
const YOUTUBE_ID = /^[\w-]{11}$/;

/**
 * Brings the YouTube ids of seed/videos.js into the integrations, on every start. A field gets an id
 * only while it is empty, and each id is offered once (store plugin_site-setup → videos), so an
 * editor's own video or a deliberately emptied field is never changed. Publishes the English version
 * unless it has unpublished edits (the shared fields are the same in every language; the website
 * takes them from the English version when a language version is older).
 */
async function syncVideos(strapi) {
  const store = strapi.store({ type: 'plugin', name: 'site-setup' });
  const offered = new Set((await store.get({ key: 'videos' })) || []);
  const before = offered.size;
  let changed = 0;
  for (const [slug, ids] of Object.entries(VIDEOS)) {
    const todo = FIELDS.map((field, i) => [field, ids[i]]).filter(([field, id]) => id && YOUTUBE_ID.test(id) && !offered.has(`${slug}:${field}:${id}`));
    if (!todo.length) continue;
    const draft = await strapi.documents(UID).findFirst({ locale: 'en', status: 'draft', filters: { slug }, fields: [...FIELDS, 'updatedAt'] });
    if (!draft) continue; // not in this CMS (yet): try again on the next start
    const data = Object.fromEntries(todo.filter(([field]) => !draft[field]));
    for (const [field, id] of todo) offered.add(`${slug}:${field}:${id}`);
    if (!Object.keys(data).length) continue;
    const published = await strapi.documents(UID).findOne({ documentId: draft.documentId, locale: 'en', status: 'published', fields: ['updatedAt'] });
    const edited = !published || new Date(draft.updatedAt) - new Date(published.updatedAt) > 1000;
    await strapi.documents(UID).update({ documentId: draft.documentId, locale: 'en', data });
    if (!edited) await strapi.documents(UID).publish({ documentId: draft.documentId, locale: 'en' });
    changed++;
  }
  if (offered.size !== before) await store.set({ key: 'videos', value: [...offered] });
  if (changed) strapi.log.info(`[setup] Added videos to ${changed} integrations`);
}

module.exports = { syncVideos, YOUTUBE_ID };
