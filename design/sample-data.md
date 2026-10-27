# Coffee Nerds — Sample Data for Designs

> The mock content used to fill the first website design (canvas "Coffee Nerds Website", 2026-10-26).
> Reuse it in future mockups so every screen tells the same story.
>
> **Real vs. invented:** methods and built-in recipes come from `PROJECT.md` §6.2 and §8. The Fazenda Santa Inês bag follows the example in §6.1. Every other coffee, roaster, brew, rating and stat is made up.

---

## 1. Story context

- **"Today"** is **Monday, 26 Oct 2026**, morning.
- The user is a **Coffee Nerd**: a V60, a French Press, an AeroPress and a **Comandante** hand grinder (grind is logged in clicks).
- Their favourite coffee right now is **Fazenda Santa Inês**, and their best cup was brewed this morning.

## 2. Coffees

### 2.1 Active bags

| Field | Fazenda Santa Inês — Yellow Bourbon | Guji Hambela | Huila Pink Bourbon |
|---|---|---|---|
| Roaster | Coffee Lab | Northside Roastery | Moinho Roasters |
| Country · region | Brazil · Sul de Minas | Ethiopia · Guji | Colombia · Huila |
| Farm / producer | Fazenda Santa Inês | — | — |
| Variety | Yellow Bourbon | Heirloom | Pink Bourbon |
| Process | Natural | Washed | Anaerobic |
| Altitude | 1,150 m | — | — |
| Roast level | Medium-light | Light | Light |
| Roast date | 2026-10-10 | 2026-10-19 | 2026-10-22 |
| Days off roast | 16 (Peak window) | 7 (Peak window) | 4 (Resting) |
| Roaster's notes | Chocolate, caramel, yellow fruits | Jasmine, bergamot, peach | Red berries, cacao nib |
| SCA score | 86 | 88 | 87.5 |
| Form | Whole bean | — | — |
| Bag weight | 250 g | — | — |
| Price | R$ 65.00 | — | — |
| Purchase date | 2026-10-15 | — | — |
| Personal notes | "Shines on pour-over. Needs a finer grind than the Ethiopians to avoid a sour finish." | — | — |
| Brews logged | 9 | 4 | 1 |
| Best result | 5★ V60 | 4★ V60 | 2★ French Press |
| Status | Active | Active | Active |

### 2.2 Finished bags

| Name | Roaster | Country | Process | Brews | Best rating |
|---|---|---|---|---|---|
| Cerrado Mineiro — Catuaí | Coffee Lab | Brazil | Pulped natural | 14 | 4 |
| Nyeri AA | Northside Roastery | Kenya | Washed | 11 | 5 |
| Sítio Rio Verde | Moinho Roasters | Brazil | Honey | 8 | 4 |

### 2.3 Freshness rule (days off roast)

| Days | Label | Pill background / text |
|---|---|---|
| 0–6 | Resting | `#E6EEF5` / `#1F5277` |
| 7–30 | Peak window | `#F7E3DE` / `#A3311F` |
| 31+ | Fading | `#EFECE6` / `#5F5B53` |

On the home screen, the freshness bar's fill is `days / 35`, capped at 100%.

## 3. Methods

| Method | Type | Filter | Description |
|---|---|---|---|
| V60 | Pour-over | Paper | Conical dripper with spiral ribs and a paper filter. Clean, bright cups; sensitive to pour technique. |
| French Press | Immersion | Metal | Full immersion with a metal mesh plunger. Heavy body and very forgiving. |
| AeroPress | Hybrid (immersion + pressure) | Paper | Immersion with a gentle press. Fast, versatile, travels well. |

## 4. Recipes

### 4.1 Built-in (real, from PROJECT.md §8)

