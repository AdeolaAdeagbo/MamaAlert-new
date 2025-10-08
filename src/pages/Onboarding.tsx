import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import onboardingSplash from "@/assets/onboarding-splash.jpg";

const Onboarding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${onboardingSplash})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/70 to-background/80 backdrop-blur-[2px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-md mx-auto px-6 text-center space-y-8 animate-fade-in">
        {/* Logo/Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 backdrop-blur-md flex items-center justify-center shadow-soft">
            <Heart className="w-10 h-10 text-primary fill-primary" />
          </div>
        </div>

        {/* Welcome Text */}
        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight">
            Welcome to MamaAlert
          </h1>
          <p className="text-sm md:text-base text-muted-foreground font-light leading-relaxed">
            Your pregnancy companion, every step of the way
          </p>
        </div>

        {/* Get Started Button */}
        <div className="pt-4">
          <Button
            onClick={() => navigate("/auth")}
            size="lg"
            className="w-full max-w-xs h-14 text-base font-medium shadow-medium hover:shadow-large transition-all duration-300 rounded-2xl"
          >
            Get Started
          </Button>
        </div>

        {/* Subtle Footer Text */}
        <p className="text-xs text-muted-foreground/60 pt-8">
          Supporting maternal health in Nigeria
        </p>
      </div>
    </div>
  );
};

export default Onboarding;
