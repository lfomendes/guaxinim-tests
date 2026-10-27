import { describe, expect, it } from 'vitest';
import { BREWS } from '../data/brews';
import { RECIPES } from '../data/recipes';
import { TODAY } from '../data/journal';
import {
  bestBrew,
  bestPerMethod,
  daysBetween,
  formatLongDate,
  formatRelativeDay,
  freshness,
  freshnessPct,
  lastBrewBefore,
  mmss,
  ratio,
  timeline,
} from './derive';

describe('freshness', () => {
  it('follows the days-off-roast rule', () => {
    expect(freshness(0).label).toBe('Resting');
    expect(freshness(6).label).toBe('Resting');
    expect(freshness(7).label).toBe('Peak window');
    expect(freshness(30).label).toBe('Peak window');
    expect(freshness(31).label).toBe('Fading');
  });

  it('fills the bar as days / 35, capped at 100%', () => {
    expect(freshnessPct(16)).toBe(46);
    expect(freshnessPct(70)).toBe(100);
  });

  it('counts days off roast from the journal’s today', () => {
    expect(daysBetween('2026-10-10', TODAY)).toBe(16);
    expect(daysBetween('2026-10-19', TODAY)).toBe(7);
    expect(daysBetween('2026-10-22', TODAY)).toBe(4);
  });
});

describe('ratio', () => {
  it('rounds to one decimal', () => {
    expect(ratio(30, 500)).toBe('1:16.7');
    expect(ratio(20, 300)).toBe('1:15');
    expect(ratio(11, 200)).toBe('1:18.2');
    expect(ratio(30, 220)).toBe('1:7.3');
  });

  it('shows a dash for missing values', () => {
    expect(ratio(0, 500)).toBe('—');
    expect(ratio(NaN, 500)).toBe('—');
  });
});

describe('dates', () => {
  it('formats the hero date', () => {
    expect(formatLongDate(TODAY)).toBe('MON · 26 OCT 2026');
  });

  it('formats recent brew days', () => {
    expect(formatRelativeDay('2026-10-26T08:15', TODAY)).toBe('Today');
    expect(formatRelativeDay('2026-10-25T07:50', TODAY)).toBe('Sun 25');
  });

  it('formats seconds as m:ss', () => {
    expect(mmss(0)).toBe('0:00');
    expect(mmss(212)).toBe('3:32');
  });
});

describe('best brews', () => {
  const santa = BREWS.filter((b) => b.coffeeId === 'santa-ines');

  it('finds the best cup so far', () => {
    expect(bestBrew(BREWS)?.date).toBe('2026-10-26T08:15');
  });

  it('breaks rating ties with the most recent brew', () => {
    const guji = BREWS.filter((b) => b.coffeeId === 'guji-hambela');
    expect(bestBrew(guji)?.recipeId).toBe('kasuya-46');
  });

  it('finds the best brew per method', () => {
    const best = bestPerMethod(santa, RECIPES);
    expect(best.get('v60')?.clicks).toBe(24);
    expect(best.get('aero')?.clicks).toBe(20);
    expect(best.has('press')).toBe(false);
  });

  it('finds the previous brew of a coffee for the log-form hint', () => {
    expect(lastBrewBefore(BREWS, 'santa-ines', '2026-10-26T08:15')?.next).toBe('Grind 2 clicks finer.');
  });
});

describe('timeline', () => {
  it('splits the Hoffmann V60 guide into shares of 3:30', () => {
    const segs = timeline(RECIPES[0].guide).map((s) => Math.round(s.pct * 10) / 10);
    expect(segs).toEqual([21.4, 14.3, 14.3, 7.1, 42.9]);
  });
});
