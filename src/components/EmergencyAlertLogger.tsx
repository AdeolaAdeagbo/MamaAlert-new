
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface EmergencyAlert {
  id: string;
  userId: string;
  type: "emergency" | "urgent" | "medical";
  message: string;
  timestamp: string;
  location?: string;
}

interface EmergencyAlertLoggerProps {
  userId: string;
  onAlertSent: (alert: EmergencyAlert) => void;
}

export const EmergencyAlertLogger = ({ userId, onAlertSent }: EmergencyAlertLoggerProps) => {
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const { toast } = useToast();

  const handleEmergencyAlert = async () => {
    setIsEmergencyActive(true);
    
    try {
      // Get user's location if available
      let location = "Location not available";
      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          location = `${position.coords.latitude}, ${position.coords.longitude}`;
        } catch (error) {
          console.log("Could not get location:", error);
        }
      }

      const alertData = {
        user_id: userId,
        alert_type: "emergency",
        message: "Emergency alert triggered by user",
        location
      };

      // Store in Supabase
      const { data, error } = await supabase
        .from('emergency_alerts')
        .insert(alertData)
        .select()
        .single();

      if (error) throw error;

      console.log("Emergency alert stored in database:", data);
      
      toast({
        title: "🚨 Emergency Alert Sent!",
        description: "Your emergency contacts and nearest healthcare center have been notified.",
        variant: "destructive"
      });

      // Call the callback to update parent component
      const emergencyAlert: EmergencyAlert = {
        id: data.id,
        userId: data.user_id,
        type: data.alert_type as "emergency",
        message: data.message,
        timestamp: data.timestamp,
        location: data.location || undefined
      };

      onAlertSent(emergencyAlert);

      setTimeout(() => setIsEmergencyActive(false), 3000);
      
    } catch (error) {
      console.error("Error sending emergency alert:", error);
      toast({
        title: "Alert Failed",
        description: "Failed to send emergency alert. Please call emergency services directly.",
        variant: "destructive"
      });
      setIsEmergencyActive(false);
    }
  };

  return (
    <Button 
      onClick={handleEmergencyAlert}
      disabled={isEmergencyActive}
      className={`text-white font-bold py-4 px-8 text-lg ${
        isEmergencyActive 
          ? 'bg-red-700 emergency-pulse' 
          : 'bg-red-600 hover:bg-red-700'
      }`}
    >
      <AlertTriangle className="h-6 w-6 mr-3" />
      {isEmergencyActive ? "ALERT SENT!" : "EMERGENCY ALERT"}
    </Button>
  );
};
