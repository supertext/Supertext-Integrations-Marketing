'use strict';

// YouTube videos of each plugin (English, voiced): a short demo and the install & configuration video.
// One line per plugin: slug: [demo id, install id] (null where there is none yet).
// src/videos.js puts new ids into the integration's demoVideo / installVideo on the next start,
// only where the field is empty, and each id only once: editors' values and deliberate removals stay.
module.exports = {
  strapi: ['z-kyu9i-jOs', 'VRDvZRfgccM'],
  contao: ['hvdRftRc7NY', 'qysKPCXRYcI'],
  directus: ['JQVH7uhWT6c', 'O9Ipe4iiPcE'],
  typo3: ['w1YkIkAydGo', '-an7zWZb27I'],
  joomla: ['PAX3EgXrrvM', 'RllAjEP8UfM'],
  pimcore: ['mCmIhNJVrPo', 'uEXrrLKK450'],
  'akeneo-pim': ['2tDNP57e-vk', 'KHWWBNthN2w'],
  apostrophecms: ['rG489iGxb3o', 'DOfyeyPCq24'],
  atropim: ['odUthkwUgsY', 'SkxXxUefBwk'],
  'craft-cms': ['cLhsUdmYnNM', '_XZVCavrUZc'],
  'django-cms': ['ngN4GzSx0p4', 'F2eCMsZVDpc'],
  ghost: ['iTV4xqy8EtM', 'GZHbkZylB7w'],
  grav: ['EGwhpF0xokE', 'qc-KpGdH3og'],
  hubspot: ['zeLr0ysK5BQ', 'gQkQziL1mUc'],
  magento: ['xb0Kvxhn1Ec', 'Z0TIIh94WkQ'],
  magnolia: ['_r-KPQhZISg', 'WDK6ATQ5-i4'],
  mailchimp: ['eeZyZ30STV4', 'FAA4KD78b3I'],
  neos: ['-68a1t90KLw', 'aamHVY3p1Tk'],
  'orchard-core': ['rcKv33Dw_zs', 'AUVNvqxWKwA'],
  'payload-cms': ['gFBQjwhhxVc', 'WXXEUL3yjhM'],
  prestashop: ['BcTZBzgwYNk', 't6dllmjQeUA'],
  shopify: ['om2P-mIyajo', 'F3wZXWVsNNs'],
  silverstripe: ['E4oX_bKpvAg', 'FC8XT57h5Zw'],
  umbraco: ['qb1VQMNFVmw', 'X3wiNP3XZkc'],
  wagtail: ['TGILaBW6Jdc', 'YASU2mW4SfM'],
  wix: ['JN6_eBphirU', 'Wc6ilpXicVo'],
};
