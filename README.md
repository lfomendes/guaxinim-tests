# Coffee Nerds

A personal coffee journal: the coffees you buy, the recipes you brew them with, and how each cup tasted. See [`PROJECT.md`](PROJECT.md) for the product definition.

This is the first implementation of the website interface, built from the "Coffee Nerds Website" design canvas and filled with its sample data.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit tests for the derived data (freshness, ratios, best brews…)
npm run build      # typecheck + production build into dist/
```

## Screens

| Route | Screen |
|---|---|
| `/` | Journal: month stats, bags on the shelf, recent brews, best cup so far |
| `/coffees` | My Coffees: search, status, process and sort filters; finished bags |
| `/coffees/:id` | Coffee detail: best way to brew it, best result per method, tasting, all brews, bag details |
| `/recipes` | Methods & Recipes: one tab per method (`?method=v60\|press\|aero`) |
| `/recipes/:id` | Recipe detail: parameters, brew timeline, steps, your results |
| `/guide/:id` | Brew guide: phone-first timer with steps and scale targets (`?coffee=…`, `?speed=10` to try it fast) |
| `/log` | Log a brew: pre-filled from the recipe (`?coffee=…&recipe=…&time=…`) |
| `/history` | History: best brew per coffee, filters by coffee, method and minimum rating |

## Data

There is no backend yet. The sample data lives in `src/data/`:

- `coffees.ts`, `brews.ts`: invented sample bags and brew log.
- `methods.ts`, `recipes.ts`: the three methods and the six built-in recipes from `PROJECT.md` §8, plus one user recipe.
- `journal.ts`: the story's "today" (Mon 26 Oct 2026, so days off roast match the design), month totals, and form defaults.

Values that can be derived are computed in `src/lib/derive.ts` rather than stored: days off roast and freshness, ratios, best brew per coffee and per method, the brew-guide timeline, and the "last time with this coffee" hint.

The history only holds the latest brews, so totals that cover more than it (brews this month, brews per bag, recipe use counts) are stored as sample values.

Brews you log and bags you mark as finished are saved in the browser's `localStorage` on top of the sample data. Adding or editing coffees and creating or duplicating recipes are not built yet; those buttons are shown disabled.
