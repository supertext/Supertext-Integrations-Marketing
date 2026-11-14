'use strict';

const crypto = require('node:crypto');

/** EDITORIAL_CALENDAR_TOKEN (only this endpoint; for Claude) or the website's STRAPI_API_TOKEN. */
const authorized = (header) => {
  if (typeof header !== 'string') return false;
  return [process.env.EDITORIAL_CALENDAR_TOKEN, process.env.STRAPI_API_TOKEN].some((token) => {
    if (!token || token.length < 24) return false;
    const a = Buffer.from(header);
    const b = Buffer.from(`Bearer ${token}`);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  });
};

module.exports = ({ strapi }) => ({
  async list(ctx) {
    if (!authorized(ctx.request.headers.authorization)) return ctx.unauthorized();
    ctx.set('Cache-Control', 'no-store');
    ctx.body = { items: await strapi.service('api::editorial-calendar.editorial-calendar').list() };
  },
});
