# Page Override: Brew Guide (`/recipes/:id/guide`)

> Rules here **override** `MASTER.md` for this page only.

**Goal (PROJECT.md §7.4):** step-by-step view of a recipe with a timer, readable from the counter while the user pours.

## Layout

- **Focus mode.** The bottom nav and sidebar are replaced by a slim top bar with "Exit guide" (always visible, so the user has a way out) and the recipe name.
- Timer centered: JetBrains Mono at `4.5rem` (`clamp(3rem, 14vw, 4.5rem)`), tabular figures, inside a progress ring that tracks total brew time.
- Under the timer: the **current step card** (large text, 1.25rem, with the water target in mono: "Pour to **300 g**"), then the next step in muted text.
- Full step list below, with the current step highlighted by the primary tint + a "Now" text label (not color alone).

## Controls

- Start / Pause (primary, 56px tall), Reset (secondary), Previous / Next step (ghost). Every control has text, so none is icon-only.
- Keyboard: Space = start/pause, ←/→ = previous/next step.
- Request a Screen Wake Lock while running, where supported.

## Accessibility

- The ticking timer is **not** a live region. A separate polite live region announces only step changes: "Step 3 of 7 at 0:45: pour in circles up to 300 g".
- Reduced motion: the ring does not animate and shows the static progress value.

## Finish

- At the last step: "Done — log this brew?" with the primary button `Log this brew`. It opens `/log` with the recipe and the measured time pre-filled.

## Deviations from Master

- Higher type scale (current step 1.25rem, timer 4.5rem).
- No bottom navigation (focus mode), with a persistent "Exit guide" instead.
