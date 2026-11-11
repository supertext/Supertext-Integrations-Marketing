'use client';

import { useEffect, useRef, useState } from 'react';
import { normalize } from '@/lib/normalize';

const termsOf = (query) => normalize(query).split(/[\s,]+/).filter(Boolean);

/**
 * The search field and category buttons of the integration grid. The cards are rendered on the
 * server; this only shows and hides them (each carries its words in data-search), so the browser
 * has little JavaScript to run. Category and search go into the address (?category=, ?q=).
 */
export default function GridFilter({ gridId, options, initial, fixed, search, filters, labels, requestHref }) {
  const [category, setCategory] = useState(initial);
  const [query, setQuery] = useState('');
  const [counts, setCounts] = useState(() => Object.fromEntries(options.map((o) => [o.value, o.count])));
  const [empty, setEmpty] = useState(false);
  const started = useRef(false);

  // Shows the matching cards and request pills, groups with matches, and updates the counts.
  function apply(nextCategory, nextQuery) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    const terms = termsOf(nextQuery);
    const searching = terms.length > 0;
    grid.dataset.category = fixed ? 'fixed' : nextCategory;
    grid.dataset.searching = String(searching);
    const found = { all: 0 };
    for (const group of grid.querySelectorAll('[data-group]')) {
      let matches = 0;
      for (const item of group.querySelectorAll('[data-search]')) {
        const match = !searching || terms.every((term) => item.dataset.search.includes(term));
        item.hidden = !match;
        if (match && !('sdk' in item.dataset)) matches++;
      }
      for (const list of group.querySelectorAll('.integrations, .request-pills')) {
        list.hidden = searching && !list.querySelector('[data-search]:not([hidden]):not([data-sdk])');
      }
      found[group.dataset.group] = matches;
      found.all += matches;
      group.hidden = (nextCategory !== 'all' && group.dataset.group !== nextCategory) || (searching && matches === 0);
    }
    // While searching, the SDK card shows on its own (after the groups) when it matches.
    let sdkMatch = false;
    for (const sdk of grid.querySelectorAll('.sdk-filtered [data-search]')) {
      sdkMatch = !searching || terms.every((term) => sdk.dataset.search.includes(term));
      sdk.hidden = !sdkMatch;
    }
    for (const button of grid.querySelectorAll('.filters .chip')) button.setAttribute('aria-pressed', String(button.value === nextCategory));
    setCounts(searching ? found : Object.fromEntries(options.map((o) => [o.value, o.count])));
    setEmpty(searching && (found[nextCategory] || 0) === 0 && !sdkMatch);

    const url = new URL(window.location.href);
    if (nextCategory === 'all') url.searchParams.delete('category');
    else url.searchParams.set('category', nextCategory);
    if (searching) url.searchParams.set('q', nextQuery.trim());
    else url.searchParams.delete('q');
    window.history.replaceState(null, '', url);
  }

  // A shared link with ?q= opens with the search filled in.
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const q = new URL(window.location.href).searchParams.get('q');
    if (search && q) {
      setQuery(q);
      apply(category, q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const choose = (value) => {
    setCategory(value);
    apply(value, query);
  };
  const type = (value) => {
    setQuery(value);
    apply(category, value);
  };

  const shown = query.trim();
  return (
    <>
      {search && (
        <form className="grid-search" role="search" onSubmit={(event) => event.preventDefault()}>
          <label className="visually-hidden" htmlFor={`${gridId}-q`}>{labels.searchLabel}</label>
          <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" /><path d="m20 20-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          <input
            id={`${gridId}-q`}
            type="search"
            value={query}
            placeholder={labels.searchPlaceholder}
            autoComplete="off"
            spellCheck="false"
            maxLength={80}
            onChange={(event) => type(event.target.value)}
            onKeyDown={(event) => event.key === 'Escape' && type('')}
          />
        </form>
      )}
      {filters && (
        <div className="filters" role="group">
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              className="chip"
              value={o.value}
              aria-pressed={category === o.value}
              disabled={Boolean(shown) && !counts[o.value] && category !== o.value}
              onClick={() => choose(o.value)}
            >
              {o.label}
              <span className="count">{counts[o.value] || 0}</span>
            </button>
          ))}
        </div>
      )}
      <div className="search-empty" aria-live="polite">
        {empty && (
          <p>
            {labels.searchNone.replace('{query}', shown)}{' '}
            {category !== 'all' && counts.all > 0 ? (
              <button type="button" className="btn btn-text" onClick={() => choose('all')}>{labels.searchAll} →</button>
            ) : (
              <a className="btn btn-text" href={`${requestHref}&system=${encodeURIComponent(shown)}`}>{labels.searchRequest} →</a>
            )}
          </p>
        )}
      </div>
    </>
  );
}
