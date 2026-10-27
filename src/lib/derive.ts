import type { Brew, GuideStep, MethodId, Recipe } from '../data/types';

// ---- Dates -------------------------------------------------------------------------
// Dates are stored as local "YYYY-MM-DD" or "YYYY-MM-DDTHH:MM" strings and parsed by hand
// so the result never depends on the viewer's time zone.

const DAY_MS = 86_400_000;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface Parts {
  y: number;
  m: number;
  d: number;
  hh: number;
  mm: number;
}

function parts(value: string): Parts {
  const [date, time = '00:00'] = value.split('T');
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  return { y, m, d, hh, mm };
}

function dayNumber(value: string): number {
  const p = parts(value);
  return Date.UTC(p.y, p.m - 1, p.d) / DAY_MS;
}

function weekday(value: string): string {
  return WEEKDAYS[new Date(dayNumber(value) * DAY_MS).getUTCDay()];
}

const pad = (n: number) => String(n).padStart(2, '0');

/** "26 Oct" */
export function formatDay(value: string): string {
  const p = parts(value);
  return `${p.d} ${MONTHS[p.m - 1]}`;
}

/** "08:15" */
export function formatClock(value: string): string {
  const p = parts(value);
  return `${pad(p.hh)}:${pad(p.mm)}`;
}

/** "26 Oct 08:15" */
export function formatDayTime(value: string): string {
  return `${formatDay(value)} ${formatClock(value)}`;
}

/** "MON · 26 OCT 2026" */
export function formatLongDate(value: string): string {
  const p = parts(value);
  return `${weekday(value)} · ${p.d} ${MONTHS[p.m - 1]} ${p.y}`.toUpperCase();
}

/** "Today" for today, else "Sun 25". */
export function formatRelativeDay(value: string, today: string): string {
  if (dayNumber(value) === dayNumber(today)) return 'Today';
  return `${weekday(value)} ${parts(value).d}`;
}

export function daysBetween(from: string, to: string): number {
  return dayNumber(to) - dayNumber(from);
}

// ---- Freshness ---------------------------------------------------------------------

export type FreshnessKind = 'resting' | 'peak' | 'fading';

export interface Freshness {
  kind: FreshnessKind;
  label: string;
}

/** sample-data.md §2.3: 0–6 resting, 7–30 peak window, 31+ fading. */
export function freshness(days: number): Freshness {
  if (days < 7) return { kind: 'resting', label: 'Resting' };
  if (days <= 30) return { kind: 'peak', label: 'Peak window' };
  return { kind: 'fading', label: 'Fading' };
}

/** Fill of the home-screen freshness bar: days / 35, capped at 100%. */
export function freshnessPct(days: number): number {
  return Math.min(100, Math.round((days / 35) * 100));
}

// ---- Recipes -----------------------------------------------------------------------

/** "1:16.7", or "—" when either value is missing. */
export function ratio(dose: number, water: number): string {
  if (!(dose > 0) || !(water > 0)) return '—';
  return `1:${Math.round((water / dose) * 10) / 10}`;
}

/** "~100 °C" for "just off the boil", else "93 °C". */
export function formatTemp(recipe: Pick<Recipe, 'temp' | 'tempApprox'>, unit = ' °C'): string {
  return `${recipe.tempApprox ? '~' : ''}${recipe.temp}${unit}`;
}

export function waterLabel(recipe: Pick<Recipe, 'water' | 'waterLabel'>): string {
  return recipe.waterLabel ?? `${recipe.water} g`;
}

/** "3:05" */
export function mmss(seconds: number): string {
  const s = Math.max(0, Math.round(seconds));
  return `${Math.floor(s / 60)}:${pad(s % 60)}`;
}

export interface TimelineSegment {
  title: string;
  label: string;
  start: number;
  /** Share of the total brew time, 0–100. */
  pct: number;
}

/** Splits a guide into timeline segments, each lasting until the next step starts. */
export function timeline(guide: GuideStep[]): TimelineSegment[] {
  const total = guide[guide.length - 1]?.at ?? 0;
  if (total <= 0) return [];
  return guide.slice(0, -1).map((step, i) => ({
    title: step.title,
    label: step.short ?? step.title,
    start: step.at,
    pct: ((guide[i + 1].at - step.at) / total) * 100,
  }));
}

// ---- Brews -------------------------------------------------------------------------

export function newestFirst(brews: Brew[]): Brew[] {
  return [...brews].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

/** The highest-rated brew; ties go to the most recent one. */
export function bestBrew(brews: Brew[]): Brew | undefined {
  return newestFirst(brews).reduce<Brew | undefined>((best, b) => (!best || b.rating > best.rating ? b : best), undefined);
}

/** Best brew of a coffee for each method it was brewed with. */
export function bestPerMethod(brews: Brew[], recipes: Recipe[]): Map<MethodId, Brew> {
  const methodOf = new Map(recipes.map((r) => [r.id, r.methodId]));
  const groups = new Map<MethodId, Brew[]>();
  for (const b of brews) {
    const m = methodOf.get(b.recipeId);
    if (!m) continue;
    groups.set(m, [...(groups.get(m) ?? []), b]);
  }
  const out = new Map<MethodId, Brew>();
  for (const [m, list] of groups) {
    const best = bestBrew(list);
    if (best) out.set(m, best);
  }
  return out;
}

/** The latest brew of a coffee logged before a given date-time. */
export function lastBrewBefore(brews: Brew[], coffeeId: string, before: string): Brew | undefined {
  return newestFirst(brews).find((b) => b.coffeeId === coffeeId && b.date < before);
}

export function average(values: number[]): number | undefined {
  if (!values.length) return undefined;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function formatRating(value: number | undefined): string {
  return value === undefined ? '—' : String(Math.round(value * 10) / 10);
}
