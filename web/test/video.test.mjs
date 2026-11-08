import { test } from 'node:test';
import assert from 'node:assert/strict';
import { embedUrl, youtubeId } from '../src/lib/video.js';

test('YouTube ids from ids and links', () => {
  assert.equal(youtubeId('-an7zWZb27I'), '-an7zWZb27I');
  assert.equal(youtubeId(' z-kyu9i-jOs '), 'z-kyu9i-jOs');
  assert.equal(youtubeId('https://www.youtube.com/watch?v=VRDvZRfgccM&t=3s'), 'VRDvZRfgccM');
  assert.equal(youtubeId('https://youtu.be/hvdRftRc7NY'), 'hvdRftRc7NY');
  assert.equal(youtubeId('https://www.youtube-nocookie.com/embed/qysKPCXRYcI'), 'qysKPCXRYcI');
  assert.equal(youtubeId('https://www.youtube.com/shorts/JQVH7uhWT6c'), 'JQVH7uhWT6c');
  for (const bad of [null, '', 'short', 'https://evil.example/watch?v=VRDvZRfgccM', 'javascript:alert(1)', 'VRDvZRfgccM"x']) assert.equal(youtubeId(bad), null);
});

test('embeds use the privacy-enhanced domain', () => {
  assert.equal(embedUrl('-an7zWZb27I'), 'https://www.youtube-nocookie.com/embed/-an7zWZb27I?autoplay=1&rel=0');
});
