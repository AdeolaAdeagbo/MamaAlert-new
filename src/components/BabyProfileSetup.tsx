import React, { useState } from 'react';
import { useAuth } from './AuthProvider';
import { useBabyProfile } from '@/hooks/useBabyProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Plus, Baby } from 'lucide-react';

export const BabyProfileSetup = () => {
  const { user } = useAuth();
  const { babyProfiles, createBabyProfile, isLoading } = useBabyProfile(user?.id || '');
  const { toast } = useToast();
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    birthWeight: '',
    birthHeight: '',
    gender: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.birthDate) {
      toast({
        title: "Error",
        description: "Please fill in required fields (name and birth date).",
        variant: "destructive"
      });
      return;
    }

    try {
      const profileData = {
        name: formData.name,
        birth_date: formData.birthDate,
        birth_weight: formData.birthWeight ? parseFloat(formData.birthWeight) : undefined,
        birth_height: formData.birthHeight ? parseFloat(formData.birthHeight) : undefined,
        gender: formData.gender || undefined
      };

      const newProfile = await createBabyProfile(profileData);
      
      // Generate Nigerian immunization schedule for the new baby
      await generateNigerianImmunizationSchedule(newProfile.id, formData.birthDate);
      
      setFormData({
        name: '',
        birthDate: '',
        birthWeight: '',
        birthHeight: '',
        gender: ''
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating baby profile:', error);
    }
  };

  const generateNigerianImmunizationSchedule = async (babyId: string, birthDate: string) => {
    const birth = new Date(birthDate);
    
    const nigerianSchedule = [
      { name: 'BCG (Tuberculosis)', weeks: 0, description: 'Protection against tuberculosis' },
      { name: 'Hepatitis B (Birth dose)', weeks: 0, description: 'First dose of hepatitis B vaccine' },
      { name: 'OPV 0 (Oral Polio)', weeks: 0, description: 'Birth dose of oral polio vaccine' },
      { name: 'Pentavalent 1 (DPT-HepB-Hib)', weeks: 6, description: 'First dose: Diphtheria, Pertussis, Tetanus, Hepatitis B, Haemophilus influenzae type b' },
      { name: 'OPV 1 (Oral Polio)', weeks: 6, description: 'First dose of oral polio vaccine series' },
      { name: 'PCV 1 (Pneumococcal)', weeks: 6, description: 'First dose of pneumococcal conjugate vaccine' },
      { name: 'Pentavalent 2 (DPT-HepB-Hib)', weeks: 10, description: 'Second dose of pentavalent vaccine' },
      { name: 'OPV 2 (Oral Polio)', weeks: 10, description: 'Second dose of oral polio vaccine series' },
      { name: 'PCV 2 (Pneumococcal)', weeks: 10, description: 'Second dose of pneumococcal conjugate vaccine' },
      { name: 'Pentavalent 3 (DPT-HepB-Hib)', weeks: 14, description: 'Third dose of pentavalent vaccine' },
      { name: 'OPV 3 (Oral Polio)', weeks: 14, description: 'Third dose of oral polio vaccine series' },
      { name: 'PCV 3 (Pneumococcal)', weeks: 14, description: 'Third dose of pneumococcal conjugate vaccine' },
      { name: 'IPV (Inactivated Polio)', weeks: 14, description: 'Inactivated polio vaccine' },
      { name: 'Measles 1', weeks: 36, description: 'First dose of measles vaccine (9 months)' },
      { name: 'Yellow Fever', weeks: 36, description: 'Yellow fever vaccine (9 months)' },
      { name: 'Measles 2', weeks: 72, description: 'Second dose of measles vaccine (18 months)' },
      { name: 'Vitamin A (High dose)', weeks: 24, description: 'First high-dose vitamin A supplement (6 months)' },
      { name: 'Vitamin A (High dose)', weeks: 36, description: 'Second high-dose vitamin A supplement (9 months)' },
    ];

    // Import supabase at the top level to avoid issues
    const { supabase } = await import('@/integrations/supabase/client');

    try {
      const vaccineRecords = nigerianSchedule.map(vaccine => {
        const scheduledDate = new Date(birth);
        scheduledDate.setDate(scheduledDate.getDate() + (vaccine.weeks * 7));
        
        return {
          user_id: user!.id,
          baby_id: babyId,
          vaccine_name: vaccine.name,
          scheduled_date: scheduledDate.toISOString().split('T')[0],
          notes: vaccine.description,
          location: 'Primary Health Care Center'
        };
      });

      const { data, error } = await supabase
        .from('vaccines')
        .insert(vaccineRecords);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Nigerian immunization schedule generated with ${nigerianSchedule.length} vaccines scheduled.`,
      });
    } catch (error) {
      console.error('Error generating immunization schedule:', error);
      toast({
        title: "Warning",
        description: "Baby profile created, but failed to generate immunization schedule. You can add vaccines manually.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Baby Profiles</h2>
        <Button 
          onClick={() => setShowForm(true)} 
          className="bg-rose-500 hover:bg-rose-600 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Baby
        </Button>
      </div>

      {/* Existing Baby Profiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {babyProfiles.map((baby) => (
          <Card key={baby.id} className="border-rose-200">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Baby className="h-5 w-5 text-rose-500" />
                <CardTitle className="text-lg">{baby.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-gray-600">
                Born: {new Date(baby.birth_date).toLocaleDateString()}
              </p>
              {baby.birth_weight && (
                <p className="text-sm text-gray-600">
                  Birth Weight: {baby.birth_weight} kg
                </p>
              )}
              {baby.birth_height && (
                <p className="text-sm text-gray-600">
                  Birth Height: {baby.birth_height} cm
                </p>
              )}
              {baby.gender && (
                <p className="text-sm text-gray-600 capitalize">
                  Gender: {baby.gender}
                </p>
              )}
              <div className="text-xs text-rose-500 mt-2">
                Age: {Math.floor((new Date().getTime() - new Date(baby.birth_date).getTime()) / (1000 * 60 * 60 * 24))} days
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Baby Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Add New Baby Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Baby's Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter baby's name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="birthDate">Birth Date *</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="birthWeight">Birth Weight (kg)</Label>
                  <Input
                    id="birthWeight"
                    type="number"
                    step="0.1"
                    value={formData.birthWeight}
                    onChange={(e) => setFormData({...formData, birthWeight: e.target.value})}
                    placeholder="e.g., 3.2"
                  />
                </div>

                <div>
                  <Label htmlFor="birthHeight">Birth Height (cm)</Label>
                  <Input
                    id="birthHeight"
                    type="number"
                    step="0.1"
                    value={formData.birthHeight}
                    onChange={(e) => setFormData({...formData, birthHeight: e.target.value})}
                    placeholder="e.g., 50"
                  />
                </div>

                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="bg-rose-500 hover:bg-rose-600"
                  >
                    {isLoading ? 'Creating...' : 'Create Profile'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
