import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync } from 'node:fs';
import { DEFAULT_CARD, ogCard } from '../src/lib/og-cards.js';

const pub = new URL('../public', import.meta.url).pathname;

test('every repo card is a file in public/og, and the default exists', () => {
  assert.ok(existsSync(pub + DEFAULT_CARD));
  for (const f of readdirSync(`${pub}/og`)) assert.equal(ogCard(`Supertext/${f.replace(/\.png$/, '')}`), `/og/${f}`);
});

test('cards by repo, case-insensitive, renamed repos, unknown ones', () => {
  assert.equal(ogCard('Supertext/Strapi-Supertext-Translation'), '/og/strapi-supertext-translation.png');
  assert.equal(ogCard('supertext/wordpress-polylang'), '/og/wordpress-polylang-supertext-translation.png');
  for (const none of [null, '', 'Supertext/Drupal', 'Supertext/../secret']) assert.equal(ogCard(none), undefined);
});
