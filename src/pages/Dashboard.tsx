import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useMode } from "@/contexts/ModeContext";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Navigate, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { EmergencyAlertLogger } from "@/components/EmergencyAlertLogger";
import { WelcomeModal } from "@/components/WelcomeModal";
import { OnboardingPrompt } from "@/components/OnboardingPrompt";
import { AppointmentReminder } from "@/components/AppointmentReminder";
import { HealthAlerts } from "@/components/HealthAlerts";
import { WeeklyHealthTips } from "@/components/WeeklyHealthTips";
import { usePregnancyProgress } from "@/hooks/usePregnancyProgress";
import { supabase } from "@/integrations/supabase/client";
import { BabyProfileSetup } from "@/components/BabyProfileSetup";
import { BreastfeedingTracker } from "@/components/BreastfeedingTracker";
import { InfantHealthMonitor } from "@/components/InfantHealthMonitor";
import { PostpartumMoodTracker } from "@/components/PostpartumMoodTracker";
import { VaccinationSchedule } from "@/components/VaccinationSchedule";
import { PostpartumFeatureCard } from "@/components/PostpartumFeatureCard";
import { FullTermLaborWatch } from "@/components/FullTermLaborWatch";
import { HospitalBagChecklist } from "@/components/HospitalBagChecklist";
import { FetalGrowthTracker } from "@/components/FetalGrowthTracker";
import { 
  Heart, 
  Baby,
  MessageCircle,
  Activity,
  Loader2,
  Shield,
  Hospital,
  Calendar,
  Lightbulb
} from "lucide-react";
import heroImage from '@/assets/dashboard-hero.jpg';
import healthTipsImage from '@/assets/health-tips-card.jpg';
import fetalDevImage from '@/assets/fetal-development.jpg';
import hospitalBagImage from '@/assets/hospital-bag.jpg';
import laborWatchImage from '@/assets/labor-watch.jpg';

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
  const [profile, setProfile] = useState<any>(null);

  const { pregnancyData, currentWeek, loading: pregnancyLoading, refreshData } = usePregnancyProgress(user?.id || '');

  const loadDashboardData = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      // Load user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      setProfile(profileData);

      // Load emergency alerts
      const { data: alertsData } = await supabase
        .from('emergency_alerts')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false })
        .limit(5);

      if (alertsData) setEmergencyAlerts(alertsData);

      // Load recent symptoms
      const { data: symptomsData } = await supabase
        .from('symptom_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false })
        .limit(10);

      if (symptomsData) setRecentSymptoms(symptomsData);
      setDataLoaded(true);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
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

  useEffect(() => {
    if (user && currentMode === 'onboarding' && !loading) {
      setShowOnboarding(true);
    }
  }, [user, currentMode, loading]);

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

  const handleSwitchMode = () => {
    if (currentMode === 'pregnancy') {
      switchToPostpartum(new Date().toISOString().split('T')[0]);
    } else {
      switchToPregnancy();
    }
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 17) return "afternoon";
    return "evening";
  };

  if (!user && !authLoading) {
    return <Navigate to="/auth" replace />;
  }

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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 dark:from-background dark:via-background dark:to-card">
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
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:px-8 lg:py-8">
        <div className="space-y-4 sm:space-y-6">
          {/* Welcome Section */}
          <Card className="gradient-primary text-white border-0 overflow-hidden relative shadow-xl">
            <div 
              className="absolute inset-0 opacity-20 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${heroImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/80 to-red-700/60" />
            <CardContent className="pt-4 pb-4 sm:pt-6 sm:pb-6 relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="space-y-1 sm:space-y-2">
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold drop-shadow-lg">
                    Good {getTimeOfDay()}, {profile?.first_name || 'Mama'}! 💕
                  </h1>
                  <p className="text-white/90 text-xs sm:text-sm drop-shadow">
                    {currentMode === 'pregnancy' 
                      ? `Week ${currentWeek} of your pregnancy journey`
                      : 'Your postpartum care dashboard'
                    }
                  </p>
                </div>
                <div className="flex flex-col sm:text-right gap-2">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm self-start sm:self-end text-xs">
                    {currentMode === 'pregnancy' ? '🤰 Pregnancy' : '👶 Postpartum'}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleSwitchMode}
                    className="text-white hover:bg-white/20 text-xs backdrop-blur-sm w-fit self-start sm:self-end h-7"
                  >
                    Switch to {currentMode === 'pregnancy' ? 'Postpartum' : 'Pregnancy'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Daily Health Tip */}
          <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-amber-950/30 dark:to-yellow-950/30 border-amber-200 dark:border-amber-800 overflow-hidden relative shadow-medium">
            <div 
              className="absolute right-0 top-0 h-full w-1/4 sm:w-1/3 opacity-30 bg-cover bg-center"
              style={{ backgroundImage: `url(${healthTipsImage})` }}
            />
            <CardContent className="pt-3 sm:pt-4 pb-3 sm:pb-4 relative z-10">
              <div className="flex items-start gap-2 sm:gap-3 pr-12 sm:pr-16">
                <div className="p-2 bg-amber-500 text-white rounded-full shadow-lg flex-shrink-0">
                  <Lightbulb className="h-3 w-3 sm:h-4 sm:w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-1 text-xs sm:text-sm">Daily Health Tip</h3>
                  <p className="text-amber-700 dark:text-amber-300 text-xs leading-relaxed">
                    {currentMode === 'pregnancy' 
                      ? "Stay hydrated! Aim for 8-10 glasses of water daily. Proper hydration helps with morning sickness and supports your baby's development."
                      : "Rest when your baby rests. Your body is still recovering, and adequate sleep is crucial for healing and milk production."
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency SOS Button - Static, Framed below Daily Health Tip */}
          <div className="flex justify-center">
            <Card className="bg-card shadow-medium rounded-3xl p-4 sm:p-6 lg:p-8 border border-border w-full">
              <EmergencyAlertLogger
                userId={user?.id || ""}
                onAlertSent={handleEmergencyAlert}
              />
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            <Button
              onClick={() => navigate("/emergency-contacts")}
              variant="outline"
              className="h-14 sm:h-16 lg:h-20 flex flex-col items-center justify-center gap-1 bg-card hover:bg-accent text-xs p-2"
            >
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-emergency flex-shrink-0" />
              <span className="font-medium text-center leading-tight">Emergency Contacts</span>
            </Button>
            
            <Button
              onClick={() => navigate("/healthcare-centers")}
              variant="outline"
              className="h-14 sm:h-16 lg:h-20 flex flex-col items-center justify-center gap-1 bg-card hover:bg-accent text-xs p-2"
            >
              <Hospital className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
              <span className="font-medium text-center leading-tight">Healthcare Centers</span>
            </Button>
            
            <Button
              onClick={() => navigate("/ai-nurse")}
              variant="outline"
              className="h-14 sm:h-16 lg:h-20 flex flex-col items-center justify-center gap-1 bg-card hover:bg-accent text-xs p-2"
            >
              <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
              <span className="font-medium text-center leading-tight">AI Nurse Chat</span>
            </Button>
            
            <Button
              onClick={() => navigate(isPostpartum ? "/symptom-logger?mode=postpartum" : "/symptom-logger?mode=pregnancy")}
              variant="outline"
              className="h-14 sm:h-16 lg:h-20 flex flex-col items-center justify-center gap-1 bg-card hover:bg-accent text-xs p-2"
            >
              <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
              <span className="font-medium text-center leading-tight">Log Symptoms</span>
            </Button>
          </div>

          {/* Content based on mode */}
          {isPostpartum ? (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center space-y-1 sm:space-y-2">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground">Postpartum & Baby Care</h2>
                <p className="text-muted-foreground text-xs sm:text-sm">All your postpartum tools in one place</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                <PostpartumFeatureCard
                  title="Baby Profile Setup"
                  icon={<Baby className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />}
                  description="Manage your baby's profile and basic information"
                  defaultExpanded={true}
                >
                  <BabyProfileSetup />
                </PostpartumFeatureCard>
                
                <PostpartumFeatureCard
                  title="Breastfeeding Tracker"
                  icon={<Heart className="h-5 w-5 sm:h-6 sm:w-6 text-accent-pink" />}
                  description="Track nursing sessions and feeding patterns"
                >
                  <BreastfeedingTracker />
                </PostpartumFeatureCard>
                
                <PostpartumFeatureCard
                  title="Baby Health Monitor"
                  icon={<Activity className="h-5 w-5 sm:h-6 sm:w-6 text-success" />}
                  description="Monitor growth, milestones, and health metrics"
                >
                  <InfantHealthMonitor />
                </PostpartumFeatureCard>
                
                <PostpartumFeatureCard
                  title="Mood Tracker"
                  icon={<MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-accent-gold" />}
                  description="Track your postpartum mental health and recovery"
                >
                  <PostpartumMoodTracker />
                </PostpartumFeatureCard>

                <PostpartumFeatureCard
                  title="Vaccination Schedule"
                  icon={<Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />}
                  description="Track and manage your baby's vaccination schedule"
                >
                  <VaccinationSchedule userId={user?.id || ""} />
                </PostpartumFeatureCard>
              </div>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center space-y-1 sm:space-y-2">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground">Pregnancy Journey</h2>
                <p className="text-muted-foreground text-xs sm:text-sm">Track your pregnancy milestones and stay healthy</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {/* Full Term Labor Watch */}
                {currentWeek >= 35 && (
                  <Card className="bg-card shadow-large overflow-hidden relative">
                    <div 
                      className="absolute right-0 top-0 h-full w-1/3 opacity-20 bg-cover bg-center"
                      style={{ backgroundImage: `url(${laborWatchImage})` }}
                    />
                    <CardContent className="pt-6 relative z-10">
                      <FullTermLaborWatch userId={user?.id || ""} />
                    </CardContent>
                  </Card>
                )}

                {/* Hospital Bag Checklist */}
                {currentWeek >= 32 && (
                  <Card className="bg-card shadow-large overflow-hidden relative">
                    <div 
                      className="absolute right-0 top-0 h-full w-1/3 opacity-20 bg-cover bg-center"
                      style={{ backgroundImage: `url(${hospitalBagImage})` }}
                    />
                    <CardContent className="pt-6 relative z-10">
                      <HospitalBagChecklist userId={user?.id || ""} />
                    </CardContent>
                  </Card>
                )}

                {/* Fetal Growth Tracker */}
                <Card className="bg-card shadow-large overflow-hidden relative lg:col-span-2 xl:col-span-1">
                  <div 
                    className="absolute right-0 top-0 h-full w-1/3 opacity-20 bg-cover bg-center"
                    style={{ backgroundImage: `url(${fetalDevImage})` }}
                  />
                  <CardContent className="pt-6 relative z-10">
                    <FetalGrowthTracker userId={user?.id || ""} />
                  </CardContent>
                </Card>

                {/* Appointments Card */}
                <Card className="bg-card shadow-large">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Calendar className="h-5 w-5 text-primary" />
                      Upcoming Appointments
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <AppointmentReminder userId={user?.id || ""} />
                  </CardContent>
                </Card>

                {/* Health Alerts Card */}
                <Card className="bg-card shadow-large">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Activity className="h-5 w-5 text-success" />
                      Health Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <HealthAlerts userId={user?.id || ""} />
                  </CardContent>
                </Card>

                {/* Weekly Health Tips Card */}
                <Card className="bg-card shadow-large lg:col-span-2 xl:col-span-1">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <MessageCircle className="h-5 w-5 text-accent-gold" />
                      Weekly Health Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <WeeklyHealthTips pregnancyWeek={currentWeek} />
                  </CardContent>
                </Card>
              </div>

              {/* Onboarding Alert for Pregnancy Mode */}
              {!hasPregnancyData && (
                <Card className="border-warning/20 dark:border-warning/30 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 shadow-soft">
                  <CardContent className="pt-4 sm:pt-6">
                    <div className="text-center">
                      <h2 className="text-lg sm:text-xl font-semibold text-amber-700 dark:text-amber-300 mb-2 sm:mb-4">Complete Your Pregnancy Profile</h2>
                      <p className="text-muted-foreground mb-3 sm:mb-4 text-xs sm:text-sm">
                        Help us provide personalized care by sharing your pregnancy details.
                      </p>
                      <Button 
                        onClick={() => navigate('/pregnancy-details')}
                        className="bg-warning hover:bg-warning/90 text-white"
                      >
                        Complete Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;