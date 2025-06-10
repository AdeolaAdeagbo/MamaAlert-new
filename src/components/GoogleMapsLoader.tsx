
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Navigation } from "lucide-react";

interface GoogleMapsLoaderProps {
  onPlacesLoaded: (places: any[]) => void;
}

export const GoogleMapsLoader = ({ onPlacesLoaded }: GoogleMapsLoaderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadGoogleMaps = (key: string) => {
    return new Promise((resolve, reject) => {
      if (window.google) {
        resolve(window.google);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve(window.google);
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const findNearbyHealthcare = async () => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      toast({
        title: "Configuration Error",
        description: "Google Maps API key not configured. Please contact support.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      await loadGoogleMaps(apiKey);
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          const map = new google.maps.Map(document.createElement('div'), {
            center: { lat: latitude, lng: longitude },
            zoom: 15
          });

          const service = new google.maps.places.PlacesService(map);
          
          const request = {
            location: { lat: latitude, lng: longitude },
            radius: 10000, // 10km radius
            type: 'hospital'
          };

          service.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
              const healthcareCenters = results.map(place => ({
                id: place.place_id,
                name: place.name,
                address: place.vicinity,
                rating: place.rating || 0,
                distance: calculateDistance(latitude, longitude, 
                  place.geometry?.location?.lat() || 0, 
                  place.geometry?.location?.lng() || 0),
                type: place.types?.includes('hospital') ? 'hospital' : 'clinic',
                phone: place.formatted_phone_number || 'Not available',
                isOpen: place.opening_hours?.open_now || false
              }));
              
              onPlacesLoaded(healthcareCenters);
              toast({
                title: "Healthcare Centers Found",
                description: `Found ${healthcareCenters.length} nearby healthcare centers.`
              });
            } else {
              toast({
                title: "Search Failed",
                description: "Could not find nearby healthcare centers. Please try again.",
                variant: "destructive"
              });
            }
            setIsLoading(false);
          });
        },
        (error) => {
          toast({
            title: "Location Access Denied",
            description: "Please enable location access to find nearby healthcare centers.",
            variant: "destructive"
          });
          setIsLoading(false);
        }
      );
    } catch (error) {
      toast({
        title: "Maps API Error",
        description: "Failed to load Google Maps. Please check your internet connection.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c * 10) / 10; // Round to 1 decimal place
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-blue-50">
      <div className="flex items-center gap-2">
        <MapPin className="h-5 w-5 text-blue-600" />
        <h3 className="font-medium">Find Nearby Healthcare Centers</h3>
      </div>
      
      <Button 
        onClick={findNearbyHealthcare}
        disabled={isLoading}
        className="w-full"
      >
        <Navigation className="h-4 w-4 mr-2" />
        {isLoading ? 'Finding Healthcare Centers...' : 'Find Nearby Centers'}
      </Button>
    </div>
  );
};
