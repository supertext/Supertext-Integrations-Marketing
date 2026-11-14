// Editorial calendar (admin only, behind the Strapi login): a board of ideas and work in progress,
// news posts and improvements to the site (Calendar entries, plus draft articles, which are news in
// progress by themselves), then scheduled articles, then what is done or published. Data from the
// Content Manager's own admin API, so it shows what the signed-in user may see.
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Layouts, Page, useFetchClient } from '@strapi/strapi/admin';
import { Badge, Box, Flex, Grid, LinkButton, Loader, Table, Tbody, Td, Th, Thead, Tr, Typography } from '@strapi/design-system';
import { Plus } from '@strapi/icons';

const ARTICLE = 'api::article.article';
const ENTRY = 'api::calendar-entry.calendar-entry';
const LOCALES = ['en', 'de', 'fr', 'it'];
const cm = (uid) => `/content-manager/collection-types/${uid}`;
const t = (intl, id, defaultMessage) => intl.formatMessage({ id: `editorial-calendar.${id}`, defaultMessage });

async function listAll(get, uid, params = {}) {
  const all = [];
  for (let page = 1; page < 50; page++) {
    const { data } = await get(cm(uid), { params: { ...params, page, pageSize: 100 } });
    all.push(...(data.results || []));
    if (page >= (data.pagination?.pageCount || 1)) break;
  }
  return all;
}

/** Articles: the rows of every language merged by documentId, with their state on the site. */
function mergeArticles(lists, now) {
  const byId = new Map();
  LOCALES.forEach((locale, i) => {
    for (const row of lists[i] || []) {
      const item = byId.get(row.documentId) || { documentId: row.documentId, locales: {}, rows: {} };
      item.locales[locale] = row.status; // draft | published | modified
      item.rows[locale] = row;
      byId.set(row.documentId, item);
    }
  });
  return [...byId.values()].map((item) => {
    const locale = item.rows.en ? 'en' : Object.keys(item.rows)[0];
    const main = item.rows[locale];
    const live = Object.values(item.locales).some((s) => s !== 'draft');
    const date = main.date ? new Date(main.date) : null;
    return {
      kind: 'article',
      key: `a-${item.documentId}`,
      href: `${cm(ARTICLE)}/${item.documentId}?plugins[i18n][locale]=${locale}`,
      title: main.title || main.slug || '—',
      type: 'news',
      category: main.category,
      date,
      state: !live ? 'in_progress' : date && date > now ? 'scheduled' : 'published',
      locales: item.locales,
    };
  });
}

const entryItems = (entries) =>
  entries.map((e) => ({
    kind: 'entry',
    key: `e-${e.documentId}`,
    href: `${cm(ENTRY)}/${e.documentId}`,
    title: e.title || '—',
    type: e.type,
    date: e.date ? new Date(`${e.date}T12:00:00`) : null,
    state: e.stage, // idea | in_progress | done
    notes: e.notes,
  }));

const byDate = (a, b) => (a.date ? a.date.getTime() : Infinity) - (b.date ? b.date.getTime() : Infinity);
const COLORS = {
  news: ['primary100', 'primary700'],
  improvement: ['alternative100', 'alternative700'],
  published: ['success100', 'success700'],
  modified: ['warning100', 'warning700'],
  draft: ['neutral150', 'neutral700'],
  missing: ['neutral0', 'neutral400'],
};

function Languages({ locales, intl }) {
  return (
    <Flex gap={1}>
      {LOCALES.map((locale) => {
        const s = locales[locale] || 'missing';
        const [bg, fg] = COLORS[s];
        return (
          <Badge key={locale} backgroundColor={bg} textColor={fg} title={`${locale.toUpperCase()}: ${t(intl, `locale.${s}`, s)}`}>
            {locale.toUpperCase()}
          </Badge>
        );
      })}
    </Flex>
  );
}

function TypeBadge({ type, intl }) {
  const [bg, fg] = COLORS[type] || COLORS.draft;
  return <Badge backgroundColor={bg} textColor={fg}>{t(intl, `type.${type}`, type)}</Badge>;
}

function Card({ item, intl, day }) {
  return (
    <Box background="neutral0" hasRadius shadow="tableShadow" padding={4}>
      <Flex direction="column" alignItems="stretch" gap={2}>
        <Flex gap={2} wrap="wrap">
          <TypeBadge type={item.type} intl={intl} />
          {item.kind === 'article' && <Badge>{t(intl, 'draftArticle', 'Draft article')}</Badge>}
          {item.date && <Typography variant="pi" textColor="neutral600">{day.format(item.date)}</Typography>}
        </Flex>
        <Link to={item.href}>
          <Typography fontWeight="semiBold" textColor="primary600">{item.title}</Typography>
        </Link>
        {item.notes && <Typography variant="pi" textColor="neutral700" style={{ whiteSpace: 'pre-line' }}>{item.notes}</Typography>}
        {item.locales && <Languages locales={item.locales} intl={intl} />}
      </Flex>
    </Box>
  );
}

