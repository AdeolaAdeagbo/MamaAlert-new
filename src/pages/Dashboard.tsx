
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
import { EmergencyAlertLogger } from "@/components/EmergencyAlertLogger";
import { WelcomeModal } from "@/components/WelcomeModal";
import { DeliveryPreparationTips } from "@/components/DeliveryPreparationTips";
import { AppointmentReminder } from "@/components/AppointmentReminder";
import { usePregnancyProgress } from "@/hooks/usePregnancyProgress";
import { supabase } from "@/integrations/supabase/client";
import { 
  Heart, 
  Phone, 
  MapPin,
  Activity,
  Loader2,
  TrendingUp,
  MessageCircle
} from "lucide-react";

interface EmergencyAlert {
  id: string;
  user_id: string;
  alert_type: string;
  message: string;
  timestamp: string;
  location?: string;
}

interface SymptomLog {
  id: string;
  symptom_type: string;
  severity: number;
  description: string;
  timestamp: string;
}

interface PregnancyData {
  weeks_pregnant?: number;
  due_date?: string;
  last_menstrual_period?: string;
  is_high_risk?: boolean;
}

const Dashboard = () => {
  const { user, refreshUserData, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [emergencyAlerts, setEmergencyAlerts] = useState<EmergencyAlert[]>([]);
  const [recentSymptoms, setRecentSymptoms] = useState<SymptomLog[]>([]);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Use the new progressive pregnancy hook
  const { pregnancyData, currentWeek, loading: pregnancyLoading, refreshData } = usePregnancyProgress(user?.id || '');

  // Redirect to auth if no user and not loading
  if (!user && !authLoading) {
    return <Navigate to="/auth" replace />;
  }

  // Show loading screen while auth is loading
  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const loadDashboardData = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      console.log('Loading dashboard data for user:', user.id);
      
      // Load emergency alerts
      try {
        const { data: alertsData, error: alertsError } = await supabase
          .from('emergency_alerts')
          .select('*')
          .eq('user_id', user.id)
          .order('timestamp', { ascending: false })
          .limit(5);

        if (alertsError) {
          console.error('Error loading emergency alerts:', alertsError);
        } else if (alertsData) {
          setEmergencyAlerts(alertsData);
        }
      } catch (error) {
        console.error('Exception loading emergency alerts:', error);
      }

      // Load recent symptoms
      try {
        const { data: symptomsData, error: symptomsError } = await supabase
          .from('symptom_logs')
          .select('*')
          .eq('user_id', user.id)
          .order('timestamp', { ascending: false })
          .limit(10);

        if (symptomsError) {
          console.error('Error loading symptoms:', symptomsError);
        } else if (symptomsData) {
          setRecentSymptoms(symptomsData);
          console.log('Fresh symptoms loaded:', symptomsData);
        }
      } catch (error) {
        console.error('Exception loading symptoms:', error);
      }

      setDataLoaded(true);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Loading Error",
        description: "Some dashboard data couldn't be loaded. Please refresh the page.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id && !dataLoaded) {
      loadDashboardData();
    }
  }, [user?.id, dataLoaded]);

  // Set up real-time subscriptions for data changes
  useEffect(() => {
    if (!user?.id) return;

    console.log('Setting up real-time subscriptions...');

    // Subscribe to pregnancy data changes
    const pregnancyChannel = supabase
      .channel('pregnancy_data_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pregnancy_data',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Pregnancy data changed:', payload);
          refreshData();
        }
      )
      .subscribe();

    // Subscribe to symptom log changes
    const symptomsChannel = supabase
      .channel('symptom_logs_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'symptom_logs',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Symptom logs changed:', payload);
          loadDashboardData();
        }
      )
      .subscribe();

    // Subscribe to emergency alerts changes
    const alertsChannel = supabase
      .channel('emergency_alerts_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'emergency_alerts',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Emergency alerts changed:', payload);
          loadDashboardData();
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up real-time subscriptions...');
      supabase.removeChannel(pregnancyChannel);
      supabase.removeChannel(symptomsChannel);
      supabase.removeChannel(alertsChannel);
    };
  }, [user?.id]);

  const hasPregnancyData = !!pregnancyData;

  // Show welcome modal for new users without pregnancy data
  useEffect(() => {
    if (user && !hasPregnancyData && !loading && !pregnancyLoading && dataLoaded) {
      setShowWelcomeModal(true);
    }
  }, [user, hasPregnancyData, loading, dataLoaded, pregnancyLoading]);

  const handleEmergencyAlert = (alert: any) => {
    setEmergencyAlerts(prev => [alert, ...prev.slice(0, 4)]);
    toast({
      title: "Emergency Alert Sent",
      description: "Your emergency contacts have been notified.",
    });
  };

  const handleWelcomeModalClose = () => {
    setShowWelcomeModal(false);
  };

  // Calculate dynamic health status based on fresh data
  const getHealthStatus = () => {
    if (emergencyAlerts.length > 0) {
      return { status: "Emergency", color: "text-red-600", description: `${emergencyAlerts.length} recent alerts` };
    }
    
    // Check recent symptoms (last 7 days)
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const recentSevereSymptoms = recentSymptoms.filter(symptom => {
      const symptomDate = new Date(symptom.timestamp);
      return symptomDate >= lastWeek && symptom.severity >= 7;
    });
    
    if (recentSevereSymptoms.length > 0) {
      return { status: "Needs Attention", color: "text-yellow-600", description: `${recentSevereSymptoms.length} severe symptoms logged` };
    }
    
    if (recentSymptoms.length > 0) {
      return { status: "Monitoring", color: "text-blue-600", description: `${recentSymptoms.length} symptoms tracked` };
    }
    
    return { status: "Good", color: "text-green-600", description: "No concerning symptoms" };
  };

  const healthStatus = getHealthStatus();

  // Stats with progressive data
  const userStats = {
    pregnancyWeek: currentWeek,
    emergencyContacts: user?.emergencyContacts || 0,
    recentSymptoms: recentSymptoms.length
  };

  // Recent Activity from fresh data
  const recentActivity = [
    ...emergencyAlerts.slice(0, 2).map(alert => ({
      id: alert.id,
      type: "emergency",
      title: "Emergency alert sent",
      time: new Date(alert.timestamp).toLocaleString(),
      status: "emergency"
    })),
    ...recentSymptoms.slice(0, 3).map(symptom => ({
      id: symptom.id,
      type: "symptom",
      title: `Logged ${symptom.symptom_type}`,
      time: new Date(symptom.timestamp).toLocaleString(),
      status: "normal"
    }))
  ].slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <WelcomeModal 
        isOpen={showWelcomeModal}
        onClose={handleWelcomeModalClose}
        userName={user.firstName || 'there'}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user.firstName || 'Mama'}! 
          </h1>
          <p className="text-muted-foreground">
            {hasPregnancyData ? 
              <div className="flex items-center gap-2">
                <span>You're at week {userStats.pregnancyWeek} of your pregnancy journey. Stay safe and healthy! 💕</span>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div> :
              "Complete your pregnancy profile to get personalized care and tips!"
            }
          </p>
        </div>

        {/* Onboarding Alert */}
        {!hasPregnancyData && (
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
              <EmergencyAlertLogger userId={user.id} onAlertSent={handleEmergencyAlert} />
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards with progressive data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-rose-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pregnancy Week
                </CardTitle>
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4 text-rose-500" />
                  {hasPregnancyData && <TrendingUp className="h-3 w-3 text-green-500" />}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-rose-600">
                Week {userStats.pregnancyWeek}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {userStats.pregnancyWeek === 0 ? 'Add pregnancy details' :
                 userStats.pregnancyWeek <= 12 ? '1st Trimester' : 
                 userStats.pregnancyWeek <= 26 ? '2nd Trimester' : '3rd Trimester'}
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
                <Activity className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${healthStatus.color}`}>
                {healthStatus.status}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {healthStatus.description}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Recent Symptoms
                </CardTitle>
                <Activity className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.recentSymptoms}</div>
              <p className="text-xs text-muted-foreground mt-1">Tracked this week</p>
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
                  <AppointmentLogger userId={user.id} onAppointmentAdded={loadDashboardData} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link to="/pregnancy-details">
                    <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                      <Heart className="h-6 w-6 text-rose-500" />
                      <span className="text-sm">
                        {hasPregnancyData ? 'Edit Details' : 'Add Details'}
                      </span>
                    </Button>
                  </Link>
                  
                  <Link to="/ai-nurse">
                    <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                      <MessageCircle className="h-6 w-6 text-purple-500" />
                      <span className="text-sm">AI Nurse</span>
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

            {/* Delivery Preparation Tips for late pregnancy */}
            {currentWeek >= 36 && (
              <DeliveryPreparationTips pregnancyWeek={currentWeek} />
            )}

            {/* Appointment Reminders */}
            <AppointmentReminder userId={user.id} />

            {/* Health Alerts with fresh symptom data */}
            <HealthAlerts userId={user.id} recentSymptoms={recentSymptoms} />
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
                  {recentActivity.length > 0 ? recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.status === 'emergency' ? 'bg-red-500' : 'bg-rose-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${
                          activity.status === 'emergency' ? 'text-red-600' : ''
                        }`}>
                          {activity.title}
                        </p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-center text-muted-foreground py-4">
                      No recent activity. Start by logging symptoms or scheduling appointments!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Progressive Health Tips */}
            <WeeklyHealthTips pregnancyWeek={currentWeek} isProgressive={true} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-background px-4 py-8 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} MamaAlert. Protecting Nigerian mothers, one alert at a time.</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
