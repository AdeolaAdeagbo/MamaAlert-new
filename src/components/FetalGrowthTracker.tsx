import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePregnancyProgress } from "@/hooks/usePregnancyProgress";
import { Baby, Ruler, Heart, Eye, Brain, ChevronLeft, ChevronRight } from "lucide-react";

// Dynamically load fetal images week-by-week (realistic ultrasound-style assets)
const imageModules = import.meta.glob<{ default: string }>("/src/assets/fetal/week-*.jpg", { eager: true });
const weekImageMap: Record<number, string> = {};
for (const path in imageModules) {
  const mod = imageModules[path] as { default: string };
  const match = path.match(/week-(\d+)\.jpg$/);
  if (match) {
    weekImageMap[parseInt(match[1], 10)] = mod.default;
  }
}
const maxAvailableWeek = Object.keys(weekImageMap).map(Number).sort((a, b) => a - b).pop() || 40;
const getImageForWeek = (week: number) => {
  const clamped = Math.min(Math.max(week, 1), maxAvailableWeek);
  if (weekImageMap[clamped]) return weekImageMap[clamped];
  for (let w = clamped; w >= 1; w--) {
    if (weekImageMap[w]) return weekImageMap[w];
  }
  return weekImageMap[maxAvailableWeek];
};

interface FetalDevelopment {
  week: number;
  size: string;
  weight: string;
  comparison: string;
  developments: string[];
  image: string;
}

interface FetalGrowthTrackerProps {
  userId: string;
}

