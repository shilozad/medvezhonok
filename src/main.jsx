import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Layout } from './components/Layout/Layout';
import { Home } from './pages/Home/Home';
import { GamePage } from './pages/GamePage/GamePage';
import { FinalPage } from './pages/FinalPage/FinalPage';
import './styles/global.css';

function getRoute() {
  const path = window.location.pathname;

  if (path === '/final') {
    return { name: 'final' };
  }

  const gameMatch = path.match(/^\/game\/(\d)$/);
  if (gameMatch) {
    return { name: 'game', gameNumber: Number(gameMatch[1]) };
  }

  return { name: 'home' };
}

function App() {
  const [route, setRoute] = useState(getRoute);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setRoute(getRoute());
  };

  React.useEffect(() => {
    const onPopState = () => setRoute(getRoute());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const page = useMemo(() => {
    if (route.name === 'game') {
      return <GamePage gameNumber={route.gameNumber} navigate={navigate} />;
    }

    if (route.name === 'final') {
      return <FinalPage navigate={navigate} />;
    }

    return <Home navigate={navigate} />;
  }, [route]);

  return <Layout>{page}</Layout>;
}

createRoot(document.getElementById('root')).render(<App />);
