'use client';

import { useState } from 'react';
import Image from 'next/image';
import { embedUrl } from '@/lib/video';

/**
 * Click to play: until the visitor clicks, nothing is loaded from YouTube (no thumbnail, no script).
 * The poster is our own picture from the video (public/videos/<slug>-<kind>.webp), else a plain
 * tile in the site's colours. On click the privacy-enhanced player (youtube-nocookie.com) starts.
 */
export default function VideoPlayer({ id, label, title, playLabel, poster }) {
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
          <button type="button" className={`video-poster${poster ? ' has-image' : ''}`} onClick={() => setPlaying(true)} aria-label={`${playLabel}: ${title}`}>
            {poster && <Image src={poster} alt="" fill sizes="(max-width: 620px) 100vw, (max-width: 960px) 50vw, 440px" />}
            <span className="video-play" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="40" height="40">
                <path d="M8.5 5.8v12.4a.6.6 0 0 0 .9.5l9.8-6.2a.6.6 0 0 0 0-1L9.4 5.3a.6.6 0 0 0-.9.5z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
        )}
      </div>
      <figcaption>{label}</figcaption>
    </figure>
  );
}
