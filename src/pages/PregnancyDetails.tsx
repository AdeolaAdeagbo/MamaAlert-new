
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Heart, Save } from "lucide-react";

interface PregnancyData {
  weeks_pregnant?: number;
  due_date?: string;
  last_menstrual_period?: string;
  is_high_risk?: boolean;
  hospital_name?: string;
  doctor_name?: string;
  emergency_notes?: string;
  previous_pregnancies?: string;
  medical_conditions?: string;
  allergies?: string;
  current_medications?: string;
}

const PregnancyDetails = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<PregnancyData>({});
  const [phoneNumber, setPhoneNumber] = useState("");

  // Redirect to auth if no user and not loading
  if (!user && !authLoading) {
    return <Navigate to="/auth" replace />;
  }

  // Load existing data
  useEffect(() => {
    if (user?.id) {
      loadExistingData();
    }
  }, [user?.id]);

  const loadExistingData = async () => {
    try {
      // Load pregnancy data
      const { data: pregnancyData, error: pregnancyError } = await supabase
        .from('pregnancy_data')
        .select('*')
        .eq('user_id', user!.id)
        .single();

      if (pregnancyError && pregnancyError.code !== 'PGRST116') {
        console.error('Error loading pregnancy data:', pregnancyError);
      } else if (pregnancyData) {
        setFormData(pregnancyData);
      }

      // Load user phone number from profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('phone')
        .eq('id', user!.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error loading profile data:', profileError);
      } else if (profileData) {
        setPhoneNumber(profileData.phone || "");
      }
    } catch (error) {
      console.error('Error loading existing data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    // Validate required phone number
    if (!phoneNumber.trim()) {
      toast({
        title: "Phone Number Required",
        description: "Please enter your phone number to receive SMS reminders.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Update or insert pregnancy data
      const { error: pregnancyError } = await supabase
        .from('pregnancy_data')
        .upsert({
          user_id: user.id,
          ...formData,
          updated_at: new Date().toISOString()
        });

      if (pregnancyError) throw pregnancyError;

      // Update user profile with phone number
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          phone: phoneNumber,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      toast({
        title: "Success",
        description: "Your pregnancy details and phone number have been saved successfully!",
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving pregnancy details:', error);
      toast({
        title: "Error",
        description: "Failed to save pregnancy details. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof PregnancyData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Calculate due date from LMP
  const calculateDueDate = (lmp: string) => {
    if (!lmp) return;
    const lmpDate = new Date(lmp);
    const dueDate = new Date(lmpDate);
    dueDate.setDate(dueDate.getDate() + 280); // 40 weeks
    return dueDate.toISOString().split('T')[0];
  };

  // Calculate weeks pregnant from LMP
  const calculateWeeksPregnant = (lmp: string) => {
    if (!lmp) return 0;
    const lmpDate = new Date(lmp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lmpDate.getTime());
    const weeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
    return Math.min(weeks, 42); // Cap at 42 weeks
  };

  const handleLMPChange = (lmp: string) => {
    handleInputChange('last_menstrual_period', lmp);
    if (lmp) {
      const calculatedDueDate = calculateDueDate(lmp);
      const calculatedWeeks = calculateWeeksPregnant(lmp);
      
      if (calculatedDueDate) {
        handleInputChange('due_date', calculatedDueDate);
      }
      handleInputChange('weeks_pregnant', calculatedWeeks);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Heart className="h-8 w-8 text-rose-500" />
            Pregnancy Details
          </h1>
          <p className="text-muted-foreground mt-2">
            Help us provide you with personalized care and SMS reminders by sharing your pregnancy information.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Contact Information */}
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-700">Contact Information</CardTitle>
              <p className="text-sm text-blue-600">Required for SMS appointment reminders and emergency alerts</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="e.g., +234 801 234 5678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  We'll use this number to send you appointment reminders and emergency alerts
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Basic Pregnancy Information */}
          <Card className="border-rose-200">
            <CardHeader>
              <CardTitle className="text-rose-700">Basic Pregnancy Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lmp" className="text-sm font-medium">
                    Last Menstrual Period (LMP)
                  </Label>
                  <Input
                    id="lmp"
                    type="date"
                    value={formData.last_menstrual_period || ''}
                    onChange={(e) => handleLMPChange(e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="weeks" className="text-sm font-medium">
                    Current Weeks Pregnant
                  </Label>
                  <Input
                    id="weeks"
                    type="number"
                    min="0"
                    max="42"
                    value={formData.weeks_pregnant || ''}
                    onChange={(e) => handleInputChange('weeks_pregnant', parseInt(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="due_date" className="text-sm font-medium">
                    Expected Due Date
                  </Label>
                  <Input
                    id="due_date"
                    type="date"
                    value={formData.due_date || ''}
                    onChange={(e) => handleInputChange('due_date', e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium">High-Risk Pregnancy</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="high_risk"
                        checked={formData.is_high_risk === false}
                        onChange={() => handleInputChange('is_high_risk', false)}
                        className="mr-2"
                      />
                      No
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="high_risk"
                        checked={formData.is_high_risk === true}
                        onChange={() => handleInputChange('is_high_risk', true)}
                        className="mr-2"
                      />
                      Yes
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Healthcare Information */}
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-green-700">Healthcare Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hospital" className="text-sm font-medium">
                    Hospital/Clinic Name
                  </Label>
                  <Input
                    id="hospital"
                    value={formData.hospital_name || ''}
                    onChange={(e) => handleInputChange('hospital_name', e.target.value)}
                    placeholder="e.g., Lagos University Teaching Hospital"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="doctor" className="text-sm font-medium">
                    Doctor's Name
                  </Label>
                  <Input
                    id="doctor"
                    value={formData.doctor_name || ''}
                    onChange={(e) => handleInputChange('doctor_name', e.target.value)}
                    placeholder="e.g., Dr. Sarah Johnson"
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medical History */}
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-700">Medical History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="previous_pregnancies" className="text-sm font-medium">
                  Previous Pregnancies
                </Label>
                <Textarea
                  id="previous_pregnancies"
                  value={formData.previous_pregnancies || ''}
                  onChange={(e) => handleInputChange('previous_pregnancies', e.target.value)}
                  placeholder="e.g., 2 previous pregnancies, 1 live birth, 1 miscarriage"
                  className="mt-1"
                  rows={2}
                />
              </div>
              
              <div>
                <Label htmlFor="medical_conditions" className="text-sm font-medium">
                  Medical Conditions
                </Label>
                <Textarea
                  id="medical_conditions"
                  value={formData.medical_conditions || ''}
                  onChange={(e) => handleInputChange('medical_conditions', e.target.value)}
                  placeholder="e.g., Diabetes, Hypertension, Asthma"
                  className="mt-1"
                  rows={2}
                />
              </div>
              
              <div>
                <Label htmlFor="allergies" className="text-sm font-medium">
                  Allergies
                </Label>
                <Textarea
                  id="allergies"
                  value={formData.allergies || ''}
                  onChange={(e) => handleInputChange('allergies', e.target.value)}
                  placeholder="e.g., Penicillin, Shellfish, Latex"
                  className="mt-1"
                  rows={2}
                />
              </div>
              
              <div>
                <Label htmlFor="current_medications" className="text-sm font-medium">
                  Current Medications
                </Label>
                <Textarea
                  id="current_medications"
                  value={formData.current_medications || ''}
                  onChange={(e) => handleInputChange('current_medications', e.target.value)}
                  placeholder="e.g., Prenatal vitamins, Iron supplements"
                  className="mt-1"
                  rows={2}
                />
              </div>
              
              <div>
                <Label htmlFor="emergency_notes" className="text-sm font-medium">
                  Emergency Notes
                </Label>
                <Textarea
                  id="emergency_notes"
                  value={formData.emergency_notes || ''}
                  onChange={(e) => handleInputChange('emergency_notes', e.target.value)}
                  placeholder="Any important information for emergency situations"
                  className="mt-1"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-rose-500 hover:bg-rose-600"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Details
            </Button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <footer className="border-t bg-background px-4 py-8 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} MamaAlert. Protecting Nigerian mothers, one alert at a time.</p>
        </div>
      </footer>
    </div>
  );
};

export default PregnancyDetails;
