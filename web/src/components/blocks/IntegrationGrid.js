import Link from 'next/link';
import IntegrationCard, { integrationHref } from '../IntegrationCard';
import SectionHead from './SectionHead';
import GridFilter, { normalize } from './GridFilter';

/** The words a card is found by: name, texts, technology, category and the hidden search words. */
const searchText = (i, t) =>
  normalize([i.system, i.summary, i.integrationType, i.technology, t[`category_${i.category}`], i.searchTerms].filter(Boolean).join(' '));

const SDK_SEARCH = 'sdk api developer typescript javascript php python .net c# java kotlin npm build your own integration';

const CATEGORIES = ['cms', 'pim', 'ecommerce', 'email', 'design', 'docs', 'support', 'pm', 'code', 'automation', 'language', 'analytics', 'ai'];

/** Systems without a plugin and not planned yet: small links to the request form. */
function RequestPills({ items, locale, t }) {
  return (
    <div className="request-pills">
      <span className="request-label">{t.requestGroupTitle}</span>
      {items.map((i) => (
        <Link key={i.slug} href={integrationHref(i, locale)} className="chip request" data-search={searchText(i, t)}>
          <span aria-hidden="true">+</span> {i.system}
        </Link>
      ))}
    </div>
  );
}

function SdkCard({ locale, t }) {
  return (
    <Link href={`/${locale}/sdk`} className="tile integration sdk-card" data-search={normalize(`${SDK_SEARCH} ${t.sdkCardTitle} ${t.sdkCardText}`)} data-sdk="">
      <div className="shot sdk-shot" aria-hidden="true">
        <code>
          <span>import</span> {'{ SupertextClient }'} <span>from</span> &apos;supertext-sdk&apos;{'\n\n'}
          <span>await</span> client.translateTexts(texts, &apos;de-CH&apos;)
        </code>
      </div>
      <h3>{t.sdkCardTitle}</h3>
      <p>{t.sdkCardText}</p>
      <div className="integration-meta"><span className="tag version">{t.sdkCardCta} →</span></div>
    </Link>
  );
}

/**
 * The integrations, one group per category, rendered on the server. The search field and filter
 * buttons (GridFilter) only show and hide cards and groups; "?category=" picks the first one shown,
 * "?q=" fills in the search.
 */
export default function IntegrationGrid({ block, integrations, locale, t, initialCategory }) {
  const fixed = block.category && block.category !== 'all' ? block.category : null;
  const counts = { all: integrations.length };
  for (const i of integrations) counts[i.category] = (counts[i.category] || 0) + 1;
  const category = fixed || (CATEGORIES.includes(initialCategory) && counts[initialCategory] ? initialCategory : 'all');
  const filters = !fixed && block.showFilters !== false;
  const search = block.showSearch !== false;
  const gridId = `integration-grid-${block.id ?? 'main'}`;

  const groups = (fixed ? [fixed] : CATEGORIES.filter((c) => counts[c])).map((c) => {
    const items = integrations.filter((i) => i.category === c);
    return { c, cards: items.filter((i) => i.stage !== 'request'), requests: items.filter((i) => i.stage === 'request') };
  });
  // The SDK card closes the last group with cards; with a category chosen, it follows that group.
  const sdkGroup = groups.map((g) => g.cards.length > 0).lastIndexOf(true);
  const Heading = block.title ? 'h3' : 'h2';
  const options = ['all', ...CATEGORIES]
    .filter((c) => c === 'all' || counts[c])
    .map((c) => ({ value: c, label: c === 'all' ? t.all : t[`category_${c}`], count: counts[c] || 0 }));

  return (
    <section className="section">
      <div className="container integration-grid" id={gridId} data-category={fixed ? 'fixed' : category}>
        <SectionHead title={block.title} subtitle={block.subtitle} />
        {(filters || search) && (
          <GridFilter
            gridId={gridId}
            options={options}
            initial={fixed ? 'all' : category}
            fixed={Boolean(fixed)}
            search={search}
            filters={filters}
            labels={{ searchLabel: t.searchLabel, searchPlaceholder: t.searchPlaceholder, searchNone: t.searchNone, searchRequest: t.searchRequest, searchAll: t.searchAll }}
            requestHref={`/${locale}/support?kind=request`}
          />
        )}
        {groups.length ? (
          groups.map(({ c, cards, requests }, index) => (
            <div key={c} className="integration-group" data-group={c} hidden={!fixed && category !== 'all' && c !== category}>
              {!fixed && <Heading className="group-title">{t[`category_${c}`]}</Heading>}
              {(cards.length > 0 || index === sdkGroup) && (
                <div className="integrations">
                  {cards.map((item) => <IntegrationCard key={item.slug} item={item} locale={locale} t={t} search={searchText(item, t)} />)}
                  {index === sdkGroup && <SdkCard locale={locale} t={t} />}
                </div>
              )}
              {requests.length > 0 && <RequestPills items={requests} locale={locale} t={t} />}
            </div>
          ))
        ) : (
          <p className="empty">{t.noResults}</p>
        )}
        {(filters || search) && (
          <div className="integrations sdk-filtered">
            <SdkCard locale={locale} t={t} />
          </div>
        )}
        <p className="roadmap-link">
          <Link href={`/${locale}/roadmap`} className="btn btn-text">{t.roadmapLink} →</Link>
        </p>
      </div>
    </section>
  );
}
