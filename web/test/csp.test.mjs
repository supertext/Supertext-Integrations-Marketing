import { test } from 'node:test';
import assert from 'node:assert/strict';
import { contentSecurityPolicy, newNonce } from '../src/lib/csp.js';

test('pages run scripts only with the nonce, frame only YouTube and Turnstile', () => {
  const csp = contentSecurityPolicy('abc', { strapiUrl: 'https://cms.example' });
  assert.match(csp, /script-src 'self' 'nonce-abc' 'strict-dynamic'(;|$)/);
  assert.doesNotMatch(csp, /unsafe-eval/);
  assert.match(csp, /frame-src 'self' https:\/\/www\.youtube-nocookie\.com https:\/\/challenges\.cloudflare\.com/);
  assert.match(csp, /frame-ancestors 'self' https:\/\/cms\.example/);
  assert.match(csp, /img-src 'self' data: https:\/\/cms\.example/);
  for (const part of ["object-src 'none'", "base-uri 'none'", "form-action 'self'"]) assert.ok(csp.includes(part), part);
  assert.match(contentSecurityPolicy('abc', { strapiUrl: 'x', dev: true }), /'unsafe-eval'/);
});

test('a new nonce every time', () => {
  assert.notEqual(newNonce(), newNonce());
});
