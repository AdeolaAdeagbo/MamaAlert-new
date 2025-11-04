import { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { useBabyProfile } from '@/hooks/useBabyProfile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Baby, 
  Clock, 
  Play, 
  Square, 
  AlertCircle,
  Heart,
  Timer
} from 'lucide-react';
import { format } from 'date-fns';

interface BreastfeedingSession {
  id: string;
  baby_id: string;
  start_time: string;
  end_time?: string;
  side_used?: string;
  notes?: string;
  created_at: string;
}

export const BreastfeedingTracker = () => {
  const { user } = useAuth();
  const { babyProfiles } = useBabyProfile(user?.id || '');
  const { toast } = useToast();
  
  const [sessions, setSessions] = useState<BreastfeedingSession[]>([]);
  const [activeSession, setActiveSession] = useState<BreastfeedingSession | null>(null);
  const [selectedBaby, setSelectedBaby] = useState<string>('');
  const [selectedSide, setSelectedSide] = useState<'left' | 'right' | 'both'>('left');
  const [notes, setNotes] = useState('');
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchSessions();
    }
  }, [user?.id]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeSession) {
      interval = setInterval(() => {
        const start = new Date(activeSession.start_time).getTime();
        const now = Date.now();
        setDuration(Math.floor((now - start) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeSession]);

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('breastfeeding_sessions')
        .select('*')
        .eq('user_id', user!.id)
        .order('start_time', { ascending: false })
        .limit(10);

      if (error) throw error;
      setSessions(data || []);

      // Check for active session
      const active = data?.find(session => !session.end_time);
      if (active) {
        setActiveSession(active);
        setSelectedBaby(active.baby_id);
        const validSide = (active.side_used as 'left' | 'right' | 'both') || 'left';
        setSelectedSide(validSide);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast({
        title: "Error",
        description: "Failed to load breastfeeding sessions.",
        variant: "destructive"
      });
    }
  };

  const startSession = async () => {
    if (!selectedBaby) {
      toast({
        title: "Error",
        description: "Please select a baby first.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('breastfeeding_sessions')
        .insert({
          user_id: user!.id,
          baby_id: selectedBaby,
          start_time: new Date().toISOString(),
          side_used: selectedSide
        })
        .select()
        .single();

      if (error) throw error;
      setActiveSession(data);
      setSessions(prev => [data, ...prev]);
      toast({
        title: "Session Started",
        description: "Breastfeeding session has been started."
      });
    } catch (error) {
      console.error('Error starting session:', error);
      toast({
        title: "Error",
        description: "Failed to start session.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const endSession = async () => {
    if (!activeSession) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('breastfeeding_sessions')
        .update({
          end_time: new Date().toISOString(),
          notes: notes || null
        })
        .eq('id', activeSession.id)
        .select()
        .single();

      if (error) throw error;
      
      setActiveSession(null);
      setDuration(0);
      setNotes('');
      setSessions(prev => 
        prev.map(session => session.id === activeSession.id ? data : session)
      );
      
      toast({
        title: "Session Completed",
        description: `Feeding session lasted ${formatDuration(duration)}.`
      });
    } catch (error) {
      console.error('Error ending session:', error);
      toast({
        title: "Error",
        description: "Failed to end session.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const calculateSessionDuration = (session: BreastfeedingSession) => {
    if (!session.end_time) return 'Ongoing';
    const start = new Date(session.start_time).getTime();
    const end = new Date(session.end_time).getTime();
    const duration = Math.floor((end - start) / 1000);
    return formatDuration(duration);
  };

  const getBabyName = (babyId: string) => {
    return babyProfiles.find(baby => baby.id === babyId)?.name || 'Unknown';
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <Card className="border-pink-200 bg-gradient-to-r from-pink-50 to-rose-50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-500 text-white rounded-full">
              <Baby className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-pink-700">Breastfeeding Tracker</CardTitle>
              <p className="text-sm text-pink-600">Track feeding sessions and monitor patterns</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Active Session */}
      {activeSession && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-700 flex items-center gap-2">
              <Timer className="h-5 w-5" />
              Active Session
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-green-800">
                  {getBabyName(activeSession.baby_id)} - {activeSession.side_used} side
                </p>
                <p className="text-sm text-green-600">
                  Started: {format(new Date(activeSession.start_time), 'h:mm a')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-700">
                  {formatDuration(duration)}
                </p>
                <Button 
                  onClick={endSession} 
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Square className="h-4 w-4 mr-2" />
                  End Session
                </Button>
              </div>
            </div>
            <div className="mt-4">
              <Textarea
                placeholder="Add notes about this session..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-white"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Start New Session */}
      {!activeSession && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Start New Session
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Select Baby</label>
                <Select value={selectedBaby} onValueChange={setSelectedBaby}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your baby" />
                  </SelectTrigger>
                  <SelectContent>
                    {babyProfiles.map(baby => (
                      <SelectItem key={baby.id} value={baby.id}>
                        {baby.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Side</label>
                <Select value={selectedSide} onValueChange={(value: 'left' | 'right' | 'both') => setSelectedSide(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button 
              onClick={startSession} 
              disabled={isLoading || !selectedBaby}
              className="w-full bg-pink-600 hover:bg-pink-700"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Feeding Session
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Recent Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No feeding sessions recorded yet. Start your first session above!
            </p>
          ) : (
            <div className="space-y-3">
              {sessions.map(session => (
                <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{getBabyName(session.baby_id)}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(session.start_time), 'MMM d, h:mm a')} - {session.side_used} side
                    </p>
                    {session.notes && (
                      <p className="text-xs text-muted-foreground mt-1">{session.notes}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <Badge variant={session.end_time ? "secondary" : "default"}>
                      {calculateSessionDuration(session)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Emergency Section */}
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <h3 className="font-semibold text-red-800">Feeding Concerns?</h3>
          </div>
          <p className="text-sm text-red-700 mb-4">
            If your baby hasn't fed in over 3 hours, is having difficulty latching, or you're experiencing severe pain, contact your healthcare provider immediately.
          </p>
          <Button 
            variant="destructive" 
            className="w-full text-sm sm:text-base px-3 py-2"
            onClick={() => {
              // This could trigger an emergency alert
              toast({
                title: "Emergency Alert",
                description: "Contact your healthcare provider or call emergency services.",
                variant: "destructive"
              });
            }}
          >
            <Heart className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">Emergency Help</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};