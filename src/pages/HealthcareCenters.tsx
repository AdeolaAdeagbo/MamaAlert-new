
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";
import { MapPin, Phone, Clock, Navigation, Loader2, Star } from "lucide-react";

interface HealthcareCenter {
  id: string;
  name: string;
  address: string;
  phone: string;
  rating: number;
  distance: number;
  type: string;
  isOpen: boolean;
}

const HealthcareCenters = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [centers, setCenters] = useState<HealthcareCenter[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const loadGoogleMaps = () => {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps) {
        resolve(window.google);
        return;
      }

      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        reject(new Error('Google Maps API key not configured'));
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve(window.google);
      script.onerror = () => reject(new Error('Failed to load Google Maps'));
      document.head.appendChild(script);
    });
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

  const findNearbyHealthcare = async () => {
    setIsLoading(true);
    try {
      await loadGoogleMaps();
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          
          const map = new google.maps.Map(document.createElement('div'), {
            center: { lat: latitude, lng: longitude },
            zoom: 15
          });

          const service = new google.maps.places.PlacesService(map);
          
          const request = {
            location: { lat: latitude, lng: longitude },
            radius: 15000, // 15km radius for more results
            type: 'hospital'
          };

          service.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
              const healthcareCenters = results.slice(0, 10).map(place => ({
                id: place.place_id || Math.random().toString(),
                name: place.name || 'Unknown Healthcare Center',
                address: place.vicinity || 'Address not available',
                phone: place.formatted_phone_number || 'Phone not available',
                rating: place.rating || 0,
                distance: place.geometry?.location ? 
                  calculateDistance(
                    latitude, 
                    longitude, 
                    place.geometry.location.lat(), 
                    place.geometry.location.lng()
                  ) : 0,
                type: place.types?.includes('hospital') ? 'Hospital' : 'Clinic',
                isOpen: place.opening_hours?.open_now || false
              }));
              
              // Sort by distance
              healthcareCenters.sort((a, b) => a.distance - b.distance);
              setCenters(healthcareCenters);
              
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
          console.error('Geolocation error:', error);
          toast({
            title: "Location Access Required",
            description: "Please enable location access to find nearby healthcare centers.",
            variant: "destructive"
          });
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.error('Maps loading error:', error);
      toast({
        title: "Maps Loading Error",
        description: "Failed to load Google Maps. Please check your internet connection.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Find Healthcare Centers</h1>
          <p className="text-muted-foreground">
            Locate nearby hospitals and clinics for your maternal care needs.
          </p>
        </div>

        {/* Search Button */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium">Find Nearby Healthcare Centers</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                We'll use your location to find the closest hospitals and clinics.
              </p>
              <Button 
                onClick={findNearbyHealthcare}
                disabled={isLoading}
                className="bg-blue-500 hover:bg-blue-600"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Finding Healthcare Centers...
                  </>
                ) : (
                  <>
                    <Navigation className="h-4 w-4 mr-2" />
                    Find Nearby Centers
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {centers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {centers.map((center) => (
              <Card key={center.id} className="border-blue-200">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg leading-tight">{center.name}</CardTitle>
                    <Badge variant={center.isOpen ? "default" : "secondary"}>
                      {center.isOpen ? "Open" : "Closed"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{center.type}</Badge>
                    {center.rating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm">{center.rating}</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{center.address}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{center.phone}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Navigation className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{center.distance} km away</span>
                    </div>
                    
                    <div className="pt-3">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          if (userLocation) {
                            const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${center.address}`;
                            window.open(url, '_blank');
                          }
                        }}
                      >
                        Get Directions
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {centers.length === 0 && !isLoading && (
          <Card className="text-center py-12">
            <CardContent>
              <MapPin className="h-12 w-12 mx-auto mb-4 text-blue-500 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No Results Yet</h3>
              <p className="text-muted-foreground">
                Click "Find Nearby Centers" to discover healthcare facilities in your area.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HealthcareCenters;
