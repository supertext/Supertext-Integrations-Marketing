/**
 * Social preview cards (1280x640): the same images as the GitHub repos' social previews, one per repo,
 * in public/og/<repo name in lower case>.png. Made by the project's social-preview-render.js
 * (docs/DEVELOPER.md → Social preview images). The site's own card is the default for every other page.
 */
const CARDS = new Set([
  'adobe-illustrator-translation',
  'adobe-indesign-translation',
  'akeneo-supertext-translation',
  'apostrophe-supertext-translation',
  'atropim-supertext-translation',
  'commando-center-supertext-translation',
  'contao-supertext-translation',
  'coreldraw-supertext-translation',
  'craftcms-supertext-translation',
  'directus-supertext-translation',
  'djangocms-supertext-translation',
  'ghost-supertext-translation',
  'grav-supertext-translation',
  'hubspot-supertext-translation',
  'joomla-supertext-translation',
  'localization-review-supertext-translation',
  'magento-supertext-translation',
  'magnolia-supertext-translation',
  'mailchimp-supertext-translation',
  'neos-supertext-translation',
  'orchardcore-supertext-translation',
  'payload-supertext-translation',
  'pimcore-supertext-translation',
  'prestashop-supertext-translation',
  'shopify-supertext-translation',
  'silverstripe-supertext-translation',
  'strapi-supertext-translation',
  'supertext-aem-connector',
  'supertext-agent-toolbox',
  'supertext-api-sdk-guide',
  'supertext-integrations-marketing',
  'typo3-supertext-translation',
  'umbraco-supertext-translation',
  'wagtail-supertext-translation',
  'wix-supertext-translation',
  'wordpress-polylang-supertext-translation',
  'wordpress-wpml-supertext-translation',
]);

/** Repos renamed on GitHub: the old name, as the CMS may still have it, → the card's name. */
const RENAMED = { 'wordpress-polylang': 'wordpress-polylang-supertext-translation', 'supertext-api-sdk-and-guide': 'supertext-api-sdk-guide' };

export const DEFAULT_CARD = '/og/supertext-integrations-marketing.png';

/** The card for a repo ("Supertext/Strapi-Supertext-Translation"), or undefined. */
export function ogCard(repo) {
  const name = String(repo || '').split('/').pop().toLowerCase();
  const card = RENAMED[name] || name;
  return CARDS.has(card) ? `/og/${card}.png` : undefined;
}
