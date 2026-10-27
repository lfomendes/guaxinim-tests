import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { daysOffRoast, Field, FreshPill } from '../components/bits';
import { PencilIcon, PlusIcon, SearchIcon } from '../components/Icons';
import { METHODS } from '../data/methods';
import type { Coffee } from '../data/types';
import { bestBrew, formatDay, freshness } from '../lib/derive';
import { useJournal, useLookups } from '../store';

type StatusFilter = 'active' | 'finished' | 'all';
type Sort = 'roast' | 'rating' | 'purchase';

const PROCESSES = ['Washed', 'Natural', 'Pulped natural', 'Honey', 'Anaerobic'];

export function Coffees() {
  const { today, coffees, brews, setCoffeeStatus } = useJournal();
  const { recipeById } = useLookups();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<StatusFilter>('active');
  const [process, setProcess] = useState('any');
  const [sort, setSort] = useState<Sort>('roast');

  // Best rating and the method it was reached with, per coffee.
  const bestOf = useMemo(() => {
    const out = new Map<string, { rating: number; label: string }>();
    for (const c of coffees) {
      const best = bestBrew(brews.filter((b) => b.coffeeId === c.id));
      const method = best && recipeById.get(best.recipeId)?.methodId;
      if (best) out.set(c.id, { rating: best.rating, label: `${best.rating}★ ${methodName(method)}` });
      else if (c.bestRating) out.set(c.id, { rating: c.bestRating, label: `${c.bestRating}★` });
    }
    return out;
  }, [coffees, brews, recipeById]);

  const q = query.trim().toLowerCase();
  const matches = (c: Coffee) =>
    (process === 'any' || c.process === process) &&
    (!q || [c.name, c.roaster, c.country, c.region, c.farm].some((v) => v?.toLowerCase().includes(q)));

  const active = coffees
    .filter((c) => c.status === 'active' && matches(c))
    .sort((a, b) => {
      if (sort === 'rating') return (bestOf.get(b.id)?.rating ?? 0) - (bestOf.get(a.id)?.rating ?? 0);
      // Oldest roast first (drink it before it fades); newest purchase first.
      if (sort === 'roast') return (a.roastDate ?? '9999').localeCompare(b.roastDate ?? '9999');
      return (b.purchaseDate ?? '').localeCompare(a.purchaseDate ?? '');
    });
  const finished = coffees.filter((c) => c.status === 'finished' && matches(c));
  const counts = {
    active: coffees.filter((c) => c.status === 'active').length,
    finished: coffees.filter((c) => c.status === 'finished').length,
  };

  const showActive = status !== 'finished';
  const showFinished = status !== 'active';

  return (
    <main className="page">
      <div className="page-head">
        <div className="page-head__text">
          <h1 className="h1">My Coffees</h1>
          <p className="muted">Every bag you’ve bought, with how fresh it is and how it brewed.</p>
        </div>
        <button type="button" className="btn btn--lg btn--pill btn--ink" disabled title="Adding coffees isn’t built yet">
          <PlusIcon />
          Add a coffee
        </button>
      </div>

      <div className="toolbar">
        <label className="search">
          <SearchIcon />
          <span className="sr-only">Search coffees</span>
          <input type="search" placeholder="Search name, roaster, origin…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
        <div role="group" aria-label="Status" className="segmented">
          {(
            [
              ['active', `Active · ${counts.active}`],
              ['finished', `Finished · ${counts.finished}`],
              ['all', 'All'],
            ] as const
          ).map(([value, label]) => (
            <button key={value} type="button" aria-pressed={status === value} onClick={() => setStatus(value)}>
              {label}
            </button>
          ))}
        </div>
        <label className="inline-field">
          Process
          <select className="select select--sm" value={process} onChange={(e) => setProcess(e.target.value)}>
            <option value="any">Any</option>
            {PROCESSES.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>
        <label className="inline-field">
          Sort
          <select className="select select--sm" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
            <option value="roast">Roast date</option>
            <option value="rating">Best rating</option>
            <option value="purchase">Purchase date</option>
          </select>
        </label>
      </div>

      {showActive && (
        <div className="grid-cards">
          {active.map((c) => {
            const days = daysOffRoast(c, today);
            const best = bestOf.get(c.id);
            return (
              <article key={c.id} className="card">
                <div className="section-head" style={{ alignItems: 'center' }}>
                  {days !== undefined ? (
                    <FreshPill days={days}>
                      {`${freshness(days).label} · ${days} days off roast`}
                    </FreshPill>
                  ) : (
                    <span className="pill">Roast date unknown</span>
                  )}
                  <button type="button" className="btn btn--icon" aria-label="Edit coffee" disabled title="Editing coffees isn’t built yet">
                    <PencilIcon />
                  </button>
                </div>
                <Link to={`/coffees/${c.id}`} style={{ display: 'flex', flexDirection: 'column', gap: 2, textDecoration: 'none', color: 'var(--ink)' }}>
                  <span className="h2 h2--sm" style={{ lineHeight: 1.25 }}>
                    {c.name}
                  </span>
                  <span className="muted small">{c.roaster}</span>
                </Link>
                <dl className="facts facts--3">
                  <Field label="Origin" value={c.country} />
                  <Field label="Process" value={c.process} />
                  <Field label="Variety" value={c.variety ?? '—'} />
                  <Field label="Roast" value={c.roastLevel ?? '—'} />
                  <Field label="Roasted" value={c.roastDate ? formatDay(c.roastDate) : '—'} mono />
                  <Field label="SCA" value={c.sca ?? '—'} mono />
                </dl>
                {c.roasterNotes && (
                  <p className="note-box">
                    <span style={{ color: 'var(--muted-2)' }}>On the bag: </span>
                    {c.roasterNotes.join(', ')}
                  </p>
                )}
                <div className="section-head" style={{ alignItems: 'center', borderTop: '1px solid var(--line-soft)', paddingTop: 14, marginTop: 'auto' }}>
                  <span className="muted" style={{ fontSize: 13 }}>
                    {c.brewCount} {c.brewCount === 1 ? 'brew' : 'brews'}
                    {best ? ` · best ${best.label}` : ''}
                  </span>
                  <Link to={`/log?coffee=${c.id}`} className="btn btn--accent">
                    Log a brew
                  </Link>
                </div>
              </article>
            );
          })}
          {active.length === 0 && <p className="empty">No active bags match.</p>}
        </div>
      )}

      {showFinished && (
        <section className="section section--tight">
          <h2 className="h2 h2--sm">Finished bags</h2>
          {finished.length === 0 ? (
            <p className="empty list">No finished bags match.</p>
          ) : (
            <ul className="list">
              {finished.map((f) => (
                <li key={f.id} style={{ alignItems: 'center', gap: '8px 24px', padding: '14px 20px' }}>
                  <Link to={`/coffees/${f.id}`} style={{ flex: '1 1 260px', minWidth: 0, textDecoration: 'none', color: 'var(--ink)', fontWeight: 600 }}>
                    {f.name} <span style={{ fontWeight: 400, color: 'var(--muted)' }}>· {f.roaster}</span>
                  </Link>
                  <span className="muted small" style={{ flex: '0 0 180px' }}>
                    {f.country} · {f.process}
                  </span>
                  <span className="mono-sm" style={{ flex: '0 0 140px', color: 'var(--muted)' }}>
                    {f.brewCount} brews{bestOf.get(f.id) ? ` · ★ ${bestOf.get(f.id)!.rating}` : ''}
                  </span>
                  <button type="button" className="btn" style={{ minHeight: 40, fontWeight: 500 }} onClick={() => setCoffeeStatus(f.id, 'active')}>
                    Move to active
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </main>
  );
}

function methodName(id: string | undefined) {
  return METHODS.find((m) => m.id === id)?.name ?? '';
}
