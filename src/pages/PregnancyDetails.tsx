
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Heart, Calendar, Shield, UserCheck } from "lucide-react";

const PregnancyDetails = () => {
  const { user, refreshUserData } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    weeksPregnant: "",
    dueDate: "",
    lastMenstrualPeriod: "",
    hospitalName: "",
    doctorName: "",
    isHighRisk: false,
    previousPregnancies: "",
    medicalConditions: "",
    allergies: "",
    currentMedications: "",
    emergencyNotes: ""
  });

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  useEffect(() => {
    loadPregnancyData();
  }, [user?.id]);

  const loadPregnancyData = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('pregnancy_data')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setFormData({
          weeksPregnant: data.weeks_pregnant?.toString() || "",
          dueDate: data.due_date || "",
          lastMenstrualPeriod: data.last_menstrual_period || "",
          hospitalName: data.hospital_name || "",
          doctorName: data.doctor_name || "",
          isHighRisk: data.is_high_risk || false,
          previousPregnancies: data.previous_pregnancies || "",
          medicalConditions: data.medical_conditions || "",
          allergies: data.allergies || "",
          currentMedications: data.current_medications || "",
          emergencyNotes: data.emergency_notes || ""
        });
      }
    } catch (error) {
      console.error('Error loading pregnancy data:', error);
      toast({
        title: "Error",
        description: "Failed to load pregnancy data.",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateDueDate = (lmp: string) => {
    if (!lmp) return "";
    const lmpDate = new Date(lmp);
    const dueDate = new Date(lmpDate.getTime() + (280 * 24 * 60 * 60 * 1000)); // 280 days
    return dueDate.toISOString().split('T')[0];
  };

  const handleLMPChange = (lmp: string) => {
    handleInputChange('lastMenstrualPeriod', lmp);
    if (lmp) {
      const calculatedDueDate = calculateDueDate(lmp);
      handleInputChange('dueDate', calculatedDueDate);
      
      // Calculate weeks pregnant
      const lmpDate = new Date(lmp);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - lmpDate.getTime());
      const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
      const weeks = Math.min(diffWeeks, 42);
      handleInputChange('weeksPregnant', weeks.toString());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const pregnancyData = {
        user_id: user.id,
        weeks_pregnant: formData.weeksPregnant ? parseInt(formData.weeksPregnant) : null,
        due_date: formData.dueDate || null,
        last_menstrual_period: formData.lastMenstrualPeriod || null,
        hospital_name: formData.hospitalName || null,
        doctor_name: formData.doctorName || null,
        is_high_risk: formData.isHighRisk,
        previous_pregnancies: formData.previousPregnancies || null,
        medical_conditions: formData.medicalConditions || null,
        allergies: formData.allergies || null,
        current_medications: formData.currentMedications || null,
        emergency_notes: formData.emergencyNotes || null,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('pregnancy_data')
        .upsert(pregnancyData, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      // Refresh user data to update hasPregnancyData flag
      await refreshUserData();

      toast({
        title: "Success! 🎉",
        description: "Your pregnancy details have been saved successfully.",
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving pregnancy data:', error);
      toast({
        title: "Error",
        description: "Failed to save pregnancy details. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Pregnancy Details
          </h1>
          <p className="text-muted-foreground">
            Help us personalize your MamaAlert experience by sharing your pregnancy information.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-rose-500" />
                Basic Pregnancy Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lastMenstrualPeriod">Last Menstrual Period (LMP)</Label>
                  <Input
                    id="lastMenstrualPeriod"
                    type="date"
                    value={formData.lastMenstrualPeriod}
                    onChange={(e) => handleLMPChange(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    This helps us calculate your due date and pregnancy week
                  </p>
                </div>

                <div>
                  <Label htmlFor="weeksPregnant">Current Weeks Pregnant</Label>
                  <Input
                    id="weeksPregnant"
                    type="number"
                    min="0"
                    max="42"
                    value={formData.weeksPregnant}
                    onChange={(e) => handleInputChange('weeksPregnant', e.target.value)}
                    placeholder="e.g., 24"
                  />
                </div>

                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isHighRisk"
                    checked={formData.isHighRisk}
                    onCheckedChange={(checked) => handleInputChange('isHighRisk', checked)}
                  />
                  <Label htmlFor="isHighRisk" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    High-risk pregnancy
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Healthcare Provider Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-blue-500" />
                Healthcare Provider Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hospitalName">Hospital/Clinic Name</Label>
                  <Input
                    id="hospitalName"
                    value={formData.hospitalName}
                    onChange={(e) => handleInputChange('hospitalName', e.target.value)}
                    placeholder="e.g., Lagos University Teaching Hospital"
                  />
                </div>

                <div>
                  <Label htmlFor="doctorName">Doctor's Name</Label>
                  <Input
                    id="doctorName"
                    value={formData.doctorName}
                    onChange={(e) => handleInputChange('doctorName', e.target.value)}
                    placeholder="e.g., Dr. Sarah Johnson"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medical History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-green-500" />
                Medical History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="previousPregnancies">Previous Pregnancies</Label>
                <Textarea
                  id="previousPregnancies"
                  value={formData.previousPregnancies}
                  onChange={(e) => handleInputChange('previousPregnancies', e.target.value)}
                  placeholder="Please describe any previous pregnancies, including outcomes..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="medicalConditions">Medical Conditions</Label>
                <Textarea
                  id="medicalConditions"
                  value={formData.medicalConditions}
                  onChange={(e) => handleInputChange('medicalConditions', e.target.value)}
                  placeholder="List any medical conditions (diabetes, hypertension, etc.)"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="allergies">Allergies</Label>
                <Textarea
                  id="allergies"
                  value={formData.allergies}
                  onChange={(e) => handleInputChange('allergies', e.target.value)}
                  placeholder="List any known allergies (medications, foods, etc.)"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="currentMedications">Current Medications</Label>
                <Textarea
                  id="currentMedications"
                  value={formData.currentMedications}
                  onChange={(e) => handleInputChange('currentMedications', e.target.value)}
                  placeholder="List current medications and supplements"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="emergencyNotes">Emergency Notes</Label>
                <Textarea
                  id="emergencyNotes"
                  value={formData.emergencyNotes}
                  onChange={(e) => handleInputChange('emergencyNotes', e.target.value)}
                  placeholder="Any special instructions for emergency situations"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-rose-600 hover:bg-rose-700"
            >
              {loading ? "Saving..." : "Save Pregnancy Details"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PregnancyDetails;
