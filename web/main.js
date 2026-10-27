// Coffee Nerds, page script. Everything it touches is already in the HTML; without it the page
// still reads, the brew guide shows the Kasuya 4:6 at 20 g and the slider is a plain range input.

// ---------- reveal once, as each part enters ----------
(() => {
  const targets = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window)) { targets.forEach((el) => el.classList.add('is-in')); return; }
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
  targets.forEach((el) => io.observe(el));
  // safety net: anything in view that the observer missed is shown
  window.addEventListener('load', () => setTimeout(() => {
    targets.forEach((el) => { const r = el.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) el.classList.add('is-in'); });
  }, 2000));
})();

// ---------- the footage: a muted loop that rests off screen and under reduced motion ----------
(() => {
  const v = document.querySelector('[data-loop]');
  if (!v) return;
  const still = matchMedia('(prefers-reduced-motion: reduce)');
  if (still.matches) { v.removeAttribute('autoplay'); v.pause(); return; }
  // the film opens on a title and ends on a credit: loop the bloom, the drawdown and the cup (34–57 s)
  const FROM = 34, TO = 57;
  const into = () => { if (v.duration > TO && (v.currentTime < FROM - 1 || v.currentTime >= TO)) v.currentTime = FROM; };
  v.addEventListener('loadedmetadata', into);
  v.addEventListener('timeupdate', into);
  if (v.readyState >= 1) into();
  if (!('IntersectionObserver' in window)) return;
  new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); }).observe(v);
})();

// ---------- the brew guide ----------
// Recipes as published (PROJECT.md §8). Targets are scale readings at the recipe's own dose; the
// guide scales every target by dose / recipe dose, so the ratio holds.
const METHODS = {
  V60: 'V60: conical dripper with spiral ribs and a paper filter. Clean, bright cups; sensitive to pour technique.',
  'French Press': 'French Press: full immersion with a metal mesh plunger. Heavy body and very forgiving.',
  AeroPress: 'AeroPress: immersion with a gentle press. Fast, versatile, travels well.',
};
const RECIPES = {
  'hoffmann-v60': {
    name: 'Hoffmann V60', method: 'V60', dose: 30, water: 500, ratio: '1:16.7', temp: 'about 100 °C', grind: 'medium-fine', total: '3:30',
    steps: [
      [0, 'Bloom: pour {t} (twice the dose), then swirl so every ground is wet.', 60],
      [45, 'Pour in circles: a steady spiral pour until the scale reads {t}.', 300],
      [75, 'Pour gently: a slower, lower pour up to {t}.', 500],
      [105, 'Stir and swirl: stir once gently with a spoon, then a gentle swirl to flatten the bed.', null],
      [120, 'Drawdown: hands off. Let it drain; aim to finish around 3:30.', null],
      [210, 'Done: pull the dripper. Taste it, then rate it while it’s fresh.', null],
    ],
  },
  'kasuya-46': {
    name: 'Kasuya 4:6', method: 'V60', dose: 20, water: 300, ratio: '1:15', temp: '93 °C', grind: 'medium-coarse', total: '3:30',
    steps: [
      [0, 'First pour. It sets sweetness against acidity.', 60],
      [40, 'Second pour. The 40% phase ends.', 120],
      [80, 'Third pour. The 60% phase sets strength.', 180],
      [120, 'Fourth pour.', 240],
      [150, 'Last pour.', 300],
      [210, 'Remove the dripper.', null],
    ],
  },
  'hoffmann-press': {
    name: 'Hoffmann press', method: 'French Press', dose: 30, water: 500, ratio: '1:16.7', temp: 'about 100 °C', grind: 'medium', total: '9:00 or more',
    steps: [
      [0, 'Add the coffee and pour all the water. Don’t stir.', 500],
      [240, 'Break the crust, stir gently, skim the foam.', null],
      [540, 'Plunger to the surface only, then pour slowly.', null],
    ],
  },
  stumptown: {
    name: 'Stumptown', method: 'French Press', dose: 56, water: 850, ratio: '1:15', temp: '96 °C', grind: 'coarse', total: '4:00',
    steps: [
      [0, 'Pour, making sure all the grounds are wet.', 450],
      [60, 'Stir the grounds in, top up and put the lid on.', 850],
      [240, 'Press all the way down and pour it all out.', null],
    ],
  },
  'hoffmann-aero': {
    name: 'Hoffmann Aero', method: 'AeroPress', dose: 11, water: 200, ratio: '1:18', temp: 'about 100 °C', grind: 'fine-medium', total: '3:00',
    steps: [
      [0, 'Pour quickly, then set the plunger in 1 cm.', 200],
      [120, 'Hold brewer and plunger, swirl gently.', null],
      [150, 'Press gently for about 30 seconds.', null],
      [180, 'Done.', null],
    ],
  },
  'van-bunnik': {
    name: 'Van Bunnik', method: 'AeroPress', dose: 30, water: 220, brew: 100, ratio: '1:7.3', temp: '92 °C', grind: 'coarse', total: '1:30',
    steps: [
      [0, 'Inverted. Pour the brew water.', 100],
      [0, 'Stir hard, about 20 times, for 20 seconds.', null],
      [20, 'Cap on with a rinsed filter, push out the air.', null],
      [40, 'Flip onto the server and press.', null],
      [90, 'Add the bypass water, cool to about 60 °C.', 220],
    ],
  },
};

