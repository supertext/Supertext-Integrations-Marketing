'use client';

import { useState } from 'react';
import { embedUrl } from '@/lib/video';

/**
 * Click to play: until the visitor clicks, nothing is loaded from YouTube (no thumbnail, no script).
 * Then the privacy-enhanced player (youtube-nocookie.com) replaces the placeholder and starts.
 */
export default function VideoPlayer({ id, label, title, playLabel }) {
  const [playing, setPlaying] = useState(false);
  return (
    <figure className="video">
      <div className="video-frame">
        {playing ? (
          <iframe
            src={embedUrl(id)}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <button type="button" className="video-poster" onClick={() => setPlaying(true)} aria-label={`${playLabel}: ${title}`}>
            <span className="video-play" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="28" height="28"><path d="M8 5.5v13l11-6.5z" fill="currentColor" /></svg>
            </span>
          </button>
        )}
      </div>
      <figcaption>{label}</figcaption>
    </figure>
  );
}
