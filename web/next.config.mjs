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
          // Only the Strapi admin may show the site in a frame (its preview pane).
          { key: 'Content-Security-Policy', value: `frame-ancestors 'self' ${strapiUrl}` },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
