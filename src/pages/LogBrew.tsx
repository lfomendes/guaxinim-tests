import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { daysOffRoast } from '../components/bits';
import { StarIcon } from '../components/Icons';
import { LOG_DEFAULTS, RATING_WORDS, SENSORY_SCALES } from '../data/journal';
import { METHODS } from '../data/methods';
import type { Recipe, Sensory } from '../data/types';
import { lastBrewBefore, ratio } from '../lib/derive';
import { useJournal, useLookups } from '../store';

function recipeLabel(r: Recipe) {
  const method = METHODS.find((m) => m.id === r.methodId)?.name;
  return `${method} — ${r.shortName}${r.builtIn ? '' : ' (yours)'}`;
}

/** "Comandante — 24 clicks" → { grinder: "Comandante", clicks: 24 } */
function parseGrinder(value: string): { grinder?: string; clicks?: number } {
  const clicks = value.match(/(\d+)\s*clicks?/i);
  const grinder = value.split(/[—–-]/)[0].trim();
  return { grinder: grinder || undefined, clicks: clicks ? Number(clicks[1]) : undefined };
}

export function LogBrew() {
  const { today, coffees, recipes, brews, addBrew } = useJournal();
  const { coffeeById, recipeById } = useLookups();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const shelf = coffees.filter((c) => c.status === 'active');
  const initialRecipe = recipeById.get(params.get('recipe') ?? '') ?? recipeById.get(LOG_DEFAULTS.recipeId)!;
  const fromParams = params.has('recipe');

  const [coffeeId, setCoffeeId] = useState(
    coffeeById.get(params.get('coffee') ?? '')?.id ?? LOG_DEFAULTS.coffeeId,
  );
  const [recipeId, setRecipeId] = useState(initialRecipe.id);
  const [date, setDate] = useState(LOG_DEFAULTS.date);
  const [dose, setDose] = useState(String(fromParams ? initialRecipe.dose : LOG_DEFAULTS.dose));
  const [water, setWater] = useState(String(fromParams ? initialRecipe.water : LOG_DEFAULTS.water));
  const [temp, setTemp] = useState(String(fromParams ? initialRecipe.temp : LOG_DEFAULTS.temp));
  const [grinder, setGrinder] = useState(LOG_DEFAULTS.grinder);
  const [time, setTime] = useState(params.get('time') ?? (fromParams ? initialRecipe.time : LOG_DEFAULTS.time));
  const [rating, setRating] = useState(0);
  const [sensory, setSensory] = useState<Sensory>(LOG_DEFAULTS.sensory);
  const [notes, setNotes] = useState('');
  const [next, setNext] = useState('');
  const [error, setError] = useState('');

  const coffee = coffeeById.get(coffeeId);
  const recipe = recipeById.get(recipeId)!;
  const previous = lastBrewBefore(brews, coffeeId, date);
  const days = coffee && daysOffRoast(coffee, today);

  function pickRecipe(id: string) {
    const r = recipeById.get(id);
    if (!r) return;
    setRecipeId(r.id);
    setDose(String(r.dose));
    setWater(String(r.water));
    setTemp(String(r.temp));
    setTime(r.time);
  }

  function save(e: FormEvent) {
    e.preventDefault();
    if (!rating) {
      setError('Tap a star to rate the cup — it’s the one thing the journal needs.');
      return;
    }
    const num = (v: string) => (v.trim() === '' || Number.isNaN(Number(v)) ? undefined : Number(v));
    addBrew({
      date,
      coffeeId,
      recipeId,
      dose: num(dose) ?? recipe.dose,
      water: num(water) ?? recipe.water,
      temp: num(temp),
      ...parseGrinder(grinder),
      time: time.trim() || undefined,
      rating,
      notes: notes.trim() || undefined,
      next: next.trim() || undefined,
      sensory,
    });
    navigate('/history?saved=1');
  }

  return (
    <main className="page" style={{ paddingTop: 40 }}>
      <div className="page-head__text">
        <h1 className="h1">Log a brew</h1>
        <p className="muted">Pick the coffee and recipe. Everything else is pre-filled from the recipe — change only what you did differently.</p>
      </div>

      <form className="split" onSubmit={save} noValidate>
        <div className="split__main" style={{ gap: 20 }}>
          <fieldset className="card card--lg" style={{ margin: 0, padding: '22px 24px', gap: 14 }}>
            <legend className="h2" style={{ fontSize: 18, padding: '0 6px' }}>
              1 · Coffee
            </legend>
            <div role="radiogroup" aria-label="Coffee" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
              {shelf.map((c) => {
                const d = daysOffRoast(c, today);
                return (
                  <button
                    key={c.id}
                    type="button"
                    role="radio"
                    aria-checked={c.id === coffeeId}
                    onClick={() => setCoffeeId(c.id)}
                    className="choice"
                    style={{ flexDirection: 'column', gap: 2, padding: 14, minHeight: 44, borderRadius: 12 }}
                  >
                    <span className="strong small" style={{ lineHeight: 1.3 }}>
                      {c.name}
                    </span>
                    <span className="muted" style={{ fontSize: 13 }}>
                      {c.roaster}
                      {d !== undefined ? ` · ${d} days` : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="card card--lg" style={{ margin: 0, padding: '22px 24px', gap: 14 }}>
            <legend className="h2" style={{ fontSize: 18, padding: '0 6px' }}>
              2 · Recipe
            </legend>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
              <label className="field" style={{ flex: '2 1 280px' }}>
                Recipe
                <select className="select" value={recipeId} onChange={(e) => pickRecipe(e.target.value)}>
                  {recipes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {recipeLabel(r)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field" style={{ flex: '1 1 200px' }}>
                Date &amp; time
                <input type="datetime-local" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
              </label>
            </div>
          </fieldset>

          <fieldset className="card card--lg" style={{ margin: 0, padding: '22px 24px', gap: 14 }}>
            <legend className="h2" style={{ fontSize: 18, padding: '0 6px' }}>
              3 · What you actually did
            </legend>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 14 }}>
              <label className="field">
                Coffee (g)
                <input type="number" inputMode="decimal" min="0" className="input input--mono" value={dose} onChange={(e) => setDose(e.target.value)} />
              </label>
              <label className="field">
                Water (g)
                <input type="number" inputMode="decimal" min="0" className="input input--mono" value={water} onChange={(e) => setWater(e.target.value)} />
              </label>
              <div className="field">
                Ratio
                <output className="output">{ratio(Number(dose), Number(water))}</output>
              </div>
              <label className="field">
                Water temp (°C)
                <input type="number" inputMode="numeric" className="input input--mono" value={temp} onChange={(e) => setTemp(e.target.value)} />
              </label>
              <label className="field" style={{ gridColumn: 'span 2' }}>
                Grinder &amp; setting
                <input type="text" className="input" value={grinder} onChange={(e) => setGrinder(e.target.value)} />
              </label>
              <label className="field">
                Total time
                <input type="text" className="input input--mono" value={time} onChange={(e) => setTime(e.target.value)} />
              </label>
            </div>
            {previous?.next && (
              <p className="muted" style={{ fontSize: 13 }}>
                Last time with this coffee: <strong style={{ fontWeight: 600, color: 'var(--ink)' }}>“{previous.next}”</strong>
              </p>
            )}
          </fieldset>

          <fieldset className="card card--lg" style={{ margin: 0, padding: '22px 24px', gap: 18 }}>
            <legend className="h2" style={{ fontSize: 18, padding: '0 6px' }}>
              4 · How did it taste?
            </legend>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 }}>
              <div role="radiogroup" aria-label="Rating" aria-describedby={error ? 'rating-error' : undefined} style={{ display: 'flex', gap: 4 }}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={rating === n}
                    aria-label={`${n} ${n === 1 ? 'star' : 'stars'}`}
                    onClick={() => {
                      setRating(n);
                      setError('');
                    }}
                    style={{ width: 48, height: 48, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: 0, borderRadius: 10, background: 'transparent', cursor: 'pointer' }}
                  >
                    <StarIcon size={34} filled={n <= rating} />
                  </button>
                ))}
              </div>
              <span className="strong">{RATING_WORDS[rating]}</span>
            </div>
            {error && (
              <p id="rating-error" role="alert" style={{ margin: 0, color: 'var(--accent)', fontSize: 14, fontWeight: 500 }}>
                {error}
              </p>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px 32px' }}>
              {SENSORY_SCALES.map((s) => (
                <label key={s.key} style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, fontWeight: 500 }}>
                  <span className="section-head">
                    <span>{s.name}</span>
                    <span className="mono" style={{ color: 'var(--muted)' }}>
                      {sensory[s.key]}/5
                    </span>
                  </span>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    step={1}
                    value={sensory[s.key]}
                    onChange={(e) => setSensory({ ...sensory, [s.key]: Number(e.target.value) })}
                    style={{ width: '100%', minHeight: 32, accentColor: 'var(--accent)' }}
                  />
                  <span className="section-head" style={{ fontSize: 12, fontWeight: 400, color: 'var(--muted-2)' }}>
                    <span>{s.lo}</span>
                    <span>{s.hi}</span>
                  </span>
                </label>
              ))}
            </div>
            <label className="field">
              Tasting notes
              <textarea rows={3} className="textarea" placeholder="Sweet, a bit sour at the end…" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </label>
            <label className="field">
              What to change next time
              <input type="text" className="input" placeholder="e.g. Grind 2 clicks finer" value={next} onChange={(e) => setNext(e.target.value)} />
            </label>
          </fieldset>
        </div>

        <aside className="split__side" style={{ flexBasis: 300 }}>
          <section className="card card--dark card--lg" style={{ padding: 22, gap: 14 }}>
            <p className="eyebrow">THIS BREW</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span className="h2 h2--sm" style={{ lineHeight: 1.25 }}>
                {coffee?.name}
              </span>
              <span className="muted small">{recipeLabel(recipe)}</span>
            </div>
            <dl className="facts" style={{ gap: 10 }}>
              <div>
                <dt className="label">Dose / water</dt>
                <dd>
                  {dose || '—'} g / {water || '—'} g
                </dd>
              </div>
              <div>
                <dt className="label">Ratio</dt>
                <dd>{ratio(Number(dose), Number(water))}</dd>
              </div>
              <div>
                <dt className="label">Days off roast</dt>
                <dd>{days ?? '—'}</dd>
              </div>
              <div>
                <dt className="label">Rating</dt>
                <dd>{rating ? `${rating} / 5` : '—'}</dd>
              </div>
            </dl>
            <button type="submit" className="btn btn--lg btn--save">
              Save brew
            </button>
            <Link
              to={`/guide/${recipe.id}?coffee=${coffeeId}`}
              className="btn btn--on-dark"
            >
              Open the brew guide first
            </Link>
          </section>
          <p className="muted" style={{ padding: '0 4px', fontSize: 13 }}>
            Only the coffee, recipe and rating are required. Everything else is optional — log as much or as little as you like.
          </p>
        </aside>
      </form>
    </main>
  );
}
