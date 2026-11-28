const strapiUrl = (process.env.STRAPI_PUBLIC_URL || process.env.STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [new URL(`${strapiUrl}/uploads/**`)],
    // Local development (Strapi on localhost): Next.js won't optimise images from a
    // private address, so serve them as they are.
    unoptimized: /^https?:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/.test(strapiUrl),
  },
  // Google Search Console's HTML-file check (GOOGLE_SITE_VERIFICATION_FILE, e.g. google1a2b3c.html).
  async rewrites() {
    return [{ source: '/:file(google[0-9a-f]+\\.html)', destination: '/api/google-verification/:file' }];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Pages get the full Content-Security-Policy with a nonce in src/proxy.js (src/lib/csp.js); everything
          // else (API answers, files) this one: only the Strapi admin may show it in a frame, no plugins.
          { key: 'Content-Security-Policy', value: `frame-ancestors 'self' ${strapiUrl}; object-src 'none'; base-uri 'none'` },
          // HTTPS only, for a year (browsers ignore it over plain HTTP, e.g. locally).
          { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
