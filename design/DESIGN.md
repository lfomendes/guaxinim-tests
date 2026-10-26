# Coffee Nerds — Website Design

> Status: draft v0.1 · 2026-10-26
> Based on [`PROJECT.md`](../PROJECT.md). Like that document, this one is technology-agnostic: it describes what the site looks like and how it behaves, not how it is built.
>
> **Clickable prototype:** [`design/prototype/index.html`](prototype/index.html). Open it in any browser; it needs no build step or server. All flows work with demo data, which is saved only in your browser.

---

## 1. Design principles

The goals (§2 of PROJECT.md) and the two personas (§4) lead to five principles. Every screen below follows from them.

| # | Principle | What it means in the UI | Serves |
|---|---|---|---|
| 1 | **Log at the counter, one-handed** | Mobile-first. Big tap targets (≥ 44 px). The main action (“Log a brew”) is always one tap away. A brew can be logged in about 30 seconds. | Both |
| 2 | **Never start from a blank form** | Picking a recipe pre-fills every brew field. Grinder and setting carry over from your last brew. Built-in recipes are always there to start from. | Beginner |
| 3 | **Numbers are first-class** | Tabular figures, units on every input, ratio calculated live, and any change from the recipe shown as a delta (`+2 g`). | Nerd |
| 4 | **Close the loop** | “What to change next time” comes back the next time you brew that coffee. Each coffee shows the best way to brew it. | Both |
| 5 | **Calm and personal** | Warm, quiet visuals. No feeds, counts of other people or shop links (see the non-goals). It's *your* journal. | Both |

## 2. Sitemap

```
/                       Home (dashboard)
/coffees                My Coffees (Active · Finished · All, search)
/coffees/new            Add a coffee
/coffees/:id            Coffee detail (+ best way to brew it, brews with it)
/coffees/:id/edit       Edit coffee
/recipes                Methods & Recipes (filter by method)
/recipes?method=v60     Method page (description + its recipes)
/recipes/:id            Recipe detail (specs, steps, tips, your results)
/recipes/new            New recipe   (?from=:id → duplicate a recipe)
/recipes/:id/edit       Edit own recipe (built-ins are read-only)
/brew/new               Log a brew: 3-step wizard (?coffee=&recipe= skip steps)
/guide/:recipeId        Brew guide with timer
/history                History (filter by coffee, method, rating; sort)
/signin                 Sign in / create account
```

Every page is reachable from the URL, so a brew can be started from any context. The coffee page links to `/brew/new?coffee=…`, a recipe links to `/brew/new?recipe=…`, and “Brew it again” fills in both.

## 3. Navigation

| | Phone (< 760 px) | Desktop (≥ 760 px) |
|---|---|---|
| Primary nav | Bottom tab bar: **Home · Coffees · (+ Brew) · Recipes · History** | Top bar: logo, Home · My Coffees · Methods & Recipes · History |
| Main action | Round **+** button raised in the middle of the tab bar | “+ Log a brew” button in the top bar |
| Utilities | Theme toggle, account (top right) | Same |

The **Brew** action is always visible because it's the core loop of the product (PROJECT.md §7, “Main user flow”).

## 4. Screens

### 4.1 Home (dashboard)

Purpose: answer “what should I brew now?” and give a quick sense of progress.

```
┌──────────────────────────────────────────────────────────┐
│ GOOD MORNING                                             │
│ What's in the cup today?         ┌──────┬──────┬──────┐  │
│ Pick a bag, pick a recipe…       │ 6    │ 3    │ 4.0  │  │
│ [+ Log a brew] [Browse recipes]  │ week │ bags │ avg ★│  │
│                                  └──────┴──────┴──────┘  │
├──────────────────────────────────────────────────────────┤
│ Active bags                                 All coffees →│
│ ┌────────────┐ ┌────────────┐ ┌────────────┐  (swipe on  │
│ │▣ Santa Inês│ │▣ Guji      │ │▣ Huila     │    phone)   │
│ │● 16 days   │ │● 9 days    │ │● 2 days    │             │
│ │     [Brew] │ │     [Brew] │ │     [Brew] │             │
│ └────────────┘ └────────────┘ └────────────┘             │
├───────────────────────────────┬──────────────────────────┤
│ Recent brews                  │ Your best cups           │
│ ⏷ Santa Inês · V60  ★★★★★     │ Santa Inês → Hoffmann V60│
│ ⏷ Guji · 4:6        ★★★★★     │ ★★★★★  [Brew it again]   │
└───────────────────────────────┴──────────────────────────┘
```

