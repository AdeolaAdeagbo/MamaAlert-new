
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EmergencyAlertProps {
  isEmergencyActive: boolean;
  onEmergencyAlert: () => void;
}

export const EmergencyAlert = ({ isEmergencyActive, onEmergencyAlert }: EmergencyAlertProps) => {
  return (
    <Card className="mb-8 border-red-200 bg-gradient-to-r from-red-50 to-rose-50">
      <CardContent className="pt-6">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-800 mb-4">Emergency Alert</h2>
          <p className="text-red-700 mb-6">
            If you're experiencing a medical emergency, press the button below to instantly 
            notify your emergency contacts and nearest healthcare center.
          </p>
          <Button 
            onClick={onEmergencyAlert}
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
        </div>
      </CardContent>
    </Card>
  );
};
