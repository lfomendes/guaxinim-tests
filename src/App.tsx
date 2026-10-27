import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { BrewGuide } from './pages/BrewGuide';
import { CoffeeDetail } from './pages/CoffeeDetail';
import { Coffees } from './pages/Coffees';
import { History } from './pages/History';
import { Journal } from './pages/Journal';
import { LogBrew } from './pages/LogBrew';
import { NotFound } from './pages/NotFound';
import { RecipeDetail } from './pages/RecipeDetail';
import { Recipes } from './pages/Recipes';
import { JournalProvider } from './store';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function App() {
  return (
    <JournalProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Journal />} />
            <Route path="coffees" element={<Coffees />} />
            <Route path="coffees/:id" element={<CoffeeDetail />} />
            <Route path="recipes" element={<Recipes />} />
            <Route path="recipes/:id" element={<RecipeDetail />} />
            <Route path="log" element={<LogBrew />} />
            <Route path="history" element={<History />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          {/* Full-screen, phone-first view with its own dark chrome. */}
          <Route path="guide/:id" element={<BrewGuide />} />
        </Routes>
      </BrowserRouter>
    </JournalProvider>
  );
}
