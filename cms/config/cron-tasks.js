module.exports = {
  // Every night at 03:17 (server time): latest GitHub release of every integration.
  githubReleases: {
    task: async ({ strapi }) => {
      try {
        await strapi.service('api::github-release.github-release').syncAll();
      } catch (error) {
        strapi.log.warn(`[github] Release sync failed: ${error.message}`);
      }
    },
    options: { rule: '17 3 * * *' },
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
