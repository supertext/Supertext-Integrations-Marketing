export const dynamic = 'force-dynamic';

/**
 * Google Search Console's HTML-file ownership check: /google<token>.html (rewritten here) answers
 * when GOOGLE_SITE_VERIFICATION_FILE names that file. Several files: comma-separated.
 */
export async function GET(request, { params }) {
  const { file } = await params;
  const allowed = (process.env.GOOGLE_SITE_VERIFICATION_FILE || '').split(',').map((s) => s.trim()).filter(Boolean);
  if (!allowed.includes(file)) return new Response('Not found', { status: 404 });
  return new Response(`google-site-verification: ${file}`, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
