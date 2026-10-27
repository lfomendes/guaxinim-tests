// Story context and month aggregates: sample-data.md §1 and §6.

/** The journal's "today": Monday 26 Oct 2026, morning. Days off roast count from here. */
export const TODAY = '2026-10-26T09:00';

/**
 * This month's totals. The history log only holds the latest brews, so these are
 * stored rather than computed from it.
 */
export const MONTH_STATS = {
  brews: 23,
  avgRating: 3.8,
  mostUsedMethod: 'V60',
};

/** The grinder the user owns. Grind settings are logged in clicks. */
export const GRINDER = 'Comandante';

/** Pre-filled state of the "Log a brew" form: sample-data.md §7. */
export const LOG_DEFAULTS = {
  coffeeId: 'santa-ines',
  recipeId: 'hoffmann-v60',
  date: '2026-10-26T08:15',
  dose: 30,
  water: 500,
  temp: 98,
  time: '3:30',
  grinder: 'Comandante — 24 clicks',
  sensory: { acidity: 3, sweetness: 4, body: 3, bitterness: 2 },
};

export const RATING_WORDS = ['Tap a star', 'Undrinkable', 'Meh', 'Decent', 'Great', 'Best cup yet'];

export const SENSORY_SCALES = [
  { key: 'acidity', name: 'Acidity', lo: 'Flat', hi: 'Bright' },
  { key: 'sweetness', name: 'Sweetness', lo: 'None', hi: 'Very sweet' },
  { key: 'body', name: 'Body', lo: 'Tea-like', hi: 'Heavy' },
  { key: 'bitterness', name: 'Bitterness', lo: 'None', hi: 'Harsh' },
] as const;

export const DIALING_IN_TIP =
  'Drawdown much past 3:30 → grind coarser. Sour or hollow and fast → grind finer. Change one thing per brew and note it in “next time”.';
