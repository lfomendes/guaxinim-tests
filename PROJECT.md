# Coffee Nerds — Project Definition

> Status: draft v0.1 · 2026-10-26
> Scope of this document: what the product is and what it should do. Technology, architecture and code decisions are intentionally left out.

---

## 1. Vision

**Coffee Nerds** is a simple website where home-brewing enthusiasts keep a personal record of the coffees they buy and the way they brew them.

The core idea: *"Which coffee did I use, how did I brew it, and how did it taste?"* Over time, the user builds a personal coffee journal that helps them repeat good cups and avoid bad ones.

## 2. Goals

1. Register the **coffees** a user has bought (the bag/ground details: roaster, origin, process, roast date, etc.).
2. Register the **brewing methods** a user owns (V60, French Press, AeroPress to start).
3. Register **recipes** for each method (dose, water, temperature, grind, step-by-step timing).
4. Log each **brew**: coffee + recipe + any adjustments + tasting notes + rating.
5. Browse and search the history to find "the best way to brew coffee X".

## 3. Non-goals (for now)

- Selling coffee or linking to shops.
- Social network features (followers, feeds, comments).
- Espresso / machine-specific parameters (pressure, profiles).
- Mobile apps (the website should simply work well on a phone).
- Integration with smart scales or grinders.

## 4. Target users

| Persona | Description | Main need |
|---|---|---|
| **The Curious Beginner** | Just bought a V60 or AeroPress, follows YouTube recipes. | Start from a known recipe and record if it worked. |
| **The Coffee Nerd** | Owns several brewers and a good grinder, buys specialty bags often. | Track every variable and compare results across coffees. |

## 5. Core concepts (domain)

```
Coffee (the bag)  ──┐
                    ├──►  Brew (a logged cup)  ◄── Tasting notes + rating
Recipe ──► Method ──┘
```

- **Coffee** — a specific coffee the user bought (one bag / one lot).
- **Method** — a brewing device/technique: V60, French Press, AeroPress (extensible later: Chemex, Kalita, Moka pot, Clever…).
- **Recipe** — a reusable set of parameters and steps for one method. Can be a *built-in* recipe (seeded, see §8) or a *user* recipe.
- **Brew** — one actual brewing session: which coffee, which recipe, what the user actually did (adjustments) and how it tasted.

## 6. Data definition

### 6.1 Coffee

> ⚠️ **Pending:** the example spreadsheet (`.xls`) mentioned in the request was not found in the repository. The fields below are a provisional proposal based on what specialty coffee bags usually show. They must be reviewed and aligned (translated) with the spreadsheet once it is shared.

