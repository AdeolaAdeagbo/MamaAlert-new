import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

const Splash = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Fade in animation
    setTimeout(() => setIsVisible(true), 100);

    // Start fade out
    setTimeout(() => setIsFadingOut(true), 2300);

    // Navigate to onboarding
    setTimeout(() => navigate("/onboarding"), 2800);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-primary/20 via-accent-pink/30 to-white dark:from-primary/10 dark:via-rose-950/20 dark:to-background">
      {/* Subtle animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-gold/10 rounded-full blur-3xl animate-pulse delay-500" />

      {/* Optional subtle background silhouette */}
      <div className="absolute inset-0 opacity-5 dark:opacity-[0.02]">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-96 bg-gradient-to-t from-primary/20 to-transparent rounded-t-full" />
      </div>

      {/* Main content */}
      <div 
        className={`relative z-10 flex flex-col items-center justify-center space-y-8 px-6 transition-all duration-1000 ${
          isVisible && !isFadingOut 
            ? 'opacity-100 scale-100' 
            : 'opacity-0 scale-95'
        }`}
      >
        {/* Logo */}
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-light to-accent-gold rounded-full blur-2xl opacity-40 animate-pulse" />
          
          {/* Logo container */}
          <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-primary via-primary-light to-primary flex items-center justify-center shadow-2xl">
            <Heart className="w-14 h-14 text-white fill-white drop-shadow-lg" />
          </div>
        </div>

        {/* App name */}
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary-dark to-accent-gold bg-clip-text text-transparent">
          MamaAlert
        </h1>

        {/* Tagline */}
        <p className="text-lg md:text-xl text-foreground/70 font-light text-center max-w-sm leading-relaxed">
          Hey Mama, you're not alone anymore.
        </p>
      </div>
    </div>
  );
};

export default Splash;
