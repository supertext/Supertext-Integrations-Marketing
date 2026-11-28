/**
 * Content-Security-Policy of every page (set per request in src/proxy.js). Scripts only with this
 * request's nonce (Next.js puts it on its own scripts) or added by them ('strict-dynamic': the
 * support form adds Cloudflare Turnstile's script). Styles, fonts, images and videos from the site
 * (images also from Strapi's uploads; style attributes allowed). Frames: only the YouTube player
 * (privacy-enhanced, after a click) and Turnstile. Only the Strapi admin may show the site in a frame
 * (its preview pane). No plugins, no other <base>, forms only to the site.
 */
/** Where browsers report what the policy blocked: Supertext Plugin Health. */
export const CSP_REPORT_URL = 'https://pluginhealth.supertext.com/api/v1/csp-report';

export function contentSecurityPolicy(nonce, { strapiUrl, dev = false }) {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${dev ? " 'unsafe-eval'" : ''}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' data: ${strapiUrl}`,
    "font-src 'self'",
    "connect-src 'self'",
    "media-src 'self'",
    "frame-src 'self' https://www.youtube-nocookie.com https://challenges.cloudflare.com",
    `frame-ancestors 'self' ${strapiUrl}`,
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'self'",
    // Violations go to Supertext Plugin Health's collector (its CSP reports page).
    `report-uri ${CSP_REPORT_URL}`,
    'report-to csp',
  ].join('; ');
}

/** A fresh nonce for one request: 128 random bits, base64. */
export function newNonce() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes));
}
