import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Calendar, MapPin, Clock, Baby, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format, addDays, isBefore, isWithin } from 'date-fns';

interface Vaccine {
  id: string;
  vaccine_name: string;
  scheduled_date: string;
  administered_date?: string;
  location?: string;
  notes?: string;
}

interface VaccinationScheduleProps {
  babyId?: string;
  userId: string;
}

const NIGERIAN_VACCINE_SCHEDULE = [
  { name: 'BCG + OPV 0', months: 0, description: 'At birth' },
  { name: 'OPV 1 + Pentavalent 1 + PCV 1', months: 1.5, description: '6 weeks' },
  { name: 'OPV 2 + Pentavalent 2 + PCV 2', months: 2.5, description: '10 weeks' },
  { name: 'OPV 3 + Pentavalent 3 + PCV 3 + IPV', months: 3.5, description: '14 weeks' },
  { name: 'Measles 1 + Yellow Fever', months: 9, description: '9 months' },
  { name: 'Measles 2', months: 15, description: '15 months' },
];

export const VaccinationSchedule = ({ babyId, userId }: VaccinationScheduleProps) => {
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchVaccines();
  }, [babyId, userId]);

  const fetchVaccines = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('vaccines')
        .select('*')
        .eq('user_id', userId)
        .order('scheduled_date', { ascending: true });

      if (error) throw error;
      setVaccines(data || []);
    } catch (error) {
      console.error('Error fetching vaccines:', error);
      toast({
        title: "Error",
        description: "Failed to load vaccination schedule.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSchedule = async () => {
    try {
      // Get baby's birth date
      const { data: babyData } = await supabase
        .from('baby_profiles')
        .select('birth_date')
        .eq('user_id', userId)
        .single();

      if (!babyData?.birth_date) {
        toast({
          title: "Baby Profile Required",
          description: "Please set up your baby's profile first.",
          variant: "destructive"
        });
        return;
      }

      const birthDate = new Date(babyData.birth_date);
      const vaccineRecords = NIGERIAN_VACCINE_SCHEDULE.map(vaccine => {
        const scheduledDate = new Date(birthDate);
        scheduledDate.setMonth(scheduledDate.getMonth() + vaccine.months);

        return {
          user_id: userId,
          baby_id: babyId,
          vaccine_name: vaccine.name,
          scheduled_date: scheduledDate.toISOString().split('T')[0],
          notes: vaccine.description
        };
      });

      const { error } = await supabase
        .from('vaccines')
        .insert(vaccineRecords);

      if (error) throw error;

      await fetchVaccines();
      toast({
        title: "Schedule Generated",
        description: "Nigerian immunization schedule has been created.",
      });
    } catch (error) {
      console.error('Error generating schedule:', error);
      toast({
        title: "Error",
        description: "Failed to generate vaccination schedule.",
        variant: "destructive"
      });
    }
  };

  const markAsAdministered = async (vaccineId: string) => {
    try {
      const { error } = await supabase
        .from('vaccines')
        .update({ administered_date: new Date().toISOString().split('T')[0] })
        .eq('id', vaccineId);

      if (error) throw error;

      await fetchVaccines();
      toast({
        title: "Vaccine Recorded",
        description: "Vaccine has been marked as administered.",
      });
    } catch (error) {
      console.error('Error updating vaccine:', error);
      toast({
        title: "Error",
        description: "Failed to update vaccine record.",
        variant: "destructive"
      });
    }
  };

  const sendVaccineReminder = async (vaccine: Vaccine) => {
    try {
      const response = await supabase.functions.invoke('send-termii-sms', {
        body: {
          messageType: "vaccine_reminder",
          vaccineName: vaccine.vaccine_name,
          scheduledDate: vaccine.scheduled_date,
          userId: userId
        }
      });

      if (response.error) throw response.error;

      toast({
        title: "Reminder Sent",
        description: "Vaccination reminder has been sent to your emergency contacts.",
      });
    } catch (error) {
      console.error('Error sending reminder:', error);
      toast({
        title: "Error",
        description: "Failed to send vaccination reminder.",
        variant: "destructive"
      });
    }
  };

  const getVaccineStatus = (vaccine: Vaccine) => {
    if (vaccine.administered_date) return 'completed';
    
    const scheduledDate = new Date(vaccine.scheduled_date);
    const today = new Date();
    const daysUntil = Math.ceil((scheduledDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntil < 0) return 'overdue';
    if (daysUntil <= 7) return 'due-soon';
    return 'upcoming';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'due-soon': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">Loading vaccination schedule...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Baby className="h-5 w-5 text-blue-500" />
            Vaccination Schedule
          </CardTitle>
          {vaccines.length === 0 && (
            <Button onClick={generateSchedule} variant="outline" size="sm">
              Generate Schedule
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {vaccines.length === 0 ? (
          <div className="text-center py-8">
            <Baby className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Vaccination Schedule</h3>
            <p className="text-muted-foreground mb-4">
              Generate the Nigerian immunization schedule for your baby.
            </p>
            <Button onClick={generateSchedule}>
              Generate Schedule
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {vaccines.map(vaccine => {
              const status = getVaccineStatus(vaccine);
              return (
                <div key={vaccine.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <Checkbox
                    checked={!!vaccine.administered_date}
                    onCheckedChange={() => !vaccine.administered_date && markAsAdministered(vaccine.id)}
                    className="flex-shrink-0"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{vaccine.vaccine_name}</h4>
                      <Badge className={getStatusColor(status)}>
                        {status === 'completed' ? 'Completed' :
                         status === 'overdue' ? 'Overdue' :
                         status === 'due-soon' ? 'Due Soon' : 'Upcoming'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(vaccine.scheduled_date), 'MMM d, yyyy')}
                      </div>
                      {vaccine.administered_date && (
                        <div className="flex items-center gap-1 text-green-600">
                          <Check className="h-3 w-3" />
                          Given {format(new Date(vaccine.administered_date), 'MMM d, yyyy')}
                        </div>
                      )}
                    </div>
                    
                    {vaccine.notes && (
                      <p className="text-xs text-muted-foreground mt-1">{vaccine.notes}</p>
                    )}
                  </div>
                  
                  {!vaccine.administered_date && status === 'due-soon' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => sendVaccineReminder(vaccine)}
                      className="flex-shrink-0"
                    >
                      <Clock className="h-4 w-4 mr-1" />
                      Remind
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};