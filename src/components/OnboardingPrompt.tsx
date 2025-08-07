import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useMode } from '@/contexts/ModeContext';
import { Baby, Heart, ArrowRight } from 'lucide-react';

interface OnboardingPromptProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingPrompt = ({ isOpen, onClose }: OnboardingPromptProps) => {
  const { setOnboardingMode, isLoading } = useMode();

  const handleModeSelection = async (mode: 'pregnancy' | 'postpartum') => {
    await setOnboardingMode(mode);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-pink-700">
            Welcome to MamaAlert! 💕
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <p className="text-center text-gray-600">
            Let's personalize your care journey. Are you currently pregnant or have you already given birth?
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pregnancy Mode */}
            <Card className="border-2 border-blue-200 hover:border-blue-400 transition-colors cursor-pointer group">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto p-3 bg-blue-100 rounded-full w-fit mb-3 group-hover:bg-blue-200 transition-colors">
                  <Heart className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-blue-700">I'm Pregnant</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 text-center">
                  Get personalized pregnancy care with:
                </p>
                <ul className="text-xs space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-3 w-3 text-blue-500" />
                    Week-by-week pregnancy tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-3 w-3 text-blue-500" />
                    Symptom logging and monitoring
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-3 w-3 text-blue-500" />
                    Emergency alert system
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-3 w-3 text-blue-500" />
                    Hospital locator and appointments
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-3 w-3 text-blue-500" />
                    AI nurse support
                  </li>
                </ul>
                <Button
                  onClick={() => handleModeSelection('pregnancy')}
                  disabled={isLoading}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Start Pregnancy Care
                </Button>
              </CardContent>
            </Card>

            {/* Postpartum Mode */}
            <Card className="border-2 border-pink-200 hover:border-pink-400 transition-colors cursor-pointer group">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto p-3 bg-pink-100 rounded-full w-fit mb-3 group-hover:bg-pink-200 transition-colors">
                  <Baby className="h-8 w-8 text-pink-600" />
                </div>
                <CardTitle className="text-pink-700">I Have a Baby</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 text-center">
                  Get dedicated postpartum and infant care:
                </p>
                <ul className="text-xs space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-3 w-3 text-pink-500" />
                    Breastfeeding guidance and tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-3 w-3 text-pink-500" />
                    Baby immunization schedule
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-3 w-3 text-pink-500" />
                    Infant health monitoring
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-3 w-3 text-pink-500" />
                    Postpartum mood tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-3 w-3 text-pink-500" />
                    Baby milestone tracking
                  </li>
                </ul>
                <Button
                  onClick={() => handleModeSelection('postpartum')}
                  disabled={isLoading}
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white"
                >
                  Start Postpartum Care
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <p className="text-xs text-center text-gray-500">
            You can switch between modes anytime from your profile settings.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};