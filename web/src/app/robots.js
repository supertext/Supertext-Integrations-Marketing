import { SITE_URL, indexingAllowed } from '@/lib/seo';

// Read on request, so ALLOW_INDEXING takes effect without a rebuild.
export const dynamic = 'force-dynamic';

// AI crawlers named explicitly, so answer engines (ChatGPT, Claude, Perplexity, Gemini…) can cite the site.
const AI_CRAWLERS = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended', 'CCBot'];

export default function robots() {
  if (!indexingAllowed()) {
    // Not launched yet (ALLOW_INDEXING isn't true): keep everything out of search results.
    // The sitemap is still named, so Search Console can read it before the launch.
    // Search engines may fetch the sitemap (Search Console reads it), nothing else yet.
    return { rules: [{ userAgent: '*', allow: '/sitemap.xml', disallow: '/' }], sitemap: `${SITE_URL}/sitemap.xml` };
  }
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/*/shop/'] },
      { userAgent: AI_CRAWLERS, allow: '/', disallow: ['/api/', '/*/shop/'] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
