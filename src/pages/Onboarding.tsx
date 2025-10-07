import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, Shield, Bell } from "lucide-react";
import onboardingPremium from "@/assets/onboarding-premium.jpg";

const Onboarding = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    { icon: Heart, text: "Personalized care" },
    { icon: Shield, text: "Emergency support" },
    { icon: Bell, text: "Smart reminders" },
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-rose-50 via-peach-50 to-orange-50 dark:from-gray-900 dark:via-rose-950/20 dark:to-gray-900">
      {/* Premium Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(${onboardingPremium})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background/90" />

      {/* Animated Gradient Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-40 right-10 w-96 h-96 bg-accent-gold/10 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Content Container */}
      <div className="relative z-10 flex-1 flex flex-col justify-between px-6 py-12 max-w-md mx-auto w-full">
        
        {/* Top Section - Logo & Branding */}
        <div className={`text-center space-y-6 pt-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>
          {/* Premium Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-light to-accent-gold rounded-3xl blur-xl opacity-50 animate-pulse" />
              <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-primary via-primary-light to-primary flex items-center justify-center shadow-2xl">
                <Heart className="w-12 h-12 text-white fill-white drop-shadow-lg" />
                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-accent-gold animate-pulse" />
              </div>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary-dark to-accent-gold bg-clip-text text-transparent leading-tight tracking-tight">
              MamaAlert
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 font-light leading-relaxed px-4">
              Your trusted companion through every moment of motherhood
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 pt-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-soft transition-all duration-700 delay-${index * 100} ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
              >
                <feature.icon className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground/80">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section - CTA */}
        <div className={`space-y-6 pb-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Main CTA Button */}
          <Button
            onClick={() => navigate("/auth")}
            size="lg"
            className="w-full h-16 text-lg font-semibold shadow-2xl hover:shadow-primary/50 transition-all duration-300 rounded-3xl bg-gradient-to-r from-primary via-primary-dark to-primary hover:scale-[1.02] active:scale-[0.98]"
          >
            Get Started
            <Sparkles className="ml-2 w-5 h-5" />
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
