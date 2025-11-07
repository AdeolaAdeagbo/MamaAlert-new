import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Baby, Heart } from "lucide-react";
import { useMode } from "@/contexts/ModeContext";

interface OnboardingPromptProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OnboardingPrompt({ isOpen, onClose }: OnboardingPromptProps) {
  const { setOnboardingMode } = useMode();

  const handleModeSelection = async (mode: 'pregnancy' | 'postpartum') => {
    await setOnboardingMode(mode);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-center mb-1">Welcome to MamaAlert! 🌸</DialogTitle>
          <p className="text-center text-sm text-muted-foreground">
            Let's personalize your experience. Where are you in your journey?
          </p>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-3 mt-3">
          <Card className="cursor-pointer hover:shadow-lg transition-all hover:border-primary border-2">
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-rose-500 fill-rose-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-base mb-1.5">I'm Pregnant</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    Track your pregnancy journey with:
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-0.5 text-left">
                    <li>• Fetal development tracking</li>
                    <li>• Pregnancy symptom guide</li>
                    <li>• Appointment reminders</li>
                    <li>• Emergency planning tools</li>
                    <li>• Weekly health tips</li>
                  </ul>
                </div>
                <Button 
                  onClick={() => handleModeSelection('pregnancy')}
                  className="w-full h-10"
                  size="sm"
                >
                  Continue with Pregnancy Mode
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all hover:border-primary border-2">
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                  <Baby className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-base mb-1.5">I Have a Baby</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    Care for your newborn with:
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-0.5 text-left">
                    <li>• Baby health monitoring</li>
                    <li>• Growth & milestone tracking</li>
                    <li>• Vaccination schedules</li>
                    <li>• Postpartum mood tracker</li>
                    <li>• Breastfeeding logger</li>
                  </ul>
                </div>
                <Button 
                  onClick={() => handleModeSelection('postpartum')}
                  className="w-full h-10"
                  size="sm"
                  variant="secondary"
                >
                  Continue with Postpartum Mode
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-3">
          Don't worry, you can always change this later in your profile settings.
        </p>
      </DialogContent>
    </Dialog>
  );
}