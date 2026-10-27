import { Link } from 'react-router-dom';
import { daysOffRoast, FreshPill, Stars } from '../components/bits';
import { ClockIcon, TimerIcon } from '../components/Icons';
import { METHODS } from '../data/methods';
import { bestBrew, formatClock, formatDay, formatLongDate, formatRelativeDay, freshness, freshnessPct, ratio } from '../lib/derive';
import { useJournal, useLookups } from '../store';

export function Journal() {
  const { today, coffees, brews, stats } = useJournal();
  const { coffeeById, recipeById } = useLookups();

  const shelf = coffees.filter((c) => c.status === 'active');
  const recent = brews.slice(0, 4);
  const last = brews[0];
  const best = bestBrew(brews);
  const bestCoffee = best && coffeeById.get(best.coffeeId);
  const bestRecipe = best && recipeById.get(best.recipeId);
  const resting = shelf
    .map((c) => ({ coffee: c, days: daysOffRoast(c, today) }))
    .filter((x): x is { coffee: typeof x.coffee; days: number } => x.days !== undefined && freshness(x.days).kind === 'resting');

  return (
    <main className="page page--home">
      <section className="page-head">
        <div className="page-head__text page-head__text--hero">
          <p className="eyebrow" style={{ fontSize: 13 }}>
            {formatLongDate(today)}
          </p>
          <h1 className="h1 h1--hero">Good morning. What’s in the cup today?</h1>
          <p className="lead">
            Pick a bag, pick a recipe, write down how it tasted. Your journal remembers the rest — and tells you how to repeat the good cups.
          </p>
        </div>
        <div className="actions">
          <Link to="/log" className="btn btn--lg btn--pill btn--ink">
            Log a brew
          </Link>
          <Link to={last ? `/guide/${last.recipeId}?coffee=${last.coffeeId}` : '/recipes'} className="btn btn--lg btn--pill">
            <TimerIcon />
            Start a brew guide
          </Link>
        </div>
      </section>

      <dl aria-label="This month" className="stat-strip">
        <div>
          <dt>Brews this month</dt>
          <dd>{stats.brews}</dd>
        </div>
        <div>
          <dt>Bags on the shelf</dt>
          <dd>{stats.bagsOnShelf}</dd>
        </div>
        <div>
          <dt>Average rating</dt>
          <dd>
            {stats.avgRating}
            <span className="stat-unit"> / 5</span>
          </dd>
        </div>
        <div>
          <dt>Most-used method</dt>
          <dd className="stat-word">{stats.mostUsedMethod}</dd>
        </div>
      </dl>

      <div className="split" style={{ gap: 32 }}>
        <div className="split__main" style={{ flexBasis: 560, gap: 44 }}>
          <section className="section">
            <div className="section-head">
              <h2 className="h2">On the shelf</h2>
              <Link to="/coffees" className="link-strong">
                All coffees →
              </Link>
            </div>
            <div className="grid-cards grid-cards--sm">
              {shelf.map((c) => {
                const days = daysOffRoast(c, today);
                return (
                  <article key={c.id} className="card" style={{ padding: 20, gap: 14 }}>
                    {days !== undefined && (
                      <div className="section-head" style={{ alignItems: 'center' }}>
                        <FreshPill days={days} />
                        <span className="mono" style={{ fontSize: 12, color: 'var(--muted-2)' }}>
                          {days}d off roast
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="h2" style={{ fontSize: 18, lineHeight: 1.25 }}>
                        <Link to={`/coffees/${c.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                          {c.name}
                        </Link>
                      </h3>
                      <p className="muted small">{c.roaster}</p>
                    </div>
                    <p className="muted" style={{ fontSize: 13 }}>
                      {[c.country, c.region].filter(Boolean).join(', ')} · {c.process}
                    </p>
                    {days !== undefined && (
                      <div className={`bar bar--${freshness(days).kind}`} aria-hidden="true">
                        <div style={{ width: `${freshnessPct(days)}%` }} />
                      </div>
                    )}
                    {c.roasterNotes && (
                      <p style={{ margin: 0, fontSize: 13 }}>{c.roasterNotes.join(', ')}</p>
                    )}
                    <Link to={`/log?coffee=${c.id}`} className="btn" style={{ marginTop: 'auto' }}>
                      Brew this
                    </Link>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="section">
            <div className="section-head">
              <h2 className="h2">Recent brews</h2>
              <Link to="/history" className="link-strong">
                Full history →
              </Link>
            </div>
            <ul className="list">
              {recent.map((b) => {
                const recipe = recipeById.get(b.recipeId);
                return (
                  <li key={b.id} style={{ padding: '18px 20px' }}>
                    <div style={{ flex: '0 0 96px', display: 'flex', flexDirection: 'column' }}>
                      <span className="mono-sm strong" style={{ fontWeight: 500 }}>
                        {formatRelativeDay(b.date, today)}
                      </span>
                      <span className="mono" style={{ fontSize: 12, color: 'var(--muted-2)' }}>
                        {formatClock(b.date)}
                      </span>
                    </div>
                    <div style={{ flex: '1 1 260px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span className="strong">{coffeeById.get(b.coffeeId)?.shortName}</span>
                      <span className="muted small">
                        {recipe?.shortName} ·{' '}
                        <span className="mono-sm">
                          {b.dose}g · {b.water}g{b.time ? ` · ${b.time}` : ''}
                        </span>
                      </span>
                      {b.notes && <span className="small">“{b.notes}”</span>}
                      {b.next && (
                        <span className="muted" style={{ fontSize: 13 }}>
                          <strong style={{ color: 'var(--ink)', fontWeight: 600 }}>Next time:</strong> {b.next}
                        </span>
                      )}
                    </div>
                    <div style={{ paddingTop: 2 }}>
                      <Stars rating={b.rating} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        <aside className="split__side" style={{ flexBasis: 300 }}>
          {best && bestCoffee && bestRecipe && (
            <section className="card card--dark">
              <p className="eyebrow">BEST CUP SO FAR</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <h2 className="h2" style={{ fontSize: 22, lineHeight: 1.2 }}>
                  {bestCoffee.name}
                </h2>
                <p className="muted small">
                  {bestRecipe.shortName} · {formatDay(best.date)}
                </p>
              </div>
              <dl className="facts" style={{ gap: 12 }}>
                <div>
                  <dt className="label">Dose / water</dt>
                  <dd>
                    {best.dose} g / {best.water} g
                  </dd>
                </div>
                <div>
                  <dt className="label">Ratio</dt>
                  <dd>{ratio(best.dose, best.water)}</dd>
                </div>
                <div>
                  <dt className="label">Grind</dt>
                  <dd>
                    {best.grinder} {best.clicks}
                  </dd>
                </div>
                <div>
                  <dt className="label">Time</dt>
                  <dd>{best.time ?? '—'}</dd>
                </div>
              </dl>
              <Link to={`/guide/${bestRecipe.id}?coffee=${bestCoffee.id}`} className="btn btn--light">
                Brew it again
              </Link>
            </section>
          )}

          {resting.map(({ coffee, days }) => (
            <section key={coffee.id} className="card card--info" style={{ flexDirection: 'row', gap: 14, padding: '20px 22px' }}>
              <ClockIcon className="info-icon" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <h2 className="h3">Still resting</h2>
                <p className="small" style={{ margin: 0 }}>
                  {coffee.shortName} was roasted {days} {days === 1 ? 'day' : 'days'} ago. Give it a few more days before you judge it.
                </p>
              </div>
            </section>
          ))}

          <section className="card" style={{ padding: '20px 22px', gap: 10 }}>
            <h2 className="h3">Your brewers</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {METHODS.map((m) => (
                <Link key={m.id} to={`/recipes?method=${m.id}`} className="chip">
                  {m.name}
                </Link>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
