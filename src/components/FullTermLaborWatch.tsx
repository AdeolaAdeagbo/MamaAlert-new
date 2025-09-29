import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { usePregnancyProgress } from "@/hooks/usePregnancyProgress";
import { useEmergencyAlert } from "@/hooks/useEmergencyAlert";
import { Clock, AlertTriangle, Baby, Heart } from "lucide-react";

interface LaborSign {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  severity: 'low' | 'medium' | 'high';
}

interface FullTermLaborWatchProps {
  userId: string;
}

export const FullTermLaborWatch = ({ userId }: FullTermLaborWatchProps) => {
  const { pregnancyData, currentWeek } = usePregnancyProgress(userId);
  const { toast } = useToast();
  const { triggerEmergencyAlert } = useEmergencyAlert();
  const [laborSigns, setLaborSigns] = useState<LaborSign[]>([
    {
      id: '1',
      name: 'Regular Contractions',
      description: 'Contractions every 5-10 minutes for an hour',
      isActive: false,
      severity: 'high'
    },
    {
      id: '2',
      name: 'Water Breaking',
      description: 'Rupture of membranes (clear or slightly bloody fluid)',
      isActive: false,
      severity: 'high'
    },
    {
      id: '3',
      name: 'Bloody Show',
      description: 'Pink or blood-tinged mucus discharge',
      isActive: false,
      severity: 'medium'
    },
    {
      id: '4',
      name: 'Lower Back Pain',
      description: 'Persistent lower back pain with pressure',
      isActive: false,
      severity: 'medium'
    },
    {
      id: '5',
      name: 'Increased Pelvic Pressure',
      description: 'Baby dropping lower, increased pressure',
      isActive: false,
      severity: 'low'
    }
  ]);

  const isFullTerm = currentWeek >= 37;

  const toggleLaborSign = (signId: string) => {
    setLaborSigns(prev => {
      const updatedSigns = prev.map(sign => 
        sign.id === signId 
          ? { ...sign, isActive: !sign.isActive }
          : sign
      );
      
      // Auto-trigger emergency alert if high-risk symptoms are selected
      const newActiveHighSigns = updatedSigns.filter(sign => sign.isActive && sign.severity === 'high').length;
      if (newActiveHighSigns >= 1) {
        // Delay to allow state update
        setTimeout(() => {
          autoTriggerEmergency(updatedSigns);
        }, 100);
      }
      
      return updatedSigns;
    });
  };

  const getActiveHighSeveritySigns = () => {
    return laborSigns.filter(sign => sign.isActive && sign.severity === 'high').length;
  };

  const getActiveMediumSeveritySigns = () => {
    return laborSigns.filter(sign => sign.isActive && sign.severity === 'medium').length;
  };

  const autoTriggerEmergency = async (signs: LaborSign[]) => {
    const activeSigns = signs.filter(s => s.isActive);
    const message = `URGENT: High-risk labor signs detected - ${activeSigns.map(s => s.name).join(', ')}. Immediate medical attention required.`;
    
    await triggerEmergencyAlert(userId, message, 'Labor Watch - Auto-triggered');
    
    toast({
      title: "EMERGENCY ALERT TRIGGERED!",
      description: "High-risk labor signs detected. Emergency contacts notified and healthcare providers alerted immediately.",
      variant: "destructive"
    });
  };

  const contactProvider = async () => {
    const activeHighSigns = getActiveHighSeveritySigns();
    const activeMediumSigns = getActiveMediumSeveritySigns();
    
    if (activeHighSigns >= 1 || activeMediumSigns >= 2) {
      await autoTriggerEmergency(laborSigns);
    } else {
      toast({
        title: "Monitor Your Symptoms",
        description: "Keep tracking these signs. Contact your provider if they intensify.",
        variant: "default"
      });
    }
  };

  if (!isFullTerm) {
    return (
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="text-center space-y-3">
            <Baby className="h-12 w-12 text-blue-500 mx-auto" />
            <h3 className="font-semibold text-blue-800 dark:text-blue-200">Full Term Labor Watch</h3>
            <p className="text-sm text-blue-600 dark:text-blue-300">
              Available from week 37 of pregnancy. Currently at week {currentWeek}.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const activeHighSigns = getActiveHighSeveritySigns();
  const activeMediumSigns = getActiveMediumSeveritySigns();
  const shouldContactProvider = activeHighSigns >= 1 || activeMediumSigns >= 2;

  return (
    <Card className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20 border-pink-200 dark:border-pink-800">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-pink-800 dark:text-pink-200">
          <Clock className="h-5 w-5" />
          Full Term Labor Watch
          <Badge variant="secondary" className="ml-auto">
            Week {currentWeek}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {laborSigns.map((sign) => (
            <div
              key={sign.id}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                sign.isActive
                  ? sign.severity === 'high'
                    ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
                    : sign.severity === 'medium'
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/20'
                    : 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
              }`}
              onClick={() => toggleLaborSign(sign.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{sign.name}</h4>
                    <Badge
                      variant={
                        sign.severity === 'high' ? 'destructive' :
                        sign.severity === 'medium' ? 'secondary' : 'outline'
                      }
                      className="text-xs"
                    >
                      {sign.severity}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{sign.description}</p>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 ${
                  sign.isActive
                    ? 'bg-primary border-primary'
                    : 'border-gray-300 dark:border-gray-600'
                }`} />
              </div>
            </div>
          ))}
        </div>

        {shouldContactProvider && (
          <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-2 text-red-800 dark:text-red-200 mb-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-semibold text-sm">Labor Signs Detected</span>
            </div>
            <p className="text-xs text-red-700 dark:text-red-300">
              Your symptoms suggest you may be in early labor. Contact your healthcare provider immediately.
            </p>
          </div>
        )}

        <Button
          onClick={contactProvider}
          variant={shouldContactProvider ? "destructive" : "outline"}
          className="w-full"
          size="sm"
        >
          <Heart className="h-4 w-4 mr-2" />
          {shouldContactProvider ? 'Contact Provider Now' : 'Monitor & Contact Provider'}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Track your labor signs. If you experience any concerning symptoms, contact your healthcare provider immediately.
        </p>
      </CardContent>
    </Card>
  );
};