export const FetalGrowthTracker = ({ userId }: FetalGrowthTrackerProps) => {
  const { pregnancyData, currentWeek } = usePregnancyProgress(userId);
  const [selectedWeek, setSelectedWeek] = useState(currentWeek || 12);
  const [showDetails, setShowDetails] = useState(false);

  // Auto-sync with pregnancy week
  useEffect(() => {
    if (currentWeek) {
      const clamped = Math.min(currentWeek, 40);
      if (clamped !== selectedWeek) {
        setSelectedWeek(clamped);
      }
    }
  }, [currentWeek, selectedWeek]);

  const fetalDevelopmentData: FetalDevelopment[] = [
    {
      week: 4,
      size: "0.2 cm",
      weight: "0.5 grams",
      comparison: "Size of a poppy seed",
      developments: [
        "Embryo implants in uterus",
        "Cells dividing rapidly",
        "Amniotic sac forming",
        "Placenta begins to develop"
      ],
      image: "/src/assets/fetal/week-4.jpg"
    },
    {
      week: 8,
      size: "1.6 cm",
      weight: "1 gram",
      comparison: "Size of a raspberry",
      developments: [
        "Heart is beating steadily",
        "Arms and legs are growing",
        "Facial features developing",
        "Major organs forming"
      ],
      image: "/src/assets/fetal/week-8.jpg"
    },
    {
      week: 12,
      size: "6 cm",
      weight: "14 grams",
      comparison: "Size of a lime",
      developments: [
        "Fingerprints are forming",
        "Baby can make fists",
        "Reflexes are developing",
        "Kidneys start producing urine"
      ],
      image: "/src/assets/fetal/week-12.jpg"
    },
    {
      week: 16,
      size: "11 cm",
      weight: "100 grams",
      comparison: "Size of an avocado",
      developments: [
        "Baby can hear your voice",
        "Facial muscles can squint and frown",
        "Heart pumps 25 quarts of blood daily",
        "Skeleton changing from cartilage to bone"
      ],
      image: "/src/assets/fetal/week-16.jpg"
    },
    {
      week: 20,
      size: "16 cm",
      weight: "300 grams",
      comparison: "Size of a banana",
      developments: [
        "Baby can swallow and hear",
        "Hair and nails are growing",
        "You may feel first movements",
        "Genitals are fully formed"
      ],
      image: "/src/assets/fetal/week-20.jpg"
    },
    {
      week: 24,
      size: "21 cm",
      weight: "600 grams",
      comparison: "Size of an ear of corn",
      developments: [
        "Lungs are developing rapidly",
        "Brain tissue increases",
        "Baby responds to sound",
        "Footprints and fingerprints form"
      ],
      image: "/src/assets/fetal/week-24.jpg"
    },
    {
      week: 28,
      size: "25 cm",
      weight: "1000 grams",
      comparison: "Size of an eggplant",
      developments: [
        "Eyes can open and close",
        "Sleep cycles develop",
        "Brain tissue continues developing",
        "Can recognize your voice"
      ],
      image: "/src/assets/fetal/week-28.jpg"
    },
    {
      week: 32,
      size: "28 cm",
      weight: "1700 grams",
      comparison: "Size of a squash",
      developments: [
        "Bones are hardening",
        "Lots of sleeping",
        "Rapid weight gain begins",
        "Toenails and fingernails grow"
      ],
      image: "/src/assets/fetal/week-32.jpg"
    },
    {
      week: 36,
      size: "32 cm",
      weight: "2600 grams",
      comparison: "Size of a papaya",
      developments: [
        "Lungs are nearly mature",
        "Baby gains about ½ pound per week",
        "Getting ready for birth",
        "Digestive system nearly mature"
      ],
      image: "/src/assets/fetal/week-36.jpg"
    },
    {
      week: 40,
      size: "36 cm",
      weight: "3300 grams",
      comparison: "Size of a small watermelon",
      developments: [
        "Fully developed and ready for birth",
        "Skull bones not yet fused",
        "Immune system still developing",
        "Ready to meet you!"
      ],
      image: "/src/assets/fetal/week-40.jpg"
    }
  ];

  const getCurrentDevelopment = () => {
    const eligible = fetalDevelopmentData.filter(dev => dev.week <= selectedWeek);
    return eligible.length > 0 ? eligible[eligible.length - 1] : fetalDevelopmentData[0];
  };
  
  const navigateWeek = (direction: 'prev' | 'next') => {
    const availableWeeks = fetalDevelopmentData.map(dev => dev.week);
    const currentIndex = availableWeeks.indexOf(getCurrentDevelopment().week);
    
    if (direction === 'prev' && currentIndex > 0) {
      setSelectedWeek(availableWeeks[currentIndex - 1]);
    } else if (direction === 'next' && currentIndex < availableWeeks.length - 1) {
      setSelectedWeek(availableWeeks[currentIndex + 1]);
    }
  };
  
  const currentDev = getCurrentDevelopment();
  const availableWeeks = fetalDevelopmentData.map(dev => dev.week);
  const currentIndex = availableWeeks.indexOf(currentDev.week);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-rose-800 dark:text-rose-200 flex items-center gap-2">
          <Baby className="h-4 w-4" />
          Fetal Growth Tracker
        </h3>
        <Badge variant="secondary" className="bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-100 text-xs px-2 py-0.5">
          Week {selectedWeek}
        </Badge>
      </div>

      {/* Pregnancy Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Pregnancy Progress</span>
          <span>{Math.round((Math.min(selectedWeek, 40) / 40) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-rose-500 to-pink-500 h-2 rounded-full transition-all"
            style={{ width: `${Math.min((Math.min(selectedWeek, 40) / 40) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Current Development Display - Always Visible */}
      <div className="text-center space-y-2">
        <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-rose-200/50 to-pink-300/50 dark:from-rose-900/30 dark:to-pink-900/30 backdrop-blur-sm border-4 border-rose-300/50 dark:border-rose-700/50 shadow-lg relative">
          <img
            src={getImageForWeek(selectedWeek)}
            alt={`Fetal development at week ${Math.min(selectedWeek, 40)}`}
            className="w-full h-full object-cover opacity-90 mix-blend-multiply dark:mix-blend-lighten relative z-10"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="space-y-1">
          <p className="text-sm text-rose-600 dark:text-rose-300 font-medium">
            {currentDev.comparison}
          </p>
          <div className="flex justify-center gap-3 text-xs">
            <div className="flex items-center gap-1">
              <Ruler className="h-3.5 w-3.5 text-rose-500" />
              <span className="font-medium text-foreground">{currentDev.size}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-3.5 w-3.5 text-pink-500" />
              <span className="font-medium text-foreground">{currentDev.weight}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Show More Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowDetails(!showDetails)}
        className="w-full h-8 text-xs"
      >
        {showDetails ? 'Show Less' : 'Show More Details'}
      </Button>

      {/* Collapsible Details */}
      {showDetails && (
        <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2">
          {/* Week Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateWeek('prev')}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            
            <div className="flex gap-1 flex-wrap justify-center">
              {availableWeeks.map((week) => (
                <Button
                  key={week}
                  variant={selectedWeek === week ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedWeek(week)}
                  className="text-xs px-2 py-1 h-8"
                >
                  {week}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateWeek('next')}
              disabled={currentIndex === availableWeeks.length - 1}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          {/* Weekly Details */}
          <div className="text-center space-y-1">
            <h4 className="text-lg font-bold text-rose-800 dark:text-rose-200">
              Week {currentDev.week}
            </h4>
          </div>

          {/* Development Milestones */}
          <div className="space-y-2">
            <h4 className="font-semibold text-rose-800 dark:text-rose-200 flex items-center gap-2 text-sm">
              <Brain className="h-4 w-4" />
              Development This Week
            </h4>
            <div className="grid gap-2">
              {currentDev.developments.map((development, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-2 bg-white/60 dark:bg-rose-950/20 rounded-lg backdrop-blur-sm border border-rose-200/50 dark:border-rose-800/50"
                >
                  <div className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-1.5 flex-shrink-0" />
                  <p className="text-xs text-gray-700 dark:text-gray-300">{development}</p>
                </div>
              ))}
            </div>
          </div>

          {selectedWeek === currentWeek && (
            <div className="p-2 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-2 text-rose-800 dark:text-rose-200">
                <Eye className="h-3 w-3" />
                <span className="font-semibold text-xs">This is your current week!</span>
              </div>
            </div>
          )}

          <p className="text-xs text-muted-foreground text-center">
            Every pregnancy is unique. These are general milestones.
          </p>
        </div>
      )}
    </div>
  );
};