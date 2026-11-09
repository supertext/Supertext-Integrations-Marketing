import Link from 'next/link';
import Mark from '../Mark';
import SectionHead from './SectionHead';
import { format } from '@/lib/i18n';
import { getRepoStats, getRequestCounts, getSupportStats, hasPlugin } from '@/lib/strapi';
import { getPluginHealthStats, integrationFor } from '@/lib/pluginHealth';

const DAY = 24 * 60 * 60 * 1000;

/** "TYPO3 13.4.2" → "TYPO3 13" (or "WordPress 6.9" when every site runs the same major version). */
function versionGroups(values, minorToo) {
  const groups = new Map();
  for (const { value, installations } of values) {
    if (!value) continue;
    const m = /^(.*?)\s+(\d+)(?:\.(\d+))?/.exec(value);
    const key = m ? (minorToo && m[3] !== undefined ? `${m[1]} ${m[2]}.${m[3]}` : `${m[1]} ${m[2]}`) : value;
    groups.set(key, (groups.get(key) || 0) + installations);
  }
  return [...groups].map(([label, n]) => ({ label, n })).sort((a, b) => b.n - a.n);
}

function systemVersions(values) {
  const majors = versionGroups(values, false);
  return majors.length === 1 ? versionGroups(values, true) : majors;
}

const pct = (n, of) => (of ? Math.round((n / of) * 100) : 0);

function duration(t, hours) {
  if (hours === null || hours === undefined) return null;
  if (hours < 1) return format(t, 'statsMinutes', { n: Math.max(1, Math.round(hours * 60)) });
  if (hours < 1.5) return t.statsHour;
  if (hours < 48) return format(t, 'statsHours', { n: Math.round(hours) });
  return format(t, 'statsDays', { n: Math.round(hours / 24) });
}

function ago(t, iso) {
  const days = Math.floor((Date.now() - new Date(iso)) / DAY);
  if (days <= 0) return t.statsToday;
  if (days === 1) return t.statsYesterday;
  return format(t, 'statsDaysAgo', { n: days });
}

function Stat({ value, label, note }) {
  return (
    <div className="tile stat">
      <strong>{value}</strong>
      <span>{label}</span>
      {note && <small>{note}</small>}
    </div>
  );
}

/** Running total per month as columns; the last month is the current one. */
function GrowthChart({ points, locale, title }) {
  const max = Math.max(...points.map((p) => p.total), 1);
  const month = (m) => new Intl.DateTimeFormat(`${locale}-CH`, { month: 'short', year: '2-digit', timeZone: 'UTC' }).format(new Date(`${m}-01T00:00:00Z`));
  const shown = points.slice(-18);
  return (
    <figure className="tile stats-growth">
      <figcaption>{title}</figcaption>
      <div className="stats-bars" role="list">
        {shown.map((p) => (
          <div key={p.month} className="stats-bar" role="listitem" aria-label={`${month(p.month)}: ${p.total}`}>
            <span className="value">{p.total}</span>
            <span className="bar" style={{ height: `${Math.max(4, (p.total / max) * 100)}%` }} />
            <span className="label">{month(p.month)}</span>
          </div>
        ))}
      </div>
    </figure>
  );
}

function Bars({ rows }) {
  const max = Math.max(...rows.map((r) => r.n), 1);
  return (
    <ul className="stats-hbars">
      {rows.map((r) => (
        <li key={r.key || r.label}>
          <span className="name">{r.href ? <Link href={r.href}>{r.label}</Link> : r.label}</span>
          <span className="track"><span className="fill" style={{ width: `${(r.n / max) * 100}%` }} /></span>
          <span className="num">{r.text}</span>
        </li>
      ))}
    </ul>
  );
}

