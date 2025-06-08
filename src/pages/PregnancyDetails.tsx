
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Navigate, useNavigate } from "react-router-dom";
import { Heart, Calendar, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PregnancyData {
  weeksPregnant: number;
  dueDate: string;
  lastMenstrualPeriod: string;
  isHighRisk: boolean;
  medicalConditions: string;
  allergies: string;
  currentMedications: string;
  doctorName: string;
  hospitalName: string;
  emergencyNotes: string;
  previousPregnancies: string;
}

const PregnancyDetails = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [pregnancyData, setPregnancyData] = useState<PregnancyData>({
    weeksPregnant: 0,
    dueDate: "",
    lastMenstrualPeriod: "",
    isHighRisk: false,
    medicalConditions: "",
    allergies: "",
    currentMedications: "",
    doctorName: "",
    hospitalName: "",
    emergencyNotes: "",
    previousPregnancies: ""
  });

  const [errors, setErrors] = useState<Partial<PregnancyData>>({});

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  useEffect(() => {
    loadPregnancyData();
  }, [user.id]);

  const loadPregnancyData = async () => {
    try {
      const { data } = await supabase
        .from('pregnancy_data')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        setPregnancyData({
          weeksPregnant: data.weeks_pregnant || 0,
          dueDate: data.due_date || "",
          lastMenstrualPeriod: data.last_menstrual_period || "",
          isHighRisk: data.is_high_risk || false,
          medicalConditions: data.medical_conditions || "",
          allergies: data.allergies || "",
          currentMedications: data.current_medications || "",
          doctorName: data.doctor_name || "",
          hospitalName: data.hospital_name || "",
          emergencyNotes: data.emergency_notes || "",
          previousPregnancies: data.previous_pregnancies || ""
        });
        setIsEditing(true);
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

  const validateForm = (): boolean => {
    const newErrors: Partial<PregnancyData> = {};

    if (!pregnancyData.weeksPregnant || pregnancyData.weeksPregnant < 1 || pregnancyData.weeksPregnant > 42) {
      newErrors.weeksPregnant = pregnancyData.weeksPregnant as any;
    }

    if (!pregnancyData.dueDate) {
      newErrors.dueDate = "Due date is required";
    } else {
      const dueDate = new Date(pregnancyData.dueDate);
      const today = new Date();
      if (dueDate <= today) {
        newErrors.dueDate = "Due date must be in the future";
      }
    }

    if (!pregnancyData.lastMenstrualPeriod) {
      newErrors.lastMenstrualPeriod = "Last menstrual period is required";
    } else {
      const lmpDate = new Date(pregnancyData.lastMenstrualPeriod);
      const today = new Date();
      if (lmpDate >= today) {
        newErrors.lastMenstrualPeriod = "Last menstrual period must be in the past";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please correct the errors in the form.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const pregnancyPayload = {
        user_id: user.id,
        weeks_pregnant: pregnancyData.weeksPregnant,
        due_date: pregnancyData.dueDate,
        last_menstrual_period: pregnancyData.lastMenstrualPeriod,
        is_high_risk: pregnancyData.isHighRisk,
        medical_conditions: pregnancyData.medicalConditions,
        allergies: pregnancyData.allergies,
        current_medications: pregnancyData.currentMedications,
        doctor_name: pregnancyData.doctorName,
        hospital_name: pregnancyData.hospitalName,
        emergency_notes: pregnancyData.emergencyNotes,
        previous_pregnancies: pregnancyData.previousPregnancies
      };

      if (isEditing) {
        const { error } = await supabase
          .from('pregnancy_data')
          .update(pregnancyPayload)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('pregnancy_data')
          .insert([pregnancyPayload]);

        if (error) throw error;
      }

      toast({
        title: isEditing ? "Details Updated!" : "Details Saved!",
        description: "Your pregnancy information has been saved successfully.",
      });

      navigate("/dashboard");
    } catch (error) {
      console.error('Error saving pregnancy details:', error);
      toast({
        title: "Error",
        description: "Failed to save pregnancy details. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof PregnancyData, value: any) => {
    setPregnancyData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const calculateDueDateFromWeeks = (weeks: number) => {
    if (weeks >= 1 && weeks <= 42) {
      const today = new Date();
      const remainingWeeks = 40 - weeks;
      const dueDate = new Date(today.getTime() + (remainingWeeks * 7 * 24 * 60 * 60 * 1000));
      return dueDate.toISOString().split('T')[0];
    }
    return "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Heart className="h-8 w-8 text-rose-500" />
            {isEditing ? "Update Pregnancy Details" : "Enter Pregnancy Details"}
          </h1>
          <p className="text-muted-foreground">
            Help us provide you with personalized care and timely alerts by sharing your pregnancy information.
          </p>
        </div>

        <Card className="border-rose-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-rose-500" />
              Pregnancy Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Pregnancy Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="weeksPregnant">Weeks Pregnant *</Label>
                  <Input
                    id="weeksPregnant"
                    type="number"
                    min="1"
                    max="42"
                    value={pregnancyData.weeksPregnant || ""}
                    onChange={(e) => {
                      const weeks = parseInt(e.target.value);
                      handleInputChange("weeksPregnant", weeks);
                      
                      if (weeks >= 1 && weeks <= 42) {
                        const calculatedDueDate = calculateDueDateFromWeeks(weeks);
                        if (calculatedDueDate) {
                          handleInputChange("dueDate", calculatedDueDate);
                        }
                      }
                    }}
                    placeholder="e.g., 24"
                    className={errors.weeksPregnant ? "border-red-500" : ""}
                  />
                  {errors.weeksPregnant && (
                    <p className="text-sm text-red-500 mt-1">
                      Please enter a valid week (1-42)
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="dueDate">Expected Due Date *</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={pregnancyData.dueDate}
                    onChange={(e) => handleInputChange("dueDate", e.target.value)}
                    className={errors.dueDate ? "border-red-500" : ""}
                  />
                  {typeof errors.dueDate === 'string' && (
                    <p className="text-sm text-red-500 mt-1">{errors.dueDate}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="lastMenstrualPeriod">Last Menstrual Period (LMP) *</Label>
                <Input
                  id="lastMenstrualPeriod"
                  type="date"
                  value={pregnancyData.lastMenstrualPeriod}
                  onChange={(e) => handleInputChange("lastMenstrualPeriod", e.target.value)}
                  className={errors.lastMenstrualPeriod ? "border-red-500" : ""}
                />
                {typeof errors.lastMenstrualPeriod === 'string' && (
                  <p className="text-sm text-red-500 mt-1">{errors.lastMenstrualPeriod}</p>
                )}
              </div>

              {/* Risk Assessment */}
              <div>
                <Label htmlFor="isHighRisk">Pregnancy Risk Level</Label>
                <Select
                  value={pregnancyData.isHighRisk ? "high" : "normal"}
                  onValueChange={(value) => handleInputChange("isHighRisk", value === "high")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select risk level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal Risk</SelectItem>
                    <SelectItem value="high">High Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Medical Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Medical Information</h3>
                
                <div>
                  <Label htmlFor="medicalConditions">Pre-existing Medical Conditions</Label>
                  <Textarea
                    id="medicalConditions"
                    value={pregnancyData.medicalConditions}
                    onChange={(e) => handleInputChange("medicalConditions", e.target.value)}
                    placeholder="e.g., Diabetes, Hypertension, Asthma..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="allergies">Allergies</Label>
                  <Textarea
                    id="allergies"
                    value={pregnancyData.allergies}
                    onChange={(e) => handleInputChange("allergies", e.target.value)}
                    placeholder="e.g., Penicillin, Peanuts, Latex..."
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="currentMedications">Current Medications</Label>
                  <Textarea
                    id="currentMedications"
                    value={pregnancyData.currentMedications}
                    onChange={(e) => handleInputChange("currentMedications", e.target.value)}
                    placeholder="e.g., Prenatal vitamins, Iron supplements..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="previousPregnancies">Previous Pregnancies</Label>
                  <Textarea
                    id="previousPregnancies"
                    value={pregnancyData.previousPregnancies}
                    onChange={(e) => handleInputChange("previousPregnancies", e.target.value)}
                    placeholder="Describe any previous pregnancies, complications, etc..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Healthcare Provider Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Healthcare Provider</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="doctorName">Doctor's Name</Label>
                    <Input
                      id="doctorName"
                      value={pregnancyData.doctorName}
                      onChange={(e) => handleInputChange("doctorName", e.target.value)}
                      placeholder="Dr. Adebayo Okonkwo"
                    />
                  </div>

                  <div>
                    <Label htmlFor="hospitalName">Hospital/Clinic Name</Label>
                    <Input
                      id="hospitalName"
                      value={pregnancyData.hospitalName}
                      onChange={(e) => handleInputChange("hospitalName", e.target.value)}
                      placeholder="Lagos University Teaching Hospital"
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Notes */}
              <div>
                <Label htmlFor="emergencyNotes">Emergency Notes</Label>
                <Textarea
                  id="emergencyNotes"
                  value={pregnancyData.emergencyNotes}
                  onChange={(e) => handleInputChange("emergencyNotes", e.target.value)}
                  placeholder="Any special instructions for emergency situations..."
                  rows={3}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-rose-500 hover:bg-rose-600 flex-1"
                >
                  {isLoading ? (
                    "Saving..."
                  ) : isEditing ? (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Update Details
                    </>
                  ) : (
                    <>
                      <Heart className="h-4 w-4 mr-2" />
                      Save Details
                    </>
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PregnancyDetails;
