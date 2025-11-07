import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Shield, Activity, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

export function WelcomeModal({ isOpen, onClose, userName }: WelcomeModalProps) {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/pregnancy-details');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary fill-primary" />
            </div>
            Welcome to MamaAlert, {userName}! 🌸
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-3">
          <p className="text-center text-sm text-muted-foreground">
            Let's set up your pregnancy profile so we can support you every step of the way.
          </p>

          <div className="grid md:grid-cols-2 gap-3">
            <Card className="border-primary/20">
              <CardContent className="pt-4 text-center space-y-1.5">
                <Shield className="w-6 h-6 mx-auto text-primary" />
                <h3 className="font-semibold text-sm">Emergency Support</h3>
                <p className="text-xs text-muted-foreground">
                  Quick access to emergency contacts and healthcare centers
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardContent className="pt-4 text-center space-y-1.5">
                <Activity className="w-6 h-6 mx-auto text-primary" />
                <h3 className="font-semibold text-sm">Health Tracking</h3>
                <p className="text-xs text-muted-foreground">
                  Monitor symptoms and track your pregnancy journey
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardContent className="pt-4 text-center space-y-1.5">
                <Heart className="w-6 h-6 mx-auto text-primary fill-primary" />
                <h3 className="font-semibold text-sm">Fetal Development</h3>
                <p className="text-xs text-muted-foreground">
                  Week-by-week updates on your baby's growth
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardContent className="pt-4 text-center space-y-1.5">
                <Calendar className="w-6 h-6 mx-auto text-primary" />
                <h3 className="font-semibold text-sm">Appointments</h3>
                <p className="text-xs text-muted-foreground">
                  Never miss an important prenatal checkup
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center pt-3">
            <Button 
              onClick={handleGetStarted}
              className="px-8"
            >
              Get Started with Your Profile
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
