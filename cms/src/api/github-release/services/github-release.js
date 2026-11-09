'use strict';

const { factories } = require('@strapi/strapi');

const UID = 'api::github-release.github-release';

const DAY = 24 * 60 * 60 * 1000;

async function github(path, token) {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'supertext-integrations-cms',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub ${res.status} for ${path}`);
  return res.json();
}

/** The last 100 published (non-draft) releases of a repo, newest first; pre-releases included (0.x plugins). */
async function releases(repo, token) {
  return ((await github(`/repos/${repo}/releases?per_page=100`, token)) || []).filter((r) => !r.draft);
}

/** Newest published release of a repo. */
async function latestRelease(repo, token) {
  return (await releases(repo, token))[0] || null;
}

/**
 * Issues of a repo for the statistics page: open and closed, and the hours from opening to closing of each
 * closed one (one decimal; the page takes the median over all repos).
 * Issues only (no pull requests), and only those opened by people: automated ones (broken-link reports,
 * Dependabot) say nothing about support. Up to 300 of the most recent.
 */
async function issueStats(repo, token) {
  const issues = [];
  for (let page = 1; page <= 3; page++) {
    const list = (await github(`/repos/${repo}/issues?state=all&per_page=100&page=${page}`, token)) || [];
    issues.push(...list);
    if (list.length < 100) break;
  }
  const human = issues.filter((i) => !i.pull_request && i.user?.type !== 'Bot');
  const closed = human.filter((i) => i.state === 'closed' && i.closed_at);
  const closeHours = closed.map((i) => Math.round(((new Date(i.closed_at) - new Date(i.created_at)) / 3600000) * 10) / 10);
  return { issuesOpen: human.length - closed.length, issuesClosed: closed.length, closeHours };
}

module.exports = factories.createCoreService(UID, ({ strapi }) => ({
  latestRelease,
  issueStats,

  /** Updates the release info of every integration that has a GitHub repo. Editorial content is never touched. */
  async syncAll() {
    const token = process.env.GITHUB_TOKEN;
    const integrations = await strapi.documents('api::integration.integration').findMany({
      locale: 'en',
      status: 'published',
      fields: ['repo'],
      limit: 500,
    });
    const repos = [...new Set(integrations.map((i) => (i.repo || '').trim()).filter((r) => /^[\w.-]+\/[\w.-]+$/.test(r)))];
    let updated = 0;
    for (const repo of repos) {
      try {
        const list = await releases(repo, token);
        const release = list[0] || null;
        const since = (days) => list.filter((r) => r.published_at && Date.now() - new Date(r.published_at) <= days * DAY).length;
        const issues = await issueStats(repo, token).catch((error) => {
          strapi.log.warn(`[github] ${repo} issues: ${error.message}`);
          return {};
        });
        const data = {
          releases30: since(30),
          releases90: since(90),
          ...issues,
          repo,
          version: release ? release.tag_name.replace(/^v/, '') : null,
          url: release ? release.html_url : null,
          releasedAt: release ? release.published_at : null,
          prerelease: release ? release.prerelease : false,
          syncedAt: new Date().toISOString(),
        };
        const existing = await strapi.db.query(UID).findOne({ where: { repo } });
        if (existing) await strapi.documents(UID).update({ documentId: existing.documentId, data });
        else await strapi.documents(UID).create({ data });
        updated++;
      } catch (error) {
        strapi.log.warn(`[github] ${repo}: ${error.message}`);
      }
    }
    strapi.log.info(`[github] Synced releases of ${updated} of ${repos.length} repos`);
    return { updated, total: repos.length };
  },
}));
