import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import mamaLogo from "@/assets/mama-logo.png";
import pregnantSilhouette from "@/assets/pregnant-silhouette.png";

const Onboarding = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);


  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-background">
      {/* Pregnant woman silhouette background */}
      <div className="absolute inset-0 flex items-end justify-center opacity-[0.03] dark:opacity-[0.02]">
        <img 
          src={pregnantSilhouette} 
          alt="" 
          className="h-[70%] object-contain"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex-1 flex flex-col justify-between px-6 py-12 max-w-md mx-auto w-full">
        
        {/* Top Section - Logo & Tagline */}
        <div className={`text-center space-y-8 pt-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>
          {/* Logo */}
          <div className="flex justify-center">
            <img 
              src={mamaLogo} 
              alt="MamaAlert" 
              className="w-64 md:w-72 h-auto"
            />
          </div>

          {/* Tagline */}
          <p className="text-lg md:text-xl text-foreground/70 font-light leading-relaxed px-4">
            Your trusted companion through every moment of motherhood
          </p>
        </div>

        {/* Bottom Section - CTA */}
        <div className={`space-y-6 pb-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Main CTA Button */}
          <Button
            onClick={() => navigate("/auth")}
            size="lg"
            className="w-full h-14 text-base font-medium transition-all duration-300 rounded-2xl"
          >
            Get Started
          </Button>

          {/* Privacy & Support Text */}
          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground/70 leading-relaxed px-4">
              Join thousands of Nigerian mothers getting the care they deserve
            </p>
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground/60">
              <Shield className="w-3 h-3" />
              <span>Your data is secure and private</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
