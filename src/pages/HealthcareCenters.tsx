
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { GoogleMapsLoader } from "@/components/GoogleMapsLoader";
import { MapPin, Phone, Clock, Star, Navigation, Loader2 } from "lucide-react";

interface HealthcareCenter {
  id: string;
  name: string;
  address: string;
  phone?: string;
  rating?: number;
  isOpen?: boolean;
  distance?: string;
  specialty?: string;
  placeId?: string;
}

const HealthcareCenters = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [centers, setCenters] = useState<HealthcareCenter[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLocation, setSearchLocation] = useState("");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null);

  if (!user && !authLoading) {
    return <Navigate to="/auth" replace />;
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  const onMapLoad = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    const service = new google.maps.places.PlacesService(mapInstance);
    setPlacesService(service);
  };

  const getCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          searchNearbyHospitals(location);
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast({
            title: "Location Error",
            description: "Unable to get your location. Please enter a location manually.",
            variant: "destructive"
          });
          setLoading(false);
        }
      );
    } else {
      toast({
        title: "Geolocation Not Supported",
        description: "Please enter a location manually to search for healthcare centers.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const searchByLocation = () => {
    if (!searchLocation.trim()) {
      toast({
        title: "Location Required",
        description: "Please enter a location to search for healthcare centers.",
        variant: "destructive"
      });
      return;
    }

    if (!window.google?.maps?.Geocoder) {
      toast({
        title: "Maps Not Ready",
        description: "Google Maps is still loading. Please try again in a moment.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    const geocoder = new window.google.maps.Geocoder();
    
    geocoder.geocode({ address: searchLocation }, (results, status) => {
      if (status === 'OK' && results && results[0]?.geometry?.location) {
        const location = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng()
        };
        setUserLocation(location);
        searchNearbyHospitals(location);
      } else {
        console.error("Geocoding failed:", status);
        toast({
          title: "Location Not Found",
          description: "Could not find the specified location. Please try a different search term.",
          variant: "destructive"
        });
        setLoading(false);
      }
    });
  };

  const searchNearbyHospitals = (location: { lat: number; lng: number }) => {
    if (!placesService) {
      toast({
        title: "Service Not Ready",
        description: "Maps service is not ready. Please try again.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    const request: google.maps.places.PlaceSearchRequest = {
      location: new window.google.maps.LatLng(location.lat, location.lng),
      radius: 10000,
      type: 'hospital'
    };

    placesService.nearbySearch(request, (results, status) => {
      console.log("Places search results:", results, status);
      
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        const healthcareCenters: HealthcareCenter[] = results.slice(0, 10).map((place, index) => {
          const address = place.vicinity || place.name || "Address not available";
          
          return {
            id: place.place_id || `center-${index}`,
            name: place.name || "Healthcare Center",
            address: address,
            phone: "Contact for details",
            rating: place.rating,
            isOpen: place.opening_hours?.open_now,
            specialty: "Maternal Health",
            placeId: place.place_id
          };
        });
        
        setCenters(healthcareCenters);
        
        if (healthcareCenters.length === 0) {
          toast({
            title: "No Results",
            description: "No healthcare centers found in this area. Try searching a different location.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Search Complete",
            description: `Found ${healthcareCenters.length} healthcare centers near you.`,
          });
        }
      } else {
        console.error("Places search failed:", status);
        toast({
          title: "Search Failed",
          description: "Unable to find healthcare centers. Please try again or search a different location.",
          variant: "destructive"
        });
      }
      setLoading(false);
    });
  };

  const getDirections = (address: string) => {
    if (userLocation) {
      const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${encodeURIComponent(address)}`;
      window.open(url, '_blank');
    } else {
      const url = `https://www.google.com/maps/search/${encodeURIComponent(address)}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Find Healthcare Centers
          </h1>
          <p className="text-muted-foreground">
            Locate maternal health centers and hospitals near you for immediate care.
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Search for Healthcare Centers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Enter city, state, or address..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchByLocation()}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={searchByLocation}
                  disabled={loading || !searchLocation.trim()}
                  className="bg-primary hover:bg-primary/90"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <MapPin className="h-4 w-4 mr-2" />}
                  Search Location
                </Button>
                <Button 
                  variant="outline" 
                  onClick={getCurrentLocation}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Navigation className="h-4 w-4 mr-2" />}
                  Use My Location
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Google Maps */}
        <GoogleMapsLoader onMapLoad={onMapLoad} />

        {/* Results */}
        {loading && (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Searching for healthcare centers...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {!loading && centers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {centers.map((center) => (
              <Card key={center.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{center.name}</CardTitle>
                    {center.isOpen !== undefined && (
                      <Badge variant={center.isOpen ? "default" : "secondary"}>
                        {center.isOpen ? "Open" : "Closed"}
                      </Badge>
                    )}
                  </div>
                  {center.specialty && (
                    <Badge variant="outline" className="w-fit">
                      {center.specialty}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{center.address}</span>
                  </div>
                  
                  {center.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{center.phone}</span>
                    </div>
                  )}
                  
                  {center.rating && (
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">{center.rating}/5</span>
                    </div>
                  )}
                  
                  <Button 
                    onClick={() => getDirections(center.address)} 
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Get Directions
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && centers.length === 0 && searchLocation && (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">
                  No healthcare centers found. Try searching for a different location.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <footer className="border-t bg-background px-4 py-8 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} MamaAlert. Protecting Nigerian mothers, one alert at a time.</p>
        </div>
      </footer>
    </div>
  );
};

export default HealthcareCenters;
