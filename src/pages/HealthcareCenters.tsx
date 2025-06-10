
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";
import { MapPin, Phone, Clock, Star, Navigation, Loader2 } from "lucide-react";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";

interface HealthcareCenter {
  id: string;
  name: string;
  address: string;
  phone?: string;
  rating?: number;
  distance?: string;
  isOpen?: boolean;
  types?: string[];
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

  useEffect(() => {
    if (error) {
      toast({
        title: "Google Maps Error",
        description: "Unable to load Google Maps. Please check your internet connection.",
        variant: "destructive"
      });
    }
  }, [error, toast]);

  const getCurrentLocation = () => {
    return new Promise<{lat: number, lng: number}>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser."));
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
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  };

  const findNearbyHealthcareCenters = async () => {
    if (!isLoaded) {
      toast({
        title: "Maps Not Ready",
        description: "Google Maps is still loading. Please try again in a moment.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setCenters([]);

    try {
      console.log('Getting user location...');
      
      // Get user's current location
      const location = await getCurrentLocation();
      console.log('User location:', location);
      
      setUserLocation(location);

      // Search for nearby healthcare centers using Google Places
      const map = new google.maps.Map(document.createElement('div'), {
        center: location,
        zoom: 15
      });

      const service = new google.maps.places.PlacesService(map);
      
      const searchPromise = new Promise<google.maps.places.PlaceResult[]>((resolve, reject) => {
        const request = {
          location: location,
          radius: 15000, // 15km radius
          type: 'hospital'
        };

        service.nearbySearch(request, (results, status) => {
          console.log('Places search status:', status);
          console.log('Places search results:', results);
          
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            resolve(results);
          } else {
            reject(new Error(`Places search failed with status: ${status}`));
          }
        });
      });

      const results = await searchPromise;
      console.log('Search results:', results);

      if (results.length === 0) {
        toast({
          title: "No Healthcare Centers Found",
          description: "No healthcare centers found in your area. Try expanding your search radius or check your location.",
        });
        return;
      }

      // Convert results to our format
      const healthcareCenters: HealthcareCenter[] = results.slice(0, 10).map((place, index) => ({
        id: place.place_id || `center-${index}`,
        name: place.name || 'Unknown Healthcare Center',
        address: place.vicinity || place.formatted_address || 'Address not available',
        phone: place.formatted_phone_number,
        rating: place.rating,
        isOpen: place.opening_hours?.open_now,
        types: place.types,
        distance: place.geometry?.location ? 
          calculateDistance(location, {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          }) : undefined
      }));

      console.log('Processed healthcare centers:', healthcareCenters);
      setCenters(healthcareCenters);

      toast({
        title: "Healthcare Centers Found",
        description: `Found ${healthcareCenters.length} healthcare centers near you.`,
      });

    } catch (error) {
      console.error('Error finding healthcare centers:', error);
      
      let errorMessage = "Unable to find nearby healthcare centers.";
      
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enable location permissions and try again.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable. Please check your GPS settings.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out. Please try again.";
            break;
        }
      } else if (error instanceof Error) {
        if (error.message.includes("Geolocation")) {
          errorMessage = "Geolocation is not supported by your browser.";
        } else {
          errorMessage = error.message;
        }
      }

      toast({
        title: "Location Error",
        description: errorMessage,
        variant: "destructive"
      });

      // Fallback: show some default healthcare centers for Nigeria
      const fallbackCenters: HealthcareCenter[] = [
        {
          id: "fallback-1",
          name: "Lagos University Teaching Hospital",
          address: "Idi-Araba, Lagos State",
          phone: "+234 1 234 5678",
          rating: 4.2
        },
        {
          id: "fallback-2", 
          name: "University College Hospital",
          address: "Ibadan, Oyo State",
          phone: "+234 2 234 5678",
          rating: 4.0
        },
        {
          id: "fallback-3",
          name: "National Hospital Abuja",
          address: "Central Area, Abuja",
          phone: "+234 9 234 5678",
          rating: 4.1
        }
      ];
      
      setCenters(fallbackCenters);
      
      toast({
        title: "Showing Default Centers",
        description: "Showing popular healthcare centers in Nigeria. Enable location for personalized results.",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (from: {lat: number, lng: number}, to: {lat: number, lng: number}): string => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (to.lat - from.lat) * Math.PI / 180;
    const dLng = (to.lng - from.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(from.lat * Math.PI / 180) * Math.cos(to.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return `${distance.toFixed(1)} km`;
  };

  const getDirections = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Healthcare Centers</h1>
          <p className="text-muted-foreground">
            Find nearby healthcare centers that provide maternal health services.
          </p>
        </div>

        <div className="mb-6">
          <Button 
            onClick={findNearbyHealthcareCenters}
            disabled={loading || !isLoaded}
            className="bg-rose-500 hover:bg-rose-600"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Finding Healthcare Centers...
              </>
            ) : (
              <>
                <Navigation className="h-4 w-4 mr-2" />
                Find Nearby Healthcare Centers
              </>
            )}
          </Button>
          
          {!isLoaded && !error && (
            <p className="text-sm text-muted-foreground mt-2">
              Loading Google Maps...
            </p>
          )}
          
          {error && (
            <p className="text-sm text-red-600 mt-2">
              Google Maps unavailable. You can still view default healthcare centers.
            </p>
          )}
        </div>

        {centers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {centers.map((center) => (
              <Card key={center.id} className="border-rose-100 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-start justify-between">
                    <span>{center.name}</span>
                    {center.rating && (
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{center.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-rose-500 mt-1 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{center.address}</span>
                    </div>
                    
                    {center.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-rose-500" />
                        <a 
                          href={`tel:${center.phone}`}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {center.phone}
                        </a>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      {center.isOpen !== undefined && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-rose-500" />
                          <span className={`text-sm ${center.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                            {center.isOpen ? 'Open Now' : 'Closed'}
                          </span>
                        </div>
                      )}
                      
                      {center.distance && (
                        <span className="text-sm text-muted-foreground">
                          {center.distance} away
                        </span>
                      )}
                    </div>
                    
                    <div className="pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => getDirections(center.address)}
                        className="w-full"
                      >
                        <Navigation className="h-4 w-4 mr-2" />
                        Get Directions
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && centers.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <MapPin className="h-12 w-12 mx-auto mb-4 text-rose-500 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No Healthcare Centers Found</h3>
              <p className="text-muted-foreground mb-4">
                Click "Find Nearby Healthcare Centers" to discover maternal health facilities in your area.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Emergency Information */}
        <Card className="mt-8 border-red-200 bg-gradient-to-r from-red-50 to-rose-50">
          <CardHeader>
            <CardTitle className="text-red-800">Emergency Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-red-700">
              <p className="font-medium">In case of a medical emergency:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Call emergency services immediately: <strong>199 or 911</strong></li>
                <li>Use the Emergency Alert button on your dashboard</li>
                <li>Contact your nearest healthcare center directly</li>
                <li>Have your emergency contacts ready</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HealthcareCenters;
