
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WelcomeModal } from "@/components/WelcomeModal";
import { WeeklyHealthTips } from "@/components/WeeklyHealthTips";
import { HealthAlerts } from "@/components/HealthAlerts";
import { Navigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Heart, 
  Phone, 
  Calendar, 
  MapPin, 
  AlertTriangle, 
  Activity,
  Baby,
  Stethoscope,
  Shield,
  Clock,
  CheckCircle,
  Loader2
} from "lucide-react";

const Dashboard = () => {
  const { user, isLoading: authLoading, refreshUserData } = useAuth();
  const { toast } = useToast();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [isEmergencyLoading, setIsEmergencyLoading] = useState(false);
  const [recentSymptoms, setRecentSymptoms] = useState<any[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<any[]>([]);

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

  useEffect(() => {
    if (user && !user.hasPregnancyData) {
      setShowWelcomeModal(true);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      // Fetch recent symptoms
      const { data: symptomsData } = await supabase
        .from('symptom_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (symptomsData) {
        setRecentSymptoms(symptomsData);
      }

      // Fetch upcoming appointments
      const { data: appointmentsData } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user.id)
        .gte('appointment_date', new Date().toISOString())
        .order('appointment_date', { ascending: true })
        .limit(3);

      if (appointmentsData) {
        setUpcomingAppointments(appointmentsData);
      }

      // Fetch emergency contacts
      const { data: contactsData } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', user.id)
        .limit(3);

      if (contactsData) {
        setEmergencyContacts(contactsData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleEmergencyAlert = async () => {
    if (!user) return;

    setIsEmergencyLoading(true);
    
    try {
      // Get user location
      const location = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { data, error } = await supabase.functions.invoke('send-emergency-sms', {
        body: {
          userId: user.id,
          userLocation: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          },
          message: `EMERGENCY: ${user.firstName} ${user.lastName} needs immediate medical assistance. Location: https://maps.google.com/?q=${location.coords.latitude},${location.coords.longitude}`
        }
      });

      if (error) {
        console.error('Emergency alert error:', error);
        toast({
          title: "Emergency Alert Failed",
          description: "Unable to send emergency alert. Please call emergency services directly.",
          variant: "destructive"
        });
      } else {
        // Log the emergency alert
        await supabase.from('emergency_alerts').insert([{
          user_id: user.id,
          alert_type: 'medical_emergency',
          location_latitude: location.coords.latitude,
          location_longitude: location.coords.longitude,
          status: 'sent'
        }]);

        toast({
          title: "Emergency Alert Sent",
          description: "Your emergency contacts have been notified with your location.",
        });
      }
    } catch (error) {
      console.error('Emergency alert error:', error);
      toast({
        title: "Emergency Alert Failed",
        description: "Unable to send emergency alert. Please call emergency services directly at 199 or 112.",
        variant: "destructive"
      });
    } finally {
      setIsEmergencyLoading(false);
    }
  };

  const getHealthStatus = () => {
    if (!user?.hasPregnancyData) {
      return { status: "Setup Required", color: "bg-yellow-500", description: "Complete your pregnancy profile" };
    }
    
    if (recentSymptoms.length > 0) {
      const lastSymptom = recentSymptoms[0];
      if (lastSymptom.severity === 'severe') {
        return { status: "Needs Attention", color: "bg-red-500", description: "Recent severe symptoms logged" };
      }
      if (lastSymptom.severity === 'moderate') {
        return { status: "Monitor Closely", color: "bg-yellow-500", description: "Recent moderate symptoms" };
      }
    }
    
    return { status: "Good", color: "bg-green-500", description: "No concerning symptoms recently" };
  };

  const healthStatus = getHealthStatus();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, Mama {user?.firstName}!
          </h1>
          <p className="text-muted-foreground">
            Here's your pregnancy dashboard with important updates and quick actions.
          </p>
        </div>

        {/* Emergency Alert Section */}
        <Card className="mb-8 border-red-200 bg-gradient-to-r from-red-50 to-pink-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Emergency Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600 mb-4">
              If you're experiencing a medical emergency, press the button below to instantly alert your emergency contacts with your location.
            </p>
            <Button 
              onClick={handleEmergencyAlert}
              disabled={isEmergencyLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isEmergencyLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending Alert...
                </>
              ) : (
                <>
                  <Phone className="h-4 w-4 mr-2" />
                  Send Emergency Alert
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Health Status & Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Health Status</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${healthStatus.color}`}></div>
                <div className="text-2xl font-bold">{healthStatus.status}</div>
              </div>
              <p className="text-xs text-muted-foreground">{healthStatus.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pregnancy Week</CardTitle>
              <Baby className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user?.pregnancyWeek || 0}</div>
              <p className="text-xs text-muted-foreground">
                {user?.hasPregnancyData ? 'weeks along' : 'Complete setup'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Emergency Contacts</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user?.emergencyContacts || 0}</div>
              <p className="text-xs text-muted-foreground">contacts saved</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Appointment</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {upcomingAppointments.length > 0 ? formatDate(upcomingAppointments[0].appointment_date) : 'None'}
              </div>
              <p className="text-xs text-muted-foreground">scheduled</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link to="/symptom-logger">
                    <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                      <Stethoscope className="h-6 w-6" />
                      <span className="text-xs">Log Symptoms</span>
                    </Button>
                  </Link>
                  
                  <Link to="/healthcare-centers">
                    <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                      <MapPin className="h-6 w-6" />
                      <span className="text-xs">Find Care</span>
                    </Button>
                  </Link>
                  
                  <Link to="/emergency-contacts">
                    <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                      <Phone className="h-6 w-6" />
                      <span className="text-xs">Contacts</span>
                    </Button>
                  </Link>
                  
                  <Link to="/pregnancy-details">
                    <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                      <Baby className="h-6 w-6" />
                      <span className="text-xs">Profile</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Recent Symptoms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Recent Symptoms
                  <Link to="/symptom-logger">
                    <Button variant="outline" size="sm">Add New</Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentSymptoms.length > 0 ? (
                  <div className="space-y-3">
                    {recentSymptoms.map((symptom) => (
                      <div key={symptom.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{symptom.symptom_type}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(symptom.created_at)}
                          </p>
                        </div>
                        <Badge variant={symptom.severity === 'severe' ? 'destructive' : symptom.severity === 'moderate' ? 'default' : 'secondary'}>
                          {symptom.severity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No symptoms logged yet. Start tracking your health today.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Health Alerts */}
            <HealthAlerts />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingAppointments.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="p-3 border rounded-lg">
                        <p className="font-medium">{appointment.appointment_type}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(appointment.appointment_date)}
                        </p>
                        {appointment.healthcare_provider && (
                          <p className="text-sm text-muted-foreground">
                            with {appointment.healthcare_provider}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No upcoming appointments scheduled.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Emergency Contacts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {emergencyContacts.length > 0 ? (
                  <div className="space-y-3">
                    {emergencyContacts.map((contact) => (
                      <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{contact.name}</p>
                          <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                        </div>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground mb-3">
                      No emergency contacts added yet.
                    </p>
                    <Link to="/emergency-contacts">
                      <Button size="sm">Add Contacts</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Weekly Health Tips */}
            <WeeklyHealthTips />
          </div>
        </div>
      </div>

      {/* Welcome Modal */}
      <WelcomeModal 
        isOpen={showWelcomeModal} 
        onClose={() => {
          setShowWelcomeModal(false);
          refreshUserData();
        }} 
      />
    </div>
  );
};

export default Dashboard;