function Adoption({ health, integrations, locale, t, min, nf, showSmall }) {
  if (!health?.totals) return null;
  // Only plugins that belong to an integration count (test reports from other tools stay out).
  const plugins = health.plugins
    .map((p) => ({ ...p, integration: integrationFor(p.plugin, integrations) }))
    .filter((p) => p.installations > 0 && p.integration);
  const sum = (key) => plugins.reduce((n, p) => n + (p[key] || 0), 0);
  const totals = { installations: sum('installations'), active: sum('active'), up_to_date: sum('up_to_date'), outdated: sum('outdated') };
  if (totals.installations < min) {
    console.info(`[stats] Adoption hidden: ${totals.installations} installations (${plugins.length} plugins), below minCount ${min}`);
    return null;
  }
  const released = totals.up_to_date + totals.outdated;
  const langs = health.totals.languages;
  const languageRows = langs && langs.reported >= min ? (langs.supertext || []).filter((l) => l.value).slice(0, 10) : [];
  // Growth: the plugins' months added up, with the running total.
  const perMonth = new Map();
  for (const p of plugins) for (const g of p.growth || []) perMonth.set(g.month, (perMonth.get(g.month) || 0) + g.new);
  const months = [...(health.totals.growth || []).map((g) => g.month)].sort();
  let running = 0;
  const growth = months.map((month) => ({ month, total: (running += perMonth.get(month) || 0) })).filter((g) => g.total > 0);

  return (
    <section className="stats-section" aria-labelledby="stats-adoption">
      <header>
        <h2 id="stats-adoption">{t.statsAdoption}</h2>
        <p>{t.statsAdoptionText}</p>
      </header>
      <div className="stats-tiles">
        <Stat value={nf.format(totals.installations)} label={t.statsInstallations} note={format(t, 'statsActive', { n: nf.format(totals.active) })} />
        <Stat value={nf.format(plugins.length)} label={t.statsPluginsInUse} />
        {released >= min && <Stat value={`${pct(totals.up_to_date, released)}%`} label={t.statsUpToDate} note={t.statsUpToDateNote} />}
        {languageRows.length > 0 && (
          <Stat value={nf.format(langs.supertext.filter((l) => l.value).length)} label={t.statsLanguagesInUse} note={format(t, 'statsLanguagesNote', { n: nf.format(langs.reported) })} />
        )}
      </div>

      {growth.length >= 2 && <GrowthChart points={growth} locale={locale} title={t.statsGrowth} />}

      <h3>{t.statsByPlugin}</h3>
      <div className="stats-table-wrap">
        <table className="stats-table">
          <thead>
            <tr>
              <th scope="col">{t.statsColPlugin}</th>
              <th scope="col" className="num">{t.statsColInstallations}</th>
              <th scope="col" className="num">{t.statsColUpToDate}</th>
              <th scope="col">{t.statsColVersions}</th>
            </tr>
          </thead>
          <tbody>
            {plugins.map((p) => {
              // Small counts only while test installations are included; system versions identify no site.
              const shown = showSmall || p.installations >= min;
              const name = p.integration?.system || p.plugin;
              const pluginReleased = p.up_to_date + p.outdated;
              const versions = systemVersions(p.system_versions || []).slice(0, 3);
              return (
                <tr key={p.plugin}>
                  <th scope="row" data-label={t.statsColPlugin}>
                    {p.integration ? (
                      <Link href={`/${locale}/integrations/${p.integration.slug}`} className="stats-system">
                        <Mark name={name} logo={p.integration.logoUrl} />
                        {name}
                      </Link>
                    ) : (
                      name
                    )}
                  </th>
                  <td className="num" data-label={t.statsColInstallations}>{shown ? nf.format(p.installations) : <span className="tag">{t.statsNew}</span>}</td>
                  <td className="num" data-label={t.statsColUpToDate}>{pluginReleased > 0 && (showSmall || pluginReleased >= min) ? `${pct(p.up_to_date, pluginReleased)}%` : '–'}</td>
                  <td data-label={t.statsColVersions}>{versions.length ? versions.map((v) => `${v.label} (${pct(v.n, p.installations)}%)`).join(', ') : '–'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {languageRows.length > 0 && (
        <>
          <h3>{t.statsTopLanguages}</h3>
          <Bars rows={languageRows.map((l) => ({ key: l.value, label: l.value, n: l.installations, text: format(t, 'statsSitesShare', { n: pct(l.installations, langs.reported) }) }))} />
        </>
      )}
    </section>
  );
}

function Pace({ integrations, repos, locale, t, nf }) {
  const live = integrations.filter((i) => hasPlugin(i) && i.stage !== 'in_development');
  const stats = live.map((i) => ({ i, r: repos.get((i.repo || '').toLowerCase()) })).filter((x) => x.r);
  const sum = (key) => stats.reduce((n, { r }) => n + (r[key] || 0), 0);
  // Median over every closed issue of the live plugins.
  const hours = stats.flatMap(({ r }) => (Array.isArray(r.closeHours) ? r.closeHours.map(Number) : [])).sort((a, b) => a - b);
  const mid = hours.length >> 1;
  const medianClose = !hours.length ? null : hours.length % 2 ? hours[mid] : (hours[mid - 1] + hours[mid]) / 2;
  const latest = stats
    .filter(({ r }) => r.releasedAt && r.version)
    .sort((a, b) => new Date(b.r.releasedAt) - new Date(a.r.releasedAt))
    .slice(0, 12);
  const date = (iso) => new Intl.DateTimeFormat(`${locale}-CH`, { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso));

  return (
    <section className="stats-section" aria-labelledby="stats-pace">
      <header>
        <h2 id="stats-pace">{t.statsPace}</h2>
        <p>{t.statsPaceText}</p>
      </header>
      <div className="stats-tiles">
        <Stat value={nf.format(live.length)} label={t.statsLive} />
        <Stat value={nf.format(integrations.filter((i) => i.stage === 'in_development').length)} label={t.statsInDevelopment} />
        <Stat value={nf.format(integrations.filter((i) => i.stage === 'roadmap').length)} label={t.statsOnRoadmap} />
      </div>
      {stats.length > 0 && (
        <div className="stats-tiles">
          <Stat value={nf.format(sum('releases30'))} label={t.statsReleases30} />
          <Stat value={nf.format(sum('releases90'))} label={t.statsReleases90} />
          {sum('issuesClosed') > 0 && (
            <Stat value={nf.format(sum('issuesClosed'))} label={t.statsIssues} note={format(t, 'statsIssuesOpen', { n: nf.format(sum('issuesOpen')) })} />
          )}
          {medianClose !== null && <Stat value={duration(t, medianClose)} label={t.statsCloseTime} />}
        </div>
      )}
      {latest.length > 0 && (
        <>
          <h3>{t.statsLatestReleases}</h3>
          <div className="stats-table-wrap">
            <table className="stats-table">
              <thead>
                <tr>
                  <th scope="col">{t.statsColPlugin}</th>
                  <th scope="col">{t.statsColVersion}</th>
                  <th scope="col">{t.statsColReleased}</th>
                </tr>
              </thead>
              <tbody>
                {latest.map(({ i, r }) => (
                  <tr key={i.slug}>
                    <th scope="row">
                      <Link href={`/${locale}/integrations/${i.slug}`} className="stats-system">
                        <Mark name={i.system} logo={i.logoUrl} />
                        {i.system}
                      </Link>
                    </th>
                    <td data-label={t.statsColVersion}>{r.url ? <a href={r.url} rel="noopener">v{r.version}</a> : `v${r.version}`}</td>
                    <td data-label={t.statsColReleased}><time dateTime={r.releasedAt} title={date(r.releasedAt)}>{ago(t, r.releasedAt)}</time></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}

function Demand({ integrations, counts, support, locale, t, min, nf }) {
  const bySlug = new Map(integrations.map((i) => [i.slug, i]));
  const requested = Object.entries(counts)
    .map(([slug, n]) => ({ i: bySlug.get(slug), n }))
    .filter((x) => x.i && x.n > 0)
    .sort((a, b) => b.n - a.n || a.i.system.localeCompare(b.i.system))
    .slice(0, 10);
  const showSupport = support && support.answered >= min;
  if (!requested.length && !showSupport) return null;
  return (
    <section className="stats-section" aria-labelledby="stats-demand">
      <header>
        <h2 id="stats-demand">{t.statsDemand}</h2>
        <p>{t.statsDemandText}</p>
      </header>
      {showSupport && (
        <div className="stats-tiles">
          <Stat value={nf.format(support.answered)} label={t.statsSupportAnswered} />
          {support.firstReplyHoursMedian !== null && <Stat value={duration(t, support.firstReplyHoursMedian)} label={t.statsFirstReply} />}
        </div>
      )}
      {requested.length > 0 && (
        <>
          <h3>{t.statsTopRequests}</h3>
          <Bars
            rows={requested.map(({ i, n }) => ({
              key: i.slug,
              label: i.system,
              href: `/${locale}/integrations/${i.slug}`,
              n,
              text: n === 1 ? t.statsRequestOne : format(t, 'statsRequests', { n: nf.format(n) }),
            }))}
          />
          <p style={{ marginTop: 20 }}>
            <Link href={`/${locale}/support?kind=request`} className="btn btn-secondary">{t.requestOther}</Link>
          </p>
        </>
      )}
    </section>
  );
}

/**
 * The statistics page: adoption (Supertext Plugin Health), development pace (GitHub, synced by the CMS),
 * demand and support (this site). Numbers below `minCount` are not shown, so no single site can be recognised.
 */
export default async function Statistics({ block, integrations, locale, t }) {
  const min = Math.max(1, block.minCount ?? 10);
  const [health, repos, counts, support] = await Promise.all([
    block.showAdoption !== false ? getPluginHealthStats(!!block.includeLocal) : null,
    block.showPace !== false ? getRepoStats() : new Map(),
    block.showDemand !== false ? getRequestCounts() : {},
    block.showDemand !== false ? getSupportStats() : null,
  ]);
  const nf = new Intl.NumberFormat(`${locale}-CH`);
  const updated = health?.generated_at
    ? new Intl.DateTimeFormat(`${locale}-CH`, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(health.generated_at))
    : null;

  return (
    <section className="section statistics" style={{ paddingTop: block.title ? undefined : 0 }}>
      <div className="container">
        <SectionHead title={block.title} subtitle={block.subtitle} />
        {block.includeLocal && block.showAdoption !== false && <p className="stats-note">{t.statsIncludesTest}</p>}
        {block.showAdoption !== false && <Adoption health={health} integrations={integrations} locale={locale} t={t} min={min} nf={nf} showSmall={!!block.includeLocal} />}
        {block.showPace !== false && <Pace integrations={integrations} repos={repos} locale={locale} t={t} nf={nf} />}
        {block.showDemand !== false && <Demand integrations={integrations} counts={counts} support={support} locale={locale} t={t} min={min} nf={nf} />}
        {updated && <p className="stats-updated">{format(t, 'statsUpdated', { date: updated })}</p>}
      </div>
    </section>
  );
}
