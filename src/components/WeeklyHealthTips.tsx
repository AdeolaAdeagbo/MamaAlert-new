
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

interface HealthTip {
  week: number;
  title: string;
  content: string;
  category: string;
}

interface WeeklyHealthTipsProps {
  pregnancyWeek: number;
}

export const WeeklyHealthTips = ({ pregnancyWeek }: WeeklyHealthTipsProps) => {
  const [currentTip, setCurrentTip] = useState<HealthTip | null>(null);

  const healthTips: HealthTip[] = [
    {
      week: 4,
      title: "Early Pregnancy Care",
      content: "Start taking prenatal vitamins with folic acid. Avoid alcohol, smoking, and limit caffeine. Schedule your first prenatal appointment.",
      category: "Nutrition & Health"
    },
    {
      week: 8,
      title: "Managing Morning Sickness",
      content: "Eat small, frequent meals. Keep crackers by your bedside. Ginger tea may help reduce nausea. Stay hydrated.",
      category: "Symptom Management"
    },
    {
      week: 12,
      title: "End of First Trimester",
      content: "Morning sickness should start to improve. You may want to share your pregnancy news. Continue prenatal vitamins.",
      category: "Milestones"
    },
    {
      week: 16,
      title: "Second Trimester Begins",
      content: "Energy levels should improve. Start thinking about maternity clothes. You might feel baby's first movements soon.",
      category: "Development"
    },
    {
      week: 20,
      title: "Anatomy Scan Week",
      content: "This is typically when you'll have your detailed ultrasound. You can find out the baby's sex if you want to know.",
      category: "Medical Care"
    },
    {
      week: 24,
      title: "Glucose Screening",
      content: "You'll likely have glucose screening for gestational diabetes. Baby's hearing is developing - talk and sing to your bump!",
      category: "Medical Care"
    },
    {
      week: 28,
      title: "Third Trimester Preparation",
      content: "Start thinking about your birth plan. Consider childbirth classes. Monitor baby's movements daily.",
      category: "Birth Preparation"
    },
    {
      week: 32,
      title: "Baby Shower Time",
      content: "Perfect time for baby showers. Start preparing the nursery. Practice relaxation techniques for labor.",
      category: "Preparation"
    },
    {
      week: 36,
      title: "Final Preparations",
      content: "Baby is considered full-term at 37 weeks. Pack your hospital bag. Review your birth plan with your partner.",
      category: "Birth Preparation"
    },
    {
      week: 40,
      title: "Due Date Approaches",
      content: "Stay active but rest when needed. Watch for signs of labor. Remember, babies can arrive 2 weeks before or after due date.",
      category: "Labor & Delivery"
    }
  ];

  useEffect(() => {
    // Find the most relevant tip for current pregnancy week
    const relevantTip = healthTips.reduce((closest, tip) => {
      if (!closest) return tip;
      
      const currentDiff = Math.abs(pregnancyWeek - tip.week);
      const closestDiff = Math.abs(pregnancyWeek - closest.week);
      
      return currentDiff < closestDiff ? tip : closest;
    }, null as HealthTip | null);

    setCurrentTip(relevantTip);
  }, [pregnancyWeek]);

  if (!currentTip) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-500" />
            Weekly Health Tip
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Add your pregnancy details to get personalized weekly health tips!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-rose-500" />
          Week {currentTip.week} Health Tip
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-4 bg-rose-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-rose-800">{currentTip.title}</h4>
            <span className="text-xs bg-rose-200 text-rose-700 px-2 py-1 rounded">
              {currentTip.category}
            </span>
          </div>
          <p className="text-sm text-rose-700">
            {currentTip.content}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
