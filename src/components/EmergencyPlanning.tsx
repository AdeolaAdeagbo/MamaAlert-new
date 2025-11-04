import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { usePregnancyProgress } from '@/hooks/usePregnancyProgress';
import { Shield, AlertCircle, CheckCircle, Bell, BellOff } from 'lucide-react';

interface EmergencyItem {
  id: string;
  label: string;
  category: 'contacts' | 'hospital' | 'transport' | 'medical';
  isChecked: boolean;
}

interface EmergencyPlanningProps {
  userId: string;
}

const EMERGENCY_CHECKLIST = [
  { id: '1', label: 'Emergency contact list saved', category: 'contacts' },
  { id: '2', label: 'Backup emergency contact identified', category: 'contacts' },
  { id: '3', label: 'Hospital/birthing center chosen and registered', category: 'hospital' },
  { id: '4', label: 'Hospital route and travel time confirmed', category: 'hospital' },
  { id: '5', label: 'Hospital bag packed and ready', category: 'hospital' },
  { id: '6', label: 'Trusted transport contact saved', category: 'transport' },
  { id: '7', label: 'Backup transport option identified', category: 'transport' },
  { id: '8', label: 'Blood group confirmed and documented', category: 'medical' },
  { id: '9', label: 'Health insurance details accessible', category: 'medical' },
  { id: '10', label: 'Known allergies documented', category: 'medical' },
  { id: '11', label: 'Current medications list prepared', category: 'medical' },
] as const;

export const EmergencyPlanning = ({ userId }: EmergencyPlanningProps) => {
  const { toast } = useToast();
  const { currentWeek } = usePregnancyProgress(userId);
  const [checklist, setChecklist] = useState<EmergencyItem[]>([]);
  const [weeklyReminders, setWeeklyReminders] = useState(false);
  const [loading, setLoading] = useState(true);

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
        setChecklist(savedChecklist.length > 0 ? savedChecklist : 
          EMERGENCY_CHECKLIST.map(item => ({ ...item, isChecked: false }))
        );
        setWeeklyReminders(data.weekly_reminders || false);
      } else {
        setChecklist(EMERGENCY_CHECKLIST.map(item => ({ ...item, isChecked: false })));
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
          ? "You'll receive weekly reminders until your due date."
          : "Weekly reminders have been turned off."
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
    return {
      completed,
      total,
      percentage: Math.round((completed / total) * 100)
    };
  };

  const getCategoryIcon = (category: string) => {
    return <Shield className="h-4 w-4" />;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'contacts': return 'text-blue-600 dark:text-blue-400';
      case 'hospital': return 'text-purple-600 dark:text-purple-400';
      case 'transport': return 'text-green-600 dark:text-green-400';
      case 'medical': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const progress = getProgress();

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200 dark:border-orange-800">
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  const categories = [
    { key: 'contacts', name: 'Emergency Contacts', color: 'blue' },
    { key: 'hospital', name: 'Hospital Readiness', color: 'purple' },
    { key: 'transport', name: 'Transportation', color: 'green' },
    { key: 'medical', name: 'Medical Information', color: 'red' },
  ];

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200 dark:border-orange-800">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
            <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900/30">
              <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            Emergency Planning
          </CardTitle>
          <Badge variant="secondary">Week {currentWeek}</Badge>
        </div>
        <p className="text-sm text-orange-700 dark:text-orange-300 italic">
          "Prepared today, protected tomorrow."
        </p>
        
        <div className="space-y-3 mt-4">
          <div className="flex justify-between text-sm text-orange-800 dark:text-orange-200">
            <span>Completion Progress</span>
            <span className="font-medium">{progress.completed}/{progress.total}</span>
          </div>
          <Progress value={progress.percentage} className="h-3" />
          <p className="text-xs text-muted-foreground">
            {progress.percentage}% complete - Keep going!
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={toggleReminders}
          className="mt-4 w-full border-orange-300 dark:border-orange-700 text-orange-800 dark:text-orange-200"
        >
          {weeklyReminders ? (
            <>
              <BellOff className="h-4 w-4 mr-2" />
              Disable Weekly Reminders
            </>
          ) : (
            <>
              <Bell className="h-4 w-4 mr-2" />
              Enable Weekly Reminders
            </>
          )}
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {categories.map((category) => {
          const categoryItems = checklist.filter(item => item.category === category.key);
          const checkedItems = categoryItems.filter(item => item.isChecked).length;
          
          return (
            <div key={category.key} className="space-y-3">
              <div className="flex items-center gap-2">
                <div className={getCategoryColor(category.key)}>
                  {getCategoryIcon(category.key)}
                </div>
                <h4 className="font-medium text-sm text-foreground">{category.name}</h4>
                <Badge variant="outline" className="text-xs">
                  {checkedItems}/{categoryItems.length}
                </Badge>
              </div>
              
              <div className="space-y-2 ml-6">
                {categoryItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <Checkbox
                      id={item.id}
                      checked={item.isChecked}
                      onCheckedChange={() => toggleItem(item.id)}
                      className="flex-shrink-0"
                    />
                    <label
                      htmlFor={item.id}
                      className={`text-sm flex-1 cursor-pointer ${
                        item.isChecked ? 'line-through text-muted-foreground' : 'text-foreground'
                      }`}
                    >
                      {item.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {progress.percentage === 100 && (
          <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
              <CheckCircle className="h-5 w-5" />
              <span className="font-semibold">Fully Prepared!</span>
            </div>
            <p className="text-sm text-green-700 dark:text-green-300 mt-1">
              Excellent work! Your emergency plan is complete. You're ready for any situation.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
