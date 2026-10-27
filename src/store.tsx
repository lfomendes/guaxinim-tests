import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { BREWS } from './data/brews';
import { COFFEES } from './data/coffees';
import { MONTH_STATS, TODAY } from './data/journal';
import { RECIPES } from './data/recipes';
import type { Brew, Coffee, CoffeeStatus, Recipe } from './data/types';
import { newestFirst } from './lib/derive';

// Sample data is the starting point; what the user adds in this browser is kept in
// localStorage on top of it.

const STORAGE_KEY = 'coffee-nerds:v1';

interface Saved {
  brews: Brew[];
  statuses: Record<string, CoffeeStatus>;
}

function load(): Saved {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Saved>;
      return { brews: parsed.brews ?? [], statuses: parsed.statuses ?? {} };
    }
  } catch {
    // Storage blocked or corrupt: start from the sample data.
  }
  return { brews: [], statuses: {} };
}

export interface MonthStats {
  brews: number;
  avgRating: number;
  mostUsedMethod: string;
  bagsOnShelf: number;
}

interface Journal {
  today: string;
  coffees: Coffee[];
  recipes: Recipe[];
  /** Newest first. */
  brews: Brew[];
  stats: MonthStats;
  addBrew: (brew: Omit<Brew, 'id'>) => Brew;
  setCoffeeStatus: (id: string, status: CoffeeStatus) => void;
}

const JournalContext = createContext<Journal | null>(null);

export function JournalProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState<Saved>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch {
      // Not persisted; the journal still works for this visit.
    }
  }, [saved]);

  const addBrew = useCallback((input: Omit<Brew, 'id'>) => {
    const brew: Brew = { ...input, id: `b-${Date.now()}` };
    setSaved((s) => ({ ...s, brews: [...s.brews, brew] }));
    return brew;
  }, []);

  const setCoffeeStatus = useCallback((id: string, status: CoffeeStatus) => {
    setSaved((s) => ({ ...s, statuses: { ...s.statuses, [id]: status } }));
  }, []);

  const value = useMemo<Journal>(() => {
    const added = saved.brews;
    const coffees = COFFEES.map((c) => ({
      ...c,
      status: saved.statuses[c.id] ?? c.status,
      brewCount: c.brewCount + added.filter((b) => b.coffeeId === c.id).length,
    }));
    const recipes = RECIPES.map((r) => ({ ...r, uses: r.uses + added.filter((b) => b.recipeId === r.id).length }));
    const total = MONTH_STATS.brews + added.length;
    const ratingSum = MONTH_STATS.avgRating * MONTH_STATS.brews + added.reduce((sum, b) => sum + b.rating, 0);
    return {
      today: TODAY,
      coffees,
      recipes,
      brews: newestFirst([...BREWS, ...added]),
      stats: {
        brews: total,
        avgRating: Math.round((ratingSum / total) * 10) / 10,
        mostUsedMethod: MONTH_STATS.mostUsedMethod,
        bagsOnShelf: coffees.filter((c) => c.status === 'active').length,
      },
      addBrew,
      setCoffeeStatus,
    };
  }, [saved, addBrew, setCoffeeStatus]);

  return <JournalContext.Provider value={value}>{children}</JournalContext.Provider>;
}

export function useJournal(): Journal {
  const ctx = useContext(JournalContext);
  if (!ctx) throw new Error('useJournal must be used inside <JournalProvider>');
  return ctx;
}

/** Lookups shared by most pages. */
export function useLookups() {
  const { coffees, recipes } = useJournal();
  return useMemo(() => {
    const coffeeById = new Map(coffees.map((c) => [c.id, c]));
    const recipeById = new Map(recipes.map((r) => [r.id, r]));
    return { coffeeById, recipeById };
  }, [coffees, recipes]);
}
