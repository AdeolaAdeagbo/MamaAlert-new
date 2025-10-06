
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2, Ambulance } from "lucide-react";
import { useEmergencyAlert } from "@/hooks/useEmergencyAlert";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TransportRequestDialog } from "./TransportRequestDialog";
import { TransportRequestStatus } from "./TransportRequestStatus";

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
  const [showTransportDialog, setShowTransportDialog] = useState(false);
  const [showTransportQuestion, setShowTransportQuestion] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);
  const { triggerEmergencyAlert } = useEmergencyAlert();

  const handleEmergencyClick = () => {
    setShowTransportQuestion(true);
  };

  const handleTransportResponse = async (needsTransport: boolean) => {
    setShowTransportQuestion(false);
    
    if (needsTransport) {
      setShowTransportDialog(true);
    } else {
      // Continue with normal emergency alert
      setIsEmergencyActive(true);
      const success = await triggerEmergencyAlert(
        userId, 
        "Emergency alert triggered by user", 
        "Location not available", 
        onAlertSent
      );
      
      if (success) {
        setTimeout(() => setIsEmergencyActive(false), 3000);
      } else {
        setIsEmergencyActive(false);
      }
    }
  };

  const handleTransportRequestSubmitted = (requestId: string) => {
    setCurrentRequestId(requestId);
    setShowStatusDialog(true);
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
            onClick={handleEmergencyClick}
            disabled={isEmergencyActive}
            aria-label="Emergency Alert"
            variant="emergency"
            className="w-full h-24 rounded-2xl text-lg font-extrabold btn-press transition-transform duration-200 will-change-transform touch-target active:scale-95"
          >
            <div className="flex items-center justify-center gap-3">
              {isEmergencyActive ? (
                <>
                  <Loader2 className="h-7 w-7 animate-spin text-emergency-foreground" />
                  <span className="text-emergency-foreground">Sending Alert...</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-7 w-7 text-emergency-foreground" />
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

      {/* Transport Question Dialog */}
      <AlertDialog open={showTransportQuestion} onOpenChange={setShowTransportQuestion}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Do you need transport?</AlertDialogTitle>
            <AlertDialogDescription>
              We can arrange emergency transport to get you to a healthcare facility quickly.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => handleTransportResponse(false)}
            >
              No, just alert
            </Button>
            <Button
              className="flex-1 gap-2"
              onClick={() => handleTransportResponse(true)}
            >
              <Ambulance className="h-4 w-4" />
              Yes, request transport
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Transport Request Form */}
      <TransportRequestDialog
        open={showTransportDialog}
        onOpenChange={setShowTransportDialog}
        userId={userId}
        onRequestSubmitted={handleTransportRequestSubmitted}
      />

      {/* Transport Status Tracker */}
      <TransportRequestStatus
        open={showStatusDialog}
        onOpenChange={setShowStatusDialog}
        requestId={currentRequestId}
      />
    </div>
  );
};
