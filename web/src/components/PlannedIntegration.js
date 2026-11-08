import Link from 'next/link';
import IntegrationCard from './IntegrationCard';
import Mark from './Mark';
import Markdown from './Markdown';
import { JsonLd, SITE_URL } from '@/lib/seo';
import { format } from '@/lib/i18n';
import { plainText } from '@/lib/page';

const Check = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * The page of a system without a Supertext plugin yet (status roadmap or request): what it is,
 * what a plugin would do, how to translate its content today, and the request button.
 */
export default function PlannedIntegration({ item, locale, t, all, requests = 0 }) {
  const roadmap = item.stage === 'roadmap';
  const system = { system: item.system };
  const requestHref = `/${locale}/support?kind=request&platform=${item.slug}`;
  const pageUrl = `${SITE_URL}/${locale}/integrations/${item.slug}`;
  const sameCategory = all.filter((i) => i.category === item.category && i.slug !== item.slug);
  const available = sameCategory.filter((i) => !i.stage || i.stage === 'live' || i.stage === 'in_development').slice(0, 6);
  const others = sameCategory.filter((i) => i.stage === 'roadmap' || i.stage === 'request');
  const until = ['plannedUntilFiles', 'plannedUntilSdk', 'plannedUntilMcp', 'plannedUntilTeam'];
  // "How to translate it today" (CMS): a lead paragraph, numbered steps and a tip.
  const today = item.translateToday || '';
  const lead = today.split(/\n\s*\n/)[0];
  const steps = today.split('\n').filter((line) => /^\d+\.\s/.test(line)).map((line) => plainText(line.replace(/^\d+\.\s+/, '')));
  const faq = [
    [format(t, 'plannedFaqExists', system), roadmap ? t.plannedFaqExistsRoadmap : t.plannedFaqExistsRequest],
    [format(t, 'plannedFaqToday', system), today ? plainText(lead) : format(t, 'plannedFaqTodayAnswer', system)],
  ];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'FAQPage',
        mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: plainText(a) } })),
      },
      ...(steps.length
        ? [
            {
              '@type': 'HowTo',
              name: format(t, 'plannedUntilTitle', system),
              description: plainText(lead),
              step: steps.map((text, i) => ({ '@type': 'HowToStep', position: i + 1, text })),
            },
          ]
        : []),
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Supertext', item: `${SITE_URL}/${locale}` },
          { '@type': 'ListItem', position: 2, name: t.allIntegrations, item: `${SITE_URL}/${locale}/integrations` },
          { '@type': 'ListItem', position: 3, name: item.system, item: pageUrl },
        ],
      },
    ],
  };
  const count = requests === 1 ? t.requestCountOne : format(t, 'requestCountMany', { n: requests });

  return (
    <>
      <JsonLd data={jsonLd} />
      <section className="hero">
        <div className="container">
          <p style={{ marginBottom: 24 }}>
            <Link href={`/${locale}/integrations`} className="btn btn-text">← {t.allIntegrations}</Link>
          </p>
          <div className="integration-hero">
            <Mark name={item.system} logo={item.logoUrl} large />
            <div style={{ display: 'grid', gap: 16 }}>
              <h1 className="display">
                <span className="h1-kicker">{t.integrationHeading}</span> {item.system}
              </h1>
              <p className="hero-sub">{item.summary}</p>
              <div className="integration-meta">
                <Link href={`/${locale}/roadmap#${item.slug}`} className={`status ${roadmap ? 'roadmap' : 'request'}`}>
                  {roadmap ? t.stage_roadmap : t.stage_request}
                </Link>
                <span className="tag">{t[`category_${item.category}`]}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container detail">
          <div style={{ display: 'grid', gap: 24 }}>
            <section className="card detail-section planned-cta">
              <p>{format(t, roadmap ? 'plannedLeadRoadmap' : 'plannedLeadRequest', system)}</p>
              <p className="planned-actions">
                <Link href={requestHref} className="btn btn-primary">{t.sendRequest}</Link>
                {requests > 0 && <span className="request-count">{format(t, 'plannedCountText', { count })}</span>}
              </p>
            </section>
            {item.aboutSystem && (
              <section className="card detail-section">
                <h2>{format(t, 'aboutSystem', system)}</h2>
                <Markdown locale={locale}>{item.aboutSystem}</Markdown>
              </section>
            )}
            <section className="card detail-section planned-today">
              <h2>{format(t, 'plannedUntilTitle', system)}</h2>
              {today && <Markdown locale={locale}>{today}</Markdown>}
              {today && <h3>{t.plannedMoreWays}</h3>}
              <Markdown locale={locale}>{until.map((k) => `- ${t[k]}`).join('\n')}</Markdown>
            </section>
            <section className="card detail-section">
              <h2>{t.plannedWhatTitle}</h2>
              <ul className="check-list">
                {['plannedWhat1', 'plannedWhat2', 'plannedWhat3', 'plannedWhat4'].map((k) => (
                  <li key={k}><Check /><span>{format(t, k, system)}</span></li>
                ))}
              </ul>
            </section>
            <section className="card detail-section">
              <h2>{t.faqHeading}</h2>
              <dl className="planned-faq">
                {faq.map(([q, a]) => (
                  <div key={q}><dt>{q}</dt><dd>{a}</dd></div>
                ))}
              </dl>
            </section>
          </div>
          <aside className="facts">
            <div className="card">
              <dl>
                <div>
                  <dt>{t.status}</dt>
                  <dd><Link href={`/${locale}/roadmap#${item.slug}`}>{roadmap ? t.stage_roadmap : t.stage_request}</Link></dd>
                </div>
                <div><dt>{t.categoryLabel}</dt><dd>{t[`category_${item.category}`]}</dd></div>
              </dl>
              <div style={{ display: 'grid', gap: 8, marginTop: 20 }}>
                <Link href={requestHref} className="btn btn-primary btn-block">{t.sendRequest}</Link>
                <Link href={`/${locale}/roadmap`} className="btn btn-secondary btn-block">{t.roadmapLink}</Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {available.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <h2 className="group-title">{t.plannedAvailable}</h2>
            <div className="integrations">
              {available.map((i) => <IntegrationCard key={i.slug} item={i} locale={locale} t={t} />)}
            </div>
          </div>
        </section>
      )}
      {others.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <h2 className="group-title">{t.plannedAlso}</h2>
            <div className="request-pills">
              {others.map((i) => (
                <Link key={i.slug} href={`/${locale}/integrations/${i.slug}`} className="chip request">
                  <span aria-hidden="true">+</span> {i.system}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
