import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { usePregnancyProgress } from '@/hooks/usePregnancyProgress';
import { Shield, AlertCircle, CheckCircle, Bell, BellOff, Award, Lock, Unlock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface EmergencyItem {
  id: string;
  label: string;
  week: number;
  category: 'contacts' | 'hospital' | 'transport' | 'medical' | 'financial' | 'preparation';
  isChecked: boolean;
  emoji?: string;
}

interface EmergencyPlanningProps {
  userId: string;
}

// 36-week roadmap with emoji accents
const EMERGENCY_ROADMAP: Omit<EmergencyItem, 'isChecked'>[] = [
  // Weeks 1-4: Foundation
  { id: '1', label: 'Save primary emergency contact', week: 1, category: 'contacts', emoji: '📞' },
  { id: '2', label: 'Add backup emergency contact', week: 2, category: 'contacts', emoji: '👥' },
  { id: '3', label: 'Document blood group', week: 3, category: 'medical', emoji: '🩸' },
  { id: '4', label: 'List known allergies', week: 4, category: 'medical', emoji: '⚠️' },
  
  // Weeks 5-8: Medical Setup
  { id: '5', label: 'Choose healthcare provider', week: 5, category: 'hospital', emoji: '🏥' },
  { id: '6', label: 'Register at hospital/birthing center', week: 6, category: 'hospital', emoji: '📋' },
  { id: '7', label: 'Save health insurance details', week: 7, category: 'medical', emoji: '🏥' },
  { id: '8', label: 'Document current medications', week: 8, category: 'medical', emoji: '💊' },
  
  // Weeks 9-12: Transport Planning (Bronze Badge)
  { id: '9', label: 'Identify trusted transport', week: 9, category: 'transport', emoji: '🚗' },
  { id: '10', label: 'Save driver contact details', week: 10, category: 'transport', emoji: '📱' },
  { id: '11', label: 'Plan backup transport option', week: 11, category: 'transport', emoji: '🚕' },
  { id: '12', label: 'Test hospital route & timing', week: 12, category: 'transport', emoji: '🗺️' },
  
  // Weeks 13-16: Financial Preparation
  { id: '13', label: 'Review delivery costs', week: 13, category: 'financial', emoji: '💰' },
  { id: '14', label: 'Start MamaWallet savings', week: 14, category: 'financial', emoji: '💵' },
  { id: '15', label: 'Verify insurance coverage', week: 15, category: 'financial', emoji: '📄' },
  { id: '16', label: 'Plan for unexpected costs', week: 16, category: 'financial', emoji: '🏦' },
  
  // Weeks 17-20: Care Circle
  { id: '17', label: 'Build your Care Circle', week: 17, category: 'contacts', emoji: '🤝' },
  { id: '18', label: 'Share emergency plan with family', week: 18, category: 'contacts', emoji: '👨‍👩‍👧' },
  { id: '19', label: 'Confirm contact availability', week: 19, category: 'contacts', emoji: '✅' },
  { id: '20', label: 'Update emergency numbers', week: 20, category: 'contacts', emoji: '☎️' },
  
  // Weeks 21-24: Hospital Readiness (Silver Badge)
  { id: '21', label: 'Tour hospital/birthing center', week: 21, category: 'hospital', emoji: '🚶‍♀️' },
  { id: '22', label: 'Learn admission procedures', week: 22, category: 'hospital', emoji: '📝' },
  { id: '23', label: 'Know labor & delivery floor location', week: 23, category: 'hospital', emoji: '🏥' },
  { id: '24', label: 'Save hospital hotline', week: 24, category: 'hospital', emoji: '📞' },
  
  // Weeks 25-28: Document Preparation
  { id: '25', label: 'Organize medical records', week: 25, category: 'medical', emoji: '📑' },
  { id: '26', label: 'Prepare birth preferences', week: 26, category: 'preparation', emoji: '📋' },
  { id: '27', label: 'Complete pre-registration forms', week: 27, category: 'hospital', emoji: '✍️' },
  { id: '28', label: 'Update insurance info', week: 28, category: 'financial', emoji: '🔄' },
  
  // Weeks 29-32: Final Transport
  { id: '29', label: 'Confirm transport availability 24/7', week: 29, category: 'transport', emoji: '⏰' },
  { id: '30', label: 'Share hospital address with driver', week: 30, category: 'transport', emoji: '📍' },
  { id: '31', label: 'Practice emergency call drill', week: 31, category: 'contacts', emoji: '📲' },
  { id: '32', label: 'Pack hospital bag', week: 32, category: 'preparation', emoji: '🎒' },
  
  // Weeks 33-36: Baby Readiness (Gold Badge)
  { id: '33', label: 'Prepare baby essentials', week: 33, category: 'preparation', emoji: '👶🏽' },
  { id: '34', label: 'Stock emergency supplies', week: 34, category: 'preparation', emoji: '🧰' },
  { id: '35', label: 'Final emergency contact check', week: 35, category: 'contacts', emoji: '🔍' },
  { id: '36', label: 'Complete all emergency planning', week: 36, category: 'preparation', emoji: '🎉' },
];

export const EmergencyPlanning = ({ userId }: EmergencyPlanningProps) => {
  const { toast } = useToast();
  const { currentWeek, pregnancyData } = usePregnancyProgress(userId);
  const [checklist, setChecklist] = useState<EmergencyItem[]>([]);
  const [weeklyReminders, setWeeklyReminders] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasShownConfetti, setHasShownConfetti] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchEmergencyPlan();
  }, [userId]);

  const fetchEmergencyPlan = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('emergency_planning')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        const savedChecklist = JSON.parse(data.checklist_items || '[]');
        if (savedChecklist.length > 0) {
          setChecklist(savedChecklist);
        } else {
          setChecklist(EMERGENCY_ROADMAP.map(item => ({ ...item, isChecked: false })));
        }
        setWeeklyReminders(data.weekly_reminders || false);
      } else {
        setChecklist(EMERGENCY_ROADMAP.map(item => ({ ...item, isChecked: false })));
      }
    } catch (error) {
      console.error('Error fetching emergency plan:', error);
      toast({
        title: "Error",
        description: "Failed to load emergency plan.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = async (itemId: string) => {
    const updatedChecklist = checklist.map(item =>
      item.id === itemId ? { ...item, isChecked: !item.isChecked } : item
    );
    setChecklist(updatedChecklist);

    try {
      const { data: existing } = await supabase
        .from('emergency_planning')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('emergency_planning')
          .update({ checklist_items: JSON.stringify(updatedChecklist) })
          .eq('user_id', userId);
      } else {
        await supabase
          .from('emergency_planning')
          .insert({
            user_id: userId,
            checklist_items: JSON.stringify(updatedChecklist),
            weekly_reminders: weeklyReminders
          });
      }
    } catch (error) {
      console.error('Error updating checklist:', error);
      toast({
        title: "Error",
        description: "Failed to update checklist.",
        variant: "destructive"
      });
    }
  };

  const toggleReminders = async () => {
    const newValue = !weeklyReminders;
    setWeeklyReminders(newValue);

    try {
      const { data: existing } = await supabase
        .from('emergency_planning')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('emergency_planning')
          .update({ weekly_reminders: newValue })
          .eq('user_id', userId);
      } else {
        await supabase
          .from('emergency_planning')
          .insert({
            user_id: userId,
            checklist_items: JSON.stringify(checklist),
            weekly_reminders: newValue
          });
      }

      toast({
        title: newValue ? "Reminders Enabled" : "Reminders Disabled",
        description: newValue 
          ? "Hi Mama 💕, you'll get weekly safety reminders until delivery!"
          : "Weekly reminders turned off."
      });
    } catch (error) {
      console.error('Error toggling reminders:', error);
      toast({
        title: "Error",
        description: "Failed to update reminder settings.",
        variant: "destructive"
      });
    }
  };

  const getProgress = () => {
    const completed = checklist.filter(item => item.isChecked).length;
    const total = checklist.length;
    const percentage = Math.round((completed / total) * 100);
    const completedWeeks = Math.max(...checklist.filter(item => item.isChecked).map(item => item.week), 0);
    
    return { completed, total, percentage, completedWeeks };
  };

  const getBadge = (completedWeeks: number) => {
    if (completedWeeks >= 36) return { name: 'Gold', color: 'text-yellow-600 dark:text-yellow-400', icon: '🏆' };
    if (completedWeeks >= 24) return { name: 'Silver', color: 'text-gray-400 dark:text-gray-300', icon: '🥈' };
    if (completedWeeks >= 12) return { name: 'Bronze', color: 'text-orange-600 dark:text-orange-400', icon: '🥉' };
    return null;
  };

  const progress = getProgress();
  const badge = getBadge(progress.completedWeeks);

  // Trigger confetti on 100% completion
  useEffect(() => {
    if (progress.percentage === 100 && !hasShownConfetti) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF6B9D', '#FFA07A', '#FFD700', '#FF69B4']
      });
      setHasShownConfetti(true);
      toast({
        title: "🎉 You're Emergency-Ready!",
        description: "Congratulations Mama! You've completed all 36 weeks of emergency planning.",
      });
    }
  }, [progress.percentage]);

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-coral-50 to-rose-50 dark:from-coral-950/20 dark:to-rose-950/20 border-coral-200 dark:border-coral-800">
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  const weeklyItems = checklist.filter(item => item.week === currentWeek);
  const upcomingItems = checklist.filter(item => item.week > currentWeek).slice(0, 3);
  const unlockedItems = checklist.filter(item => item.week <= currentWeek);

  return (
    <Card className="bg-gradient-to-br from-coral-50 to-rose-50 dark:from-coral-950/20 dark:to-rose-950/20 border-coral-200 dark:border-coral-800 shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-1.5">
          <CardTitle className="flex items-center gap-2 text-coral-800 dark:text-coral-200 text-base">
            <div className="p-1.5 rounded-full bg-coral-100 dark:bg-coral-900/30">
              <AlertCircle className="h-4 w-4 text-coral-600 dark:text-coral-400" />
            </div>
            Emergency Planning
          </CardTitle>
          <div className="flex items-center gap-1.5">
            {badge && (
              <Badge variant="secondary" className={`${badge.color} font-semibold text-xs px-2 py-0.5`}>
                {badge.icon} {badge.name}
              </Badge>
            )}
            <Badge variant="outline" className="text-xs px-2 py-0.5">Week {currentWeek}</Badge>
          </div>
        </div>
        <p className="text-xs text-coral-700 dark:text-coral-300 italic">
          "Prepared today, protected tomorrow." 💕
        </p>
        
        <div className="space-y-2 mt-3">
          <div className="flex justify-between text-xs text-coral-800 dark:text-coral-200">
            <span>Overall Progress</span>
            <span className="font-medium">{progress.completed}/{progress.total}</span>
          </div>
          <Progress value={progress.percentage} className="h-2 bg-coral-100 dark:bg-coral-900/30" />
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">{progress.percentage}% complete</span>
            <span className="text-muted-foreground">{progress.completedWeeks}/36 weeks</span>
          </div>
        </div>

        <div className="flex gap-2 mt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleReminders}
            className="flex-1 border-coral-300 dark:border-coral-700 text-coral-800 dark:text-coral-200 hover:bg-coral-100 dark:hover:bg-coral-900/30 h-8 text-xs"
          >
            {weeklyReminders ? (
              <>
                <BellOff className="h-3.5 w-3.5 mr-1.5" />
                Disable Reminders
              </>
            ) : (
              <>
                <Bell className="h-3.5 w-3.5 mr-1.5" />
                Enable Reminders
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="flex-1 border-coral-300 dark:border-coral-700 text-coral-800 dark:text-coral-200 hover:bg-coral-100 dark:hover:bg-coral-900/30 h-8 text-xs"
          >
            {showDetails ? "Hide Details" : "Show Details"}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {showDetails && (
          <>
        {/* This Week's Goals */}
        {weeklyItems.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Unlock className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
              <h4 className="font-semibold text-xs text-foreground">This Week's Safety Goals</h4>
              <Badge variant="outline" className="text-xs px-1.5 py-0 bg-green-50 dark:bg-green-950/20 border-green-300 dark:border-green-700">
                Week {currentWeek}
              </Badge>
            </div>
            
            <div className="space-y-1.5 ml-5">
              {weeklyItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-2 p-2 rounded-lg bg-white/70 dark:bg-gray-800/70 border border-coral-200 dark:border-coral-800 hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-sm"
                >
                  <Checkbox
                    id={item.id}
                    checked={item.isChecked}
                    onCheckedChange={() => toggleItem(item.id)}
                    className="flex-shrink-0"
                  />
                  <label
                    htmlFor={item.id}
                    className={`text-xs flex-1 cursor-pointer flex items-center gap-1.5 ${
                      item.isChecked ? 'line-through text-muted-foreground' : 'text-foreground font-medium'
                    }`}
                  >
                    {item.emoji && <span>{item.emoji}</span>}
                    {item.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Tasks */}
        {upcomingItems.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-muted-foreground" />
              <h4 className="font-medium text-xs text-muted-foreground">Coming Soon</h4>
            </div>
            
            <div className="space-y-1 ml-5 opacity-60">
              {upcomingItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-2 p-1.5 rounded-lg"
                >
                  <div className="text-xs flex items-center gap-1.5 text-muted-foreground">
                    {item.emoji && <span className="grayscale">{item.emoji}</span>}
                    <span>Week {item.week}: {item.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Milestone Badges */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-coral-200 dark:border-coral-800">
          <div className={`text-center p-2 rounded-lg ${progress.completedWeeks >= 12 ? 'bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800' : 'bg-gray-50 dark:bg-gray-900/20 opacity-50'}`}>
            <div className="text-xl mb-0.5">🥉</div>
            <div className="text-xs font-medium">Bronze</div>
            <div className="text-xs text-muted-foreground">Week 12</div>
          </div>
          <div className={`text-center p-2 rounded-lg ${progress.completedWeeks >= 24 ? 'bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700' : 'bg-gray-50 dark:bg-gray-900/20 opacity-50'}`}>
            <div className="text-xl mb-0.5">🥈</div>
            <div className="text-xs font-medium">Silver</div>
            <div className="text-xs text-muted-foreground">Week 24</div>
          </div>
          <div className={`text-center p-2 rounded-lg ${progress.completedWeeks >= 36 ? 'bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800' : 'bg-gray-50 dark:bg-gray-900/20 opacity-50'}`}>
            <div className="text-xl mb-0.5">🏆</div>
            <div className="text-xs font-medium">Gold</div>
            <div className="text-xs text-muted-foreground">Week 36</div>
          </div>
        </div>

        {/* Completion Message */}
        {progress.percentage === 100 && (
          <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800 rounded-lg animate-scale-in">
            <div className="flex items-center gap-2 text-green-800 dark:text-green-200 mb-1">
              <CheckCircle className="h-4 w-4" />
              <span className="font-bold text-xs">You're Emergency-Ready! 🎉</span>
            </div>
            <p className="text-xs text-green-700 dark:text-green-300 leading-relaxed">
              Excellent work, Mama! You've completed all 36 weeks of emergency planning. You're fully prepared for your delivery journey. 💕
            </p>
          </div>
        )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
