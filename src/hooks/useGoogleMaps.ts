
import { useState, useEffect } from 'react';

interface GoogleMapsConfig {
  apiKey: string;
  libraries: string[];
}

export const useGoogleMaps = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      return;
    }

    const config: GoogleMapsConfig = {
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
      libraries: ['places']
    };

    if (!config.apiKey) {
      setError('Google Maps API key not configured');
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${config.apiKey}&libraries=${config.libraries.join(',')}&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;

    // Global callback function
    (window as any).initGoogleMaps = () => {
      setIsLoaded(true);
    };

    script.onerror = () => {
      setError('Failed to load Google Maps');
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup
      delete (window as any).initGoogleMaps;
      const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return { isLoaded, error };
};
