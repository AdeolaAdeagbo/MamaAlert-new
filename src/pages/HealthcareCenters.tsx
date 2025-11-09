
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
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-3xl bg-primary/10 mb-4">
            <MapPin className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-3">
            Healthcare Centers
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find maternal healthcare centers and hospitals in your area for immediate care and support.
          </p>
        </div>

        {/* Google Maps Integration */}
        <div className="mb-8">
          <GoogleMapsLoader onPlacesLoaded={handlePlacesLoaded} />
        </div>

        {/* Search */}
        {centers.length > 0 && (
          <div className="mb-6">
            <Input
              placeholder="Search healthcare centers by name, location, or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md h-12 rounded-2xl border-border shadow-soft"
            />
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Finding healthcare centers near you...</p>
          </div>
        )}

        {/* Results */}
        {!isLoading && centers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCenters.map((center) => (
              <Card key={center.id} className="rounded-3xl shadow-medium hover:shadow-large transition-all duration-300 border-border bg-card overflow-hidden group">
                <CardHeader className="space-y-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg leading-tight font-semibold text-foreground pr-2">{center.name}</CardTitle>
                    <Badge 
                      variant={center.type === 'hospital' ? 'default' : 'secondary'}
                      className="rounded-full px-3 py-1 text-xs font-medium"
                    >
                      {center.type}
                    </Badge>
                  </div>
                  
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                    <span className="line-clamp-2">{center.address}</span>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    {center.rating > 0 && (
                      <div className="flex items-center gap-1.5 text-foreground">
                        <Star className="h-4 w-4 fill-accent-gold text-accent-gold" />
                        <span className="font-medium">{center.rating.toFixed(1)}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Navigation className="h-4 w-4 text-primary" />
                      <span>{center.distance}km</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                      center.isOpen 
                        ? 'bg-success/10 text-success' 
                        : 'bg-destructive/10 text-destructive'
                    }`}>
                      <Clock className="h-3.5 w-3.5" />
                      {center.isOpen ? 'Open Now' : 'Closed'}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 pb-4">
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => getDirections(center.address)}
                      className="flex-1 rounded-2xl h-11 font-medium shadow-soft hover:shadow-medium transition-all"
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Directions
                    </Button>
                    
                    <Button 
                      onClick={() => callCenter(center.phone)}
                      variant="outline"
                      className="flex-1 rounded-2xl h-11 font-medium border-border hover:bg-accent/50"
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
          <Card className="text-center py-16 rounded-3xl shadow-soft border-border bg-card">
            <div className="p-4 rounded-3xl bg-primary/10 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <MapPin className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">No Centers Found Yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Click "Find Nearby Centers" above to discover healthcare facilities near your location.
            </p>
          </Card>
        )}

        {/* Emergency Notice */}
        <Card className="mt-8 rounded-3xl border-emergency/20 bg-emergency/5 shadow-large overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emergency/10 rounded-full blur-3xl" />
          <CardContent className="pt-8 pb-8 relative">
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-emergency/10 mb-4">
                <Phone className="h-8 w-8 text-emergency animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">
                Medical Emergency?
              </h3>
              <p className="text-muted-foreground mb-6 text-lg">
                If you're experiencing a medical emergency, don't wait. Call emergency services immediately.
              </p>
              <Button 
                size="lg"
                className="bg-emergency hover:bg-emergency/90 text-white rounded-2xl h-14 px-8 font-semibold shadow-large hover:shadow-xl transition-all"
                onClick={() => window.open('tel:199')}
              >
                <Phone className="h-5 w-5 mr-2" />
                Call 199 (Emergency)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HealthcareCenters;