| Method | Recipe | Author / source | Dose | Water | Ratio | Temp | Grind | Time | Used |
|---|---|---|---|---|---|---|---|---|---|
| V60 | The Ultimate V60 Technique | James Hoffmann | 30 g | 500 g | 1:16.7 | ~100 °C | Medium-fine | 3:30 | 12× |
| V60 | 4:6 Method | Tetsu Kasuya · 2016 World Brewers Cup | 20 g | 300 g | 1:15 | 93 °C | Medium-coarse | 3:30 | 5× |
| French Press | The Ultimate French Press Technique | James Hoffmann | 30 g | 500 g | 1:16.7 | ~100 °C | Medium | 9:00+ | Not used yet |
| French Press | French Press | Stumptown Coffee Roasters | 56 g | 850 g | 1:15 | 96 °C | Coarse | 4:00 | 1× |
| AeroPress | The Ultimate AeroPress Technique | James Hoffmann · standard | 11 g | 200 g | 1:18 | ~100 °C | Fine-medium | 3:00 | 4× |
| AeroPress | 2019 World AeroPress Champion | Wendelien van Bunnik · inverted | 30 g | 100 + 120 g | 1:7.3 | 92 °C | Coarse | 1:30 | Not used yet |

The "Used" counts are invented. The full step lists are in `PROJECT.md` §8.

### 4.2 User recipe (invented)

| Field | Value |
|---|---|
| Name | Santa Inês house V60 |
| Method | V60 |
| Based on | Hoffmann Ultimate V60 (duplicated) |
| Dose / water / ratio | 30 g / 500 g / 1:16.7 |
| Temp | 98 °C |
| Grind | Medium-fine · Comandante 24 clicks |
| Time | 3:30 |
| Used | 3× |

### 4.3 Brew-guide steps (Hoffmann V60, used in the phone timer)

| Starts at (s) | Label | Step | Scale target |
|---|---|---|---|
| 0 | 0:00 | Bloom: pour 60 g (twice the dose), then swirl so every ground is wet. | 60 g |
| 45 | 0:45 | Pour in circles: a steady spiral pour until the scale reads 300 g. | 300 g |
| 75 | 1:15 | Pour gently: a slower, lower pour up to 500 g. | 500 g |
| 105 | 1:45 | Stir & swirl: stir once gently with a spoon, then a gentle swirl to flatten the bed. | — |
| 120 | 2:00 | Drawdown: hands off. Let it drain; aim to finish around 3:30. | — |
| 210 | 3:30 | Done: pull the dripper. Taste it, then rate it while it's fresh. | — |

Timeline bar segments (share of 3:30): Bloom 21.4% · →300 g 14.3% · →500 g 14.3% · Stir 7.1% · Drawdown the rest.

## 5. Brews (history log, newest first)

Grinder for all brews: Comandante.

| Date | Coffee | Recipe | Method | Dose · water (g) | Grind | Time | Rating | Tasting notes | Next time |
|---|---|---|---|---|---|---|---|---|---|
| 26 Oct 08:15 | Fazenda Santa Inês | Hoffmann Ultimate V60 | V60 | 30 · 500 | 24 clicks | 3:32 | 5 | Sweet and round, long caramel finish. | Keep it. |
| 25 Oct 07:50 | Guji Hambela | Kasuya 4:6 | V60 | 20 · 300 | 28 clicks | 3:28 | 4 | Bright and floral, a touch thin. | Smaller first pour (for more sweetness). |
| 24 Oct 09:10 | Fazenda Santa Inês | Hoffmann AeroPress | AeroPress | 11 · 200 | 20 clicks | 3:00 | 3 | Sweet, a bit sour at the end. | Grind 2 clicks finer. |
| 23 Oct 08:05 | Huila Pink Bourbon | Stumptown French Press | French Press | 56 · 850 | 32 clicks | 4:00 | 2 | Muddy and heavy, flavours flat. | Let it rest longer; try Hoffmann's press. |
| 22 Oct 07:40 | Fazenda Santa Inês | Hoffmann Ultimate V60 | V60 | 30 · 500 | 26 clicks | 3:10 | 3 | Fast drawdown, slightly hollow. | Grind finer. |
| 21 Oct 08:20 | Guji Hambela | Hoffmann AeroPress | AeroPress | 11 · 200 | 18 clicks | 3:00 | 4 | Juicy peach, clean. | Try 1:16. |
| 20 Oct 07:55 | Fazenda Santa Inês | Kasuya 4:6 | V60 | 20 · 300 | 28 clicks | 3:25 | 3 | Clean but a little thin. | Bigger dose. |
| 19 Oct 08:30 | Guji Hambela | Hoffmann Ultimate V60 | V60 | 30 · 500 | 25 clicks | 3:40 | 3 | A bit astringent. | Grind coarser. |
| 18 Oct 08:00 | Fazenda Santa Inês | Hoffmann Ultimate V60 | V60 | 30 · 500 | 25 clicks | 3:20 | 4 | Getting there — more sweetness. | One click finer. |

