import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Logo, PlusIcon } from './Icons';

const NAV = [
  { to: '/', label: 'Journal', end: true },
  { to: '/coffees', label: 'Coffees' },
  { to: '/recipes', label: 'Recipes' },
  { to: '/history', label: 'History' },
];

export function Layout() {
  const { pathname } = useLocation();
  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar__inner">
          <Link to="/" className="brand">
            <Logo />
            Coffee Nerds
          </Link>
          <nav aria-label="Main" className="nav">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className="nav__link">
                {item.label}
              </NavLink>
            ))}
          </nav>
          {pathname !== '/log' && (
            <Link to="/log" className="btn btn--accent btn--pill">
              <PlusIcon />
              Log a brew
            </Link>
          )}
        </div>
      </header>
      <Outlet />
    </div>
  );
}
