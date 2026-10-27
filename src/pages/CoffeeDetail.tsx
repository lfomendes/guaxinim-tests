import { Link, useParams } from 'react-router-dom';
import { daysOffRoast, Field, FreshPill, Meter } from '../components/bits';
import { PhotoIcon } from '../components/Icons';
import { SENSORY_SCALES } from '../data/journal';
import { METHODS } from '../data/methods';
import { bestBrew, bestPerMethod, formatDay, freshness } from '../lib/derive';
import { useJournal, useLookups } from '../store';
import { NotFound } from './NotFound';

export function CoffeeDetail() {
  const { id } = useParams();
  const { today, brews, recipes, setCoffeeStatus } = useJournal();
  const { coffeeById, recipeById } = useLookups();
  const coffee = id ? coffeeById.get(id) : undefined;
  if (!coffee) return <NotFound what="coffee" />;

  const mine = brews.filter((b) => b.coffeeId === coffee.id);
  const best = bestBrew(mine);
  const bestRecipe = best && recipeById.get(best.recipeId);
  const perMethod = bestPerMethod(mine, recipes);
  const days = daysOffRoast(coffee, today);
  const origin = [coffee.country, coffee.region].filter(Boolean).join(', ');

  return (
    <main className="page page--detail">
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <Link to="/coffees">My Coffees</Link> <span aria-hidden="true">/</span> {coffee.shortName}
      </nav>

      <section className="page-head" style={{ gap: 24 }}>
        <div className="page-head__text" style={{ gap: 10 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {days !== undefined && coffee.status === 'active' && (
              <FreshPill days={days}>{`${freshness(days).label} · ${days} days off roast`}</FreshPill>
            )}
            <span className="pill">{coffee.status === 'active' ? 'Active' : 'Finished'}</span>
          </div>
          <h1 className="h1 h1--detail">{coffee.name}</h1>
          <p className="lead">
            {coffee.roaster} · {origin} · {coffee.process}
          </p>
        </div>
        <div className="actions">
          <Link to={`/log?coffee=${coffee.id}`} className="btn btn--lg btn--pill btn--accent">
            Log a brew
          </Link>
          <button type="button" className="btn btn--lg btn--pill" disabled title="Editing coffees isn’t built yet">
            Edit
          </button>
          <button
            type="button"
            className="btn btn--lg btn--pill"
            onClick={() => setCoffeeStatus(coffee.id, coffee.status === 'active' ? 'finished' : 'active')}
          >
            {coffee.status === 'active' ? 'Mark as finished' : 'Move to active'}
          </button>
        </div>
      </section>

      <div className="split">
        <div className="split__main">
          {best && bestRecipe ? (
            <section className="card card--lg card--flush">
              <div style={{ padding: '22px 24px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <p className="eyebrow eyebrow--accent">THE BEST WAY TO BREW THIS COFFEE</p>
                <h2 className="h2">
                  {bestRecipe.shortName}
                  {best.clicks !== undefined ? `, ${best.grinder ?? ''} ${best.clicks} clicks` : ''}
                </h2>
                <p className="muted small">
                  Your top-rated brew out of {coffee.brewCount}. Best result per method:
                </p>
              </div>
              <div className="table-wrap">
                <table className="table" style={{ minWidth: 560 }}>
                  <thead>
                    <tr>
                      <th scope="col">Method</th>
                      <th scope="col">Recipe</th>
                      <th scope="col">Grind</th>
                      <th scope="col">Time</th>
                      <th scope="col">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...METHODS]
                      .sort((a, b) => (perMethod.get(b.id)?.rating ?? 0) - (perMethod.get(a.id)?.rating ?? 0))
                      .map((m) => {
                      const b = perMethod.get(m.id);
                      if (!b) {
                        const suggestion = recipes.find((r) => r.methodId === m.id && r.builtIn);
                        return (
                          <tr key={m.id}>
                            <th scope="row">{m.name}</th>
                            <td colSpan={4} className="muted">
                              Not brewed yet
                              {suggestion && (
                                <>
                                  {' — '}
                                  <Link to={`/recipes/${suggestion.id}`}>try {suggestion.shortName}</Link>
                                </>
                              )}
                            </td>
                          </tr>
                        );
                      }
                      const isBest = b.id === best.id;
                      return (
                        <tr key={m.id} className={isBest ? 'row--best' : undefined}>
                          <th scope="row">{m.name}</th>
                          <td>{recipeById.get(b.recipeId)?.shortName}</td>
                          <td className="mono-sm">{b.clicks !== undefined ? `${b.clicks} clicks` : '—'}</td>
                          <td className="mono-sm">{b.time ?? '—'}</td>
                          <td className="strong" style={isBest ? { color: 'var(--accent)' } : undefined}>
                            {b.rating} / 5
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          ) : (
            <section className="card card--lg">
              <h2 className="h2 h2--sm">No brews in your history yet</h2>
              <p className="muted small">
                {coffee.brewCount > 0
                  ? `You brewed this bag ${coffee.brewCount} times before your history started${coffee.bestRating ? `; the best cup got ${coffee.bestRating}★` : ''}.`
                  : 'Log a brew to start finding the best way to brew this coffee.'}
              </p>
            </section>
          )}

          {best?.sensory && (
            <section className="card card--lg" style={{ padding: '22px 24px' }}>
              <div className="section-head">
                <h2 className="h2 h2--sm">How the best cup tasted</h2>
                <span style={{ fontSize: 13, color: 'var(--muted-2)' }}>
                  {formatDay(best.date)} · {METHODS.find((m) => m.id === bestRecipe?.methodId)?.name}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px 32px' }}>
                {SENSORY_SCALES.map((s) => (
                  <div key={s.key} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div className="section-head small">
                      <span>{s.name}</span>
                      <span className="mono" style={{ color: 'var(--muted)' }}>
                        {best.sensory![s.key]}/5
                      </span>
                    </div>
                    <Meter value={best.sensory![s.key]} />
                  </div>
                ))}
              </div>
              {(best.longNotes ?? best.notes) && <p style={{ margin: 0 }}>“{best.longNotes ?? best.notes}”</p>}
            </section>
          )}

          {mine.length > 0 && (
            <section className="section section--tight">
              <div className="section-head">
                <h2 className="h2 h2--sm">All brews of this coffee</h2>
                <Link to={`/history?coffee=${coffee.id}`} className="link-strong">
                  Open in History →
                </Link>
              </div>
              <ul className="list">
                {mine.map((b) => (
                  <li key={b.id} style={{ alignItems: 'baseline', gap: '6px 20px', padding: '14px 20px' }}>
                    <span className="mono-sm" style={{ flex: '0 0 64px' }}>
                      {formatDay(b.date)}
                    </span>
                    <span className="strong" style={{ flex: '1 1 200px', minWidth: 0 }}>
                      {recipeById.get(b.recipeId)?.shortName}
                    </span>
                    <span className="mono-sm" style={{ flex: '0 0 170px', color: 'var(--muted)' }}>
                      {b.clicks !== undefined ? `${b.clicks} clicks` : '—'} · {b.time ?? '—'}
                    </span>
                    <span className="muted small" style={{ flex: '1 1 160px', minWidth: 0 }}>
                      {b.notes}
                    </span>
                    <span
                      className="mono"
                      style={{ flex: '0 0 44px', textAlign: 'right', fontWeight: 500, color: b.rating >= 5 ? 'var(--accent)' : 'var(--ink)' }}
                    >
                      {b.rating}★
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="split__side">
          <div role="img" aria-label="Photo of the bag (placeholder)" className="photo-placeholder">
            <PhotoIcon />
            [Photo of the bag]
          </div>
          <section className="card card--lg" style={{ gap: 14 }}>
            <h2 className="h3">Bag details</h2>
            <dl className="facts">
              <Field label="Roaster" value={coffee.roaster} />
              {coffee.farm && <Field label="Farm / producer" value={coffee.farm} />}
              <Field label="Country · region" value={[coffee.country, coffee.region].filter(Boolean).join(' · ')} />
              {coffee.altitude && <Field label="Altitude" value={`${coffee.altitude.toLocaleString('en-US')} m`} mono />}
              {coffee.variety && <Field label="Variety" value={coffee.variety} />}
              <Field label="Process" value={coffee.process} />
              {coffee.roastLevel && <Field label="Roast level" value={coffee.roastLevel} />}
              {coffee.roastDate && <Field label="Roast date" value={coffee.roastDate} mono />}
              {coffee.sca && <Field label="SCA score" value={coffee.sca} mono />}
              {coffee.form && <Field label="Form" value={coffee.form} />}
              {coffee.bagWeight && <Field label="Bag" value={`${coffee.bagWeight} g`} mono />}
              {coffee.price && <Field label="Price" value={coffee.price} mono />}
              {coffee.purchaseDate && <Field label="Purchased" value={coffee.purchaseDate} mono />}
            </dl>
          </section>
          {(coffee.roasterNotes || coffee.personalNotes) && (
            <section className="card card--lg" style={{ gap: 12 }}>
              {coffee.roasterNotes && (
                <>
                  <h2 className="h3">Roaster’s tasting notes</h2>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {coffee.roasterNotes.map((n) => (
                      <span key={n} className="tag">
                        {n}
                      </span>
                    ))}
                  </div>
                </>
              )}
              {coffee.personalNotes && (
                <>
                  <h2 className="h3" style={{ marginTop: 8 }}>
                    My notes
                  </h2>
                  <p className="muted small">{coffee.personalNotes}</p>
                </>
              )}
            </section>
          )}
        </aside>
      </div>
    </main>
  );
}
