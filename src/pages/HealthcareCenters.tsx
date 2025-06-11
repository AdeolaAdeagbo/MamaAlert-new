
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { GoogleMapsLoader } from "@/components/GoogleMapsLoader";
import { Navigate } from "react-router-dom";
import { 
  MapPin, 
  Phone, 
  Clock, 
  Star,
  Navigation,
  Loader2
} from "lucide-react";

interface HealthcareCenter {
  id: string;
  name: string;
  address: string;
  rating: number;
  distance: number;
  type: string;
  phone: string;
  isOpen: boolean;
}

const HealthcareCenters = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [centers, setCenters] = useState<HealthcareCenter[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect to auth if no user and not loading
  if (!user && !authLoading) {
    return <Navigate to="/auth" replace />;
  }

  // Show loading screen while auth is loading
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

  const handlePlacesLoaded = (places: any[]) => {
    const formattedCenters: HealthcareCenter[] = places.map((place, index) => ({
      id: place.id || `center-${index}`,
      name: place.name || 'Healthcare Center',
      address: place.address || place.vicinity || 'Address not available',
      rating: place.rating || 0,
      distance: place.distance || 0,
      type: place.type || 'hospital',
      phone: place.phone || 'Not available',
      isOpen: place.isOpen || false
    }));
    
    setCenters(formattedCenters);
  };

  const filteredCenters = centers.filter(center =>
    center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    center.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    center.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDirections = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
  };

  const callCenter = (phone: string) => {
    if (phone && phone !== 'Not available') {
      window.open(`tel:${phone}`);
    } else {
      toast({
        title: "Phone Not Available",
        description: "Phone number is not available for this healthcare center.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Healthcare Centers Near You
          </h1>
          <p className="text-muted-foreground">
            Find maternal healthcare centers and hospitals in your area for immediate care and support.
          </p>
        </div>

        {/* Google Maps Integration */}
        <div className="mb-8">
          <GoogleMapsLoader onPlacesLoaded={handlePlacesLoaded} />
        </div>

        {/* Search */}
        <div className="mb-6">
          <Input
            placeholder="Search healthcare centers by name, location, or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Finding healthcare centers near you...</p>
          </div>
        )}

        {/* Results */}
        {!isLoading && centers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCenters.map((center) => (
              <Card key={center.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg leading-tight">{center.name}</CardTitle>
                    <Badge variant={center.type === 'hospital' ? 'default' : 'secondary'}>
                      {center.type}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{center.address}</span>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    {center.rating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{center.rating.toFixed(1)}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1">
                      <Navigation className="h-4 w-4" />
                      <span>{center.distance}km away</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className={`text-sm ${center.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                      {center.isOpen ? 'Open' : 'Closed'}
                    </span>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => getDirections(center.address)}
                      className="flex-1"
                      size="sm"
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Directions
                    </Button>
                    
                    <Button 
                      onClick={() => callCenter(center.phone)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && centers.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Healthcare Centers Found</h3>
            <p className="text-muted-foreground mb-6">
              Click "Find Nearby Centers" to search for healthcare facilities in your area.
            </p>
          </div>
        )}

        {/* Emergency Notice */}
        <Card className="mt-8 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-bold text-red-800 mb-2">
                Medical Emergency?
              </h3>
              <p className="text-red-700 mb-4">
                If you're experiencing a medical emergency, don't wait. Call emergency services immediately.
              </p>
              <div className="flex justify-center gap-4">
                <Button 
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => window.open('tel:199')}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call 199 (Emergency)
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HealthcareCenters;
