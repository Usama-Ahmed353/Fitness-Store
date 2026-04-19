import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop - Scrolls the window to top on route changes.
 * Place inside <Router> so it has access to location context.
 */
const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    console.log('Route changed to:', pathname + search);
    window.scrollTo(0, 0);
    // Force page repaint
    window.dispatchEvent(new Event('routeChange'));
  }, [pathname, search]);

  return null;
};

export default ScrollToTop;
