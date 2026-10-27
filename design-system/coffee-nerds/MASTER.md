# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/coffee-nerds/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Coffee Nerds — a personal coffee brewing journal (see `PROJECT.md`)
**Generated with:** `ui-ux-pro-max` v2.15.0, then curated by hand (see "Provenance" at the end)
**Category:** Diary & Journal App × Bakery/Cafe palette
**Design Dials:** Variance 4/10 (Balanced / Modern) | Motion 3/10 (Subtle) | Density 5/10 (Standard)
**Reference prototype:** `prototype/index.html` (open it in a browser, no build step)

---

## Design Principles

1. **The cup comes first.** Every screen answers *"which coffee, how did I brew it, how did it taste?"* Logging a brew is always one tap away.
2. **Warm paper, precise ink.** Linen and espresso tones give the journal feel. Numbers (grams, °C, ratios, timers) are set in a monospace face so they read like lab notes.
3. **Beginner-safe, nerd-deep.** Defaults and built-in recipes get the *Curious Beginner* brewing quickly. Extra variables (grinder clicks, sensory sliders, adjustments) sit behind progressive disclosure for the *Coffee Nerd*.
4. **Works at the counter.** Pages are mobile-first and one-handed, with big touch targets, and the Brew Guide stays readable from arm's length.

---

## Global Rules

### Color Palette

Semantic tokens only — components never use raw hex. Every text pair below was measured (WCAG 2.x relative luminance).

#### Light ("Linen")

| Role | Hex | CSS Variable | Contrast |
|------|-----|--------------|----------|
| Background | `#FBF6EE` | `--color-background` | — |
| Surface (cards) | `#FFFDF9` | `--color-surface` | — |
| Surface 2 (muted fills, chips) | `#F3EADC` | `--color-muted` | — |
| Foreground (body text) | `#2B1A0E` | `--color-foreground` | 15.5:1 on bg |
| Muted foreground | `#6B5443` | `--color-muted-foreground` | 6.6:1 on bg · 5.9:1 on muted |
| Primary (espresso amber) | `#92400E` | `--color-primary` | 6.6:1 on bg |
| On primary | `#FFFFFF` | `--color-on-primary` | 7.1:1 on primary |
| Primary tint (selected fills) | `#FBE9D2` | `--color-primary-tint` | primary text 6.0:1 |
| Secondary (stars, highlights) | `#B45309` | `--color-secondary` | 4.9:1 on surface |
| Border (dividers, decorative) | `#E6D8C3` | `--color-border` | decorative only |
| Border strong (inputs, controls) | `#9A8268` | `--color-border-strong` | 3.4:1 on bg (non-text ≥3:1) |
| Success | `#2F6B3A` | `--color-success` | 6.3:1 |
| Warning | `#8A5A00` | `--color-warning` | 5.8:1 |
| Destructive | `#B42318` | `--color-destructive` | 6.5:1 |
| Ring (focus) | `#92400E` | `--color-ring` | — |

#### Dark ("Espresso")

| Role | Hex | CSS Variable | Contrast |
|------|-----|--------------|----------|
| Background | `#17100B` | `--color-background` | — |
| Surface | `#221812` | `--color-surface` | — |
| Surface 2 | `#2E2219` | `--color-muted` | — |
| Foreground | `#F6ECDF` | `--color-foreground` | 16.1:1 on bg |
| Muted foreground | `#C4B09C` | `--color-muted-foreground` | 9.0:1 on bg · 7.4:1 on muted |
| Primary (caramel) | `#F0A961` | `--color-primary` | 9.5:1 on bg |
| On primary | `#2B1A0E` | `--color-on-primary` | 8.4:1 on primary |
| Primary tint | `#3A2716` | `--color-primary-tint` | primary text 7.1:1 |
| Secondary | `#F5C27A` | `--color-secondary` | 10.7:1 on surface |
| Border | `#3D2E22` | `--color-border` | decorative only |
| Border strong | `#8C7259` | `--color-border-strong` | 3.9:1 on surface |
| Success | `#86C995` | `--color-success` | 9.0:1 |
| Warning | `#E8B04B` | `--color-warning` | 8.9:1 |
| Destructive | `#F2958A` | `--color-destructive` | 7.8:1 |
| Ring | `#F0A961` | `--color-ring` | — |

**Color notes:** Primary/secondary come from the skill's *Bakery/Cafe* palette (warm brown + cream). The neutrals were warmed toward the *Diary & Journal* guidance ("warm paper tones + muted ink") instead of the palette's cool `#EDEEF0` / `#475569` greys. Dark mode uses lighter, desaturated tonal variants, not inverted colors. Status colors always ship with an icon or text label — never color alone.

### Typography