| Field | Required | Example | Notes |
|---|---|---|---|
| Name | yes | "Fazenda Santa Inês — Yellow Bourbon" | Free text |
| Roaster | yes | "Coffee Lab" | |
| Country of origin | yes | Brazil | |
| Region | no | Sul de Minas | |
| Farm / Producer | no | Fazenda Santa Inês | |
| Variety | no | Yellow Bourbon | Can be multiple |
| Process | no | Natural | Washed, Natural, Honey, Anaerobic, … |
| Altitude (m) | no | 1,150 | |
| Roast level | no | Medium-light | Light / Medium / Dark scale |
| Roast date | no | 2026-10-10 | Used to show "days off roast" |
| Tasting notes (roaster's) | no | Chocolate, caramel, yellow fruits | As printed on the bag |
| SCA score | no | 86 | |
| Form | yes | Whole bean / Pre-ground | |
| Bag weight (g) | no | 250 | |
| Price | no | R$ 65.00 | |
| Purchase date | no | 2026-10-15 | |
| Photo of the bag | no | image | Nice-to-have |
| Personal notes | no | free text | |
| Status | yes | Active / Finished | To hide finished bags |

### 6.2 Method

| Field | Example |
|---|---|
| Name | V60 |
| Type | Pour-over / Immersion / Hybrid (pressure) |
| Description | Conical dripper with spiral ribs, paper filter |
| Default filter type | Paper / Metal / None |

Initial methods: **V60** (pour-over), **French Press** (immersion), **AeroPress** (hybrid: immersion + pressure).

### 6.3 Recipe

| Field | Required | Example |
|---|---|---|
| Name | yes | "Hoffmann Ultimate V60" |
| Method | yes | V60 |
| Author / Source | no | James Hoffmann (link) |
| Coffee dose (g) | yes | 30 |
| Water (g) | yes | 500 |
| Ratio | auto | 1:16.7 (calculated from dose and water) |
| Water temperature (°C) | no | 100 (just off the boil) |
| Grind size | yes | Medium-fine (descriptive scale) |
| Total brew time | no | 3:30 |
| Steps | yes | Ordered list: time mark + action + water target (g) |
| Built-in vs. user recipe | auto | Built-in recipes are read-only; users can duplicate and edit |

### 6.4 Brew (log entry)

| Field | Required | Example |
|---|---|---|
| Date/time | yes | 2026-10-26 08:15 |
| Coffee | yes | link to a Coffee |
| Recipe | yes | link to a Recipe |
| Actual dose / water / temperature | no | Pre-filled from the recipe, editable |
| Grinder + grind setting | no | "Comandante — 24 clicks" |
| Actual total time | no | 3:45 |
| Rating | yes | 1–5 stars |
| Tasting notes | no | "Sweet, a bit sour at the end" |
| Sensory sliders | no | Acidity, Sweetness, Body, Bitterness (1–5) |
| What to change next time | no | "Grind 2 clicks finer" |

## 7. Main features (MVP)

1. **My Coffees** — list, add, edit, archive coffees; show days off roast.
2. **Methods & Recipes** — browse methods; view built-in recipes; create/duplicate/edit own recipes.
3. **Log a Brew** — choose coffee → choose recipe → fields pre-filled → adjust → rate.
4. **Brew Guide (nice-to-have in MVP)** — step-by-step view of a recipe with a timer.
5. **History** — list of brews, filterable by coffee, method, rating; "best brew for this coffee".
6. **User accounts** — each user sees only their own data.

### Main user flow

```
Add a coffee bag ─► Pick a method ─► Pick (or create) a recipe ─► Brew ─► Rate & take notes ─► Repeat / adjust
```

## 8. Built-in recipes (seed data)

Two well-known recipes per method, from the internet. Temperatures marked "just off the boil" mean roughly 96–100 °C.

### 8.1 V60

#### A) James Hoffmann — The Ultimate V60 Technique
- **Dose:** 30 g · **Water:** 500 g · **Ratio:** ~1:16.7
- **Grind:** medium-fine · **Temp:** just off the boil · **Total time:** ~3:30

| Time | Action |
|---|---|
| Prep | Rinse the paper filter with hot water, discard the water. Add the coffee, level the bed, make a small well in the middle. |
| 0:00 | Bloom: pour 60 g (2× the dose), swirl the brewer so all the grounds get wet. |
| 0:00–0:45 | Let it bloom. |
| 0:45–1:15 | Pour in circles up to **300 g**. |
| 1:15–1:45 | Pour more gently up to **500 g**. |
| ~1:45 | Stir once gently with a spoon, then give a gentle swirl to flatten the bed. |
| ~3:30 | Drawdown finishes. |

#### B) Tetsu Kasuya — 4:6 Method (2016 World Brewers Cup)
- **Dose:** 20 g · **Water:** 300 g · **Ratio:** 1:15
- **Grind:** medium-coarse · **Temp:** 93 °C · **Total time:** ~3:30
- **Idea:** the water is split into 40% (first two pours, which set sweetness vs. acidity) and 60% (last pours, which set strength).

| Time | Pour |
|---|---|
| 0:00 | 60 g |
| 0:40 | 60 g (total 120 g, the 40% phase ends) |
| 1:20 | 60 g (180 g) |
| 2:00 | 60 g (240 g) |
| 2:30 | 60 g (300 g) |
| ~3:30 | Remove the dripper |

- **Adjustments:** a smaller first pour gives a sweeter cup, a larger first pour gives a brighter one. More (smaller) pours in the 60% phase give a stronger cup (e.g. four pours of 45 g), fewer give a lighter one.

### 8.2 French Press

#### A) James Hoffmann — The Ultimate French Press Technique
- **Dose:** 30 g · **Water:** 500 g · **Ratio:** ~1:16.7
- **Grind:** medium (not too coarse) · **Temp:** just off the boil · **Total time:** ~9–12 min

| Time | Action |
|---|---|
| 0:00 | Add the coffee, pour all 500 g of water. Don't stir. |
| 4:00 | Break the crust with a spoon and stir gently. Skim off the foam and floating grounds. |
| 4:00–9:00+ | Wait 5–8 more minutes so the fines sink to the bottom. |
| ~9:00+ | Put the lid on and lower the plunger **only to the surface** (don't press down). Pour slowly. |

#### B) Stumptown Coffee Roasters — French Press
- **Dose:** 56 g · **Water:** 850 g · **Ratio:** ~1:15
- **Grind:** coarse (like breadcrumbs) · **Temp:** ~96 °C (205 °F) · **Total time:** 4:00

| Time | Action |
|---|---|
| Prep | Preheat the French press with hot water, then empty it. |
| 0:00 | Pour 450 g of water, making sure all the grounds are wet. |
| 1:00 | Stir the grounds into the water. |
| 1:00 | Top up to **850 g**. Put the lid on. |
| 4:00 | Press the plunger all the way down and serve right away (pour it all out so it doesn't over-extract). |

### 8.3 AeroPress

#### A) James Hoffmann — The Ultimate AeroPress Technique (standard position)
- **Dose:** 11 g · **Water:** 200 g · **Ratio:** ~1:18
- **Grind:** fine side of medium · **Temp:** just off the boil · **Total time:** ~3:00
- **Filter:** paper, no rinse needed

| Time | Action |
|---|---|
| Prep | AeroPress in the normal position on top of a mug, filter cap on. |
| 0:00 | Add the coffee and pour 200 g of water quickly so all the grounds get wet. |
| 0:00 | Put the plunger in about 1 cm to make a vacuum (stops dripping). |
| 2:00 | Holding the brewer and plunger, swirl gently. |
| 2:30 | Press gently for ~30 s, all the way down. |

#### B) Wendelien van Bunnik — 2019 World AeroPress Champion (inverted)
- **Dose:** 30 g · **Water:** 100 g brew + 120 g bypass (220 g total) · **Ratio:** ~1:7.3 (1:3.3 during brewing)
- **Grind:** coarse · **Temp:** 92 °C · **Total time:** ~1:30
- **Filter:** rinsed paper

| Time | Action |
|---|---|
| Prep | AeroPress inverted. Add 30 g of coffee. |
| 0:00 | Pour 100 g of water at 92 °C. |
| 0:00–0:20 | Stir hard, ~20 times. |
| ~0:20 | Screw on the cap with the rinsed filter and push out the extra air. |
| 0:40 | Flip it onto the server and press. |
| After press | Add 120 g of water at 92 °C (bypass). Cool it down by pouring between two cups and serve at ~60 °C. |

## 9. Future ideas (post-MVP)

- More methods (Chemex, Kalita Wave, Clever Dripper, Moka pot, Espresso).
- Grinder catalog with a grind-setting converter.
- Compare two brews side by side.
- Charts: rating evolution per coffee, favorite origins/processes.
- Export/import (CSV/XLS), including importing the user's existing spreadsheet.
- Share a recipe publicly through a link.
- Low-stock / "bag almost finished" reminder based on doses logged.
- Portuguese (pt-BR) translation.

## 10. Open questions

1. **Example spreadsheet:** please share the `.xls` so the Coffee fields (§6.1) can be translated and aligned with it.
2. Should the first version support **multiple users with login**, or start as a single-user journal?
3. **Units:** metric only (g, °C), or also imperial (oz, °F)?
4. Should users be able to **edit built-in recipes** directly, or only duplicate them?
5. Grind size: a descriptive scale only (extra-fine → extra-coarse), or also a grinder + clicks field?
6. Language of the interface: English only for now, with pt-BR later?

## 11. Sources

- James Hoffmann V60 — [Hario USA](https://www.hario-usa.com/blogs/recipes-and-more-from-friends/james-hoffmann-uitimate-v60-technique), [Honest Coffee Guide](https://honestcoffeeguide.com/brew-recipes/james-hoffmann-v60/)
- Tetsu Kasuya 4:6 — [Hario UK](https://hario.co.uk/blogs/hario-ambassadors/hario-v60-recipe-interview-with-hario-ambassador-tetsu-kasuya), [Honest Coffee Guide](https://honestcoffeeguide.com/brew-recipes/tetsu-kasuya-4-6-method/)
- James Hoffmann French Press — [Honest Coffee Guide](https://honestcoffeeguide.com/brew-recipes/james-hoffmann-french-press/)
- Stumptown French Press — [Stumptown Brew Guide](https://www.stumptowncoffee.com/brew-guides/french-press)
- James Hoffmann AeroPress — [Aeroprecipe](https://aeroprecipe.com/recipes/james-hoffmann-aeropress-recipe)
- 2019 World AeroPress Championship — [Aeroprecipe](https://aeroprecipe.com/recipes/2019-wac-1st-place)
