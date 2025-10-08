import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import mamaLogo from "@/assets/mama-logo.png";
import pregnantSilhouette from "@/assets/pregnant-silhouette.png";

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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Pregnant woman silhouette background */}
      <div className="absolute inset-0 flex items-end justify-center opacity-[0.03] dark:opacity-[0.02]">
        <img 
          src={pregnantSilhouette} 
          alt="" 
          className="h-[85%] object-contain"
        />
      </div>

      {/* Main content */}
      <div 
        className={`relative z-10 flex flex-col items-center justify-center px-6 transition-all duration-1000 ${
          isVisible && !isFadingOut 
            ? 'opacity-100 scale-100' 
            : 'opacity-0 scale-95'
        }`}
      >
        {/* Logo */}
        <div className="mb-8">
          <img 
            src={mamaLogo} 
            alt="MamaAlert" 
            className="w-64 md:w-80 h-auto"
          />
        </div>

        {/* Tagline */}
        <p className="text-lg md:text-xl text-foreground/60 font-light text-center max-w-md mb-12">
          Hey Mama, you're not alone anymore.
        </p>
      </div>
    </div>
  );
};

export default Splash;
