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
    <Card className="relative overflow-hidden bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100 dark:from-rose-950/30 dark:via-pink-950/20 dark:to-purple-950/30 border-rose-200 dark:border-rose-800">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose-200/20 via-transparent to-transparent dark:from-rose-900/20 pointer-events-none" />
      <CardHeader className="pb-4 relative z-10">
        <CardTitle className="flex items-center gap-2 text-rose-800 dark:text-rose-200">
          <Baby className="h-5 w-5" />
          Fetal Growth Tracker
          <Badge variant="secondary" className="ml-auto bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-100">
            Week {selectedWeek}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 relative z-10">
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
          
          <div className="flex gap-1">
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

        {/* Current Development Display */}
        <div className="text-center space-y-4">
          <div className="w-64 h-64 mx-auto rounded-lg overflow-hidden bg-black border-4 border-gray-800 dark:border-gray-600 shadow-2xl relative">
            <div className="absolute top-2 left-2 text-xs font-mono text-green-400 z-20">
              WEEK {selectedWeek}
            </div>
            <div className="absolute top-2 right-2 text-xs font-mono text-green-400 z-20">
              {currentDev.size}
            </div>
            <img
              src={getImageForWeek(selectedWeek)}
              alt={`Ultrasound scan of fetal development at week ${Math.min(selectedWeek, 40)}`}
              className="w-full h-full object-cover grayscale contrast-125 brightness-110 relative z-10"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute bottom-2 left-2 text-xs font-mono text-green-400 z-20">
              {currentDev.weight}
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-rose-800 dark:text-rose-200">
              Week {currentDev.week}
            </h3>
            <p className="text-lg text-rose-600 dark:text-rose-300 font-medium">
              {currentDev.comparison}
            </p>
            <div className="flex justify-center gap-6 text-sm">
              <div className="flex items-center gap-1">
                <Ruler className="h-4 w-4 text-rose-500" />
                <span className="font-medium text-foreground">{currentDev.size}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4 text-pink-500" />
                <span className="font-medium text-foreground">{currentDev.weight}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Development Milestones */}
        <div className="space-y-3">
          <h4 className="font-semibold text-rose-800 dark:text-rose-200 flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Development This Week
          </h4>
          <div className="grid gap-2">
            {currentDev.developments.map((development, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-white/60 dark:bg-rose-950/20 rounded-lg backdrop-blur-sm border border-rose-200/50 dark:border-rose-800/50"
              >
                <div className="w-2 h-2 bg-rose-500 rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-gray-700 dark:text-gray-300">{development}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
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

        {selectedWeek === currentWeek && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 rounded-lg backdrop-blur-sm">
            <div className="flex items-center gap-2 text-rose-800 dark:text-rose-200">
              <Eye className="h-4 w-4" />
              <span className="font-semibold text-sm">This is your current week!</span>
            </div>
            <p className="text-xs text-rose-700 dark:text-rose-300 mt-1">
              Your baby is developing these amazing features right now.
            </p>
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center">
          Every pregnancy is unique. These are general milestones - your baby may develop at their own pace.
        </p>
      </CardContent>
    </Card>
  );
};