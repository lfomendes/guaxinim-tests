# Page Override: Log a Brew (`/log`)

> Rules here **override** `MASTER.md` for this page only. Anything not mentioned follows Master.

**Goal (PROJECT.md §7.3):** choose coffee → choose recipe → fields pre-filled → adjust → rate. A beginner should finish in under a minute. A nerd can record every variable.

## Layout

- Single column, max-width `40rem`. A **step indicator** at the top shows "Step 2 of 3 · Recipe", with each step as text + number (not dots only).
- **Sticky action bar** at the bottom of the form (above the bottom nav on mobile): `Back` (ghost) on the left, `Next` / `Save brew` (primary) on the right. Content gets matching bottom padding so nothing hides behind it.
- The bottom nav stays visible (persistent navigation). Leaving with unsaved input asks for confirmation.

## Steps

1. **Coffee** — radio cards for *Active* bags only (name, roaster, days off roast). Includes a "+ Add a new coffee" link that returns here afterwards. Pre-selected when arriving from a coffee page (`/log?coffee=…`).
2. **Recipe** — method filter chips (V60 / French Press / AeroPress), then radio cards for recipes. Each card shows the mono stat row. The user's last recipe for this coffee is marked "Last used". Pre-selected from `/log?recipe=…`.
3. **Brew & taste**
   - *Parameters* fieldset: dose (g), water (g), temperature (°C), pre-filled from the recipe. The **ratio updates live** (`1:16.7`) and is announced politely. A changed field shows "Changed from 30 g", so the adjustment is recorded.
   - *Grind & time*: grinder + setting (free text, e.g. "Comandante — 24 clicks"), actual total time (`mm:ss`).
   - *Rating* (required): 5-star radio fieldset.
   - *More details* (`<details>`, closed by default): sensory sliders (Acidity, Sweetness, Body, Bitterness), tasting notes, "What to change next time".

## Validation

- Only coffee, recipe and rating are required (PROJECT.md §6.4).
- On failed save: focus the error summary, link to each field, and keep the inline errors.
- On success: toast "Brew saved — 4 stars for Fazenda Santa Inês", then go to the new entry in History.

## Deviations from Master

- The sticky action bar uses `--shadow-md` on its top edge. This is the only page with a sticky bottom bar besides the nav.
- The primary button label changes per step ("Next: Recipe", "Next: Brew & taste", "Save brew").
