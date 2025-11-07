import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePregnancyProgress } from "@/hooks/usePregnancyProgress";
import { Baby, Ruler, Heart, Eye, Brain, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

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
    <Card className="border-none shadow-none bg-gradient-to-b from-primary/5 via-background to-background overflow-hidden">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl flex items-center gap-3">
            <Heart className="h-8 w-8 text-rose-500 fill-rose-500 animate-pulse" />
            Your Baby's Journey
          </CardTitle>
          {currentWeek && (
            <Badge variant="secondary" className="text-base px-4 py-1.5">
              Week {currentWeek}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6 pb-6">
        {/* Progress */}
        {currentWeek && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium text-foreground">
              <span>Pregnancy Progress</span>
              <span>{currentWeek} of 40 weeks</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-rose-500 to-pink-500 h-2 rounded-full transition-all"
                style={{ width: `${Math.min((Math.min(selectedWeek, 40) / 40) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Baby Image & Stats - Enhanced */}
        <div className="relative bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 rounded-2xl p-6 shadow-medium">
          <div className="flex flex-col gap-4">
            <div className="mx-auto">
              <img 
                src={getImageForWeek(selectedWeek)}
                alt={`Week ${selectedWeek} fetal development`}
                className="w-40 h-40 rounded-2xl object-cover shadow-large ring-2 ring-primary/10"
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Heart className="h-4 w-4 text-rose-500 fill-rose-500 animate-pulse" />
                <p className="text-base text-foreground font-semibold text-center">
                  About the size of <span className="text-primary">{currentDev.comparison}</span>
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-background/50 rounded-xl p-3 text-center backdrop-blur-sm">
                  <div className="text-xs text-muted-foreground mb-1">Length</div>
                  <div className="text-lg font-bold text-foreground">{currentDev.size}</div>
                </div>
                <div className="bg-background/50 rounded-xl p-3 text-center backdrop-blur-sm">
                  <div className="text-xs text-muted-foreground mb-1">Weight</div>
                  <div className="text-lg font-bold text-foreground">{currentDev.weight}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Week Calendar Navigation */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateWeek('prev')}
              disabled={selectedWeek <= 4}
            >
              ← Previous Week
            </Button>
            <span className="text-sm font-medium text-foreground">Week {selectedWeek}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateWeek('next')}
              disabled={selectedWeek >= 40}
            >
              Next Week →
            </Button>
          </div>
          
          <div className="grid grid-cols-9 gap-1">
            {[4, 8, 12, 16, 20, 24, 28, 32, 36, 40].map((week) => (
              <button
                key={week}
                onClick={() => setSelectedWeek(week)}
                className={`h-10 rounded-lg text-xs font-medium transition-all ${
                  selectedWeek === week
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : week === currentWeek
                    ? 'bg-primary/20 text-primary border-2 border-primary'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {week}
              </button>
            ))}
          </div>
        </div>

        {/* Show Details Button */}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? "Hide Development Details" : "View What's Happening"}
        </Button>

        {showDetails && (
          <div className="space-y-4 animate-fade-in bg-gradient-to-b from-background to-primary/5 rounded-2xl p-4 border border-primary/10">
            {/* Development Details */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                What's happening this week
              </h4>
              <ul className="space-y-2">
                {getCurrentDevelopment().developments.map((dev, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
                    <span className="text-primary mt-1">•</span>
                    <span>{dev}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Disclaimer */}
            <div className="bg-background/80 rounded-xl p-3 border border-border/50">
              <p className="text-xs text-muted-foreground italic leading-relaxed">
                💛 Every pregnancy is unique. These milestones are general guidelines. 
                Always consult your healthcare provider for personalized information.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};