### 4.2 My Coffees: list, detail, form (Feature 1)

* **List:** card grid. Each card shows a **bag illustration tinted by roast level**, name, roaster · country, chips for process, roast and brew count/best rating, and a **freshness badge**. A segmented filter (Active / Finished / All) and free-text search over name, roaster, origin, process and variety.
* **Detail:** a header with the main actions (Log a brew · Edit · Mark as finished). A green **“Best way to brew this so far”** callout: the top-rated brew with its exact parameters and its “next time” note, plus **[Brew it again]**. A details table that hides empty fields, then the list of brews with this coffee.
* **Form:** the §6.1 fields grouped as they appear on a bag: **The essentials** (Name, Roaster, Country, Form, all required) → **Origin** → **Roast** → **Purchase** → **Notes & photo**. Required fields are marked with `*`, and everything else can be skipped. Units sit inside the inputs (`m`, `g`).
* **Archive, not delete:** “Mark as finished” moves a bag to *Finished* so its history stays intact.

**Freshness badge (days off roast).** A coloured dot plus text, so it doesn't rely on colour alone:

| Days off roast | Label | Colour |
|---|---|---|
| 0–3 | Resting | blue |
| 4–30 | Sweet spot | green |
| 31–60 | Past peak | amber |
| > 60 | Stale | red |

The thresholds are a starting point for filter coffee and could become a user setting.

### 4.3 Methods & Recipes (Feature 2)

* **Method filter** (All / V60 / French Press / AeroPress). Picking a method shows its card (icon, type, filter, description from §6.2) above its recipes.
* **Recipe card:** a 3×2 grid of specs (coffee, water, **ratio**, temp, time, grind), a 🔒 *Built-in* or ★ *My recipe* tag, and two actions: **▶ Brew guide** and **Log a brew**.
* **Recipe detail:** large spec tiles, a **step timeline** (time mark · action · scale target in g), “The idea” and “How to adjust” cards (e.g. the 4:6 tips), a source link, and **your results with this recipe** (count, average rating, recent brews).
* **Built-in recipes are read-only.** Their main secondary action is **Duplicate & edit**, which opens the form pre-filled as “*Name* (my version)” and credited “Based on *author*”.
* **Recipe form:** the ratio is **calculated live** from dose and water. Grind uses the descriptive scale (Extra-fine → Extra-coarse). The **step editor** has rows of `m:ss | action | target g` that can be added or removed, and “Prep” is allowed as a time mark.

### 4.4 Log a Brew: 3-step wizard (Feature 3)

```
 ① Coffee ✓ ─── ② Recipe ✓ ─── ③ Brew & rate
```

1. **Coffee:** cards for active bags only, with freshness badges, plus “+ Add a new coffee”.
2. **Recipe:** grouped by method. If you've brewed this coffee before, a **“Your best with this coffee”** callout appears at the top with one tap to use that recipe.
3. **Brew & rate:**
   * **“Last time you said…”** callout, showing the previous *next time* note for this coffee + recipe (principle 4).
   * **What you actually did:** date/time (now), dose, water, temp (pre-filled from the recipe, with “Recipe: 30 g” hints underneath), live ratio, grinder + setting (carried over from the last brew), actual time.
   * **How did it taste?:** a **1–5 star rating** (the only required field), four **sensory sliders** (acidity, sweetness, body, bitterness, 1–5), tasting notes, and *what to change next time*.
   * Save and Back sit in a **sticky action bar** above the tab bar, so they're reachable without scrolling.

