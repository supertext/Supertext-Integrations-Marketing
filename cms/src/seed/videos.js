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
};