(() => {
  const root = document.querySelector('#brew');
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const select = $('[data-recipe-select]'), range = $('[data-dose]'), out = $('[data-dose-out]');
  const waterEl = $('[data-dose-water]'), facts = $('[data-facts]'), body = $('[data-steps]');
  const clock = $('[data-clock]'), startBtn = $('[data-start]'), resetBtn = $('[data-reset]');
  const word = $('[data-dose-word]'), announce = $('[data-announce]'), method = $('[data-method]');

  let recipe = RECIPES[select.value];
  let t0 = 0, elapsed = 0, timer = null, current = -1;

  const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  function render() {
    const dose = +range.value;
    const k = dose / recipe.dose;
    const water = Math.round(recipe.water * k);
    out.textContent = `${dose} g`;
    word.textContent = String(dose);
    range.setAttribute('aria-valuetext', `${dose} grams`);
    const brewNote = recipe.brew ? `, ${Math.round(recipe.brew * k)} g to brew` : '';
    waterEl.textContent = `Water ${water} g${brewNote} · ratio ${recipe.ratio}`;
    method.textContent = METHODS[recipe.method];
    facts.textContent = `Water ${water} g · ${recipe.ratio} · ${recipe.temp} · ${recipe.grind} grind · about ${recipe.total}`;
    body.replaceChildren(...recipe.steps.map(([at, text, target]) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td class="nums">${mmss(at)}</td><td></td><td class="num nums">${target == null ? '—' : Math.round(target * k) + ' g'}</td>`;
      tr.children[1].textContent = text.replace('{t}', `${Math.round(target * k)}\u00a0g`);
      return tr;
    }));
    paint();
  }

  function paint() {
    clock.textContent = mmss(elapsed);
    const rows = [...body.children];
    let now = -1;
    if (timer || elapsed > 0) recipe.steps.forEach(([at], i) => { if (elapsed >= at) now = i; });
    rows.forEach((tr, i) => { tr.classList.toggle('is-now', i === now); tr.classList.toggle('is-done', i < now); });
    if (now !== current && now >= 0 && timer) {
      const [, text, target] = recipe.steps[now];
      const k = +range.value / recipe.dose;
      announce.textContent = `${mmss(recipe.steps[now][0])}. ${text.replace('{t}', `${Math.round(target * k)} grams`)}${target == null ? '' : ` Scale at ${Math.round(target * k)} grams.`}`;
    }
    current = now;
  }

  function tick() { elapsed = (performance.now() - t0) / 1000; paint(); }
  function start() {
    if (timer) { clearInterval(timer); timer = null; startBtn.textContent = 'Resume'; return; }
    t0 = performance.now() - elapsed * 1000;
    timer = setInterval(tick, 250);
    startBtn.textContent = 'Pause';
    tick();
  }
  function reset() { clearInterval(timer); timer = null; elapsed = 0; current = -1; startBtn.textContent = 'Start'; announce.textContent = ''; paint(); }

  function choose(id, dose) {
    recipe = RECIPES[id];
    select.value = id;
    range.min = String(Math.max(5, Math.round(recipe.dose * 0.5)));
    range.max = String(Math.round(recipe.dose * 2));
    range.value = String(dose ?? recipe.dose);
    reset();
    render();
  }

  select.addEventListener('change', () => choose(select.value));
  range.addEventListener('input', render);
  startBtn.addEventListener('click', start);
  resetBtn.addEventListener('click', reset);

  // the six poster lines open their recipe here
  document.querySelectorAll('[data-pick]').forEach((b) => b.addEventListener('click', () => {
    choose(b.dataset.pick);
    root.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    setTimeout(() => range.focus({ preventScroll: true }), 500);
  }));

  choose('hoffmann-v60', 30);
})();

// ---------- the sign-up sentence (not wired to a backend yet) ----------
(() => {
  const form = document.querySelector('[data-signup]');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const note = form.querySelector('[data-cta-note]');
    note.textContent = `Thanks. We’ll open a journal for ${form.email.value} as soon as sign-up is live.`;
  });
})();