Completed steps in the stepper are links, so you can change the coffee or recipe without starting over. Opening the wizard with `?coffee=` and/or `?recipe=` skips the steps that are already chosen.

### 4.5 Brew Guide (Feature 4, nice-to-have)

A screen you can read from a step away, while your hands are busy with a kettle:

* A **giant monospaced timer** (`0:00`) and a progress bar for the total brew time.
* A **“Now” card** with the current step's instruction, the **scale target** in large type (“Scale: 300 g”), and a countdown to the next step (“Next in 0:12: …”).
* A step list beside it (below it on a phone), with the current step highlighted and past steps faded.
* Start / Pause / Reset buttons at 52 px height. **The screen stays on** while the timer runs, where the browser supports it.
* When the timer finishes, a **Log this brew** button appears and opens the wizard with the recipe (and coffee, if one was chosen) already filled in.

### 4.6 History (Feature 5)

* **Filters:** coffee, method, minimum rating, and sort (newest / best rated).
* When filtered by coffee, a **“Best way to brew *X*”** callout appears at the top. This answers goal 5 directly.
* **Rows expand in place.** They show parameters with **deltas from the recipe** (`+2 g`, `−4°`), sensory bars, tasting notes, the *next time* note, and the actions **Brew this again · View coffee · View recipe**.

### 4.7 Account (Feature 6)

A minimal sign-in card that says plainly: *“Your coffee journal is private. Only you can see your coffees, recipes and brews.”* It has no profile or social features (non-goal). The design works the same way whether the first version is single-user or multi-user (open question 2).

## 5. Visual language

### 5.1 Colour

The palette is warm and taken from coffee itself: a cream page, espresso-brown text and a terracotta “roast” accent. Status colours are kept for meaning (freshness, “best brew”).

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#f6efe4` cream | `#18110c` | Page |
| `--surface` | `#fffaf2` | `#221812` | Cards, inputs |
| `--surface-2` | `#efe4d2` | `#2e2219` | Chips, tiles, hover |
| `--text` | `#2a1c13` espresso | `#f2e6d8` | Body text |
| `--muted` | `#75604f` | `#b39c88` | Secondary text |
| `--accent` | `#a3471f` terracotta | `#e27c4a` | Primary buttons, links, timer marks |
| `--good` | `#33663a` | `#8cc08a` | Sweet spot, “best brew” callouts |
| `--warn` / `--bad` / `--rest` | amber / brick / blue | lighter variants | Freshness states |
| `--star` | `#cf9214` | `#f0b43a` | Ratings |

**Dark mode** follows the system setting, and a toggle in the header can override it. A dark theme also suits dim early-morning kitchens.

Roast level drives the colour of the **bag illustration** (Light `#c99a68` → Dark `#432817`), so bags can be told apart at a glance.

### 5.2 Typography

| Role | Font | Notes |
|---|---|---|
| Display (h1–h3, big numbers) | Old-style serif (Iowan / Palatino / Georgia) | Specialty-coffee, “journal” feel |
| Body & UI | System sans-serif | Fast, native and readable |
| Timer, time marks | Monospace | Digits don't shift while counting |
| All numbers | `tabular-nums` | Doses and ratios line up in columns |

Scale: h1 `clamp(1.9rem, 4.5vw, 2.7rem)` · h2 1.35rem · h3 1.1rem · body 16px · small 0.875rem.

### 5.3 Shape, spacing, icons

* Radii: cards 16 px, inputs 10 px, buttons and chips fully rounded.
* Soft two-layer shadows and 1 px borders in `--border`.
* A spacing rhythm of 4/8 px (gaps of 8–16, sections 36).
* **Method icons:** simple line drawings of a V60 cone, a French press and an AeroPress, used on recipe cards, brew rows and method headers.
* **Logo:** a steaming cup wearing round glasses. It's the “nerd” in Coffee Nerds.

## 6. Components

