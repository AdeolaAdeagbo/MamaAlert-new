import { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Heart, 
  Moon, 
  Brain,
  Smile,
  Frown,
  Sun,
  AlertCircle,
  Sparkles,
  Coffee,
  Book
} from 'lucide-react';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';

interface MoodEntry {
  id: string;
  mood_score: number;
  anxiety_level: number;
  sleep_hours?: number;
  notes?: string;
  created_at: string;
}

const SELF_CARE_TIPS = [
  "Take a warm bath while someone watches the baby",
  "Practice 5 minutes of deep breathing",
  "Go for a short walk outside",
  "Call a friend or family member",
  "Listen to your favorite music",
  "Do some gentle stretching",
  "Write in a journal",
  "Drink a cup of herbal tea",
  "Watch something that makes you laugh",
  "Take a nap if possible"
];

const POSITIVE_AFFIRMATIONS = [
  "I am learning and growing as a mother every day",
  "It's okay to ask for help when I need it",
  "My baby is lucky to have me as their mother",
  "I am doing my best, and that is enough",
  "Difficult moments don't last, but strong mothers do",
  "I am worthy of love, care, and support",
  "Every mother has challenging days - I'm not alone",
  "I trust my instincts as a mother",
  "It's normal to feel overwhelmed sometimes",
  "I am creating a loving environment for my baby"
];

