'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const SOURCES = require('./seed/screenshots');

const UID = 'api::integration.integration';

/** True when the draft has changes that aren't published yet (then we leave publishing to the editor). */
async function hasUnpublishedChanges(strapi, documentId) {
  const [draft, published] = await Promise.all([
    strapi.documents(UID).findOne({ documentId, locale: 'en', status: 'draft', fields: ['updatedAt'] }),
    strapi.documents(UID).findOne({ documentId, locale: 'en', status: 'published', fields: ['updatedAt'] }),
  ]);
  if (!published) return true;
  return new Date(draft.updatedAt) - new Date(published.updatedAt) > 1000;
}

/**
 * File name of an automatic import: <slug>-supertext-<version>-<source file>, where <version> is
 * the start of the file's GitHub ETag (its content hash), so an image a plugin repo updates under
 * the same path gets a new name and is imported again. Editors' uploads never match.
 */
const autoName = (slug, source, version) => `${slug}-supertext-${version ? `${version}-` : ''}${path.basename(source)}`;

/** The start of the file's ETag on raw.githubusercontent.com (changes with its content), or '' if unknown. */
async function sourceVersion(repo, source) {
  try {
    const res = await fetch(`https://raw.githubusercontent.com/${repo}/HEAD/${source}`, { method: 'HEAD' });
    if (!res.ok) return '';
    return (res.headers.get('etag') || '').replace(/[^a-f0-9]/gi, '').slice(0, 10).toLowerCase();
  } catch {
    return '';
  }
}
const isAutoImport = (slug, file) => Boolean(file?.name) && file.name.startsWith(`${slug}-supertext`);

/** Sets (or clears) an integration's screenshot; publishes unless an editor has unpublished changes. */
async function setScreenshot(strapi, item, fileId) {
  const publish = !(await hasUnpublishedChanges(strapi, item.documentId));
  await strapi.documents(UID).update({ documentId: item.documentId, locale: 'en', data: { screenshot: fileId } });
  if (publish) await strapi.documents(UID).publish({ documentId: item.documentId, locale: 'en' });
}

/**
 * Keeps the automatic screenshots in line with seed/screenshots.js, downloading from each
 * plugin's GitHub repo: fills empty ones, replaces earlier automatic imports whose source path
 * or content changed and removes automatic imports no longer listed. Runs on every start (one
 * HEAD request per screenshot); downloads nothing once everything matches.
 */
async function importScreenshots(strapi) {
  const items = await strapi.documents(UID).findMany({
    locale: 'en',
    status: 'draft',
    fields: ['slug', 'system', 'repo'],
    populate: ['screenshot'],
    limit: 500,
  });
  // Automatic imports no longer listed: back to the monogram tile.
  for (const item of items.filter((i) => isAutoImport(i.slug, i.screenshot) && !SOURCES[i.slug])) {
    await setScreenshot(strapi, item, null);
    await strapi.plugin('upload').service('upload').remove({ id: item.screenshot.id }).catch(() => undefined);
    strapi.log.info(`[setup] Removed the automatic screenshot of ${item.slug}`);
  }
  const todo = [];
  for (const i of items) {
    if (!SOURCES[i.slug] || !i.repo || (i.screenshot && !isAutoImport(i.slug, i.screenshot))) continue;
    // Unknown version (GitHub unreachable): keep an existing import as it is.
    i.version = await sourceVersion(i.repo, SOURCES[i.slug]);
    if (!i.screenshot || (i.version && i.screenshot.name !== autoName(i.slug, SOURCES[i.slug], i.version))) todo.push(i);
  }
  if (!todo.length) return;

  const upload = strapi.plugin('upload').service('upload');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'screenshots-'));
  let done = 0;
  try {
    for (const item of todo) {
      const source = SOURCES[item.slug];
      try {
        const res = await fetch(`https://raw.githubusercontent.com/${item.repo}/HEAD/${source}`);
        if (!res.ok) throw new Error(`GitHub ${res.status}`);
        const buffer = Buffer.from(await res.arrayBuffer());
        const ext = path.extname(source).toLowerCase();
        const filename = autoName(item.slug, source, item.version);
        const filepath = path.join(dir, filename);
        fs.writeFileSync(filepath, buffer);
        const [file] = await upload.upload({
          data: {
            fileInfo: {
              name: filename,
              alternativeText: `Supertext translation in ${item.system}`,
              caption: `Supertext in ${item.system}`,
            },
          },
          files: {
            filepath,
            originalFilename: filename,
            mimetype: ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png',
            size: buffer.length,
          },
        });
        const previous = isAutoImport(item.slug, item.screenshot) ? item.screenshot.id : null;
        await setScreenshot(strapi, item, file.id);
        // Old automatic file: delete it, unless something else uses it.
        if (previous) await strapi.plugin('upload').service('upload').remove({ id: previous }).catch(() => undefined);
        done++;
      } catch (error) {
        strapi.log.warn(`[setup] Screenshot for ${item.slug}: ${error.message}`);
      }
    }
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  strapi.log.info(`[setup] Imported ${done} of ${todo.length} integration screenshots`);
}

module.exports = { importScreenshots };
