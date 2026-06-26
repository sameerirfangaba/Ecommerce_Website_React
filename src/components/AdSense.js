import { useEffect } from 'react';

function AdSense() {
  useEffect(() => {
    try {
      // Initialize AdSense
      if (window.adsbygoogle) {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return null;
}

export default AdSense;