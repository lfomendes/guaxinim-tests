import { Link, useParams } from 'react-router-dom';
import { PlayIcon } from '../components/Icons';
import { DIALING_IN_TIP } from '../data/journal';
import { METHODS } from '../data/methods';
import { average, bestBrew, formatRating, formatTemp, mmss, ratio, timeline, waterLabel } from '../lib/derive';
import { useJournal, useLookups } from '../store';
import { NotFound } from './NotFound';

// Timeline colours, in step order.
const SEGMENT_STYLES = [
  { background: 'var(--info-bg)', color: 'var(--info-ink)' },
  { background: 'var(--accent)', color: '#fff' },
  { background: '#c9574a', color: '#fff' },
  { background: 'var(--ink)', color: '#fff' },
  { background: 'var(--line-soft)', color: 'var(--muted)' },
];

export function RecipeDetail() {
  const { id } = useParams();
  const { brews, recipes } = useJournal();
  const { coffeeById, recipeById } = useLookups();
  const recipe = id ? recipeById.get(id) : undefined;
  if (!recipe) return <NotFound what="recipe" />;

  const method = METHODS.find((m) => m.id === recipe.methodId)!;
  const base = recipe.basedOn ? recipeById.get(recipe.basedOn) : undefined;
  const versions = recipes.filter((r) => r.basedOn === recipe.id);
  const logged = brews.filter((b) => b.recipeId === recipe.id);
  const best = bestBrew(logged);
  const avg = recipe.avgRating ?? average(logged.map((b) => b.rating));
  const segments = timeline(recipe.guide);
  const total = recipe.guide[recipe.guide.length - 1]?.at ?? 0;
  const describe = segments.map((s) => `${s.title} from ${mmss(s.start)}`).join(', ');

  return (
    <main className="page page--detail">
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <Link to={`/recipes?method=${method.id}`}>Recipes</Link> <span aria-hidden="true">/</span> {method.name}{' '}
        <span aria-hidden="true">/</span> {recipe.name}
      </nav>

      <section className="page-head" style={{ gap: 24 }}>
        <div className="page-head__text" style={{ gap: 10, maxWidth: 700 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <span className={recipe.builtIn ? 'pill' : 'pill pill--accent'}>{recipe.builtIn ? 'Built-in · read-only' : 'Yours'}</span>
            <span className="pill">
              {method.name} · {method.type}
            </span>
          </div>
          <h1 className="h1 h1--detail">{recipe.name}</h1>
          <p className="lead">
            {base ? (
              <>
                Your version of <Link to={`/recipes/${base.id}`}>{base.shortName}</Link>
              </>
            ) : (
              recipe.author
            )}
            {recipe.sourceUrl && (
              <>
                {' · '}
                <a href={recipe.sourceUrl} target="_blank" rel="noreferrer">
                  Source
                </a>
              </>
            )}
          </p>
        </div>
        <div className="actions">
          <Link to={`/guide/${recipe.id}`} className="btn btn--lg btn--pill btn--accent">
            <PlayIcon />
            Brew with guide
          </Link>
          <button type="button" className="btn btn--lg btn--pill" disabled title="Duplicating recipes isn’t built yet">
            {recipe.builtIn ? 'Duplicate & edit' : 'Edit'}
          </button>
        </div>
      </section>

      <dl className="params params--big">
        <div>
          <dt className="label">Coffee</dt>
          <dd>{recipe.dose} g</dd>
        </div>
        <div>
          <dt className="label">Water</dt>
          <dd>{waterLabel(recipe)}</dd>
        </div>
        <div>
          <dt className="label">
            Ratio <span style={{ fontSize: 11 }}>(auto)</span>
          </dt>
          <dd>{ratio(recipe.dose, recipe.water)}</dd>
        </div>
        <div>
          <dt className="label">Water temp</dt>
          <dd>{formatTemp(recipe, '°C')}</dd>
        </div>
        <div>
          <dt className="label">Grind</dt>
          <dd className="params__word">{recipe.grind}</dd>
        </div>
        <div>
          <dt className="label">Total time</dt>
          <dd>{recipe.time}</dd>
        </div>
      </dl>

      <div className="split">
        <div className="split__main" style={{ gap: 24 }}>
          {segments.length > 0 && (
            <section className="card card--lg" style={{ padding: '22px 24px', gap: 14 }}>
              <h2 className="h2 h2--sm">Brew timeline</h2>
              <div role="img" aria-label={`Timeline: ${describe}, done at ${mmss(total)}`} className="timeline">
                <div className="timeline__bar">
                  {segments.map((s, i) => (
                    <div
                      key={s.start}
                      className="timeline__seg"
                      title={s.title}
                      style={{ flex: `0 0 calc(${s.pct}% - 2px)`, ...SEGMENT_STYLES[Math.min(i, SEGMENT_STYLES.length - 1)] }}
                    >
                      {s.label}
                    </div>
                  ))}
                </div>
                <div className="timeline__marks">
                  {segments.map((s) => (
                    <span key={s.start} style={{ left: `${(s.start / total) * 100}%` }}>
                      {mmss(s.start)}
                    </span>
                  ))}
                  <span style={{ right: 0 }}>{mmss(total)}</span>
                </div>
              </div>
            </section>
          )}

          <section className="card card--lg card--flush" style={{ padding: '8px 0' }}>
            <h2 className="h2 h2--sm" style={{ padding: '14px 24px 6px' }}>
              Steps
            </h2>
            <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {recipe.steps.map((s, i) => (
                <li key={i} style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 20px', padding: '16px 24px', borderTop: '1px solid var(--line-soft)' }}>
                  <span className="mono" style={{ flex: '0 0 96px', fontSize: 14, fontWeight: 500, color: 'var(--accent)' }}>
                    {s.time}
                  </span>
                  <span style={{ flex: '1 1 320px', minWidth: 0 }}>{s.action}</span>
                  <span className="mono" style={{ flex: '0 0 80px', textAlign: 'right', fontSize: 14, fontWeight: 500 }}>
                    {s.water ?? ''}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="split__side">
          <section className="card card--lg" style={{ gap: 14 }}>
            <h2 className="h3">Your results with this recipe</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
              <div>
                <p className="label" style={{ margin: 0 }}>
                  Brews
                </p>
                <p className="mono" style={{ margin: 0, fontSize: 24 }}>
                  {recipe.uses}
                </p>
              </div>
              <div>
                <p className="label" style={{ margin: 0 }}>
                  Avg rating
                </p>
                <p className="mono" style={{ margin: 0, fontSize: 24 }}>
                  {formatRating(avg)}
                </p>
              </div>
            </div>
            {best ? (
              <p className="small" style={{ margin: 0, padding: 12, borderRadius: 10, background: 'var(--accent-tint-2)' }}>
                Best: <strong className="strong">{coffeeById.get(best.coffeeId)?.shortName}</strong>, {best.rating}★
                {best.clicks !== undefined ? ` at ${best.grinder ?? ''} ${best.clicks} clicks` : ''}
                {best.time ? `, ${best.time}` : ''}.
              </p>
            ) : (
              <p className="muted small">You haven’t logged a brew with this recipe yet.</p>
            )}
            {recipe.uses > 0 && (
              <Link to={`/history?recipe=${recipe.id}`} className="link-strong">
                See your brews →
              </Link>
            )}
          </section>

          <section className="card card--lg card--info" style={{ gap: 8 }}>
            <h2 className="h3">Dialing it in</h2>
            <p className="small" style={{ margin: 0 }}>
              {DIALING_IN_TIP}
            </p>
          </section>

          {versions.length > 0 && (
            <section className="card card--lg" style={{ gap: 10 }}>
              <h2 className="h3">Your versions</h2>
              {versions.map((v) => (
                <Link
                  key={v.id}
                  to={`/recipes/${v.id}`}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 8,
                    minHeight: 44,
                    padding: '0 12px',
                    borderRadius: 10,
                    background: 'var(--bg)',
                    color: 'var(--ink)',
                    textDecoration: 'none',
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                >
                  {v.name}
                  <span className="mono" style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                    {v.temp}°{v.grindSetting ? ` · ${v.grindSetting.replace(/^\S+\s/, '')}` : ''}
                  </span>
                </Link>
              ))}
            </section>
          )}
        </aside>
      </div>
    </main>
  );
}
