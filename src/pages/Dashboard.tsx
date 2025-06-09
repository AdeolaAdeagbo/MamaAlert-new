
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Navigate, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { AppointmentLogger } from "@/components/AppointmentLogger";
import { HealthAlerts } from "@/components/HealthAlerts";
import { WeeklyHealthTips } from "@/components/WeeklyHealthTips";
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

interface Appointment {
  id: string;
  hospitalName: string;
  date: string;
  time: string;
  notes: string;
  createdAt: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [pregnancyData, setPregnancyData] = useState<any>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  useEffect(() => {
    // Load pregnancy data
    const savedData = localStorage.getItem(`pregnancy-data-${user.id}`);
    if (savedData) {
      setPregnancyData(JSON.parse(savedData));
    }

    // Load appointments
    const savedAppointments = localStorage.getItem(`appointments-${user.id}`);
    if (savedAppointments) {
      const parsedAppointments = JSON.parse(savedAppointments);
      // Sort by date and show only upcoming appointments
      const now = new Date();
      const upcomingAppointments = parsedAppointments
        .filter((apt: Appointment) => new Date(apt.date) >= now)
        .sort((a: Appointment, b: Appointment) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 3); // Show only next 3 appointments
      setAppointments(upcomingAppointments);
    }
  }, [user.id]);

  const handleEmergencyAlert = async () => {
    setIsEmergencyActive(true);
    
    try {
      console.log("Triggering emergency alert...");
      
      toast({
        title: "🚨 Emergency Alert Sent!",
        description: "Your emergency contacts and nearest healthcare center have been notified.",
        variant: "destructive"
      });

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

  const handleAppointmentAdded = (newAppointment: Appointment) => {
    // Refresh appointments list
    const savedAppointments = localStorage.getItem(`appointments-${user.id}`);
    if (savedAppointments) {
      const parsedAppointments = JSON.parse(savedAppointments);
      const now = new Date();
      const upcomingAppointments = parsedAppointments
        .filter((apt: Appointment) => new Date(apt.date) >= now)
        .sort((a: Appointment, b: Appointment) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 3);
      setAppointments(upcomingAppointments);
    }
  };

  // Mock data for MamaAlert
  const userStats = {
    pregnancyWeek: pregnancyData?.weeksPregnant || 24,
    nextAppointment: appointments.length > 0 ? new Date(appointments[0].date).toLocaleDateString() : "No upcoming appointments",
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

        {/* Pregnancy Details Alert */}
        {!pregnancyData && (
          <Card className="mb-8 border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <h2 className="text-xl font-bold text-amber-800 mb-4">Complete Your Pregnancy Profile</h2>
                <p className="text-amber-700 mb-6">
                  Help us provide you with personalized care by sharing your pregnancy details. 
                  This information will help us send you relevant alerts and track your symptoms better.
                </p>
                <Link to="/pregnancy-details">
                  <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                    <Heart className="h-4 w-4 mr-2" />
                    Add Pregnancy Details
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

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
                Week {pregnancyData?.weeksPregnant || userStats.pregnancyWeek}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {pregnancyData?.weeksPregnant <= 12 ? '1st Trimester' : 
                 pregnancyData?.weeksPregnant <= 26 ? '2nd Trimester' : '3rd Trimester'}
              </p>
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
              <div className="text-lg font-bold">{userStats.nextAppointment}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {appointments.length > 0 ? appointments[0].hospitalName : "No appointments scheduled"}
              </p>
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
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Quick Actions</CardTitle>
                  <AppointmentLogger userId={user.id} onAppointmentAdded={handleAppointmentAdded} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link to="/pregnancy-details">
                    <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                      <Heart className="h-6 w-6 text-rose-500" />
                      <span className="text-sm">
                        {pregnancyData ? 'Edit Details' : 'Add Details'}
                      </span>
                    </Button>
                  </Link>
                  
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
                {appointments.length > 0 ? (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div key={appointment.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">Antenatal Appointment</h4>
                          <Badge variant="outline">{new Date(appointment.date).toLocaleDateString()}</Badge>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{appointment.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{appointment.hospitalName}</span>
                          </div>
                          {appointment.notes && (
                            <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                              {appointment.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No upcoming appointments scheduled.</p>
                    <p className="text-xs mt-2">Use the "Log Appointment" button to add your next visit.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Health Alerts */}
            <HealthAlerts userId={user.id} />
          </div>

          {/* Recent Activity & Health Tips */}
          <div className="space-y-6">
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

            {/* Dynamic Health Tips */}
            <WeeklyHealthTips pregnancyWeek={userStats.pregnancyWeek} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
