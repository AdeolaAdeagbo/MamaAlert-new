
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";
import {
  MapPin,
  Phone,
  Clock,
  Star,
  Navigation,
  Loader2,
  AlertCircle
} from "lucide-react";

interface HealthcareCenter {
  place_id: string;
  name: string;
  vicinity: string;
  rating?: number;
  types: string[];
  geometry: {
    location: google.maps.LatLng;
  };
  formatted_phone_number?: string;
  opening_hours?: {
    open_now?: boolean;
  };
}

const HealthcareCenters = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { isLoaded: mapsLoaded, error: mapsError } = useGoogleMaps();
  
  const [centers, setCenters] = useState<HealthcareCenter[]>([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [searchRadius, setSearchRadius] = useState(5000); // 5km default

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const getCurrentLocation = useCallback((): Promise<{lat: number, lng: number}> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          resolve(location);
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
  }, []);

  const searchNearbyHealthcare = useCallback(async () => {
    if (!mapsLoaded || !window.google) {
      toast({
        title: "Maps Not Ready",
        description: "Google Maps is still loading. Please try again in a moment.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const location = userLocation || await getCurrentLocation();
      
      // Create a hidden div for PlacesService
      const service = new window.google.maps.places.PlacesService(
        document.createElement('div')
      );

      const request = {
        location: new window.google.maps.LatLng(location.lat, location.lng),
        radius: searchRadius,
        type: 'hospital'
      };

      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          // Filter and sort results
          const validCenters = results
            .filter(place => place.place_id && place.name && place.geometry?.location)
            .slice(0, 15) // Get up to 15 results
            .map(place => ({
              place_id: place.place_id!,
              name: place.name!,
              vicinity: place.vicinity || 'Address not available',
              rating: place.rating,
              types: place.types || [],
              geometry: {
                location: place.geometry!.location!
              },
              formatted_phone_number: place.formatted_phone_number,
              opening_hours: place.opening_hours
            }));

          setCenters(validCenters);
          
          toast({
            title: "Healthcare Centers Found",
            description: `Found ${validCenters.length} healthcare centers near you.`,
          });
        } else {
          throw new Error(`Places search failed: ${status}`);
        }
        setLoading(false);
      });

    } catch (error) {
      console.error('Error searching for healthcare centers:', error);
      toast({
        title: "Search Failed",
        description: "Could not find healthcare centers. Please check your location permissions.",
        variant: "destructive"
      });
      setLoading(false);
    }
  }, [mapsLoaded, userLocation, searchRadius, getCurrentLocation, toast]);

  const getDirections = (center: HealthcareCenter) => {
    const lat = center.geometry.location.lat();
    const lng = center.geometry.location.lng();
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
    window.open(url, '_blank');
  };

  const callCenter = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  if (mapsError) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card className="border-red-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-red-800 mb-2">Maps Unavailable</h2>
                <p className="text-red-600 mb-4">{mapsError}</p>
                <p className="text-sm text-muted-foreground">
                  Please contact your administrator to configure the Google Maps API key.
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
      
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Find Healthcare Centers
          </h1>
          <p className="text-muted-foreground">
            Locate nearby hospitals and clinics for your pregnancy care needs.
          </p>
        </div>

        {/* Search Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-500" />
              Search Options
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Search Radius</label>
                <select 
                  value={searchRadius} 
                  onChange={(e) => setSearchRadius(Number(e.target.value))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value={2000}>2 km</option>
                  <option value={5000}>5 km</option>
                  <option value={10000}>10 km</option>
                  <option value={20000}>20 km</option>
                </select>
              </div>
              
              <Button 
                onClick={searchNearbyHealthcare}
                disabled={loading || !mapsLoaded}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <MapPin className="h-4 w-4 mr-2" />
                    Find Healthcare Centers
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {centers.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              Found {centers.length} Healthcare Centers Near You
            </h2>
            
            <div className="grid gap-4">
              {centers.map((center) => (
                <Card key={center.place_id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          {center.name}
                        </h3>
                        
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{center.vicinity}</span>
                          </div>
                          
                          {center.rating && (
                            <div className="flex items-center gap-2">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span>{center.rating.toFixed(1)} rating</span>
                            </div>
                          )}
                          
                          {center.opening_hours?.open_now !== undefined && (
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <Badge 
                                variant={center.opening_hours.open_now ? "default" : "secondary"}
                                className={center.opening_hours.open_now ? "bg-green-100 text-green-800" : ""}
                              >
                                {center.opening_hours.open_now ? "Open Now" : "Closed"}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          onClick={() => getDirections(center)}
                          variant="outline"
                          size="sm"
                          className="whitespace-nowrap"
                        >
                          <Navigation className="h-4 w-4 mr-1" />
                          Directions
                        </Button>
                        
                        {center.formatted_phone_number && (
                          <Button
                            onClick={() => callCenter(center.formatted_phone_number!)}
                            variant="outline"
                            size="sm"
                            className="whitespace-nowrap"
                          >
                            <Phone className="h-4 w-4 mr-1" />
                            Call
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {center.types.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {center.types.slice(0, 3).map((type) => (
                          <Badge key={type} variant="secondary" className="text-xs">
                            {type.replace(/_/g, ' ').toLowerCase()}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {!loading && centers.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  No Results Yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Click "Find Healthcare Centers" to search for nearby facilities.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HealthcareCenters;
