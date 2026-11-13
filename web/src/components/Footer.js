import { Suspense } from 'react';
import CmsLink from './CmsLink';
import LanguageSwitcher from './LanguageSwitcher';
import { LANGUAGE_NAMES, LOCALES } from '@/lib/i18n';

export default function Footer({ global, locale, t }) {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-cols">
          <div className="footer-brand" style={{ display: 'grid', gap: 16, alignContent: 'start' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <span className="logo"><img src="/supertext-logo.svg" alt={global?.siteName || 'Supertext'} width={180} height={32} /></span>
            <Suspense><LanguageSwitcher locale={locale} label={t.language} /></Suspense>
          </div>
          {(global?.footerColumns || []).map((col) => (
            <div key={col.id ?? col.label}>
              <h4>{col.label}</h4>
              <ul>
                {(col.links || []).map((link) => (
                  <li key={link.id ?? link.url}><CmsLink link={link} locale={locale} className="" /></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span>{global?.footerNote}</span>
          {/* Plain links as well as the dropdown, so search engines find every language. */}
          <nav className="footer-langs" aria-label={t.language}>
            {LOCALES.map((code) => (
              <a key={code} href={`/${code}`} lang={code} hrefLang={code} aria-current={code === locale ? 'true' : undefined}>{LANGUAGE_NAMES[code]}</a>
            ))}
          </nav>
          <span>© {new Date().getFullYear()} Supertext AG</span>
        </div>
      </div>
    </footer>
  );
}
