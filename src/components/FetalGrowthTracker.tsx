import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePregnancyProgress } from "@/hooks/usePregnancyProgress";
import { Heart, Sparkles, ChevronDown, ChevronUp } from "lucide-react";

// Dynamically load fetal images week-by-week
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
  comparisonIcon: string;
  developments: string[];
  milestoneTitle: string;
}

interface FetalGrowthTrackerProps {
  userId: string;
}

export const FetalGrowthTracker = ({ userId }: FetalGrowthTrackerProps) => {
  const { pregnancyData, currentWeek } = usePregnancyProgress(userId);
  const [selectedWeek, setSelectedWeek] = useState(currentWeek || 12);
  const [showMilestones, setShowMilestones] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

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
      weight: "0.5 g",
      comparison: "Poppy Seed",
      comparisonIcon: "🌾",
      milestoneTitle: "Early Beginnings",
      developments: [
        "Embryo implants in uterus",
        "Cells dividing rapidly",
        "Amniotic sac forming",
        "Placenta begins to develop"
      ]
    },
    {
      week: 8,
      size: "1.6 cm",
      weight: "1 g",
      comparison: "Raspberry",
      comparisonIcon: "🫐",
      milestoneTitle: "Heartbeat Detected",
      developments: [
        "Heart is beating steadily",
        "Arms and legs are growing",
        "Facial features developing",
        "Major organs forming"
      ]
    },
    {
      week: 12,
      size: "6 cm",
      weight: "14 g",
      comparison: "Lime",
      comparisonIcon: "🍋",
      milestoneTitle: "First Trimester Complete",
      developments: [
        "Fingerprints are forming",
        "Baby can make fists",
        "Reflexes are developing",
        "Kidneys start producing urine"
      ]
    },
    {
      week: 16,
      size: "11 cm",
      weight: "100 g",
      comparison: "Avocado",
      comparisonIcon: "🥑",
      milestoneTitle: "Hearing Your Voice",
      developments: [
        "Baby can hear your voice",
        "Facial muscles can squint and frown",
        "Heart pumps 25 quarts of blood daily",
        "Skeleton changing from cartilage to bone"
      ]
    },
    {
      week: 20,
      size: "16 cm",
      weight: "300 g",
      comparison: "Banana",
      comparisonIcon: "🍌",
      milestoneTitle: "Halfway There!",
      developments: [
        "Baby can swallow and hear",
        "Hair and nails are growing",
        "You may feel first movements",
        "Genitals are fully formed"
      ]
    },
    {
      week: 24,
      size: "21 cm",
      weight: "600 g",
      comparison: "Corn",
      comparisonIcon: "🌽",
      milestoneTitle: "Rapid Brain Growth",
      developments: [
        "Lungs are developing rapidly",
        "Brain tissue increases",
        "Baby responds to sound",
        "Footprints and fingerprints form"
      ]
    },
    {
      week: 28,
      size: "25 cm",
      weight: "1000 g",
      comparison: "Eggplant",
      comparisonIcon: "🍆",
      milestoneTitle: "Third Trimester!",
      developments: [
        "Eyes can open and close",
        "Sleep cycles develop",
        "Brain tissue continues developing",
        "Can recognize your voice"
      ]
    },
    {
      week: 32,
      size: "28 cm",
      weight: "1700 g",
      comparison: "Squash",
      comparisonIcon: "🎃",
      milestoneTitle: "Bones Hardening",
      developments: [
        "Bones are hardening",
        "Lots of sleeping",
        "Rapid weight gain begins",
        "Toenails and fingernails grow"
      ]
    },
    {
      week: 36,
      size: "32 cm",
      weight: "2600 g",
      comparison: "Papaya",
      comparisonIcon: "🥭",
      milestoneTitle: "Almost Ready",
      developments: [
        "Lungs are nearly mature",
        "Baby gains about ½ pound per week",
        "Getting ready for birth",
        "Digestive system nearly mature"
      ]
    },
    {
      week: 40,
      size: "36 cm",
      weight: "3300 g",
      comparison: "Watermelon",
      comparisonIcon: "🍉",
      milestoneTitle: "Ready to Meet You!",
      developments: [
        "Fully developed and ready for birth",
        "Skull bones not yet fused",
        "Immune system still developing",
        "Any day now, mama!"
      ]
    }
  ];

  const getCurrentDevelopment = () => {
    const eligible = fetalDevelopmentData.filter(dev => dev.week <= selectedWeek);
    return eligible.length > 0 ? eligible[eligible.length - 1] : fetalDevelopmentData[0];
  };

  const handleWeekChange = (week: number) => {
    setIsAnimating(true);
    setSelectedWeek(week);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const currentDev = getCurrentDevelopment();
  const progressPercentage = Math.min((selectedWeek / 40) * 100, 100);
  const circumference = 2 * Math.PI * 120; // radius = 120
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  return (
    <Card className="border-none shadow-none bg-transparent overflow-visible">
      <CardContent className="p-0 space-y-6">
        {/* Circular Fetal Tracker - Flo Style */}
        <div className="relative flex items-center justify-center py-8">
          {/* Background Gradient Glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-rose-500/5 via-pink-500/5 to-transparent rounded-3xl blur-3xl" />
          
          {/* SVG Progress Ring */}
          <div className="relative">
            <svg className="transform -rotate-90" width="300" height="300">
              {/* Background circle */}
              <circle
                cx="150"
                cy="150"
                r="120"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-muted/20"
              />
              
              {/* Progress circle */}
              <circle
                cx="150"
                cy="150"
                r="120"
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
              />
              
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(348, 86%, 65%)" />
                  <stop offset="100%" stopColor="hsl(340, 82%, 75%)" />
                </linearGradient>
              </defs>
            </svg>

            {/* Floating Fetus in Amniotic Bubble */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-48 h-48">
                {/* Amniotic bubble effect - multiple layers */}
                <div className="absolute inset-0 bg-gradient-to-br from-rose-400/10 via-pink-300/15 to-rose-500/10 rounded-full blur-xl animate-bubble-pulse" />
                <div className="absolute inset-2 bg-gradient-to-br from-pink-200/20 via-rose-100/25 to-pink-300/20 rounded-full blur-lg animate-bubble-pulse" style={{ animationDelay: '1s' }} />
                
                {/* Fetus Image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`relative w-32 h-32 transition-all duration-500 ${isAnimating ? 'scale-95 opacity-50' : 'animate-fetus-float'}`}>
                    <img 
                      src={getImageForWeek(selectedWeek)}
                      alt={`Week ${selectedWeek} fetal development`}
                      className="w-full h-full object-contain drop-shadow-2xl filter brightness-110"
                    />
                    
                    {/* Subtle light reflection */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-full pointer-events-none" />
                  </div>
                </div>

                {/* Floating sparkles */}
                <Sparkles className="absolute top-4 right-4 w-4 h-4 text-rose-400 animate-pulse" />
                <Heart className="absolute bottom-6 left-6 w-3 h-3 text-pink-400 fill-pink-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
              </div>
            </div>

            {/* Week Counter Badge */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-2 rounded-full shadow-lg">
              <span className="text-sm font-semibold">Week {selectedWeek}</span>
            </div>
          </div>
        </div>

        {/* Gestational Progress Text */}
        <div className="text-center space-y-1 pt-4">
          <p className="text-sm text-muted-foreground">Your pregnancy journey</p>
          <p className="text-2xl font-bold text-foreground">{selectedWeek} of 40 weeks</p>
        </div>

        {/* Baby Size Comparison Card */}
        <div className={`bg-gradient-to-br from-rose-50/50 to-pink-50/50 dark:from-rose-950/20 dark:to-pink-950/20 rounded-3xl p-6 space-y-4 backdrop-blur-sm border border-rose-200/30 dark:border-rose-800/30 ${isAnimating ? '' : 'animate-milestone-pop'}`}>
          <div className="text-center space-y-3">
            <div className="text-5xl">{currentDev.comparisonIcon}</div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Your baby is about the size of</p>
              <p className="text-2xl font-bold text-foreground">{currentDev.comparison}</p>
            </div>
          </div>

          {/* Size Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-background/60 backdrop-blur-sm rounded-2xl p-4 text-center border border-border/50">
              <div className="text-xs text-muted-foreground mb-1 font-medium">Length</div>
              <div className="text-xl font-bold text-foreground">{currentDev.size}</div>
            </div>
            <div className="bg-background/60 backdrop-blur-sm rounded-2xl p-4 text-center border border-border/50">
              <div className="text-xs text-muted-foreground mb-1 font-medium">Weight</div>
              <div className="text-xl font-bold text-foreground">{currentDev.weight}</div>
            </div>
          </div>

          {/* Milestone Title */}
          <div className="text-center pt-2">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500/10 to-pink-500/10 px-4 py-2 rounded-full border border-rose-200/30 dark:border-rose-800/30">
              <Sparkles className="w-4 h-4 text-rose-500" />
              <span className="text-sm font-semibold text-foreground">{currentDev.milestoneTitle}</span>
            </div>
          </div>
        </div>

        {/* Week Navigation Calendar */}
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground text-center">Jump to a week</p>
          <div className="grid grid-cols-5 gap-2">
            {[4, 8, 12, 16, 20, 24, 28, 32, 36, 40].map((week) => (
              <button
                key={week}
                onClick={() => handleWeekChange(week)}
                className={`h-12 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  selectedWeek === week
                    ? 'bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-lg scale-105'
                    : week === currentWeek
                    ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-2 border-rose-500'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:scale-105'
                }`}
              >
                {week}
              </button>
            ))}
          </div>
        </div>

        {/* Milestones Toggle */}
        <Button
          variant="ghost"
          className="w-full flex items-center justify-center gap-2 text-primary hover:text-primary hover:bg-primary/5"
          onClick={() => setShowMilestones(!showMilestones)}
        >
          <span className="font-semibold">
            {showMilestones ? "Hide" : "Show"} Development Milestones
          </span>
          {showMilestones ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>

        {/* Milestones Expansion */}
        {showMilestones && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-gradient-to-br from-background to-primary/5 rounded-2xl p-6 border border-primary/10 space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-primary" />
                <h4 className="text-base font-bold text-foreground">What's happening this week</h4>
              </div>
              
              <ul className="space-y-3">
                {currentDev.developments.map((dev, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="leading-relaxed">{dev}</span>
                  </li>
                ))}
              </ul>

              {/* Gentle Disclaimer */}
              <div className="mt-6 pt-4 border-t border-border/50">
                <p className="text-xs text-muted-foreground italic leading-relaxed text-center">
                  💛 Every pregnancy is unique. These are general guidelines. 
                  Always consult your healthcare provider for personalized care.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