| Role | Font | Use |
|------|------|-----|
| Display | **Calistoga** 400 | Page titles, coffee names, the brand wordmark. Never for body text or below 20px. |
| Body / UI | **Inter** 400 / 500 / 600 | All text, labels, buttons. 16px minimum on mobile. |
| Data | **JetBrains Mono** 400 / 500 | Grams, °C, ratios, times, timers, days off roast. Always `font-variant-numeric: tabular-nums`. Uppercase 12px with tracking for small data labels. |

```css
@import url('https://fonts.googleapis.com/css2?family=Calistoga&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
```

**Type scale (rem):** 0.75 (label) · 0.875 (caption) · 1 (body) · 1.125 (lead) · 1.5 (h3) · 2 (h2) · 2.5 (h1, desktop) · 4.5 (Brew Guide timer).
Body line-height 1.55; headings 1.15 with `text-wrap: balance`. Keep line length to 65–75 characters.

### Spacing Variables

*Density: 5/10 — Standard (4/8px rhythm)*

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` / `0.25rem` | Tight gaps |
| `--space-sm` | `8px` / `0.5rem` | Icon gaps, inline spacing, min gap between targets |
| `--space-md` | `16px` / `1rem` | Standard padding, mobile page gutter |
| `--space-lg` | `24px` / `1.5rem` | Card padding, desktop gutter |
| `--space-xl` | `32px` / `2rem` | Large gaps |
| `--space-2xl` | `48px` / `3rem` | Section margins |
| `--space-3xl` | `64px` / `4rem` | Hero padding |

### Radius & Shadow

Soft UI Evolution (the *Diary & Journal* product recommendation) on a Minimalism base: soft, clear depth and no neumorphic insets.

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | `8px` | Inputs, chips, small buttons |
| `--radius-md` | `12px` | Cards, buttons |
| `--radius-lg` | `20px` | Sheets, Brew Guide panel |
| `--radius-full` | `999px` | Pills, avatar, FAB |
| `--shadow-sm` | `0 1px 2px rgb(43 26 14 / .06)` | Resting cards |
| `--shadow-md` | `0 2px 4px rgb(43 26 14 / .06), 0 8px 16px rgb(43 26 14 / .06)` | Hovered cards, sticky bars |
| `--shadow-lg` | `0 12px 32px rgb(43 26 14 / .14)` | Dialogs, toasts |

Shadows are tinted espresso, not black. In dark mode, raise elevation with a lighter surface instead of a stronger shadow.

### Z-index Scale

`0` content · `10` sticky headers · `20` bottom nav / sidebar · `40` toasts · `100` dialogs.

### Breakpoints & Layout

- Mobile-first. Breakpoints **375 / 768 / 1024 / 1440**.
- **< 1024px:** top app bar (title + theme toggle) + **bottom navigation** with 5 items. The center item is the raised **Log brew** action.
- **≥ 1024px:** fixed **left sidebar** (same 5 destinations, "Log a brew" as the primary button). No bottom nav — never mix both at the same level.
- Content max-width `72rem` (1152px); forms and reading columns max `40rem`.
- Use `min-height: 100dvh`. Reserve bottom padding for the bottom nav + `env(safe-area-inset-bottom)`.

### Icons

**Lucide** (outline, 2px stroke, round caps), sized by token: `--icon-sm` 16px, `--icon-md` 20px, `--icon-lg` 24px. One style everywhere — no filled/outline mixing at the same level, and never emoji. The filled star is the only filled glyph (selected rating state).
Decorative icons beside text get `aria-hidden="true"`. Icon-only buttons get an `aria-label`.

---

## Information Architecture

| Destination | Route | PROJECT.md feature |
|-------------|-------|--------------------|
| **Home** | `/` | Overview: start a brew, active bags, recent cups |
| **Coffees** | `/coffees`, `/coffees/:id`, `/coffees/new` | §7.1 My Coffees |
| **Log brew** (primary) | `/log` | §7.3 Log a Brew |
| **Recipes** | `/recipes?method=v60`, `/recipes/:id`, `/recipes/:id/guide` | §7.2 Methods & Recipes, §7.4 Brew Guide |
| **History** | `/history?coffee=&method=&rating=` | §7.5 History + "best brew for this coffee" |
| Sign in | `/signin` | §7.6 User accounts |

Every screen has a deep-linkable URL. Filter state lives in the query string so Back restores it.

Main flow (PROJECT.md §7): **Add coffee → pick method → pick recipe → brew (guide) → rate & note → repeat.** Every screen in that chain has a forward CTA to the next one. For example: Coffee detail → "Brew this coffee", Recipe detail → "Start brew guide", Guide finish → "Log this brew" (pre-filled).

---

## Component Specs

### Buttons

```css
.btn { min-height: 44px; padding: 0 20px; border-radius: var(--radius-md);
  font: 600 1rem/1 var(--font-body); display: inline-flex; align-items: center; gap: 8px;
  cursor: pointer; transition: background-color 150ms ease, box-shadow 150ms ease; }
