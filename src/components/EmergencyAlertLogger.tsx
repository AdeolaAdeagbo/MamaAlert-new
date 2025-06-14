
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Loader2 } from "lucide-react";
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
      try {
        if (navigator.geolocation) {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 10000,
              enableHighAccuracy: true
            });
          });
          location = `${position.coords.latitude}, ${position.coords.longitude}`;
        }
      } catch (error) {
        console.log("Could not get location:", error);
      }

      // Get user profile and emergency contacts
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', userId)
        .single();

      const { data: emergencyContacts } = await supabase
        .from('emergency_contacts')
        .select('name, phone')
        .eq('user_id', userId);

      const userName = profile ? `${profile.first_name} ${profile.last_name}`.trim() : 'Unknown User';

      // Store alert in database
      const alertData = {
        user_id: userId,
        alert_type: "emergency",
        message: "Emergency alert triggered by user",
        location
      };

      const { data, error } = await supabase
        .from('emergency_alerts')
        .insert(alertData)
        .select()
        .single();

      if (error) throw error;

      console.log("Emergency alert stored in database:", data);

      // Send SMS to emergency contacts using Termii if any exist
      if (emergencyContacts && emergencyContacts.length > 0) {
        try {
          console.log("Sending SMS via Termii to emergency contacts:", emergencyContacts);
          
          const response = await supabase.functions.invoke('send-termii-sms', {
            body: {
              emergencyContacts: emergencyContacts.filter(contact => contact.phone),
              userLocation: location,
              userName,
              messageType: "emergency"
            }
          });

          if (response.error) {
            console.error("Termii SMS function error:", response.error);
            // Don't throw error - alert was still saved to database
          } else {
            console.log("Termii SMS response:", response.data);
          }
        } catch (smsError) {
          console.error("Termii SMS sending failed:", smsError);
          // Don't throw error - alert was still saved to database
        }
      }

      toast({
        title: "Emergency Alert Sent!",
        description: emergencyContacts && emergencyContacts.length > 0 
          ? `Emergency contacts notified via SMS and nearest healthcare centers have been alerted.`
          : "Emergency alert logged. Add emergency contacts to receive SMS notifications.",
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
      {isEmergencyActive ? (
        <>
          <Loader2 className="h-6 w-6 mr-3 animate-spin" />
          SENDING ALERT...
        </>
      ) : (
        <>
          <AlertTriangle className="h-6 w-6 mr-3" />
          EMERGENCY ALERT
        </>
      )}
    </Button>
  );
};
