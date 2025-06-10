
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Loader2 } from "lucide-react";

interface GoogleMapsLoaderProps {
  onMapLoad: (mapInstance: google.maps.Map) => void;
}

export const GoogleMapsLoader = ({ onMapLoad }: GoogleMapsLoaderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [mapContainer, setMapContainer] = useState<HTMLDivElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (mapContainer && window.google?.maps) {
      const map = new google.maps.Map(mapContainer, {
        center: { lat: 9.0820, lng: 8.6753 }, // Nigeria center
        zoom: 6,
        styles: [
          {
            featureType: "poi.medical",
            elementType: "geometry",
            stylers: [{ color: "#ff6b6b" }]
          }
        ]
      });
      onMapLoad(map);
    }
  }, [mapContainer, onMapLoad]);

  const loadGoogleMaps = () => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      toast({
        title: "Configuration Error",
        description: "Google Maps API key not configured. Please contact support.",
        variant: "destructive"
      });
      return;
    }

    if (window.google?.maps) {
      return;
    }

    setIsLoading(true);
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsLoading(false);
      toast({
        title: "Maps Loaded",
        description: "Google Maps is ready to use.",
      });
    };
    script.onerror = () => {
      setIsLoading(false);
      toast({
        title: "Maps Error",
        description: "Failed to load Google Maps. Please check your internet connection.",
        variant: "destructive"
      });
    };
    document.head.appendChild(script);
  };

  useEffect(() => {
    loadGoogleMaps();
  }, []);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Map View
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading maps...</span>
          </div>
        )}
        <div 
          ref={setMapContainer}
          className="w-full h-64 bg-muted rounded-lg"
          style={{ minHeight: '256px' }}
        />
      </CardContent>
    </Card>
  );
};
