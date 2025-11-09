import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Baby, Shield, Calendar, Activity, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
}

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const steps: OnboardingStep[] = [
    {
      id: 1,
      title: "Welcome to MamaAlert",
      description: "Your trusted companion for pregnancy and postpartum care, providing personalized support every step of the way.",
      icon: <Heart className="w-20 h-20" />,
      bgColor: "bg-primary/10",
      iconColor: "text-primary"
    },
    {
      id: 2,
      title: "Track Your Journey",
      description: "Monitor your pregnancy week by week with personalized insights, fetal development tracking, and health tips tailored to you.",
      icon: <Baby className="w-20 h-20" />,
      bgColor: "bg-accent/20",
      iconColor: "text-accent-gold"
    },
    {
      id: 3,
      title: "Stay Safe & Prepared",
      description: "Access emergency contacts, find nearby healthcare centers, and prepare for delivery with our comprehensive checklists.",
      icon: <Shield className="w-20 h-20" />,
      bgColor: "bg-success/10",
      iconColor: "text-success"
    },
    {
      id: 4,
      title: "Never Miss Important Moments",
      description: "Get reminders for appointments, vaccinations, and important milestones throughout your pregnancy and beyond.",
      icon: <Calendar className="w-20 h-20" />,
      bgColor: "bg-secondary",
      iconColor: "text-foreground"
    },
    {
      id: 5,
      title: "Health Monitoring",
      description: "Log symptoms, track your mood, monitor baby's growth, and get AI-powered health guidance when you need it most.",
      icon: <Activity className="w-20 h-20" />,
      bgColor: "bg-warning/10",
      iconColor: "text-warning"
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate("/auth");
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-between p-6 py-12">
      {/* Progress Indicators */}
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-2">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                "h-1.5 flex-1 mx-0.5 rounded-full transition-all duration-500",
                index <= currentStep ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>Step {currentStep + 1} of {steps.length}</span>
          <button onClick={handleSkip} className="text-primary hover:underline">
            Skip
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center w-full max-w-md">
        <Card className="w-full border-0 shadow-large rounded-3xl overflow-hidden">
          <CardContent className="p-8 sm:p-12">
            <div 
              className="space-y-8 animate-fade-in"
              key={currentStep}
            >
              {/* Icon */}
              <div className="flex justify-center">
                <div className={cn(
                  "w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300",
                  steps[currentStep].bgColor
                )}>
                  <div className={steps[currentStep].iconColor}>
                    {steps[currentStep].icon}
                  </div>
                </div>
              </div>

              {/* Text Content */}
              <div className="space-y-4 text-center">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  {steps[currentStep].title}
                </h1>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {steps[currentStep].description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Buttons */}
      <div className="w-full max-w-md space-y-3">
        <Button
          onClick={handleNext}
          size="lg"
          className="w-full h-14 text-base font-semibold rounded-2xl shadow-medium hover:shadow-large transition-all"
        >
          {currentStep === steps.length - 1 ? "Get Started" : "Continue"}
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>

        {currentStep > 0 && (
          <Button
            onClick={handlePrev}
            variant="ghost"
            size="lg"
            className="w-full h-12 text-base font-medium rounded-2xl"
          >
            <ChevronLeft className="mr-2 h-5 w-5" />
            Back
          </Button>
        )}
      </div>

      {/* Footer */}
      <p className="text-xs text-muted-foreground/60 text-center mt-8">
        Supporting maternal health in Nigeria 🇳🇬
      </p>
    </div>
  );
};

export default Onboarding;
