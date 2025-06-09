
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";
import { MapPin, Phone, Clock, Star } from "lucide-react";

interface HealthcareCenter {
  id: string;
  name: string;
  address: string;
  phone?: string;
  rating?: number;
  distance?: number;
  isOpen?: boolean;
}

const HealthcareCenters = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { isLoaded, error } = useGoogleMaps();
  const [centers, setCenters] = useState<HealthcareCenter[]>([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const getCurrentLocation = useCallback(() => {
    return new Promise<{lat: number, lng: number}>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    });
  }, []);

  const searchNearbyHealthcare = useCallback(async () => {
    if (!isLoaded || !window.google) {
      toast({
        title: "Maps not ready",
        description: "Please wait for Google Maps to load and try again.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const location = await getCurrentLocation();
      setUserLocation(location);

      const service = new google.maps.places.PlacesService(
        document.createElement('div')
      );

      const request = {
        location: new google.maps.LatLng(location.lat, location.lng),
        radius: 10000, // 10km radius
        types: ['hospital', 'doctor', 'health'],
        keyword: 'maternity obstetrics gynecology pregnancy'
      };

      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          const healthcareCenters: HealthcareCenter[] = results.slice(0, 12).map((place, index) => ({
            id: place.place_id || `center-${index}`,
            name: place.name || 'Healthcare Center',
            address: place.vicinity || 'Address not available',
            phone: place.formatted_phone_number,
            rating: place.rating,
            distance: place.geometry?.location ? 
              google.maps.geometry.spherical.computeDistanceBetween(
                new google.maps.LatLng(location.lat, location.lng),
                place.geometry.location
              ) / 1000 : undefined,
            isOpen: place.opening_hours?.open_now
          }));

          setCenters(healthcareCenters);
          toast({
            title: "Healthcare centers found!",
            description: `Found ${healthcareCenters.length} healthcare centers near you.`
          });
        } else {
          throw new Error('No healthcare centers found nearby');
        }
      });
    } catch (error) {
      console.error('Error finding healthcare centers:', error);
      toast({
        title: "Location Error",
        description: "Could not find your location. Please enable location access and try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [isLoaded, getCurrentLocation, toast]);

  useEffect(() => {
    if (isLoaded && !error) {
      searchNearbyHealthcare();
    }
  }, [isLoaded, error, searchNearbyHealthcare]);

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <h2 className="text-xl font-bold text-red-800 mb-4">Maps Service Error</h2>
                <p className="text-red-700 mb-4">{error}</p>
                <p className="text-sm text-red-600">
                  Please contact support if this issue persists.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Healthcare Centers Near You
          </h1>
          <p className="text-muted-foreground">
            Find maternity and healthcare centers in your area for emergency visits and routine care.
          </p>
        </div>

        {!isLoaded && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p>Loading Google Maps...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {isLoaded && (
          <div className="mb-6">
            <Button 
              onClick={searchNearbyHealthcare}
              disabled={loading}
              className="bg-rose-600 hover:bg-rose-700"
            >
              <MapPin className="h-4 w-4 mr-2" />
              {loading ? "Searching..." : "Refresh Location & Search"}
            </Button>
          </div>
        )}

        {centers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {centers.map((center) => (
              <Card key={center.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-start justify-between">
                    <span className="text-lg">{center.name}</span>
                    {center.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-muted-foreground">{center.rating}</span>
                      </div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                      <span className="text-sm">{center.address}</span>
                    </div>
                    
                    {center.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a 
                          href={`tel:${center.phone}`}
                          className="text-sm text-rose-600 hover:underline"
                        >
                          {center.phone}
                        </a>
                      </div>
                    )}

                    {center.distance && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {center.distance.toFixed(1)} km away
                        </span>
                      </div>
                    )}

                    {center.isOpen !== undefined && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className={`text-sm ${center.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                          {center.isOpen ? 'Open now' : 'Closed'}
                        </span>
                      </div>
                    )}

                    <div className="pt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const query = encodeURIComponent(`${center.name} ${center.address}`);
                          window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
                        }}
                        className="w-full"
                      >
                        View on Maps
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {isLoaded && centers.length === 0 && !loading && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No Healthcare Centers Found</h3>
                <p className="text-muted-foreground mb-4">
                  We couldn't find any healthcare centers in your area. Try refreshing your location or check your internet connection.
                </p>
                <Button onClick={searchNearbyHealthcare} variant="outline">
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HealthcareCenters;
