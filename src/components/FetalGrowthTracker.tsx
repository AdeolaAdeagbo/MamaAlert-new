import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePregnancyProgress } from "@/hooks/usePregnancyProgress";
import { Baby, Ruler, Heart, Eye, Brain, ChevronLeft, ChevronRight } from "lucide-react";

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
    if (currentWeek && currentWeek !== selectedWeek) {
      setSelectedWeek(currentWeek);
    }
  }, [currentWeek]);

  const fetalDevelopmentData: FetalDevelopment[] = [
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
      image: "🍋"
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
      image: "🥑"
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
      image: "🍌"
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
      image: "🌽"
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
      image: "🍆"
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
      image: "🎃"
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
      image: "🥭"
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
      image: "🍉"
    }
  ];

  const getCurrentDevelopment = () => {
    return fetalDevelopmentData.find(dev => dev.week <= selectedWeek) || fetalDevelopmentData[0];
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const availableWeeks = fetalDevelopmentData.map(dev => dev.week);
    const currentIndex = availableWeeks.indexOf(selectedWeek);
    
    if (direction === 'prev' && currentIndex > 0) {
      setSelectedWeek(availableWeeks[currentIndex - 1]);
    } else if (direction === 'next' && currentIndex < availableWeeks.length - 1) {
      setSelectedWeek(availableWeeks[currentIndex + 1]);
    }
  };

  const currentDev = getCurrentDevelopment();
  const availableWeeks = fetalDevelopmentData.map(dev => dev.week);
  const currentIndex = availableWeeks.indexOf(selectedWeek);

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
          <Baby className="h-5 w-5" />
          Fetal Growth Tracker
          <Badge variant="secondary" className="ml-auto">
            Week {selectedWeek}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
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
          <div className="text-6xl">{currentDev.image}</div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-blue-800 dark:text-blue-200">
              Week {currentDev.week}
            </h3>
            <p className="text-lg text-blue-600 dark:text-blue-300 font-medium">
              {currentDev.comparison}
            </p>
            <div className="flex justify-center gap-6 text-sm">
              <div className="flex items-center gap-1">
                <Ruler className="h-4 w-4 text-blue-500" />
                <span className="font-medium">{currentDev.size}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4 text-pink-500" />
                <span className="font-medium">{currentDev.weight}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Development Milestones */}
        <div className="space-y-3">
          <h4 className="font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Development This Week
          </h4>
          <div className="grid gap-2">
            {currentDev.developments.map((development, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg"
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-gray-700 dark:text-gray-300">{development}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Pregnancy Progress</span>
            <span>{Math.round((selectedWeek / 40) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
              style={{ width: `${(selectedWeek / 40) * 100}%` }}
            />
          </div>
        </div>

        {selectedWeek === currentWeek && (
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
              <Eye className="h-4 w-4" />
              <span className="font-semibold text-sm">This is your current week!</span>
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
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