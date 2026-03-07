import { useEffect } from 'react';
import { useLocation } from 'wouter';

export default function GoogleAnalytics() {
  const [location] = useLocation();

  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('config', 'G-JWZKR16JFE', {
        page_path: location,
      });
    }
  }, [location]);

  return null;
}
