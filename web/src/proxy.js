import { NextResponse } from 'next/server';
import { DEFAULT_LOCALE, LOCALES } from '@/lib/i18n';
import { contentSecurityPolicy, newNonce } from '@/lib/csp';

const strapiUrl = (process.env.STRAPI_PUBLIC_URL || process.env.STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '');

/**
 * Paths without a language go to the visitor's language (Accept-Language), else English.
 * Pages get a fresh nonce and the Content-Security-Policy (src/lib/csp.js).
 */
export function proxy(request) {
  const { pathname, search } = request.nextUrl;
  if (LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) {
    const nonce = newNonce();
    const csp = contentSecurityPolicy(nonce, { strapiUrl, dev: process.env.NODE_ENV === 'development' });
    const headers = new Headers(request.headers);
    headers.set('x-nonce', nonce);
    headers.set('Content-Security-Policy', csp);
    const response = NextResponse.next({ request: { headers } });
    response.headers.set('Content-Security-Policy', csp);
    return response;
  }
  const wanted = (request.headers.get('accept-language') || '')
    .split(',')
    .map((part) => part.split(';')[0].trim().slice(0, 2).toLowerCase());
  const locale = wanted.find((l) => LOCALES.includes(l)) || DEFAULT_LOCALE;
  return NextResponse.redirect(new URL(`/${locale}${pathname === '/' ? '' : pathname}${search}`, request.url));
}

export const config = {
  matcher: ['/((?!api|_next|health|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)'],
};
