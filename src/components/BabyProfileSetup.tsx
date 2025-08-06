import { useState } from 'react';
import { useAuth } from './AuthProvider';
import { useBabyProfile } from '@/hooks/useBabyProfile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Baby, Plus } from 'lucide-react';

export const BabyProfileSetup = () => {
  const { user } = useAuth();
  const { babyProfiles, createBabyProfile } = useBabyProfile(user?.id || '');
  const { toast } = useToast();
  
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    birth_date: '',
    birth_weight: '',
    birth_height: '',
    gender: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.birth_date) {
      toast({
        title: "Error",
        description: "Please fill in the required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    try {
      await createBabyProfile({
        name: formData.name,
        birth_date: formData.birth_date,
        birth_weight: formData.birth_weight ? parseFloat(formData.birth_weight) : undefined,
        birth_height: formData.birth_height ? parseFloat(formData.birth_height) : undefined,
        gender: formData.gender as 'male' | 'female' | undefined
      });
      
      setFormData({
        name: '',
        birth_date: '',
        birth_weight: '',
        birth_height: '',
        gender: ''
      });
    } catch (error) {
      // Error is already handled in the hook
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 text-white rounded-full">
              <Baby className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-blue-700">Baby Profile Setup</CardTitle>
              <p className="text-sm text-blue-600">Create profiles for your little ones</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Existing Baby Profiles */}
      {babyProfiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Babies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {babyProfiles.map(baby => (
                <div key={baby.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{baby.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Born: {new Date(baby.birth_date).toLocaleDateString()}
                      {baby.gender && ` • ${baby.gender}`}
                    </p>
                    {baby.birth_weight && (
                      <p className="text-xs text-muted-foreground">
                        Birth weight: {baby.birth_weight}kg
                        {baby.birth_height && `, Height: ${baby.birth_height}cm`}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add New Baby */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Baby
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Baby's Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter baby's name"
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Birth Date <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={formData.birth_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, birth_date: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Birth Weight (kg)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.birth_weight}
                  onChange={(e) => setFormData(prev => ({ ...prev, birth_weight: e.target.value }))}
                  placeholder="3.5"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Birth Height (cm)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.birth_height}
                  onChange={(e) => setFormData(prev => ({ ...prev, birth_height: e.target.value }))}
                  placeholder="50.0"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-2 block">Gender</label>
                <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button type="submit" disabled={isCreating} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              {isCreating ? 'Creating...' : 'Add Baby Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
