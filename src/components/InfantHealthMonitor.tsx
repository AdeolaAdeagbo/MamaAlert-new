import { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { useBabyProfile } from '@/hooks/useBabyProfile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Thermometer, 
  Activity, 
  Syringe,
  TrendingUp,
  AlertTriangle,
  Baby,
  Calendar,
  Heart
} from 'lucide-react';
import { format } from 'date-fns';

interface InfantSymptom {
  id: string;
  baby_id: string;
  symptom_type: string;
  severity: number;
  description?: string;
  temperature?: number;
  timestamp: string;
}

interface Vaccine {
  id: string;
  baby_id: string;
  vaccine_name: string;
  scheduled_date: string;
  administered_date?: string;
  location?: string;
  notes?: string;
}

interface GrowthRecord {
  id: string;
  baby_id: string;
  weight?: number;
  height?: number;
  head_circumference?: number;
  recorded_date: string;
  notes?: string;
}

const COMMON_SYMPTOMS = [
  'Fever',
  'Diarrhea',
  'Vomiting',
  'Rash',
  'Breathing Issues',
  'Excessive Crying',
  'Poor Feeding',
  'Lethargy',
  'Congestion',
  'Cough'
];

const NIGERIAN_VACCINE_SCHEDULE = [
  { name: 'BCG', months: 0 },
  { name: 'Hepatitis B (1st dose)', months: 0 },
  { name: 'Polio (OPV 1)', months: 1.5 },
  { name: 'DPT/Hib/Hep B (1st dose)', months: 1.5 },
  { name: 'Pneumococcal (1st dose)', months: 1.5 },
  { name: 'Polio (OPV 2)', months: 2.5 },
  { name: 'DPT/Hib/Hep B (2nd dose)', months: 2.5 },
  { name: 'Pneumococcal (2nd dose)', months: 2.5 },
  { name: 'Polio (OPV 3)', months: 3.5 },
  { name: 'DPT/Hib/Hep B (3rd dose)', months: 3.5 },
  { name: 'Pneumococcal (3rd dose)', months: 3.5 },
  { name: 'Measles (1st dose)', months: 9 },
  { name: 'Yellow Fever', months: 9 },
  { name: 'Measles (2nd dose)', months: 15 },
  { name: 'DPT (Booster)', months: 18 }
];

