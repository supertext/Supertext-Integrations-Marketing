module.exports = {
  // Latest GitHub release of every integration, so a new plugin release shows on the site within
  // the hour. Every hour at :17 with GITHUB_TOKEN (a sync takes two to four requests per repo);
  // without it GitHub allows 60 requests an hour, so only once a night (03:17 server time).
  githubReleases: {
    task: async ({ strapi }) => {
      if (!process.env.GITHUB_TOKEN && new Date().getHours() !== 3) return;
      try {
        await strapi.service('api::github-release.github-release').syncAll();
      } catch (error) {
        strapi.log.warn(`[github] Release sync failed: ${error.message}`);
      }
    },
    options: { rule: '17 * * * *' },
  },
  // Every hour: support requests that couldn't be forwarded to GitHub, tried again for a week.
  supportRetry: {
    task: async ({ strapi }) => {
      try {
        await strapi.service('api::support.support').retryFailed();
      } catch (error) {
        strapi.log.warn(`[support] Retry failed: ${error.message}`);
      }
    },
    options: { rule: '41 * * * *' },
  },
};
