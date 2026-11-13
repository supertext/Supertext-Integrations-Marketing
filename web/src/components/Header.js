'use client';

import Link from 'next/link';
import { Suspense, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import CmsLink from './CmsLink';
import LanguageSwitcher from './LanguageSwitcher';
import { Chevron, MenuIcon } from './Icons';
import { localizeHref } from '@/lib/i18n';
import { supertextMenu } from '@/lib/supertextMenu';

export default function Header({ global, locale, t }) {
  const [open, setOpen] = useState(null); // index of the open dropdown
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const ref = useRef(null);
  const pathname = usePathname();

  useEffect(() => { setOpen(null); setMobile(false); }, [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(null); };
    const onKey = (e) => { if (e.key === 'Escape') { setOpen(null); setMobile(false); } };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const nav = global?.navigation || [];
  const menu = supertextMenu(locale);
  return (
    <header className={`header${scrolled ? ' scrolled' : ''}`} ref={ref}>
      <div className="container header-inner">
        <Link href={`/${locale}`} className="logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/supertext-logo.svg" alt={global?.siteName || 'Supertext'} width={150} height={27} />
          <small>Integrations</small>
        </Link>

        <nav className="nav" aria-label="Main">
          {nav.map((group, i) =>
            group.links?.length ? (
              <div key={group.id ?? i} className={`nav-item${open === i ? ' open' : ''}`}>
                <button type="button" className="nav-link" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
                  {group.label} <Chevron />
                </button>
                {open === i && (
                  <div className="dropdown">
                    {group.url && (
                      <CmsLink link={{ url: group.url }} locale={locale} className="">
                        <strong style={{ fontWeight: 500 }}>{group.label}</strong>
                      </CmsLink>
                    )}
                    {group.links.map((link) => (
                      <CmsLink key={link.id ?? link.url} link={link} locale={locale} className="">
                        {link.label}
                        {link.description && <span>{link.description}</span>}
                      </CmsLink>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div key={group.id ?? i} className="nav-item">
                <Link className="nav-link" href={localizeHref(group.url, locale)}>{group.label}</Link>
              </div>
            )
          )}
        </nav>

        <div className="header-actions">
          {global?.headerCta && <span className="hide-mobile"><CmsLink link={global.headerCta} locale={locale} /></span>}
          {global?.loginLink && <span className="hide-mobile"><CmsLink link={global.loginLink} locale={locale} style="text" /></span>}
          <button type="button" className="menu-toggle" aria-label={t.menu} aria-expanded={mobile} aria-controls="site-menu" onClick={() => setMobile(!mobile)}>
            <MenuIcon open={mobile} />
          </button>
        </div>
      </div>

      {/* The menu behind the hamburger: the same as supertext.com's (lib/supertextMenu.js), plus this site's own pages on
          small screens, where they aren't in the bar, then the login and the language. */}
      <div id="site-menu" className={`site-menu${mobile ? ' open' : ''}`} hidden={!mobile}>
        <div className="site-menu-main">
          <div className="menu-promo">
            <p>{menu.promo}</p>
            <a className="btn btn-mint btn-block" href={menu.promoLink.url}>{menu.promoLink.label}</a>
          </div>
          <div className="menu-big-wrap">
            <nav className="menu-big menu-site" aria-label={t.menu}>
              {nav.filter((group) => group.url).map((group, i) => (
                <CmsLink key={group.id ?? i} link={{ url: group.url, label: group.label }} locale={locale} className="">
                  <span>{group.label}</span><span className="menu-arrow" aria-hidden="true">→</span>
                </CmsLink>
              ))}
            </nav>
            <nav className="menu-big" aria-label="Supertext">
              {menu.main.map((item) => (
                <a key={item.url} href={item.url}><span>{item.label}</span><span className="menu-arrow" aria-hidden="true">→</span></a>
              ))}
            </nav>
          </div>
        </div>
        <div className="site-menu-side">
          <nav className="menu-small" aria-label="Supertext">
            {menu.side.map((item) => <a key={item.url} href={item.url}>{item.label}</a>)}
          </nav>
          <div className="menu-extra">
            {global?.loginLink && <CmsLink link={global.loginLink} locale={locale} className="menu-login" />}
            <label className="menu-lang">
              <span>{t.language}</span>
              <Suspense><LanguageSwitcher locale={locale} label={t.language} /></Suspense>
            </label>
          </div>
        </div>
      </div>
    </header>
  );
}
