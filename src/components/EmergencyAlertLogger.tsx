
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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-t border-border p-4 shadow-2xl">
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
            variant="emergency"
            className="w-full max-w-md h-16 rounded-2xl relative overflow-hidden shadow-xl hover:shadow-emergency transition-all duration-300 text-xl font-bold landscape-button"
          >
            <div className="relative z-10 flex items-center justify-center gap-4">
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