.btn-primary   { background: var(--color-primary); color: var(--color-on-primary); }
.btn-primary:hover { background: var(--color-primary-hover); }
.btn-secondary { background: transparent; color: var(--color-primary); border: 1.5px solid var(--color-primary); }
.btn-ghost     { background: transparent; color: var(--color-foreground); }
.btn-danger    { background: transparent; color: var(--color-destructive); border: 1.5px solid currentColor; }
.btn:focus-visible { outline: 3px solid var(--color-ring); outline-offset: 2px; }
.btn[aria-disabled="true"], .btn:disabled { opacity: .45; cursor: not-allowed; }
```

- **One primary button per screen.** Destructive actions are outlined, separated from the primary action, and either confirmed or undoable (archiving a bag shows an "Undo" toast).
- No `translateY` hover lift on buttons, because it shifts the layout. Use color and shadow only.
- Async buttons show a spinner + `aria-busy="true"` and keep their width.

### Cards

```css
.card { background: var(--color-surface); border: 1px solid var(--color-border);
  border-radius: var(--radius-md); padding: var(--space-lg); box-shadow: var(--shadow-sm);
  transition: box-shadow 200ms ease, border-color 200ms ease; }
a.card:hover { box-shadow: var(--shadow-md); border-color: var(--color-border-strong); }
```

Card variants:
- **Coffee bag card** — name (Calistoga), roaster · origin · process, the *days off roast* badge, and up to 3 roaster tasting-note chips that wrap (no clipping).
- **Recipe card** — name, author, method, a `Built-in` badge (text, not just color), and a stat row in mono: `30 g · 500 g · 1:16.7 · 100 °C · 3:30`.
- **Brew row** — date, coffee, recipe, rating (stars + numeric "4 of 5" for screen readers), one-line tasting note.

### Data badges

- **Days off roast:** mono number + a label with an icon. *Resting* (0–6 days), *Peak* (7–30), *Past peak* (31+). These ranges suit filter brewing and are a design default that's easy to change.
- **Built-in / Mine** recipe badge, **Finished** bag badge.
- Badges are static `<span>`s. Only filter chips are interactive (`<button aria-pressed>`).

### Inputs

```css
.input { min-height: 44px; padding: 10px 14px; font-size: 1rem;
  background: var(--color-surface); color: var(--color-foreground);
  border: 1.5px solid var(--color-border-strong); border-radius: var(--radius-sm);
  transition: border-color 150ms ease, box-shadow 150ms ease; }
.input:focus-visible { border-color: var(--color-primary); outline: 3px solid var(--color-ring); outline-offset: 1px; }
.input[aria-invalid="true"] { border-color: var(--color-destructive); }
```

- Visible `<label>` above every field. Required fields are marked "(required)" in text. Units are shown as a suffix inside the field (`g`, `°C`) and in the label.
- Numeric fields use `inputmode="decimal"`. Times use `mm:ss` with a hint.
- Validate on blur. On submit, show an **error summary** at the top (focused, linking to each field) and keep the inline errors under each field (`aria-describedby`).
- Group related fields in `<fieldset>`/`<legend>`. Optional detail sits in a `<details>` "More details" disclosure.

### Rating & sensory controls

- **Rating (1–5 stars):** a `<fieldset>` of 5 native radio inputs drawn as stars, with each label reading "3 stars" for screen readers. Keyboard arrows work natively. Required.
- **Sensory sliders** (Acidity, Sweetness, Body, Bitterness): native `<input type="range" min="1" max="5">` with a visible `<output>` value and end labels ("Low"/"High").
- *The skill database had no specific match for star-rating or slider inputs. These two specs follow general accessible-native-control guidance.*

### Navigation

- Nav items always have **icon + text label**. The current item gets `aria-current="page"`, the primary color and a top or left indicator bar.
- Bottom nav: 5 items, at least 56px tall, plus the safe-area inset. Sidebar: 248px wide.
- On route change, move focus to the page `<h1>` (`tabindex="-1"`). The skip link goes to `#main`.

### Toasts & dialogs

- Toasts sit bottom-center above the bottom nav and announce through `aria-live="polite"`. They auto-dismiss after 4s (8s when they include an "Undo" action) and never take focus.
- Dialogs are native `<dialog>` with a visible close button and Esc to close. Ask for confirmation before discarding a half-filled brew log.

### Empty states

