
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useEmergencyAlert } from "@/hooks/useEmergencyAlert";

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
  const { triggerEmergencyAlert } = useEmergencyAlert();

  const handleEmergencyAlert = async () => {
    setIsEmergencyActive(true);
    
    const success = await triggerEmergencyAlert(userId, "Emergency alert triggered by user", "Location not available", onAlertSent);
    
    if (success) {
      setTimeout(() => setIsEmergencyActive(false), 3000);
    } else {
      setIsEmergencyActive(false);
    }
  };

  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto space-y-3">
        <div className="text-center">
          <p className="text-sm text-muted-foreground leading-relaxed">
            In danger? Press this button to notify your emergency contacts and nearest healthcare center.
          </p>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleEmergencyAlert}
            disabled={isEmergencyActive}
            aria-label="Emergency Alert"
            variant="emergency"
            className="w-full max-w-md h-16 rounded-2xl text-xl font-bold btn-press transition-transform duration-200 will-change-transform"
          >
            <div className="flex items-center justify-center gap-4">
              {isEmergencyActive ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin text-emergency-foreground" />
                  <span className="text-emergency-foreground">Sending Alert...</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-6 w-6 text-emergency-foreground" />
                  <span className="text-emergency-foreground">EMERGENCY ALERT</span>
                </>
              )}
            </div>
          </Button>
        </div>

        {isEmergencyActive && (
          <p className="text-center text-sm text-muted-foreground font-medium">
            🚑 Notifying emergency contacts and healthcare centers...
          </p>
        )}
      </div>
    </div>
  );
};
