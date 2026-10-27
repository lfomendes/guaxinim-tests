import { Link, useSearchParams } from 'react-router-dom';
import { MethodIcon, PlayIcon, PlusIcon } from '../components/Icons';
import { METHODS } from '../data/methods';
import type { MethodId } from '../data/types';
import { formatTemp, ratio, waterLabel } from '../lib/derive';
import { useJournal, useLookups } from '../store';

export function Recipes() {
  const { recipes } = useJournal();
  const { recipeById } = useLookups();
  const [params, setParams] = useSearchParams();
  const method = METHODS.find((m) => m.id === params.get('method')) ?? METHODS[0];
  const list = recipes.filter((r) => r.methodId === method.id);

  const pick = (id: MethodId) => setParams({ method: id }, { replace: true });

  return (
    <main className="page" style={{ gap: 32 }}>
      <div className="page-head">
        <div className="page-head__text" style={{ maxWidth: 640 }}>
          <h1 className="h1">Methods &amp; Recipes</h1>
          <p className="muted">
            Start from a proven recipe, then duplicate it and make it yours. Built-in recipes stay read-only so you can always go back to the original.
          </p>
        </div>
        <button type="button" className="btn btn--lg btn--pill btn--ink" disabled title="Creating recipes isn’t built yet">
          <PlusIcon />
          New recipe
        </button>
      </div>

      <div role="tablist" aria-label="Brewing method" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        {METHODS.map((m) => {
          const ofMethod = recipes.filter((r) => r.methodId === m.id);
          const builtIn = ofMethod.filter((r) => r.builtIn).length;
          const yours = ofMethod.length - builtIn;
          return (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={m.id === method.id}
              onClick={() => pick(m.id)}
              className="choice"
              style={{ gap: 16, alignItems: 'flex-start', padding: 20 }}
            >
              <span
                aria-hidden="true"
                style={{ flex: 'none', width: 52, height: 52, borderRadius: 12, background: 'var(--chip)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <MethodIcon method={m.id} />
              </span>
              <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span className="h2 h2--sm">{m.name}</span>
                <span className="muted" style={{ fontSize: 13 }}>
                  {m.type} · {m.filter} filter
                </span>
                <span className="muted" style={{ fontSize: 13 }}>
                  {builtIn} built-in{yours ? ` · ${yours} yours` : ''}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <section className="section" role="tabpanel" aria-label={`${method.name} recipes`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <h2 className="h2" style={{ fontSize: 26 }}>
            {method.name} recipes
          </h2>
          <p className="muted small">{method.description}</p>
        </div>
        <div className="grid-cards">
          {list.map((r) => {
            const base = r.basedOn ? recipeById.get(r.basedOn) : undefined;
            return (
              <article key={r.id} className="card">
                <div className="section-head" style={{ alignItems: 'center' }}>
                  <span className={r.builtIn ? 'pill' : 'pill pill--accent'}>{r.builtIn ? 'Built-in' : 'Yours'}</span>
                  <span className="muted" style={{ fontSize: 13 }}>
                    {r.uses ? `Used ${r.uses}×` : 'Not used yet'}
                  </span>
                </div>
                <Link to={`/recipes/${r.id}`} style={{ display: 'flex', flexDirection: 'column', gap: 2, textDecoration: 'none', color: 'var(--ink)' }}>
                  <span className="h2 h2--sm" style={{ lineHeight: 1.25 }}>
                    {r.name}
                  </span>
                  <span className="muted small">
                    {base ? `Based on ${base.shortName}${r.grindSetting ? ` · ${r.grindSetting}` : ''}` : r.author}
                  </span>
                </Link>
                <dl className="params">
                  <div>
                    <dt className="label">Dose</dt>
                    <dd>{r.dose} g</dd>
                  </div>
                  <div>
                    <dt className="label">Water</dt>
                    <dd>{waterLabel(r)}</dd>
                  </div>
                  <div>
                    <dt className="label">Ratio</dt>
                    <dd>{ratio(r.dose, r.water)}</dd>
                  </div>
                  <div>
                    <dt className="label">Temp</dt>
                    <dd>{formatTemp(r, '°')}</dd>
                  </div>
                  <div>
                    <dt className="label">Grind</dt>
                    <dd className="params__word">{r.grind}</dd>
                  </div>
                  <div>
                    <dt className="label">Time</dt>
                    <dd>{r.time}</dd>
                  </div>
                </dl>
                <div className="actions" style={{ gap: 8, marginTop: 'auto' }}>
                  <Link to={`/guide/${r.id}`} className="btn btn--accent">
                    <PlayIcon />
                    Brew with guide
                  </Link>
                  <Link to={`/recipes/${r.id}`} className="btn">
                    View steps
                  </Link>
                  <button type="button" className="btn" disabled title={r.builtIn ? 'Duplicating recipes isn’t built yet' : 'Editing recipes isn’t built yet'}>
                    {r.builtIn ? 'Duplicate' : 'Edit'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