### 5.1 The "best cup so far"

- **Fazenda Santa Inês · Hoffmann Ultimate V60 · 26 Oct**
- 30 g / 500 g · 1:16.7 · Comandante 24 clicks · 3:32 · **5 / 5**
- Sensory: Acidity 3 · Sweetness 5 · Body 4 · Bitterness 1
- Long note: "Sweet and round, long caramel finish. Like a milk-chocolate bar with ripe mango."

### 5.2 Best brew per coffee

| Coffee | Recipe | Detail |
|---|---|---|
| Fazenda Santa Inês | Hoffmann Ultimate V60 | 5★ · 24 clicks · 3:32 |
| Guji Hambela | Kasuya 4:6 | 4★ · 28 clicks · 3:28 |
| Huila Pink Bourbon | Stumptown French Press | 2★ · only 1 brew so far |

Best per method for Fazenda Santa Inês: V60 5/5 (24 clicks, 3:32) · AeroPress 3/5 (20 clicks, 3:00) · French Press not brewed yet.
The Coffee detail artboard shows 18 clicks for the AeroPress row. 20 clicks is the value that matches the log, so update that artboard.

## 6. Aggregates and stats

| Stat | Value |
|---|---|
| Brews this month | 23 |
| Bags on the shelf | 3 |
| Average rating | 3.8 / 5 |
| Most-used method | V60 |
| Hoffmann V60: brews / avg rating | 12 / 3.9 |

## 7. Form defaults and UI copy

**Log a brew (pre-filled state)**
- Coffee: Fazenda Santa Inês · Recipe: Hoffmann Ultimate V60
- Date & time: `2026-10-26T08:15`
- Dose 30 g · Water 500 g · Temp 98 °C · Time 3:30 · Grinder "Comandante — 24 clicks"
- Sensory defaults: Acidity 3 · Sweetness 4 · Body 3 · Bitterness 2
- Hint: Last time with this coffee: "Grind 2 clicks finer."

**Rating words (1–5):** Undrinkable · Meh · Decent · Great · Best cup yet (0 = "Tap a star")

**Sensory slider ends:**

| Attribute | 1 | 5 |
|---|---|---|
| Acidity | Flat | Bright |
| Sweetness | None | Very sweet |
| Body | Tea-like | Heavy |
| Bitterness | None | Harsh |

**Recurring copy**
- Home hero: "Good morning. What's in the cup today?" / "Pick a bag, pick a recipe, write down how it tasted. Your journal remembers the rest — and tells you how to repeat the good cups."
- Resting tip: "Huila Pink Bourbon was roasted 4 days ago. Give it a few more days before you judge it."
- Dialing-in tip: "Drawdown much past 3:30 → grind coarser. Sour or hollow and fast → grind finer. Change one thing per brew and note it in 'next time'."
- Log form note: "Only the coffee, recipe and rating are required. Everything else is optional."

## 8. Visual tokens (for consistency)

| Token | Value |
|---|---|
| Background | `#F7F6F3` |
| Surface | `#FFFFFF` |
| Ink | `#1B1A17` |
| Muted text | `#5F5B53` (body) · `#6B665E` (small labels) |
| Line | `#E2DFD8` · `#EFECE6` (row dividers) · `#CFCAC0` (inputs) |
| Accent (cherry) | `#A3311F` · hover `#7E2416` · tint `#F7E3DE` / `#FBF4F2` |
| Info (blue) | `#E6EEF5` bg · `#1F5277` / `#163E5C` text |
| Dark mode (brew guide) | bg `#141311` · surface `#24221F` · accent `#F08A74` · muted `#A9A399` |
| Fonts | Space Grotesk (headings) · Inter (body) · JetBrains Mono (numbers) |