export const InfantHealthMonitor = () => {
  const { user } = useAuth();
  const { babyProfiles } = useBabyProfile(user?.id || '');
  const { toast } = useToast();
  
  const [selectedBaby, setSelectedBaby] = useState<string>('');
  const [symptoms, setSymptoms] = useState<InfantSymptom[]>([]);
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [growthRecords, setGrowthRecords] = useState<GrowthRecord[]>([]);
  
  // Form states
  const [symptomForm, setSymptomForm] = useState({
    symptom_type: '',
    severity: 1,
    description: '',
    temperature: ''
  });
  
  const [growthForm, setGrowthForm] = useState({
    weight: '',
    height: '',
    head_circumference: '',
    recorded_date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    if (selectedBaby) {
      fetchHealthData();
    }
  }, [selectedBaby]);

  const fetchHealthData = async () => {
    if (!selectedBaby) return;

    try {
      // Fetch symptoms
      const { data: symptomsData, error: symptomsError } = await supabase
        .from('infant_symptoms')
        .select('*')
        .eq('baby_id', selectedBaby)
        .order('timestamp', { ascending: false });

      if (symptomsError) throw symptomsError;
      setSymptoms(symptomsData || []);

      // Fetch vaccines
      const { data: vaccinesData, error: vaccinesError } = await supabase
        .from('vaccines')
        .select('*')
        .eq('baby_id', selectedBaby)
        .order('scheduled_date', { ascending: true });

      if (vaccinesError) throw vaccinesError;
      setVaccines(vaccinesData || []);

      // Fetch growth records
      const { data: growthData, error: growthError } = await supabase
        .from('baby_growth')
        .select('*')
        .eq('baby_id', selectedBaby)
        .order('recorded_date', { ascending: false });

      if (growthError) throw growthError;
      setGrowthRecords(growthData || []);

    } catch (error) {
      console.error('Error fetching health data:', error);
      toast({
        title: "Error",
        description: "Failed to load health data.",
        variant: "destructive"
      });
    }
  };

  const logSymptom = async () => {
    if (!selectedBaby || !symptomForm.symptom_type) {
      toast({
        title: "Error",
        description: "Please select a baby and symptom type.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('infant_symptoms')
        .insert({
          user_id: user!.id,
          baby_id: selectedBaby,
          symptom_type: symptomForm.symptom_type,
          severity: symptomForm.severity,
          description: symptomForm.description || null,
          temperature: symptomForm.temperature ? parseFloat(symptomForm.temperature) : null
        })
        .select()
        .single();

      if (error) throw error;
      setSymptoms(prev => [data, ...prev]);
      setSymptomForm({
        symptom_type: '',
        severity: 1,
        description: '',
        temperature: ''
      });
      
      // Check for emergency symptoms
      if (symptomForm.severity >= 8 || 
          (symptomForm.temperature && parseFloat(symptomForm.temperature) >= 38.5)) {
        toast({
          title: "High Priority Symptom",
          description: "This symptom may require immediate medical attention.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Symptom Logged",
          description: "Symptom has been recorded successfully."
        });
      }
    } catch (error) {
      console.error('Error logging symptom:', error);
      toast({
        title: "Error",
        description: "Failed to log symptom.",
        variant: "destructive"
      });
    }
  };

  const recordGrowth = async () => {
    if (!selectedBaby) {
      toast({
        title: "Error",
        description: "Please select a baby first.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('baby_growth')
        .insert({
          user_id: user!.id,
          baby_id: selectedBaby,
          weight: growthForm.weight ? parseFloat(growthForm.weight) : null,
          height: growthForm.height ? parseFloat(growthForm.height) : null,
          head_circumference: growthForm.head_circumference ? parseFloat(growthForm.head_circumference) : null,
          recorded_date: growthForm.recorded_date,
          notes: growthForm.notes || null
        })
        .select()
        .single();

      if (error) throw error;
      setGrowthRecords(prev => [data, ...prev]);
      setGrowthForm({
        weight: '',
        height: '',
        head_circumference: '',
        recorded_date: new Date().toISOString().split('T')[0],
        notes: ''
      });
      
      toast({
        title: "Growth Recorded",
        description: "Growth measurement has been recorded successfully."
      });
    } catch (error) {
      console.error('Error recording growth:', error);
      toast({
        title: "Error",
        description: "Failed to record growth.",
        variant: "destructive"
      });
    }
  };

  const generateVaccineSchedule = async () => {
    if (!selectedBaby) return;

    const baby = babyProfiles.find(b => b.id === selectedBaby);
    if (!baby) return;

    const birthDate = new Date(baby.birth_date);
    const schedulePromises = NIGERIAN_VACCINE_SCHEDULE.map(vaccine => {
      const scheduledDate = new Date(birthDate);
      scheduledDate.setMonth(scheduledDate.getMonth() + vaccine.months);

      return supabase
        .from('vaccines')
        .upsert({
          user_id: user!.id,
          baby_id: selectedBaby,
          vaccine_name: vaccine.name,
          scheduled_date: scheduledDate.toISOString().split('T')[0]
        }, {
          onConflict: 'user_id,baby_id,vaccine_name'
        });
    });

    try {
      await Promise.all(schedulePromises);
      fetchHealthData();
      toast({
        title: "Vaccine Schedule Generated",
        description: "Nigerian immunization schedule has been created."
      });
    } catch (error) {
      console.error('Error generating vaccine schedule:', error);
      toast({
        title: "Error",
        description: "Failed to generate vaccine schedule.",
        variant: "destructive"
      });
    }
  };

  const getSeverityColor = (severity: number) => {
    if (severity <= 3) return 'bg-green-100 text-green-800';
    if (severity <= 6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getBabyName = (babyId: string) => {
    return babyProfiles.find(baby => baby.id === babyId)?.name || 'Unknown';
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 text-white rounded-full">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-blue-700">Infant Health Monitor</CardTitle>
              <p className="text-sm text-blue-600">Track your baby's health, growth, and immunizations</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Select Baby:</label>
            <Select value={selectedBaby} onValueChange={setSelectedBaby}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Choose your baby" />
              </SelectTrigger>
              <SelectContent>
                {babyProfiles.map(baby => (
                  <SelectItem key={baby.id} value={baby.id}>
                    {baby.name} ({format(new Date(baby.birth_date), 'MMM d, yyyy')})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {selectedBaby && (
        <Tabs defaultValue="symptoms" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
            <TabsTrigger value="vaccines">Vaccines</TabsTrigger>
            <TabsTrigger value="growth">Growth</TabsTrigger>
          </TabsList>

          <TabsContent value="symptoms" className="space-y-6">
            {/* Log New Symptom */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5" />
                  Log Symptom
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Symptom Type</label>
                    <Select value={symptomForm.symptom_type} onValueChange={(value) => setSymptomForm(prev => ({ ...prev, symptom_type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select symptom" />
                      </SelectTrigger>
                      <SelectContent>
                        {COMMON_SYMPTOMS.map(symptom => (
                          <SelectItem key={symptom} value={symptom}>{symptom}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Severity (1-10)</label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={symptomForm.severity}
                      onChange={(e) => setSymptomForm(prev => ({ ...prev, severity: parseInt(e.target.value) || 1 }))}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Temperature (°C)</label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="37.0"
                      value={symptomForm.temperature}
                      onChange={(e) => setSymptomForm(prev => ({ ...prev, temperature: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea
                    placeholder="Additional details about the symptom..."
                    value={symptomForm.description}
                    onChange={(e) => setSymptomForm(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                
                <Button onClick={logSymptom} className="w-full">
                  Log Symptom
                </Button>
              </CardContent>
            </Card>

            {/* Recent Symptoms */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Symptoms</CardTitle>
              </CardHeader>
              <CardContent>
                {symptoms.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No symptoms logged yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {symptoms.map(symptom => (
                      <div key={symptom.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{symptom.symptom_type}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(symptom.timestamp), 'MMM d, h:mm a')}
                          </p>
                          {symptom.temperature && (
                            <p className="text-sm">Temperature: {symptom.temperature}°C</p>
                          )}
                          {symptom.description && (
                            <p className="text-xs text-muted-foreground mt-1">{symptom.description}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <Badge className={getSeverityColor(symptom.severity)}>
                            Severity: {symptom.severity}/10
                          </Badge>
                          {symptom.severity >= 8 && (
                            <div className="flex items-center gap-1 mt-1">
                              <AlertTriangle className="h-3 w-3 text-red-600" />
                              <span className="text-xs text-red-600">High Priority</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vaccines" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Syringe className="h-5 w-5" />
                  Immunization Schedule
                </CardTitle>
                <Button onClick={generateVaccineSchedule} variant="outline">
                  Generate Nigerian Schedule
                </Button>
              </CardHeader>
              <CardContent>
                {vaccines.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      No vaccine schedule created yet.
                    </p>
                    <Button onClick={generateVaccineSchedule}>
                      Generate Standard Nigerian Immunization Schedule
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {vaccines.map(vaccine => (
                      <div key={vaccine.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{vaccine.vaccine_name}</p>
                          <p className="text-sm text-muted-foreground">
                            Scheduled: {format(new Date(vaccine.scheduled_date), 'MMM d, yyyy')}
                          </p>
                          {vaccine.administered_date && (
                            <p className="text-sm text-green-600">
                              Administered: {format(new Date(vaccine.administered_date), 'MMM d, yyyy')}
                            </p>
                          )}
                        </div>
                        <Badge variant={vaccine.administered_date ? "default" : "secondary"}>
                          {vaccine.administered_date ? "Completed" : "Pending"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="growth" className="space-y-6">
            {/* Record Growth */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Record Growth
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Weight (kg)</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="3.5"
                      value={growthForm.weight}
                      onChange={(e) => setGrowthForm(prev => ({ ...prev, weight: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Height (cm)</label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="50.0"
                      value={growthForm.height}
                      onChange={(e) => setGrowthForm(prev => ({ ...prev, height: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Head Circumference (cm)</label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="35.0"
                      value={growthForm.head_circumference}
                      onChange={(e) => setGrowthForm(prev => ({ ...prev, head_circumference: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Date</label>
                    <Input
                      type="date"
                      value={growthForm.recorded_date}
                      onChange={(e) => setGrowthForm(prev => ({ ...prev, recorded_date: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Notes</label>
                  <Textarea
                    placeholder="Any observations about growth..."
                    value={growthForm.notes}
                    onChange={(e) => setGrowthForm(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>
                
                <Button onClick={recordGrowth} className="w-full">
                  Record Growth
                </Button>
              </CardContent>
            </Card>

            {/* Growth History */}
            <Card>
              <CardHeader>
                <CardTitle>Growth History</CardTitle>
              </CardHeader>
              <CardContent>
                {growthRecords.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No growth records yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {growthRecords.map(record => (
                      <div key={record.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium">
                            {format(new Date(record.recorded_date), 'MMM d, yyyy')}
                          </p>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          {record.weight && <p>Weight: {record.weight} kg</p>}
                          {record.height && <p>Height: {record.height} cm</p>}
                          {record.head_circumference && <p>Head: {record.head_circumference} cm</p>}
                        </div>
                        {record.notes && (
                          <p className="text-xs text-muted-foreground mt-2">{record.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Emergency Alert */}
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h3 className="font-semibold text-red-800">Infant Emergency Signs</h3>
          </div>
          <p className="text-sm text-red-700 mb-4">
            Seek immediate medical attention if your baby has: high fever (38.5°C+), difficulty breathing, 
            severe vomiting, signs of dehydration, or unusual lethargy.
          </p>
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={() => {
              toast({
                title: "Emergency Alert",
                description: "Contact your pediatrician or emergency services immediately.",
                variant: "destructive"
              });
            }}
          >
            <Heart className="h-4 w-4 mr-2" />
            Emergency - Baby Needs Immediate Care
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};