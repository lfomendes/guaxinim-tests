import type { Method } from './types';

// PROJECT.md §6.2, descriptions from sample-data.md §3.
export const METHODS: Method[] = [
  {
    id: 'v60',
    name: 'V60',
    type: 'Pour-over',
    filter: 'Paper',
    description: 'Conical dripper with spiral ribs and a paper filter. Clean, bright cups; sensitive to pour technique.',
  },
  {
    id: 'press',
    name: 'French Press',
    type: 'Immersion',
    filter: 'Metal',
    description: 'Full immersion with a metal mesh plunger. Heavy body and very forgiving.',
  },
  {
    id: 'aero',
    name: 'AeroPress',
    type: 'Hybrid (immersion + pressure)',
    filter: 'Paper',
    description: 'Immersion with a gentle press. Fast, versatile, travels well.',
  },
];
