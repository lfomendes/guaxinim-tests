import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { CloseIcon, ResetIcon, SkipIcon } from '../components/Icons';
import { METHODS } from '../data/methods';
import { mmss, ratio, waterLabel } from '../lib/derive';
import { useJournal, useLookups } from '../store';
import { NotFound } from './NotFound';

export function BrewGuide() {
  const { id } = useParams();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { coffees } = useJournal();
  const { coffeeById, recipeById } = useLookups();
  const recipe = id ? recipeById.get(id) : undefined;

  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  // ?speed=10 runs the clock ten times faster, for trying the guide out.
  const tick = 1000 / Math.max(1, Number(params.get('speed')) || 1);
  const steps = recipe?.guide ?? [];
  const total = steps[steps.length - 1]?.at ?? 0;

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setElapsed((t) => Math.min(t + 1, total)), tick);
    return () => clearInterval(timer);
  }, [running, tick, total]);

  useEffect(() => {
    if (elapsed >= total) setRunning(false);
  }, [elapsed, total]);

  if (!recipe) {
    return (
      <div className="app">
        <NotFound what="recipe" />
      </div>
    );
  }

  // Go back to where the guide was opened from, or to the recipe when opened directly.
  const close = () => ((window.history.state?.idx ?? 0) > 0 ? navigate(-1) : navigate(`/recipes/${recipe.id}`));
  const shelf = coffees.filter((c) => c.status === 'active');
  const coffeeId = coffeeById.get(params.get('coffee') ?? '')?.id ?? shelf[0]?.id ?? '';
  const method = METHODS.find((m) => m.id === recipe.methodId);

  let idx = 0;
  steps.forEach((s, i) => {
    if (s.at <= elapsed) idx = i;
  });
  const current = steps[idx];
  const next = steps[idx + 1];
  const done = elapsed >= total;

  return (
    <div className="guide-bg">
      <main className="guide">
        <div className="guide__top">
          <button type="button" className="guide__btn" aria-label="Close brew guide" onClick={close}>
            <CloseIcon />
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <span className="guide__meta">
              {method?.name} · {recipe.dose} g · {waterLabel(recipe)} · {ratio(recipe.dose, recipe.water)}
            </span>
            <span className="guide__title">{recipe.shortName}</span>
          </div>
        </div>

        <label className="guide__coffee">
          <span className="guide__dot" />
          <span style={{ color: 'var(--dark-muted)' }}>Brewing</span>
          <select
            value={coffeeId}
            onChange={(e) => {
              const next = new URLSearchParams(params);
              next.set('coffee', e.target.value);
              setParams(next, { replace: true });
            }}
          >
            {shelf.map((c) => (
              <option key={c.id} value={c.id}>
                {c.shortName}
              </option>
            ))}
          </select>
        </label>

        <div className="guide__clock">
          <span className="guide__clock-time" role="timer" aria-label={`Elapsed ${mmss(elapsed)}`}>
            {mmss(elapsed)}
          </span>
          <span style={{ fontSize: 14, color: 'var(--dark-muted)' }}>
            {done ? 'Total brew time' : next ? `Next: ${next.title} in ${mmss(next.at - elapsed)}` : ''}
          </span>
        </div>

        <div className="guide__progress" aria-hidden="true">
          <div style={{ width: `${total ? Math.min(100, (elapsed / total) * 100) : 0}%` }} />
        </div>

        <section aria-live="polite" className="guide__step">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
            <span className="eyebrow eyebrow--accent">
              STEP {idx + 1} OF {steps.length}
            </span>
            <span className="mono-sm" style={{ color: 'var(--muted)' }}>
              {mmss(current.at)}
            </span>
          </div>
          <h1>{current.title}</h1>
          <p style={{ margin: 0, color: 'var(--ink-2)' }}>{current.detail}</p>
          {current.target && (
            <div className="guide__target">
              <span style={{ fontSize: 13, color: 'var(--muted)' }}>Scale target</span>
              <span className="mono" style={{ fontSize: 34, fontWeight: 500, marginLeft: 'auto' }}>
                {current.target}
              </span>
            </div>
          )}
        </section>

        <ol className="guide__upcoming" aria-label="Coming up">
          {steps.slice(idx + 1, idx + 4).map((s) => (
            <li key={s.at}>
              <span className="mono-sm" style={{ flex: '0 0 44px' }}>
                {mmss(s.at)}
              </span>
              <span style={{ flex: '1 1 auto' }}>{s.title}</span>
              <span className="mono-sm">{s.target ?? ''}</span>
            </li>
          ))}
        </ol>

        {done ? (
          <div className="guide__controls">
            <button type="button" className="guide__btn guide__btn--lg" aria-label="Start over" onClick={() => setElapsed(0)}>
              <ResetIcon />
            </button>
            <Link to={`/log?coffee=${coffeeId}&recipe=${recipe.id}&time=${mmss(elapsed)}`} className="guide__primary">
              Rate this cup
            </Link>
          </div>
        ) : (
          <div className="guide__controls">
            <button
              type="button"
              className="guide__btn guide__btn--lg"
              aria-label="Reset timer"
              onClick={() => {
                setRunning(false);
                setElapsed(0);
              }}
            >
              <ResetIcon />
            </button>
            <button type="button" className="guide__primary" onClick={() => setRunning((r) => !r)}>
              {running ? 'Pause' : elapsed > 0 ? 'Resume' : 'Start'}
            </button>
            <button
              type="button"
              className="guide__btn guide__btn--lg"
              aria-label="Skip to next step"
              onClick={() => next && setElapsed(next.at)}
            >
              <SkipIcon />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
