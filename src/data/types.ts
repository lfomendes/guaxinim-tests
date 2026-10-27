export type MethodId = 'v60' | 'press' | 'aero';

export interface Method {
  id: MethodId;
  name: string;
  type: string;
  filter: string;
  description: string;
}

export type CoffeeStatus = 'active' | 'finished';

export interface Coffee {
  id: string;
  /** Full name as printed on the bag. */
  name: string;
  /** Short name used in lists and the brew log. */
  shortName: string;
  roaster: string;
  country: string;
  region?: string;
  farm?: string;
  variety?: string;
  process: string;
  altitude?: number;
  roastLevel?: string;
  /** ISO date, e.g. 2026-10-10. */
  roastDate?: string;
  roasterNotes?: string[];
  sca?: number;
  form?: string;
  bagWeight?: number;
  price?: string;
  purchaseDate?: string;
  personalNotes?: string;
  status: CoffeeStatus;
  /**
   * Total brews of this bag, including ones from before the history log starts.
   * The history only holds the most recent brews.
   */
  brewCount: number;
  /** Best rating, for bags whose brews are not in the history log. */
  bestRating?: number;
}

export interface RecipeStep {
  /** Time mark as written in the recipe, e.g. "0:45–1:15" or "Prep". */
  time: string;
  action: string;
  /** Scale target, e.g. "300 g". */
  water?: string;
}

export interface GuideStep {
  /** Seconds from the start of the brew. */
  at: number;
  title: string;
  /** Short label for the recipe timeline bar, when the title is too long. */
  short?: string;
  detail: string;
  /** Scale target, e.g. "300 g". */
  target?: string;
}

export interface Recipe {
  id: string;
  methodId: MethodId;
  name: string;
  /** Short name used in the brew log. */
  shortName: string;
  author: string;
  sourceUrl?: string;
  builtIn: boolean;
  /** For user recipes: the recipe it was duplicated from. */
  basedOn?: string;
  dose: number;
  water: number;
  /** Overrides the water label when the water is split (e.g. "100 + 120 g"). */
  waterLabel?: string;
  /** Water temperature in °C. */
  temp: number;
  /** True when the recipe says "just off the boil". */
  tempApprox?: boolean;
  grind: string;
  /** Grinder setting, for user recipes, e.g. "Comandante 24 clicks". */
  grindSetting?: string;
  /** Total brew time as written, e.g. "3:30" or "9:00+". */
  time: string;
  /** How many times the user has brewed this recipe. */
  uses: number;
  /** Average rating across all brews, when known. */
  avgRating?: number;
  steps: RecipeStep[];
  /** Timed steps for the brew guide. The last one is the end of the brew. */
  guide: GuideStep[];
}

export interface Sensory {
  acidity: number;
  sweetness: number;
  body: number;
  bitterness: number;
}

export interface Brew {
  id: string;
  /** Local date-time, e.g. 2026-10-26T08:15. */
  date: string;
  coffeeId: string;
  recipeId: string;
  dose: number;
  water: number;
  temp?: number;
  grinder?: string;
  /** Grind setting in clicks. */
  clicks?: number;
  /** Actual total time, e.g. "3:32". */
  time?: string;
  rating: number;
  notes?: string;
  /** A longer write-up of the cup. */
  longNotes?: string;
  next?: string;
  sensory?: Sensory;
}
