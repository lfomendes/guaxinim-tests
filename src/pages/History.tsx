import { Link, useSearchParams } from 'react-router-dom';
import { METHODS } from '../data/methods';
import { bestBrew, formatDayTime } from '../lib/derive';
import { useJournal, useLookups } from '../store';

const MIN_RATINGS = [0, 3, 4, 5];

export function History() {
  const { coffees, brews } = useJournal();
  const { coffeeById, recipeById } = useLookups();
  const [params, setParams] = useSearchParams();

  const coffee = params.get('coffee') ?? 'all';
  const method = params.get('method') ?? 'all';
  const min = Number(params.get('min') ?? 0);
  const recipe = params.get('recipe');
  const saved = params.has('saved');

  function update(key: string, value: string | null) {
    const next = new URLSearchParams(params);
    next.delete('saved');
    if (value === null) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  }

  const loggedCoffees = coffees.filter((c) => brews.some((b) => b.coffeeId === c.id));
  const bests = coffees
    .filter((c) => c.status === 'active')
    .map((c) => {
      const mine = brews.filter((b) => b.coffeeId === c.id);
      return { coffee: c, best: bestBrew(mine), count: mine.length };
    })
    .filter((x) => x.best);

  const rows = brews.filter(
    (b) =>
      (coffee === 'all' || b.coffeeId === coffee) &&
      (method === 'all' || recipeById.get(b.recipeId)?.methodId === method) &&
      (!recipe || b.recipeId === recipe) &&
      b.rating >= min,
  );

  return (
    <main className="page" style={{ gap: 24 }}>
      <div className="page-head__text">
        <h1 className="h1">History</h1>
        <p className="muted">Every cup you’ve logged. Filter to find the best way to brew any coffee.</p>
      </div>

      {saved && (
        <div className="toast" role="status">
          <span className="strong">Brew saved to your journal.</span>
          <Link to="/" className="link-strong">
            Back to the journal →
          </Link>
        </div>
      )}

      <section aria-label="Best brew per coffee" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
        {bests.map(({ coffee: c, best, count }) => (
          <Link
            key={c.id}
            to={`/coffees/${c.id}`}
            className="card"
            style={{ gap: 4, padding: '16px 18px', borderRadius: 14, textDecoration: 'none', color: 'var(--ink)' }}
          >
            <span className="label">Best for {c.shortName}</span>
            <span className="strong">{recipeById.get(best!.recipeId)?.shortName}</span>
            <span className="mono-sm" style={{ color: 'var(--muted)' }}>
              {best!.rating}★ · {count === 1 ? 'only 1 brew so far' : [best!.clicks !== undefined && `${best!.clicks} clicks`, best!.time].filter(Boolean).join(' · ')}
            </span>
          </Link>
        ))}
      </section>

      <div className="toolbar toolbar--end">
        <label className="field" style={{ flex: '1 1 220px' }}>
          Coffee
          <select className="select select--sm" style={{ width: '100%' }} value={coffee} onChange={(e) => update('coffee', e.target.value === 'all' ? null : e.target.value)}>
            <option value="all">All coffees</option>
            {loggedCoffees.map((c) => (
              <option key={c.id} value={c.id}>
                {c.shortName}
              </option>
            ))}
          </select>
        </label>
        <div className="field">
          <span id="method-label">Method</span>
          <div role="group" aria-labelledby="method-label" className="segmented segmented--sm">
            {[{ id: 'all', name: 'All' }, ...METHODS].map((m) => (
              <button key={m.id} type="button" aria-pressed={method === m.id} onClick={() => update('method', m.id === 'all' ? null : m.id)}>
                {m.name}
              </button>
            ))}
          </div>
        </div>
        <div className="field">
          <span id="min-label">Minimum rating</span>
          <div role="group" aria-labelledby="min-label" className="segmented segmented--sm">
            {MIN_RATINGS.map((n) => (
              <button
                key={n}
                type="button"
                aria-pressed={min === n}
                onClick={() => update('min', n ? String(n) : null)}
                className="mono"
                style={{ fontWeight: 500, fontSize: 13, padding: '0 12px' }}
              >
                {n ? `${n}★+` : 'Any'}
              </button>
            ))}
          </div>
        </div>
        {recipe && (
          <button type="button" className="chip" style={{ border: 0, cursor: 'pointer' }} onClick={() => update('recipe', null)} aria-label="Clear recipe filter">
            {recipeById.get(recipe)?.shortName ?? 'Recipe'} ×
          </button>
        )}
        <span className="muted small" style={{ marginLeft: 'auto', paddingBottom: 10 }}>
          {rows.length} {rows.length === 1 ? 'brew' : 'brews'}
        </span>
      </div>

      <div className="card card--flush" style={{ overflowX: 'auto' }}>
        <table className="table" style={{ minWidth: 900 }}>
          <thead>
            <tr style={{ background: '#fbfaf8' }}>
              <th scope="col">Date</th>
              <th scope="col">Coffee</th>
              <th scope="col">Recipe</th>
              <th scope="col">Dose · water</th>
              <th scope="col">Grind</th>
              <th scope="col">Time</th>
              <th scope="col">Rating</th>
              <th scope="col">Notes · next time</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((b) => {
              const r = recipeById.get(b.recipeId);
              return (
                <tr key={b.id} style={{ verticalAlign: 'top' }}>
                  <td className="mono-sm" style={{ whiteSpace: 'nowrap', paddingLeft: 20 }}>
                    {formatDayTime(b.date)}
                  </td>
                  <td className="strong">
                    <Link to={`/coffees/${b.coffeeId}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {coffeeById.get(b.coffeeId)?.shortName}
                    </Link>
                  </td>
                  <td>
                    {r?.shortName}
                    <br />
                    <span className="label">{METHODS.find((m) => m.id === r?.methodId)?.name}</span>
                  </td>
                  <td className="mono-sm" style={{ whiteSpace: 'nowrap' }}>
                    {b.dose} · {b.water}
                  </td>
                  <td className="mono-sm" style={{ whiteSpace: 'nowrap' }}>
                    {b.clicks !== undefined ? `${b.clicks} clicks` : '—'}
                  </td>
                  <td className="mono-sm">{b.time ?? '—'}</td>
                  <td className="mono" style={{ fontWeight: 500, whiteSpace: 'nowrap', color: b.rating >= 5 ? 'var(--accent)' : 'var(--ink)' }}>
                    {b.rating} / 5
                  </td>
                  <td style={{ maxWidth: 320, paddingRight: 20 }}>
                    {b.notes ?? '—'}
                    {b.next && (
                      <>
                        <br />
                        <span className="muted" style={{ fontSize: 13 }}>
                          → {b.next}
                        </span>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 && <p className="empty">No brews match these filters.</p>}
      </div>
    </main>
  );
}
