import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navigate } from "react-router-dom";
import { MapPin, Phone, Clock, Star, Navigation, Search } from "lucide-react";
import { GoogleMapsLoader } from "@/components/GoogleMapsLoader";

interface HealthcareCenter {
  id: string;
  name: string;
  type: "hospital" | "clinic" | "primary-care";
  address: string;
  phone: string;
  distance: number;
  rating: number;
  services?: string[];
  hours?: string;
  emergencyServices?: boolean;
  maternalSpecialty?: boolean;
  isOpen?: boolean;
}

const HealthcareCenters = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "hospital" | "clinic" | "primary-care">("all");
  const [nearbyPlaces, setNearbyPlaces] = useState<HealthcareCenter[]>([]);
  const [showMockData, setShowMockData] = useState(true);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Mock healthcare centers data (fallback)
  const mockHealthcareCenters: HealthcareCenter[] = [
    {
      id: "1",
      name: "Lagos University Teaching Hospital",
      type: "hospital",
      address: "Idi-Araba, Lagos State",
      phone: "+234 803 123 4567",
      distance: 2.5,
      rating: 4.2,
      services: ["Maternity Ward", "Emergency Care", "Prenatal Care", "NICU"],
      hours: "24/7",
      emergencyServices: true,
      maternalSpecialty: true
    },
    {
      id: "2",
      name: "First Consultant Medical Centre",
      type: "clinic",
      address: "Victoria Island, Lagos",
      phone: "+234 809 876 5432",
      distance: 5.1,
      rating: 4.6,
      services: ["Prenatal Care", "Ultrasound", "Lab Services", "Consultation"],
      hours: "Mon-Fri 8AM-6PM, Sat 9AM-2PM",
      emergencyServices: false,
      maternalSpecialty: true
    },
    {
      id: "3",
      name: "Gbagada General Hospital",
      type: "hospital",
      address: "Gbagada, Lagos State",
      phone: "+234 701 234 5678",
      distance: 8.3,
      rating: 3.8,
      services: ["Maternity Ward", "Emergency Care", "Pediatrics", "Surgery"],
      hours: "24/7",
      emergencyServices: true,
      maternalSpecialty: true
    }
  ];

  const handleNearbyPlacesLoaded = (places: HealthcareCenter[]) => {
    setNearbyPlaces(places);
    setShowMockData(false);
  };

  const allCenters = showMockData ? mockHealthcareCenters : nearbyPlaces;

  const filteredCenters = allCenters.filter(center => {
    const matchesSearch = center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         center.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || center.type === filterType;
    return matchesSearch && matchesType;
  }).sort((a, b) => a.distance - b.distance);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "hospital":
        return "bg-red-100 text-red-800 border-red-200";
      case "clinic":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "primary-care":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleGetDirections = (center: HealthcareCenter) => {
    window.open(`https://www.google.com/maps/search/${encodeURIComponent(center.address)}`, '_blank');
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Healthcare Centers</h1>
          <p className="text-muted-foreground">
            Find maternal healthcare providers and emergency services near you.
          </p>
        </div>

        {/* Google Maps Integration */}
        <GoogleMapsLoader onPlacesLoaded={handleNearbyPlacesLoaded} />

        {/* Search and Filter */}
        <div className="mb-6 mt-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search healthcare centers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Filter badges */}
          <div className="flex gap-2 flex-wrap">
            <Badge 
              variant={filterType === "all" ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/80"
              onClick={() => setFilterType("all")}
            >
              All Centers
            </Badge>
            <Badge 
              variant={filterType === "hospital" ? "default" : "outline"}
              className={`cursor-pointer ${filterType === "hospital" ? "bg-red-500 hover:bg-red-600" : ""}`}
              onClick={() => setFilterType("hospital")}
            >
              Hospitals
            </Badge>
            <Badge 
              variant={filterType === "clinic" ? "default" : "outline"}
              className={`cursor-pointer ${filterType === "clinic" ? "bg-blue-500 hover:bg-blue-600" : ""}`}
              onClick={() => setFilterType("clinic")}
            >
              Clinics
            </Badge>
          </div>
        </div>

        {/* Healthcare Centers List */}
        <div className="space-y-4">
          {filteredCenters.map((center) => (
            <Card key={center.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{center.name}</CardTitle>
                      <Badge className={getTypeColor(center.type)}>
                        {center.type.replace("-", " ")}
                      </Badge>
                      {center.emergencyServices && (
                        <Badge className="bg-red-500 text-white">24/7 Emergency</Badge>
                      )}
                      {center.maternalSpecialty && (
                        <Badge className="bg-rose-500 text-white">Maternal Specialty</Badge>
                      )}
                      {center.isOpen && (
                        <Badge className="bg-green-500 text-white">Open Now</Badge>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{center.address}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Navigation className="h-4 w-4" />
                        <span>{center.distance} km away</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{center.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCall(center.phone)}
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleGetDirections(center)}
                    >
                      <Navigation className="h-4 w-4 mr-1" />
                      Directions
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {center.services && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Services</h4>
                      <div className="flex flex-wrap gap-1">
                        {center.services.map((service, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {center.hours && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Hours</h4>
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-4 w-4" />
                        <span>{center.hours}</span>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">Contact</h4>
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-4 w-4" />
                      <span>{center.phone}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No results */}
        {filteredCenters.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">No healthcare centers found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or use the "Find Nearby Centers" feature above.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Emergency Info */}
        <Card className="mt-8 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-medium text-red-800 mb-2">Emergency Contact</h3>
              <p className="text-sm text-red-700 mb-4">
                In case of medical emergency, call emergency services immediately
              </p>
              <Button 
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => handleCall("199")}
              >
                <Phone className="h-4 w-4 mr-2" />
                Call Emergency: 199
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HealthcareCenters;