Every list has one: a short message, why it is empty, and one action. For example, History says "No brews yet — log your first cup" and links to Log brew.

---

## Style Guidelines

**Style:** Minimalism base + Soft UI Evolution depth (soft multi-layer shadows, 8–12px radius, clear focus states).

**Key Effects:** Subtle elevation on hover for links/cards. Timer progress ring on the Brew Guide. 150–250ms color/shadow transitions.

### Page Pattern

This is an app, not a marketing site, so the skill's suggested "funnel" landing pattern does not apply. Pattern per screen:

- **Home:** greeting + primary "Log a brew" → Active bags (grid) → Recent brews → "Your best cups".
- **List pages** (Coffees, Recipes, History): title + one primary action → filters (chips/selects that wrap) → results grid/list → empty state.
- **Detail pages:** title + key stats → main content → related list (e.g. brews of this coffee) → forward CTA.
- **Flows** (Log brew): 3 steps with a step indicator and a Back button on every step (see `pages/log-brew.md`).

---

## Motion

Subtle tier (Motion 3/10). Plain CSS transitions, no animation library needed.

| Token | Value | Use |
|-------|-------|-----|
| `--dur-fast` | `150ms` | Hover, press, color changes |
| `--dur-base` | `220ms` | Route cross-fade, disclosure, toast enter |
| `--dur-exit` | `150ms` | Toast/dialog exit (exit is faster than enter) |
| `--ease-out` | `cubic-bezier(.2,.8,.2,1)` | Arriving elements |

- Route change: content cross-fades (opacity only, 220ms). Lists do not stagger.
- Animate only `opacity` and `transform`.
- `@media (prefers-reduced-motion: reduce)`: disable cross-fades and the timer ring animation, and show final states immediately.

---

## Anti-Patterns (Do NOT Use)

- ❌ **Pure white page backgrounds** — use the linen background; white is only for raised surfaces.
- ❌ **Cool grey neutrals** next to the warm palette.
- ❌ **Coffee clichés as decoration** — bean-pattern wallpapers, latte-art stock photos, coffee-stain textures behind text.
- ❌ **Low-contrast "aesthetic" brown-on-brown text** — check every pair against the table above.
- ❌ **Social features** (likes, feeds, followers) and shop/affiliate links — out of scope per PROJECT.md §3.
- ❌ **Espresso-machine parameters** (pressure, profiles) — out of scope.

### Additional Forbidden Patterns

- ❌ **Emojis as icons** — use Lucide SVGs
- ❌ **Missing cursor:pointer** — all clickable elements must have cursor:pointer
- ❌ **Layout-shifting hovers** — no translate/scale that moves neighbours
- ❌ **Low contrast text** — maintain 4.5:1 minimum
- ❌ **Instant state changes** — use 150–250ms transitions (except under reduced motion)
- ❌ **Invisible focus states** — focus must always be visible
- ❌ **Placeholder-only labels** and **color-only status**

---

## Pre-Delivery Checklist

- [ ] No emojis used as icons (Lucide SVG only)
- [ ] All icons from the same set and stroke width
- [ ] `cursor: pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150–300ms)
- [ ] Text contrast ≥4.5:1 in **both** light and dark themes (see tables)
- [ ] Focus states visible for keyboard navigation; focus moves to `<h1>` on route change
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive at 375px, 768px, 1024px, 1440px; no horizontal scroll at 375px
- [ ] No content hidden behind the bottom nav / sticky bars
- [ ] Touch targets ≥44×44px with ≥8px gaps
- [ ] Every list has an empty state; every form has an error summary + inline errors
- [ ] Numbers use JetBrains Mono / tabular figures

---

## Provenance

| Decision | Source |
|----------|--------|
| Primary/secondary palette | `--design-system "coffee shop cafe warm"` → *Bakery/Cafe* palette |
| Warm-paper neutrals, Soft UI depth, storytelling over funnel | `--domain product "journal tracker personal productivity"` → *Diary & Journal App* |
| Calistoga + Inter + JetBrains Mono | `--domain typography "editorial warm serif journal"` (replaced the generated Fredoka/Nunito pairing, which targets children's apps) |
| Spacing scale, motion tier | Design dials `--density 5 --motion 3 --variance 4` |
| Form, empty-state, chip, navigation and focus rules | `--domain ux` searches + Quick Reference §1, §2, §5, §8, §9 |
| Icons | `--domain icons "coffee"` returned no match → fell back to Lucide (listed by the skill's checklist) |
| Rating stars & sensory sliders | No verified database match → general accessible-native-control guidance |
| Rejected from generated output | "Funnel (3-step conversion)" pattern, "Hidden hours"/"Poor food photos" anti-patterns, GSAP scroll reveal (unneeded for an app) |
