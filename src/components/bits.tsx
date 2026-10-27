import type { ReactNode } from 'react';
import type { Coffee } from '../data/types';
import { daysBetween, freshness } from '../lib/derive';
import { StarIcon } from './Icons';

export function Stars({ rating, size = 18 }: { rating: number; size?: number }) {
  return (
    <div className="stars" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <StarIcon key={n} size={size} filled={n <= rating} />
      ))}
    </div>
  );
}

export function FreshPill({ days, children }: { days: number; children?: ReactNode }) {
  const f = freshness(days);
  return <span className={`pill pill--${f.kind}`}>{children ?? f.label}</span>;
}

/** Days off roast for a coffee, or undefined when the roast date is unknown. */
export function daysOffRoast(coffee: Coffee, today: string): number | undefined {
  return coffee.roastDate ? daysBetween(coffee.roastDate, today) : undefined;
}

export function Field({ label, value, mono }: { label: string; value: ReactNode; mono?: boolean }) {
  return (
    <div>
      <dt className="label">{label}</dt>
      <dd className={mono ? 'mono-sm' : undefined}>{value}</dd>
    </div>
  );
}

/** One row of filled/empty cells, e.g. a sensory score out of 5. */
export function Meter({ value }: { value: number }) {
  return (
    <div className="meter" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((n) => (
        <div key={n} className={n <= value ? 'meter__cell meter__cell--on' : 'meter__cell'} />
      ))}
    </div>
  );
}
