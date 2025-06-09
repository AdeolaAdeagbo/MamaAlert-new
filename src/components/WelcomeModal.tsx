
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Calendar, Shield, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

export const WelcomeModal = ({ isOpen, onClose, userName }: WelcomeModalProps) => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    onClose();
    navigate('/pregnancy-details');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center text-rose-600">
            Welcome to MamaAlert, {userName}! 🤱
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-lg text-muted-foreground mb-4">
              Your personalized pregnancy companion is ready to help you through this amazing journey.
            </p>
            <p className="text-sm text-muted-foreground">
              Let's start by setting up your pregnancy profile to unlock all features.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="border-rose-200">
              <CardContent className="pt-4">
                <div className="text-center">
                  <Heart className="h-8 w-8 text-rose-500 mx-auto mb-2" />
                  <h3 className="font-medium">Health Tips</h3>
                  <p className="text-sm text-muted-foreground">Weekly personalized advice</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardContent className="pt-4">
                <div className="text-center">
                  <Calendar className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <h3 className="font-medium">Appointments</h3>
                  <p className="text-sm text-muted-foreground">Track your checkups</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardContent className="pt-4">
                <div className="text-center">
                  <Phone className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <h3 className="font-medium">Emergency Contacts</h3>
                  <p className="text-sm text-muted-foreground">Quick access to help</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200">
              <CardContent className="pt-4">
                <div className="text-center">
                  <Shield className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <h3 className="font-medium">Health Tracking</h3>
                  <p className="text-sm text-muted-foreground">Monitor symptoms</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center space-y-4">
            <Button 
              onClick={handleGetStarted}
              className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-3 text-lg"
            >
              <Heart className="h-5 w-5 mr-2" />
              Get Started - Add Pregnancy Details
            </Button>
            <p className="text-xs text-muted-foreground">
              This takes just 2 minutes and unlocks your personalized dashboard
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
