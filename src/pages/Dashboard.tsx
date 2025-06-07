
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Navigate, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  Heart, 
  Calendar, 
  Shield, 
  Phone, 
  MapPin,
  Clock,
  Activity
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleEmergencyAlert = async () => {
    setIsEmergencyActive(true);
    
    try {
      // Here you would typically send emergency alerts via Supabase edge functions
      console.log("Triggering emergency alert...");
      
      toast({
        title: "🚨 Emergency Alert Sent!",
        description: "Your emergency contacts and nearest healthcare center have been notified.",
        variant: "destructive"
      });

      // Reset after 3 seconds
      setTimeout(() => setIsEmergencyActive(false), 3000);
      
    } catch (error) {
      toast({
        title: "Alert Failed",
        description: "Failed to send emergency alert. Please call emergency services directly.",
        variant: "destructive"
      });
      setIsEmergencyActive(false);
    }
  };

  // Mock data for MamaAlert
  const userStats = {
    pregnancyWeek: 24,
    nextAppointment: "Jan 22, 2024",
    emergencyContacts: 3,
    recentSymptoms: 2
  };

  const recentActivity = [
    {
      id: "1",
      type: "symptom",
      title: "Logged morning sickness",
      time: "2 hours ago",
      status: "normal"
    },
    {
      id: "2", 
      type: "appointment",
      title: "Appointment reminder set",
      time: "1 day ago",
      status: "normal"
    },
    {
      id: "3",
      type: "contact",
      title: "Added emergency contact",
      time: "3 days ago", 
      status: "normal"
    }
  ];

  const upcomingAppointments = [
    {
      id: "1",
      title: "Routine Prenatal Checkup",
      date: "Jan 22, 2024",
      time: "10:00 AM",
      doctor: "Dr. Adebayo",
      location: "Lagos University Teaching Hospital"
    },
    {
      id: "2",
      title: "Ultrasound Scan",
      date: "Feb 5, 2024", 
      time: "2:30 PM",
      doctor: "Dr. Okonkwo",
      location: "First Consultant Medical Centre"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user.firstName}! 
          </h1>
          <p className="text-muted-foreground">
            You're at week {userStats.pregnancyWeek} of your pregnancy journey. Stay safe and healthy! 💕
          </p>
        </div>

        {/* Emergency Alert Button */}
        <Card className="mb-8 border-red-200 bg-gradient-to-r from-red-50 to-rose-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-red-800 mb-4">Emergency Alert</h2>
              <p className="text-red-700 mb-6">
                If you're experiencing a medical emergency, press the button below to instantly 
                notify your emergency contacts and nearest healthcare center.
              </p>
              <Button 
                onClick={handleEmergencyAlert}
                disabled={isEmergencyActive}
                className={`text-white font-bold py-4 px-8 text-lg ${
                  isEmergencyActive 
                    ? 'bg-red-700 emergency-pulse' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                <AlertTriangle className="h-6 w-6 mr-3" />
                {isEmergencyActive ? "ALERT SENT!" : "EMERGENCY ALERT"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-rose-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pregnancy Week
                </CardTitle>
                <Heart className="h-4 w-4 text-rose-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-rose-600">
                Week {userStats.pregnancyWeek}
              </div>
              <p className="text-xs text-muted-foreground mt-1">2nd Trimester</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Next Appointment
                </CardTitle>
                <Calendar className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.nextAppointment}</div>
              <p className="text-xs text-muted-foreground mt-1">Dr. Adebayo</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Emergency Contacts
                </CardTitle>
                <Phone className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.emergencyContacts}</div>
              <p className="text-xs text-muted-foreground mt-1">Ready to help</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Health Status
                </CardTitle>
                <Shield className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Good</div>
              <p className="text-xs text-muted-foreground mt-1">No alerts</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link to="/symptom-logger">
                    <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                      <Heart className="h-6 w-6 text-rose-500" />
                      <span className="text-sm">Log Symptoms</span>
                    </Button>
                  </Link>
                  
                  <Link to="/symptom-guide">
                    <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                      <Activity className="h-6 w-6 text-blue-500" />
                      <span className="text-sm">Symptom Guide</span>
                    </Button>
                  </Link>
                  
                  <Link to="/emergency-contacts">
                    <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                      <Phone className="h-6 w-6 text-green-500" />
                      <span className="text-sm">Contacts</span>
                    </Button>
                  </Link>
                  
                  <Link to="/healthcare-centers">
                    <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                      <MapPin className="h-6 w-6 text-purple-500" />
                      <span className="text-sm">Find Care</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  Upcoming Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{appointment.title}</h4>
                        <Badge variant="outline">{appointment.date}</Badge>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{appointment.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4" />
                          <span>{appointment.doctor}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{appointment.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-rose-500" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-rose-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Health Tips */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-rose-500" />
                  Health Tip
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-rose-50 rounded-lg">
                  <h4 className="font-medium text-rose-800 mb-2">Week 24 Tip</h4>
                  <p className="text-sm text-rose-700">
                    Your baby's hearing is developing! Talk, sing, or play music for your little one. 
                    Stay hydrated and continue taking your prenatal vitamins.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
