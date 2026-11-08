'use client';

/**
 * The category buttons of the integration grid. The cards are rendered on the server; this only
 * shows and hides their groups, so the browser has little JavaScript to run.
 */
export default function GridFilter({ gridId, options, initial }) {
  const choose = (value) => {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    grid.dataset.category = value;
    for (const group of grid.querySelectorAll('[data-group]')) group.hidden = value !== 'all' && group.dataset.group !== value;
    for (const button of grid.querySelectorAll('.filters .chip')) button.setAttribute('aria-pressed', String(button.value === value));
    const url = new URL(window.location.href);
    if (value === 'all') url.searchParams.delete('category');
    else url.searchParams.set('category', value);
    window.history.replaceState(null, '', url);
  };

  return (
    <div className="filters" role="group">
      {options.map((o) => (
        <button key={o.value} type="button" className="chip" value={o.value} aria-pressed={initial === o.value} onClick={() => choose(o.value)}>
          {o.label}
          <span className="count">{o.count}</span>
        </button>
      ))}
    </div>
  );
}
