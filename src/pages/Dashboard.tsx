import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useMode } from "@/contexts/ModeContext";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Navigate, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { AppointmentLogger } from "@/components/AppointmentLogger";
import { HealthAlerts } from "@/components/HealthAlerts";
import { WeeklyHealthTips } from "@/components/WeeklyHealthTips";
import { EmergencyAlertLogger } from "@/components/EmergencyAlertLogger";
import { WelcomeModal } from "@/components/WelcomeModal";
import { OnboardingPrompt } from "@/components/OnboardingPrompt";
import { DeliveryLogger } from "@/components/DeliveryLogger";
import { DeliveryPreparationTips } from "@/components/DeliveryPreparationTips";
import { AppointmentReminder } from "@/components/AppointmentReminder";
import { usePregnancyProgress } from "@/hooks/usePregnancyProgress";
import { supabase } from "@/integrations/supabase/client";
import { BabyProfileSetup } from "@/components/BabyProfileSetup";
import { BreastfeedingTracker } from "@/components/BreastfeedingTracker";
import { InfantHealthMonitor } from "@/components/InfantHealthMonitor";
import { PostpartumMoodTracker } from "@/components/PostpartumMoodTracker";
import { VaccinationSchedule } from "@/components/VaccinationSchedule";
import { PostpartumFeatureCard } from "@/components/PostpartumFeatureCard";
import heroImage from '@/assets/hero-maternal-care.jpg';
import healthTipsImage from '@/assets/health-tips-card.jpg';
import { 
  Heart, 
  Baby,
  MessageCircle,
  Activity,
  Loader2,
  Shield,
  Hospital,
  Calendar,
  Clock,
  TrendingUp
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
  const { currentMode, switchToPostpartum, switchToPregnancy } = useMode();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const isPostpartum = currentMode === "postpartum";
  const [emergencyAlerts, setEmergencyAlerts] = useState<EmergencyAlert[]>([]);
  const [recentSymptoms, setRecentSymptoms] = useState<SymptomLog[]>([]);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Use the new progressive pregnancy hook
  const { pregnancyData, currentWeek, loading: pregnancyLoading, refreshData } = usePregnancyProgress(user?.id || '');

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

  const hasPregnancyData = !!pregnancyData;

  // Show onboarding for users in onboarding mode
  useEffect(() => {
    if (user && currentMode === 'onboarding' && !loading) {
      setShowOnboarding(true);
    }
  }, [user, currentMode, loading]);

  // Show welcome modal for new users without pregnancy data (pregnancy mode only)
  useEffect(() => {
    if (user && currentMode === 'pregnancy' && !hasPregnancyData && !loading && !pregnancyLoading && dataLoaded) {
      setShowWelcomeModal(true);
    }
  }, [user, currentMode, hasPregnancyData, loading, dataLoaded, pregnancyLoading]);

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
      return { status: "Emergency", color: "text-emergency", description: `${emergencyAlerts.length} recent alerts` };
    }
    
    // Check recent symptoms (last 7 days)
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const recentSevereSymptoms = recentSymptoms.filter(symptom => {
      const symptomDate = new Date(symptom.timestamp);
      return symptomDate >= lastWeek && symptom.severity >= 7;
    });
    
    if (recentSevereSymptoms.length > 0) {
      return { status: "Needs Attention", color: "text-warning", description: `${recentSevereSymptoms.length} severe symptoms logged` };
    }
    
    if (recentSymptoms.length > 0) {
      return { status: "Monitoring", color: "text-primary", description: `${recentSymptoms.length} symptoms tracked` };
    }
    
    return { status: "Good", color: "text-success", description: "No concerning symptoms" };
  };

  const healthStatus = getHealthStatus();

  // Stats with progressive data
  const userStats = {
    pregnancyWeek: currentWeek,
    emergencyContacts: user?.emergencyContacts || 0,
    recentSymptoms: recentSymptoms.length
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 17) return "afternoon";
    return "evening";
  };

  // Redirect to auth if no user and not loading
  if (!user && !authLoading) {
    return <Navigate to="/auth" replace />;
  }

  // Show loading screen while auth or mode is loading
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

  return (
    <div className="min-h-screen bg-gradient-card">
      <Navbar />
      
      <OnboardingPrompt 
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />
      
      <WelcomeModal 
        isOpen={showWelcomeModal}
        onClose={handleWelcomeModalClose}
        userName={user.firstName || 'there'}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header with Greeting */}
          <div className="bg-white rounded-3xl p-6 shadow-soft">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold text-foreground">
                  Good {getTimeOfDay()}, {user?.firstName || "Mama"}! 👋
                </h1>
                <p className="text-muted-foreground">
                  {isPostpartum ? "Track your recovery and baby's growth" : "Monitor your pregnancy journey"}
                </p>
              </div>
              {!isPostpartum && (
                <Button
                  onClick={() => switchToPostpartum(new Date().toISOString().split('T')[0])}
                  variant="accent"
                  size="lg"
                  className="flex items-center gap-2 animate-bounce-subtle"
                >
                  <Baby className="h-5 w-5" />
                  Switch to Postpartum Mode
                </Button>
              )}
              {isPostpartum && (
                <Button
                  onClick={() => switchToPregnancy()}
                  variant="outline"
                  size="lg"
                  className="flex items-center gap-2"
                >
                  <Heart className="h-5 w-5" />
                  Switch to Pregnancy Mode
                </Button>
              )}
            </div>
          </div>

          {/* Emergency SOS Button */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-3xl p-8 shadow-large">
              <EmergencyAlertLogger 
                userId={user?.id || ""} 
                onAlertSent={handleEmergencyAlert}
              />
            </div>
          </div>

          {/* Daily Health Tip Card */}
          <Card className="bg-gradient-accent border-0 shadow-medium">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/80 rounded-xl">
                  <MessageCircle className="h-6 w-6 text-accent-gold" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-accent-foreground mb-2">Daily Health Tip</h3>
                  <p className="text-sm text-accent-foreground/80">
                    {isPostpartum ? 
                      "Remember to stay hydrated while breastfeeding. Drink 8-10 glasses of water daily to maintain your milk supply and energy levels." :
                      "Take prenatal vitamins daily, especially folic acid. This helps prevent birth defects and supports your baby's healthy development."
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={() => navigate("/emergency-contacts")}
              variant="outline"
              size="lg"
              className="h-20 flex flex-col items-center gap-2 bg-white/80 hover:bg-white"
            >
              <Shield className="h-6 w-6 text-emergency" />
              <span className="text-sm font-medium">Emergency Contacts</span>
            </Button>
            
            <Button
              onClick={() => navigate("/healthcare-centers")}
              variant="outline"
              size="lg"
              className="h-20 flex flex-col items-center gap-2 bg-white/80 hover:bg-white"
            >
              <Hospital className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium">Healthcare Centers</span>
            </Button>
            
            <Button
              onClick={() => navigate("/ai-nurse")}
              variant="outline"
              size="lg"
              className="h-20 flex flex-col items-center gap-2 bg-white/80 hover:bg-white"
            >
              <MessageCircle className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium">AI Nurse Chat</span>
            </Button>
            
            <Button
              onClick={() => navigate(isPostpartum ? "/symptom-logger?mode=postpartum" : "/symptom-logger?mode=pregnancy")}
              variant="outline"
              size="lg"
              className="h-20 flex flex-col items-center gap-2 bg-white/80 hover:bg-white"
            >
              <Activity className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium">Log Symptoms</span>
            </Button>
          </div>

          {/* Content based on mode */}
          {isPostpartum ? (
            <div className="space-y-8">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-semibold text-foreground">Postpartum & Baby Care</h2>
                <p className="text-muted-foreground">All your postpartum tools in one place</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PostpartumFeatureCard
                  title="Baby Profile Setup"
                  icon={<Baby className="h-6 w-6 text-primary" />}
                  description="Manage your baby's profile and basic information"
                  defaultExpanded={true}
                >
                  <BabyProfileSetup />
                </PostpartumFeatureCard>
                
                <PostpartumFeatureCard
                  title="Breastfeeding Tracker"
                  icon={<Heart className="h-6 w-6 text-accent-pink" />}
                  description="Track nursing sessions and feeding patterns"
                >
                  <BreastfeedingTracker />
                </PostpartumFeatureCard>
                
                <PostpartumFeatureCard
                  title="Baby Health Monitor"
                  icon={<Activity className="h-6 w-6 text-success" />}
                  description="Monitor growth, milestones, and health metrics"
                >
                  <InfantHealthMonitor />
                </PostpartumFeatureCard>
                
                <PostpartumFeatureCard
                  title="Mood Tracker"
                  icon={<MessageCircle className="h-6 w-6 text-accent-gold" />}
                  description="Track your postpartum mental health and recovery"
                >
                  <PostpartumMoodTracker />
                </PostpartumFeatureCard>

                <PostpartumFeatureCard
                  title="Vaccination Schedule"
                  icon={<Shield className="h-6 w-6 text-primary" />}
                  description="Track and manage your baby's vaccination schedule"
                >
                  <VaccinationSchedule userId={user?.id || ""} />
                </PostpartumFeatureCard>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-semibold text-foreground">Pregnancy Journey</h2>
                <p className="text-muted-foreground">Track your pregnancy milestones and stay healthy</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-white/80">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Calendar className="h-5 w-5 text-primary" />
                      Upcoming Appointments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AppointmentReminder userId={user?.id || ""} />
                  </CardContent>
                </Card>

                <Card className="bg-white/80">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Activity className="h-5 w-5 text-success" />
                      Health Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <HealthAlerts userId={user?.id || ""} />
                  </CardContent>
                </Card>

                <Card className="bg-white/80">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MessageCircle className="h-5 w-5 text-accent-gold" />
                      Weekly Health Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <WeeklyHealthTips pregnancyWeek={currentWeek} />
                  </CardContent>
                </Card>
              </div>

              {/* Onboarding Alert for Pregnancy Mode */}
              {!hasPregnancyData && (
                <Card className="border-warning/20 bg-gradient-to-r from-warning/5 to-accent/10 shadow-soft">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <h2 className="text-xl font-semibold text-warning mb-4">Complete Your Pregnancy Profile</h2>
                      <p className="text-muted-foreground mb-6">
                        Help us provide you with personalized care by sharing your pregnancy details. 
                        This information will help us send you relevant alerts and track your symptoms better.
                      </p>
                      <Button 
                        onClick={() => navigate("/pregnancy-details")}
                        variant="accent"
                        size="lg"
                      >
                        <Heart className="h-4 w-4 mr-2" />
                        Add Pregnancy Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
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