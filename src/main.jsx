import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Layout } from './components/Layout/Layout';
import { Home } from './pages/Home/Home';
import { GamePage } from './pages/GamePage/GamePage';
import { FinalPage } from './pages/FinalPage/FinalPage';
import './styles/global.css';

const basePath = new URL(import.meta.env.BASE_URL, window.location.origin).pathname.replace(/\/$/, '');

function getPathname(path = window.location.pathname) {
  return new URL(path, window.location.origin).pathname;
}

function toAppPath(path = window.location.pathname) {
  const pathname = getPathname(path);

  if (basePath && pathname.startsWith(`${basePath}/`)) {
    return pathname.slice(basePath.length) || '/';
  }

  if (basePath && pathname === basePath) {
    return '/';
  }

  return pathname;
}

function getInitialPath() {
  const redirectedPath = sessionStorage.getItem('spa-redirect');
  if (redirectedPath) {
    sessionStorage.removeItem('spa-redirect');
    return redirectedPath;
  }

  return window.location.pathname;
}

function getRoute(path = window.location.pathname) {
  const appPath = toAppPath(path);

  if (appPath === '/final') {
    return { name: 'final' };
  }

  const gameMatch = appPath.match(/^\/game\/(\d)$/);
  if (gameMatch) {
    return { name: 'game', gameNumber: Number(gameMatch[1]) };
  }

  return { name: 'home' };
}

function App() {
  const [route, setRoute] = useState(getRoute);

  const navigate = (path) => {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const targetPath = `${basePath}${normalizedPath}` || '/';
    window.history.pushState({}, '', targetPath);
    setRoute(getRoute(targetPath));
  };

  React.useEffect(() => {
    const initialPath = getInitialPath();
    if (initialPath !== window.location.pathname) {
      const appPath = toAppPath(initialPath);
      const targetPath = `${basePath}${appPath}` || '/';
      window.history.replaceState({}, '', targetPath);
      setRoute(getRoute(targetPath));
    }
  }, []);

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