function Column({ title, items, intl, day }) {
  return (
    <Box background="neutral100" hasRadius padding={4} height="100%">
      <Box paddingBottom={3}>
        <Typography variant="delta" tag="h2">{title} ({items.length})</Typography>
      </Box>
      <Flex direction="column" alignItems="stretch" gap={3}>
        {items.length ? items.map((item) => <Card key={item.key} item={item} intl={intl} day={day} />) : <Typography textColor="neutral600">{t(intl, 'empty', 'Nothing here yet.')}</Typography>}
      </Flex>
    </Box>
  );
}

function List({ title, items, intl, day }) {
  return (
    <Box paddingTop={8}>
      <Box paddingBottom={3}>
        <Typography variant="delta" tag="h2">{title} ({items.length})</Typography>
      </Box>
      {items.length ? (
        <Table colCount={4} rowCount={items.length + 1}>
          <Thead>
            <Tr>
              <Th><Typography variant="sigma">{t(intl, 'col.date', 'Date')}</Typography></Th>
              <Th><Typography variant="sigma">{t(intl, 'col.title', 'Title')}</Typography></Th>
              <Th><Typography variant="sigma">{t(intl, 'col.type', 'Type')}</Typography></Th>
              <Th><Typography variant="sigma">{t(intl, 'col.languages', 'Languages')}</Typography></Th>
            </Tr>
          </Thead>
          <Tbody>
            {items.map((item) => (
              <Tr key={item.key}>
                <Td style={{ whiteSpace: 'nowrap' }}><Typography textColor="neutral800">{item.date ? day.format(item.date) : '—'}</Typography></Td>
                <Td style={{ whiteSpace: 'normal' }}>
                  <Link to={item.href}><Typography fontWeight="semiBold" textColor="primary600">{item.title}</Typography></Link>
                </Td>
                <Td><TypeBadge type={item.type} intl={intl} /></Td>
                <Td>{item.locales ? <Languages locales={item.locales} intl={intl} /> : null}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <Typography textColor="neutral600">{t(intl, 'empty', 'Nothing here yet.')}</Typography>
      )}
    </Box>
  );
}

export default function EditorialCalendar() {
  const intl = useIntl();
  const { get } = useFetchClient();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      const [entries, ...articles] = await Promise.all([
        listAll(get, ENTRY, { sort: 'date:ASC' }),
        ...LOCALES.map((locale) => listAll(get, ARTICLE, { locale, sort: 'date:ASC' })),
      ]);
      setData({ entries, articles });
    } catch (e) {
      setError(e?.message || String(e));
    }
  }, [get]);
  useEffect(() => { load(); }, [load]);

  const day = useMemo(() => new Intl.DateTimeFormat(intl.locale, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }), [intl.locale]);
  const groups = useMemo(() => {
    if (!data) return null;
    const items = [...entryItems(data.entries), ...mergeArticles(data.articles, new Date())];
    const pick = (state) => items.filter((i) => i.state === state);
    return {
      ideas: pick('idea').sort(byDate),
      progress: pick('in_progress').sort(byDate),
      scheduled: pick('scheduled').sort(byDate),
      done: [...pick('done'), ...pick('published')].sort((a, b) => byDate(b, a)),
    };
  }, [data]);

  const title = t(intl, 'title', 'Editorial calendar');
  return (
    <Page.Main>
      <Page.Title>{title}</Page.Title>
      <Layouts.Header
        title={title}
        subtitle={t(intl, 'subtitle', 'Ideas and work in progress, for news posts and improvements to the site. Draft articles count as in progress; scheduled articles appear on the site at their date. Only signed-in editors see this page.')}
        primaryAction={
          <Flex gap={2}>
            <LinkButton tag={Link} to={`${cm(ENTRY)}/create`} startIcon={<Plus />}>{t(intl, 'newEntry', 'New idea')}</LinkButton>
            <LinkButton tag={Link} variant="secondary" to={`${cm(ARTICLE)}/create?plugins[i18n][locale]=en`} startIcon={<Plus />}>{t(intl, 'newArticle', 'New article')}</LinkButton>
          </Flex>
        }
      />
      <Layouts.Content>
        {error ? (
          <Typography textColor="danger600">{error}</Typography>
        ) : !groups ? (
          <Flex justifyContent="center" padding={8}><Loader /></Flex>
        ) : (
          <>
            <Grid.Root gap={4}>
              <Grid.Item col={6} s={12} alignItems="stretch"><Column title={t(intl, 'ideas', 'Ideas')} items={groups.ideas} intl={intl} day={day} /></Grid.Item>
              <Grid.Item col={6} s={12} alignItems="stretch"><Column title={t(intl, 'inProgress', 'In progress')} items={groups.progress} intl={intl} day={day} /></Grid.Item>
            </Grid.Root>
            <List title={t(intl, 'scheduled', 'Scheduled articles')} items={groups.scheduled} intl={intl} day={day} />
            <List title={t(intl, 'done', 'Done and published')} items={groups.done} intl={intl} day={day} />
          </>
        )}
      </Layouts.Content>
    </Page.Main>
  );
}
