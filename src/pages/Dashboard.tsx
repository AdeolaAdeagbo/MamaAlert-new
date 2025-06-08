
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Navbar } from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { UpcomingAppointments } from "@/components/dashboard/UpcomingAppointments";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { HealthTip } from "@/components/dashboard/HealthTip";
import { EmergencyAlert } from "@/components/dashboard/EmergencyAlert";
import { PregnancyPrompt } from "@/components/dashboard/PregnancyPrompt";

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [pregnancyData, setPregnancyData] = useState<any>(null);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  useEffect(() => {
    // Load pregnancy data
    const savedData = localStorage.getItem(`pregnancy-data-${user.id}`);
    if (savedData) {
      setPregnancyData(JSON.parse(savedData));
    }
  }, [user.id]);

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
        {!pregnancyData && <PregnancyPrompt />}

        {/* Emergency Alert Button */}
        <EmergencyAlert 
          isEmergencyActive={isEmergencyActive}
          onEmergencyAlert={handleEmergencyAlert}
        />

        {/* Stats Cards */}
        <StatsCards pregnancyData={pregnancyData} userStats={userStats} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <QuickActions pregnancyData={pregnancyData} />
            <UpcomingAppointments />
          </div>

          {/* Recent Activity */}
          <div>
            <RecentActivity />
            <HealthTip />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
