import { Link } from 'react-router-dom';

export function NotFound({ what = 'page' }: { what?: string }) {
  return (
    <main className="page">
      <div className="page-head">
        <h1 className="h1">Nothing here</h1>
        <p className="muted">We couldn’t find that {what}.</p>
      </div>
      <p>
        <Link to="/">Back to the journal</Link>
      </p>
    </main>
  );
}
