'use strict';

// The editorial calendar as data (calendar entries and every article, drafts and scheduled ones
// included), for tools that plan with it (Claude). Checked against EDITORIAL_CALENDAR_TOKEN (read-only, this endpoint only) or STRAPI_API_TOKEN in the controller; editors use the
// "Editorial calendar" page in the admin.
module.exports = {
  routes: [{ method: 'GET', path: '/editorial-calendar', handler: 'editorial-calendar.list', config: { auth: false } }],
};
