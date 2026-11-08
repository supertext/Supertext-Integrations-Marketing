// YouTube videos on integration pages. Editors may enter the id or paste a YouTube link.
import POSTERS from './video-posters.js';
const ID = /^[\w-]{11}$/;

/** The 11-character YouTube id of an id or link (youtu.be, watch?v=, embed/, shorts/, live/), else null. */
export function youtubeId(value) {
  const text = String(value || '').trim();
  if (!text) return null;
  if (ID.test(text)) return text;
  try {
    const url = new URL(text);
    if (!/(^|\.)(youtube\.com|youtube-nocookie\.com|youtu\.be)$/.test(url.hostname)) return null;
    const id = url.hostname.endsWith('youtu.be')
      ? url.pathname.slice(1)
      : url.searchParams.get('v') || url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1];
    return ID.test(id || '') ? id : null;
  } catch {
    return null;
  }
}

/** Privacy-enhanced embed; only loaded after the visitor clicks play. */
export const embedUrl = (id) => `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;

/** Our own poster picture (public/videos, made by scripts/video-posters.py), or null for the plain tile. */
export const posterFor = (slug, kind) => (POSTERS.includes(`${slug}-${kind}`) ? `/videos/${slug}-${kind}.webp` : null);
