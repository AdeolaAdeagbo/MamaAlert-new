
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";
import { AlertTriangle, CheckCircle, Clock, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SymptomLog {
  id: string;
  symptom: string;
  severity: "mild" | "moderate" | "severe";
  description: string;
  timestamp: string;
  isEmergency: boolean;
  recommendations: string[];
}

const SymptomLogger = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [symptom, setSymptom] = useState("");
  const [severity, setSeverity] = useState<"mild" | "moderate" | "severe">("mild");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock recent logs
  const [recentLogs] = useState<SymptomLog[]>([
    {
      id: "1",
      symptom: "Severe headache",
      severity: "severe",
      description: "Persistent headache with nausea",
      timestamp: "2024-01-15 14:30",
      isEmergency: true,
      recommendations: ["Contact your doctor immediately", "Monitor blood pressure", "Rest in dark room"]
    },
    {
      id: "2",
      symptom: "Morning sickness",
      severity: "mild",
      description: "Mild nausea in the morning",
      timestamp: "2024-01-15 08:00",
      isEmergency: false,
      recommendations: ["Eat small frequent meals", "Stay hydrated", "Rest when needed"]
    }
  ]);

  // Emergency symptoms that require immediate attention
  const emergencySymptoms = [
    "severe headache",
    "heavy bleeding",
    "severe abdominal pain",
    "chest pain",
    "difficulty breathing",
    "fainting",
    "seizures",
    "severe nausea and vomiting",
    "high fever"
  ];

  const commonSymptoms = [
    "Morning sickness",
    "Fatigue",
    "Headache",
    "Back pain",
    "Swelling",
    "Heartburn",
    "Shortness of breath",
    "Mood changes",
    "Sleep problems",
    "Breast tenderness",
    "Frequent urination",
    "Constipation",
    "Leg cramps",
    "Dizziness",
    "Other"
  ];

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const checkEmergencySymptom = (symptomText: string, severityLevel: string) => {
    const lowerSymptom = symptomText.toLowerCase();
    return emergencySymptoms.some(emergency => lowerSymptom.includes(emergency)) || severityLevel === "severe";
  };

  const getRecommendations = (symptomText: string, severityLevel: string, isEmergency: boolean) => {
    if (isEmergency) {
      return [
        "🚨 Contact your healthcare provider immediately",
        "🏥 Consider going to the nearest hospital",
        "📞 Alert your emergency contacts",
        "📝 Document all symptoms for medical consultation"
      ];
    }

    // Non-emergency recommendations based on symptom
    const lowerSymptom = symptomText.toLowerCase();
    if (lowerSymptom.includes("nausea") || lowerSymptom.includes("morning sickness")) {
      return [
        "🍃 Eat small, frequent meals",
        "💧 Stay well hydrated",
        "🍋 Try ginger or lemon",
        "😴 Get adequate rest"
      ];
    }
    
    if (lowerSymptom.includes("headache")) {
      return [
        "💧 Ensure adequate hydration",
        "😴 Rest in a quiet, dark room",
        "🩺 Monitor if headaches persist",
        "📝 Track headache patterns"
      ];
    }

    return [
      "📝 Monitor symptoms closely",
      "💧 Stay hydrated",
      "😴 Get adequate rest",
      "🩺 Consult your healthcare provider if symptoms worsen"
    ];
  };

  const sendDangerSymptomSMS = async (symptomText: string, severityLevel: string, userName: string) => {
    try {
      // Get user's emergency contacts
      const { data: emergencyContacts } = await supabase
        .from('emergency_contacts')
        .select('name, phone')
        .eq('user_id', user.id);

      if (emergencyContacts && emergencyContacts.length > 0) {
        const message = `DANGER SYMPTOM ALERT

${userName} has logged a danger symptom that requires immediate attention:

Symptom: ${symptomText}
Severity: ${severityLevel}
Time: ${new Date().toLocaleString()}

Please check on them and encourage them to seek medical attention immediately.

This is an automated alert from MamaAlert.`;

        console.log("Sending danger symptom SMS to emergency contacts");
        
        const response = await supabase.functions.invoke('send-termii-sms', {
          body: {
            emergencyContacts: emergencyContacts.filter(contact => contact.phone),
            message,
            userName,
            messageType: "emergency"
          }
        });

        if (response.error) {
          console.error("SMS sending failed:", response.error);
        } else {
          console.log("Danger symptom SMS sent successfully:", response.data);
        }
      }
    } catch (error) {
      console.error("Error sending danger symptom SMS:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isEmergency = checkEmergencySymptom(symptom, severity);
    const recommendations = getRecommendations(symptom, severity, isEmergency);

    try {
      // Get user profile for name
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', user.id)
        .single();

      const userName = profile ? `${profile.first_name} ${profile.last_name}`.trim() : 'Unknown User';

      // Save to Supabase
      const { data, error } = await supabase
        .from('symptom_logs')
        .insert({
          user_id: user.id,
          symptom_type: symptom,
          severity: severity === "mild" ? 3 : severity === "moderate" ? 6 : 9,
          description: description
        })
        .select()
        .single();

      if (error) throw error;

      console.log("Symptom logged:", data);

      // Send SMS for danger symptoms
      if (isEmergency) {
        await sendDangerSymptomSMS(symptom, severity, userName);
      }

      toast({
        title: isEmergency ? "⚠️ Emergency Symptom Detected" : "✅ Symptom Logged",
        description: isEmergency 
          ? "This symptom requires immediate medical attention. Your emergency contacts have been notified."
          : "Your symptom has been logged successfully.",
        variant: isEmergency ? "destructive" : "default"
      });

      // Reset form
      setSymptom("");
      setSeverity("mild");
      setDescription("");
      
    } catch (error) {
      console.error("Error logging symptom:", error);
      toast({
        title: "Error",
        description: "Failed to log symptom. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Symptom Logger</h1>
          <p className="text-muted-foreground">
            Log your symptoms to track your health and get guidance on when to seek medical attention.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Symptom Logger Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-rose-500" />
                  Log New Symptom
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="symptom">What symptom are you experiencing? *</Label>
                    <Select value={symptom} onValueChange={setSymptom} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a symptom" />
                      </SelectTrigger>
                      <SelectContent>
                        {commonSymptoms.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="severity">How severe is this symptom? *</Label>
                    <Select value={severity} onValueChange={(value: "mild" | "moderate" | "severe") => setSeverity(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mild">Mild - Barely noticeable</SelectItem>
                        <SelectItem value="moderate">Moderate - Noticeable but manageable</SelectItem>
                        <SelectItem value="severe">Severe - Very uncomfortable or painful</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Additional Details</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your symptom in more detail... When did it start? What makes it better or worse?"
                      rows={4}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-rose-500 hover:bg-rose-600"
                    disabled={isSubmitting || !symptom}
                  >
                    {isSubmitting ? "Logging Symptom..." : "Log Symptom"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Recent Logs */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-rose-500" />
                  Recent Logs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentLogs.map((log) => (
                  <div 
                    key={log.id} 
                    className={`p-3 rounded-lg border ${
                      log.isEmergency ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{log.symptom}</h4>
                      {log.isEmergency ? (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{log.timestamp}</p>
                    <div className="space-y-1">
                      {log.recommendations.slice(0, 2).map((rec, idx) => (
                        <p key={idx} className="text-xs">{rec}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Emergency Info */}
            <Card className="mt-6 border-red-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-red-600 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Emergency Signs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-red-700 mb-3">
                  Contact emergency services immediately if you experience:
                </p>
                <ul className="text-xs space-y-1 text-red-600">
                  <li>• Severe bleeding</li>
                  <li>• Severe headache with vision changes</li>
                  <li>• Chest pain or difficulty breathing</li>
                  <li>• Severe abdominal pain</li>
                  <li>• Fainting or seizures</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomLogger;
