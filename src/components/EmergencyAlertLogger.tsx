
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from "lucide-react";

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
        navigator.geolocation.getCurrentPosition((position) => {
          location = `${position.coords.latitude}, ${position.coords.longitude}`;
        });
      }

      const emergencyAlert: EmergencyAlert = {
        id: `alert-${Date.now()}`,
        userId,
        type: "emergency",
        message: "Emergency alert triggered by user",
        timestamp: new Date().toISOString(),
        location
      };

      // Store in localStorage (in a real app, this would go to a database)
      const existingAlerts = JSON.parse(
        localStorage.getItem(`emergency-alerts-${userId}`) || "[]"
      );
      existingAlerts.unshift(emergencyAlert);
      localStorage.setItem(`emergency-alerts-${userId}`, JSON.stringify(existingAlerts));

      console.log("Triggering emergency alert...", emergencyAlert);
      
      toast({
        title: "🚨 Emergency Alert Sent!",
        description: "Your emergency contacts and nearest healthcare center have been notified.",
        variant: "destructive"
      });

      // Call the callback to update parent component
      onAlertSent(emergencyAlert);

      setTimeout(() => setIsEmergencyActive(false), 3000);
      
    } catch (error) {
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