| Component | Where | Notes |
|---|---|---|
| Coffee card | Home, My Coffees, wizard step 1 | Bag art, name, roaster · country, chips, freshness badge, Brew button |
| Freshness badge | Coffee cards, detail | Dot + “N days off roast”, colour by range |
| Recipe card | Recipes | Spec grid, built-in/own tag, Guide + Log actions |
| Spec tiles | Recipe card/detail | Value + small uppercase label |
| Ratio output | Recipe form, brew form | Live `1:16.7` |
| Step timeline | Recipe detail, guide | Time · action · target g. States: prep, now, done |
| Step editor | Recipe form | Repeatable rows, add/remove |
| Stepper | Log a brew | Done steps are links back |
| Star input | Brew form | 5 large stars, keyboard-accessible radios |
| Sensory slider | Brew form | 1–5 range with the value shown |
| Sensory bars | History | Read-only version of the sliders |
| Callout (green) | Coffee detail, wizard, history | “Best way to brew…”, “Last time you said…” |
| Brew row | Lists | Method icon, coffee, recipe · relative date, stars. Expands in History |
| Empty state | All lists | Dashed box + one clear next action |
| Toast | After saves | “Brew saved to your journal” |

## 7. Responsive behaviour

* **Phone first.** A single column, a bottom tab bar and a sticky form action bar. Active bags become a horizontal swipe list. There is no horizontal scrolling at a phone width of 390 px.
* **≥ 760 px:** the top nav replaces the tab bar.
* **≥ 900 px:** two-column layouts (dashboard lower half, coffee/recipe detail, guide).
* **≥ 1000 px:** active bags turn into a 3-up grid.

## 8. Accessibility

* Every text/background token pair in both themes was measured at ≥ 4.5:1 (WCAG AA). Freshness and ratings never rely on colour alone (text and star count are always present).
* All controls are native elements (links, buttons, radios, ranges, selects), so they work with a keyboard and screen readers. The focus ring is a 3 px terracotta outline.
* Star ratings are radio groups with hidden text labels (“4 stars”). The timer's step changes are announced politely.
* Tap targets are at least 44 px, and 52 px for the timer controls.
* `prefers-reduced-motion` turns off transitions.

## 9. Voice and copy

Short, friendly, a little nerdy, and never preachy. Examples: “What's in the cup today?”, “Last time you said…”, “Brew it again”, and the 404 page's “Spilled.” Units are always shown (`g`, `°C`, `m:ss`). When the site is built, keep all UI text in one string catalog so pt-BR can be added later (open question 6). The prototype writes its text inline.

## 10. How the open questions are handled (PROJECT.md §10)

The design takes a default for each question but doesn't depend on it:

| Question | Default in this design | Cost of changing it |
|---|---|---|
| 1. Spreadsheet fields | §6.1 fields as proposed, grouped as they appear on a bag | Add or remove fields in the form groups |
| 2. Single vs. multi-user | Sign-in screen designed. Pages don't depend on it | None |
| 3. Units | Metric only. Units are shown next to each input | A unit preference could swap the labels |
| 4. Edit built-in recipes? | **Duplicate only.** Built-ins show 🔒 and “Duplicate & edit” | Show Edit on built-ins |
| 5. Grind | Descriptive scale on recipes, **plus** free-text “Grinder + setting” on each brew | Swap the free text for a grinder picker later (post-MVP grinder catalog) |
| 6. Language | English, with text designed to go in one string catalog | Translate the strings |

## 11. Out of scope (from PROJECT.md §3)

There is nothing in this design for selling coffee, social features, espresso parameters, native apps or smart-scale integration. The post-MVP ideas in §9 (side-by-side comparison, charts, CSV import, sharing) fit into the existing navigation later: compare and charts go under History, import goes under My Coffees, and sharing goes on Recipe detail.

## 12. Next steps

1. Review this design and the prototype. Agree on the defaults in §10.
2. Share the example spreadsheet so the coffee form fields can be finalised.
3. Choose the technology. The prototype's screens, tokens and seed recipes can carry over as-is.
