import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hace scroll al tope de la página cada vez que cambia la ruta.
 * Colocar dentro de <BrowserRouter> y antes de <Routes>.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}
