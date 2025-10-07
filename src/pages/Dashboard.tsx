import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useMode } from "@/contexts/ModeContext";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Navigate, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { EmergencyAlertLogger } from "@/components/EmergencyAlertLogger";
import { WelcomeModal } from "@/components/WelcomeModal";
import { OnboardingPrompt } from "@/components/OnboardingPrompt";
import { usePregnancyProgress } from "@/hooks/usePregnancyProgress";
import { supabase } from "@/integrations/supabase/client";
import { BabyProfileSetup } from "@/components/BabyProfileSetup";
import { BreastfeedingTracker } from "@/components/BreastfeedingTracker";
import { InfantHealthMonitor } from "@/components/InfantHealthMonitor";
import { PostpartumMoodTracker } from "@/components/PostpartumMoodTracker";
import { VaccinationSchedule } from "@/components/VaccinationSchedule";
import { PostpartumFeatureCard } from "@/components/PostpartumFeatureCard";
import { HospitalBagChecklist } from "@/components/HospitalBagChecklist";
import { FetalGrowthTracker } from "@/components/FetalGrowthTracker";
import { LearnAndGrow } from "@/components/LearnAndGrow";
import { 
  Heart, 
  Baby,
  MessageCircle,
  Activity,
  Loader2,
  Lightbulb
} from "lucide-react";

interface EmergencyAlert {
  id: string;
  user_id: string;
  alert_type: string;
  message: string;
  timestamp: string;
  location?: string;
}

const Dashboard = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { currentMode, switchToPostpartum, switchToPregnancy } = useMode();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const isPostpartum = currentMode === "postpartum";
  const [emergencyAlerts, setEmergencyAlerts] = useState<EmergencyAlert[]>([]);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  const { pregnancyData, currentWeek, loading: pregnancyLoading } = usePregnancyProgress(user?.id || '');

  const loadDashboardData = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      setProfile(profileData);

      const { data: alertsData } = await supabase
        .from('emergency_alerts')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false })
        .limit(5);

      if (alertsData) setEmergencyAlerts(alertsData);
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
      <div className="min-h-screen bg-gradient-to-br from-accent-pink via-background to-accent flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-accent-pink via-background to-accent pb-20 animate-fade-in">
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
        
        <div className="mobile-container py-4 space-y-4">
          {/* Welcome Header */}
          <div className="px-1 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-display font-bold text-foreground">
                  Good {getTimeOfDay()}, {profile?.first_name || 'Mama'}!
                </h1>
                <p className="text-muted-foreground text-sm">
                  {currentMode === 'pregnancy' 
                    ? `Week ${currentWeek} of your pregnancy`
                    : 'Your postpartum journey'
                  }
                </p>
              </div>
              <Badge variant="secondary" className="px-3 py-1.5 rounded-full text-xs font-medium">
                {currentMode === 'pregnancy' ? '🤰 Pregnancy' : '👶 Postpartum'}
              </Badge>
            </div>
          </div>

          {/* Daily Health Tip */}
          <Card className="bg-gradient-warm border-0 shadow-card overflow-hidden">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-primary/10 rounded-2xl flex-shrink-0">
                  <Lightbulb className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-1.5 text-sm">Today's Health Tip</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {currentMode === 'pregnancy' 
                      ? "Stay hydrated! Aim for 8-10 glasses of water daily to support your baby's development."
                      : "Rest when your baby rests. Adequate sleep is crucial for recovery and milk production."
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency SOS Button - Pinned at top */}
          <Card className="shadow-card border-2 border-primary/10">
            <CardContent className="pt-5 pb-5">
              <EmergencyAlertLogger
                userId={user?.id || ""}
                onAlertSent={handleEmergencyAlert}
              />
            </CardContent>
          </Card>

          {/* Content based on mode */}
          {isPostpartum ? (
            <div className="space-y-4">
              <div className="space-y-4">
                <PostpartumFeatureCard
                  title="Baby Profile Setup"
                  icon={<Baby className="h-5 w-5 text-primary" />}
                  description="Manage your baby's profile and information"
                  defaultExpanded={true}
                >
                  <BabyProfileSetup />
                </PostpartumFeatureCard>
                
                <PostpartumFeatureCard
                  title="Breastfeeding Tracker"
                  icon={<Heart className="h-5 w-5 text-primary" />}
                  description="Track nursing sessions and patterns"
                >
                  <BreastfeedingTracker />
                </PostpartumFeatureCard>
                
                <PostpartumFeatureCard
                  title="Baby Health Monitor"
                  icon={<Activity className="h-5 w-5 text-success" />}
                  description="Monitor growth and milestones"
                >
                  <InfantHealthMonitor />
                </PostpartumFeatureCard>
                
                <PostpartumFeatureCard
                  title="Mood Tracker"
                  icon={<MessageCircle className="h-5 w-5 text-primary" />}
                  description="Track your postpartum mental health"
                >
                  <PostpartumMoodTracker />
                </PostpartumFeatureCard>

                <PostpartumFeatureCard
                  title="Vaccination Schedule"
                  icon={<Activity className="h-5 w-5 text-primary" />}
                  description="Manage baby's vaccination schedule"
                >
                  <VaccinationSchedule userId={user?.id || ""} />
                </PostpartumFeatureCard>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Fetal Growth Tracker - Dominant Hero Section */}
              <Card className="shadow-large border-0 bg-gradient-card overflow-hidden">
                <CardContent className="pt-6 pb-6">
                  <FetalGrowthTracker userId={user?.id || ""} />
                </CardContent>
              </Card>

              {/* Hospital Bag Checklist */}
              {currentWeek >= 32 && (
                <Card className="shadow-card">
                  <CardContent className="pt-6 pb-6">
                    <HospitalBagChecklist userId={user?.id || ""} />
                  </CardContent>
                </Card>
              )}

              {/* Learn & Grow Section */}
              <LearnAndGrow />

              {/* Complete Profile Prompt */}
              {!hasPregnancyData && (
                <Card className="border-primary/20 bg-gradient-secondary shadow-card">
                  <CardContent className="pt-5 pb-5">
                    <div className="text-center space-y-3">
                      <h3 className="text-lg font-display font-semibold text-foreground">
                        Complete Your Pregnancy Profile
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Help us provide personalized care for you and your baby
                      </p>
                      <Button 
                        onClick={() => navigate('/pregnancy-details')}
                        className="w-full h-12 rounded-2xl bg-primary hover:bg-primary-dark shadow-medium native-transition"
                      >
                        Complete Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Mode Switch Option */}
          <div className="pt-4 pb-2 text-center">
            <button
              onClick={handleSwitchMode}
              className="text-sm text-muted-foreground hover:text-primary native-transition font-medium"
            >
              Switch to {currentMode === 'pregnancy' ? 'Postpartum' : 'Pregnancy'} Mode
            </button>
          </div>
        </div>
      </div>
      
      <BottomNav />
    </>
  );
};

export default Dashboard;
