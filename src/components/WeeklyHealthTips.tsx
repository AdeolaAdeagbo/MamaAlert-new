
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, TrendingUp } from "lucide-react";

interface HealthTip {
  week: number;
  title: string;
  content: string;
  category: string;
}

interface WeeklyHealthTipsProps {
  pregnancyWeek: number;
  isProgressive?: boolean;
}

export const WeeklyHealthTips = ({ pregnancyWeek, isProgressive = true }: WeeklyHealthTipsProps) => {
  const [currentTip, setCurrentTip] = useState<HealthTip | null>(null);

  const healthTips: HealthTip[] = [
    {
      week: 1,
      title: "Conception & Early Days",
      content: "Your pregnancy journey begins! Start taking folic acid supplements and maintain a healthy lifestyle. Avoid alcohol, smoking, and limit caffeine intake.",
      category: "Early Pregnancy"
    },
    {
      week: 4,
      title: "Early Pregnancy Care",
      content: "Start taking prenatal vitamins with folic acid. Avoid alcohol, smoking, and limit caffeine. Schedule your first prenatal appointment.",
      category: "Nutrition & Health"
    },
    {
      week: 6,
      title: "First Prenatal Visit",
      content: "Time for your first doctor's visit! Discuss your medical history, get blood tests, and start establishing your prenatal care routine.",
      category: "Medical Care"
    },
    {
      week: 8,
      title: "Managing Morning Sickness",
      content: "Eat small, frequent meals. Keep crackers by your bedside. Ginger tea may help reduce nausea. Stay hydrated and rest when needed.",
      category: "Symptom Management"
    },
    {
      week: 10,
      title: "Genetic Screening Options",
      content: "Discuss genetic screening tests with your doctor. These can help identify potential chromosomal abnormalities early in pregnancy.",
      category: "Medical Testing"
    },
    {
      week: 12,
      title: "End of First Trimester",
      content: "Morning sickness should start to improve. You may want to share your pregnancy news. Continue prenatal vitamins and maintain regular checkups.",
      category: "Milestones"
    },
    {
      week: 14,
      title: "Second Trimester Energy",
      content: "Welcome to the 'golden period'! Energy levels typically improve. Start thinking about maternity clothes and gentle exercise routines.",
      category: "Lifestyle"
    },
    {
      week: 16,
      title: "Baby's Development",
      content: "Baby's nervous system is developing rapidly. You might feel baby's first movements soon. Continue eating nutritious foods rich in omega-3 fatty acids.",
      category: "Development"
    },
    {
      week: 18,
      title: "Preparing for Movement",
      content: "Start paying attention to baby's movements. Some first-time mothers may begin to feel fluttering sensations around this time.",
      category: "Development"
    },
    {
      week: 20,
      title: "Anatomy Scan Week",
      content: "This is typically when you'll have your detailed ultrasound. You can find out the baby's sex if you want to know. Baby's organs are developing rapidly.",
      category: "Medical Care"
    },
    {
      week: 22,
      title: "Healthy Weight Gain",
      content: "Monitor your weight gain with your healthcare provider. Focus on nutrient-dense foods rather than 'eating for two' in terms of calories.",
      category: "Nutrition"
    },
    {
      week: 24,
      title: "Glucose Screening",
      content: "You'll likely have glucose screening for gestational diabetes. Baby's hearing is developing - talk and sing to your bump! Baby is now viable outside the womb.",
      category: "Medical Care"
    },
    {
      week: 26,
      title: "Third Trimester Prep",
      content: "Start thinking about childbirth classes and your birth plan. Baby's lungs are developing, and movements are becoming stronger.",
      category: "Preparation"
    },
    {
      week: 28,
      title: "Third Trimester Begins",
      content: "Start monitoring baby's movements daily. Consider childbirth classes. You may start feeling Braxton Hicks contractions. Get the whooping cough vaccine.",
      category: "Birth Preparation"
    },
    {
      week: 30,
      title: "Baby Shower Planning", 
      content: "Perfect time for baby showers. Start preparing the nursery. Practice relaxation techniques for labor. Baby's brain is developing rapidly.",
      category: "Preparation"
    },
    {
      week: 32,
      title: "Baby Position Monitoring",
      content: "Baby should be settling into head-down position soon. Continue monitoring movements. Start thinking about breastfeeding and newborn care.",
      category: "Preparation"
    },
    {
      week: 34,
      title: "Premature Labor Awareness",
      content: "Learn the signs of premature labor. Baby's lungs are maturing. Start packing your hospital bag and finalizing birth plans.",
      category: "Birth Preparation"
    },
    {
      week: 36,
      title: "Term Preparation",
      content: "Baby is considered full-term at 37 weeks. Pack your hospital bag. Review your birth plan with your partner. Baby's immune system is developing.",
      category: "Birth Preparation"
    },
    {
      week: 38,
      title: "Final Preparations",
      content: "Your cervix may start to soften and dilate. Practice breathing exercises. Ensure car seat is installed. Baby is gaining weight for birth.",
      category: "Labor Preparation"
    },
    {
      week: 40,
      title: "Due Date Approaches",
      content: "Stay active but rest when needed. Watch for signs of labor: contractions, water breaking, bloody show. Remember, babies can arrive 2 weeks before or after due date.",
      category: "Labor & Delivery"
    },
    {
      week: 42,
      title: "Post-Term Monitoring",
      content: "Your doctor will monitor baby closely. Discuss induction options if necessary. Stay calm and trust your healthcare team's guidance.",
      category: "Medical Monitoring"
    }
  ];

  useEffect(() => {
    // Find the most relevant tip for current pregnancy week
    const relevantTip = healthTips.find(tip => tip.week === pregnancyWeek) 
      || healthTips.reduce((closest, tip) => {
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
          {isProgressive ? (
            <div className="flex items-center gap-2">
              <span>Week {currentTip.week} Health Tip</span>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
          ) : (
            `Week ${currentTip.week} Health Tip`
          )}
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
          {isProgressive && (
            <div className="mt-3 pt-2 border-t border-rose-200">
              <p className="text-xs text-rose-600">
                Tips automatically update based on your pregnancy progress
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