export const PostpartumMoodTracker = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [currentMood, setCurrentMood] = useState([5]);
  const [currentAnxiety, setCurrentAnxiety] = useState([3]);
  const [sleepHours, setSleepHours] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dailyAffirmation, setDailyAffirmation] = useState('');
  const [selfCareTip, setSelfCareTip] = useState('');

  useEffect(() => {
    if (user?.id) {
      fetchMoodEntries();
    }
    
    // Set daily affirmation and self-care tip
    const today = new Date().getDate();
    setDailyAffirmation(POSITIVE_AFFIRMATIONS[today % POSITIVE_AFFIRMATIONS.length]);
    setSelfCareTip(SELF_CARE_TIPS[today % SELF_CARE_TIPS.length]);
  }, [user?.id]);

  const fetchMoodEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('mood_tracking')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(14);

      if (error) throw error;
      setMoodEntries(data || []);
    } catch (error) {
      console.error('Error fetching mood entries:', error);
      toast({
        title: "Error",
        description: "Failed to load mood entries.",
        variant: "destructive"
      });
    }
  };

  const saveMoodEntry = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('mood_tracking')
        .insert({
          user_id: user!.id,
          mood_score: currentMood[0],
          anxiety_level: currentAnxiety[0],
          sleep_hours: sleepHours ? parseFloat(sleepHours) : null,
          notes: notes || null
        })
        .select()
        .single();

      if (error) throw error;
      
      setMoodEntries(prev => [data, ...prev]);
      setCurrentMood([5]);
      setCurrentAnxiety([3]);
      setSleepHours('');
      setNotes('');
      
      // Check for concerning patterns
      if (currentMood[0] <= 3 || currentAnxiety[0] >= 8) {
        toast({
          title: "Mental Health Check",
          description: "Consider reaching out to a healthcare provider or counselor for support.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Mood Logged",
          description: "Your mood has been recorded. Remember to be kind to yourself."
        });
      }
    } catch (error) {
      console.error('Error saving mood entry:', error);
      toast({
        title: "Error",
        description: "Failed to save mood entry.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getMoodIcon = (score: number) => {
    if (score <= 3) return <Frown className="h-4 w-4 text-red-600" />;
    if (score <= 6) return <Sun className="h-4 w-4 text-yellow-600" />;
    return <Smile className="h-4 w-4 text-green-600" />;
  };

  const getMoodColor = (score: number) => {
    if (score <= 3) return 'bg-red-100 text-red-800';
    if (score <= 6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getAnxietyColor = (level: number) => {
    if (level <= 3) return 'bg-green-100 text-green-800';
    if (level <= 6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const calculateWeeklyAverage = () => {
    const thisWeek = startOfWeek(new Date());
    const weekEntries = moodEntries.filter(entry => 
      new Date(entry.created_at) >= thisWeek
    );
    
    if (weekEntries.length === 0) return { mood: 0, anxiety: 0 };
    
    const avgMood = weekEntries.reduce((sum, entry) => sum + entry.mood_score, 0) / weekEntries.length;
    const avgAnxiety = weekEntries.reduce((sum, entry) => sum + entry.anxiety_level, 0) / weekEntries.length;
    
    return { mood: Math.round(avgMood * 10) / 10, anxiety: Math.round(avgAnxiety * 10) / 10 };
  };

  const weeklyAverage = calculateWeeklyAverage();

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500 text-white rounded-full">
              <Heart className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-purple-700">Postpartum Mood & Wellness</CardTitle>
              <p className="text-sm text-purple-600">Track your mental health and practice self-care</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Daily Inspiration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-700 flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Daily Affirmation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-800 font-medium italic">"{dailyAffirmation}"</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-700 flex items-center gap-2">
              <Coffee className="h-5 w-5" />
              Self-Care Tip
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-800 font-medium">{selfCareTip}</p>
          </CardContent>
        </Card>
      </div>

      {/* Mood Tracker */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            How are you feeling today?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-3 block">Mood (1 = Very Low, 10 = Excellent)</label>
            <div className="px-3">
              <Slider
                value={currentMood}
                onValueChange={setCurrentMood}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Very Low</span>
              <span className="font-medium">Current: {currentMood[0]}</span>
              <span>Excellent</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-3 block">Anxiety Level (1 = Very Calm, 10 = Very Anxious)</label>
            <div className="px-3">
              <Slider
                value={currentAnxiety}
                onValueChange={setCurrentAnxiety}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Very Calm</span>
              <span className="font-medium">Current: {currentAnxiety[0]}</span>
              <span>Very Anxious</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                <Moon className="h-4 w-4" />
                Sleep Hours (last night)
              </label>
              <Input
                type="number"
                step="0.5"
                placeholder="6.5"
                value={sleepHours}
                onChange={(e) => setSleepHours(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Notes about your day</label>
            <Textarea
              placeholder="How are you feeling? What's on your mind? Any challenges or wins today?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <Button onClick={saveMoodEntry} disabled={isLoading} className="w-full">
            Log Today's Mood
          </Button>
        </CardContent>
      </Card>

      {/* Weekly Summary */}
      {moodEntries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>This Week's Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{weeklyAverage.mood}/10</p>
                <p className="text-sm text-muted-foreground">Average Mood</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{weeklyAverage.anxiety}/10</p>
                <p className="text-sm text-muted-foreground">Average Anxiety</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Mood Entries</CardTitle>
        </CardHeader>
        <CardContent>
          {moodEntries.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No mood entries yet. Start tracking your mental health above!
            </p>
          ) : (
            <div className="space-y-3">
              {moodEntries.slice(0, 7).map(entry => (
                <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">
                      {format(new Date(entry.created_at), 'MMM d, yyyy')}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {getMoodIcon(entry.mood_score)}
                      <span className="text-sm">
                        {entry.sleep_hours && `${entry.sleep_hours}h sleep`}
                      </span>
                    </div>
                    {entry.notes && (
                      <p className="text-xs text-muted-foreground mt-1 max-w-md">
                        {entry.notes.length > 100 ? `${entry.notes.substring(0, 100)}...` : entry.notes}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <Badge className={getMoodColor(entry.mood_score)}>
                      Mood: {entry.mood_score}/10
                    </Badge>
                    <br />
                    <Badge className={`${getAnxietyColor(entry.anxiety_level)} mt-1`}>
                      Anxiety: {entry.anxiety_level}/10
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mental Health Resources */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-700 flex items-center gap-2">
            <Book className="h-5 w-5" />
            Mental Health Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-blue-800">
            <p><strong>Postpartum Support International:</strong> Call 1-800-944-4773</p>
            <p><strong>Crisis Text Line:</strong> Text "HELLO" to 741741</p>
            <p><strong>Nigeria Mental Health Support:</strong> Contact your local healthcare provider</p>
            <p className="text-blue-600 italic">
              Remember: Postpartum depression and anxiety are common and treatable. You're not alone.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Alert */}
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <h3 className="font-semibold text-red-800">Need Immediate Support?</h3>
          </div>
          <p className="text-sm text-red-700 mb-4">
            If you're having thoughts of hurting yourself or your baby, please seek help immediately. 
            These feelings are treatable and temporary.
          </p>
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={() => {
              toast({
                title: "Emergency Resources",
                description: "Contact emergency services, your healthcare provider, or a mental health professional immediately.",
                variant: "destructive"
              });
            }}
          >
            <Heart className="h-4 w-4 mr-2" />
            Get Emergency Mental Health Support
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};