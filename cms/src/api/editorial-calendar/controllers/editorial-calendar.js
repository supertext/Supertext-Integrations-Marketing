'use strict';

const crypto = require('node:crypto');

const authorized = (header) => {
  const token = process.env.STRAPI_API_TOKEN;
  if (!token || typeof header !== 'string') return false;
  const a = Buffer.from(header);
  const b = Buffer.from(`Bearer ${token}`);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};

module.exports = ({ strapi }) => ({
  async list(ctx) {
    if (!authorized(ctx.request.headers.authorization)) return ctx.unauthorized();
    ctx.set('Cache-Control', 'no-store');
    ctx.body = { items: await strapi.service('api::editorial-calendar.editorial-calendar').list() };
  },
});
