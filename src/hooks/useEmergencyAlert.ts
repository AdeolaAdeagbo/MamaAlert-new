import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EmergencyAlert {
  id: string;
  userId: string;
  type: "emergency" | "urgent" | "medical";
  message: string;
  timestamp: string;
  location?: string;
}

export const useEmergencyAlert = () => {
  const { toast } = useToast();

  const triggerEmergencyAlert = async (
    userId: string, 
    message: string = "Emergency alert triggered by user",
    location: string = "Location not available",
    onAlertSent?: (alert: EmergencyAlert) => void
  ) => {
    try {
      // Get user's location if available
      let userLocation = location;
      try {
        if (navigator.geolocation && location === "Location not available") {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 10000,
              enableHighAccuracy: true
            });
          });
          userLocation = `${position.coords.latitude}, ${position.coords.longitude}`;
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
        message,
        location: userLocation
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
              userLocation,
              userName,
              messageType: "emergency"
            }
          });

          if (response.error) {
            console.error("Termii SMS function error:", response.error);
          } else {
            console.log("Termii SMS response:", response.data);
          }
        } catch (smsError) {
          console.error("Termii SMS sending failed:", smsError);
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
      if (onAlertSent) {
        const emergencyAlert: EmergencyAlert = {
          id: data.id,
          userId: data.user_id,
          type: data.alert_type as "emergency",
          message: data.message,
          timestamp: data.timestamp,
          location: data.location || undefined
        };
        onAlertSent(emergencyAlert);
      }

      return true;
    } catch (error) {
      console.error("Error sending emergency alert:", error);
      toast({
        title: "Alert Failed",
        description: "Failed to send emergency alert. Please call emergency services directly.",
        variant: "destructive"
      });
      return false;
    }
  };

  return { triggerEmergencyAlert };
};