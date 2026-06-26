import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // ✅ Instant scroll to top (no smooth animation)
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;