
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Calendar } from "lucide-react";

interface HealthTip {
  week: number;
  day: number;
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
  const [dayOfWeek, setDayOfWeek] = useState(0);

  const healthTips: HealthTip[] = [
    // Week 1-4 tips (7 daily tips per week)
    { week: 1, day: 1, title: "Start Folic Acid", content: "Begin taking 400-800 mcg of folic acid daily to prevent neural tube defects.", category: "Nutrition" },
    { week: 1, day: 2, title: "Track Your Cycle", content: "Start monitoring your ovulation and menstrual cycle if trying to conceive.", category: "Planning" },
    { week: 1, day: 3, title: "Avoid Harmful Substances", content: "Stop smoking, alcohol, and recreational drugs before conception.", category: "Health" },
    { week: 1, day: 4, title: "Healthy Diet Start", content: "Begin eating a balanced diet rich in fruits, vegetables, and whole grains.", category: "Nutrition" },
    { week: 1, day: 5, title: "Exercise Routine", content: "Maintain regular moderate exercise like walking or swimming.", category: "Fitness" },
    { week: 1, day: 6, title: "Reduce Caffeine", content: "Limit caffeine intake to less than 200mg per day (about 1-2 cups of coffee).", category: "Nutrition" },
    { week: 1, day: 7, title: "Stress Management", content: "Practice relaxation techniques like meditation or gentle yoga.", category: "Wellness" },
    
    { week: 4, day: 1, title: "Prenatal Vitamins", content: "Continue prenatal vitamins daily with at least 400 mcg folic acid.", category: "Nutrition" },
    { week: 4, day: 2, title: "Schedule First Visit", content: "Book your first prenatal appointment for weeks 8-10.", category: "Medical Care" },
    { week: 4, day: 3, title: "Stay Hydrated", content: "Drink 8-10 glasses of water daily to support increased blood volume.", category: "Health" },
    { week: 4, day: 4, title: "Rest When Tired", content: "Listen to your body - fatigue is normal in early pregnancy.", category: "Wellness" },
    { week: 4, day: 5, title: "Avoid Raw Foods", content: "Skip raw fish, unpasteurized cheese, and undercooked meats.", category: "Food Safety" },
    { week: 4, day: 6, title: "Gentle Movement", content: "Continue light exercise unless advised otherwise by your doctor.", category: "Fitness" },
    { week: 4, day: 7, title: "Document Symptoms", content: "Keep a journal of symptoms to discuss at your first appointment.", category: "Tracking" },

    { week: 8, day: 1, title: "Morning Sickness Relief", content: "Eat small, frequent meals and keep crackers by your bedside.", category: "Symptom Relief" },
    { week: 8, day: 2, title: "Ginger Tea", content: "Try ginger tea or ginger candies to help reduce nausea.", category: "Natural Remedies" },
    { week: 8, day: 3, title: "Protein Intake", content: "Aim for 70-100g of protein daily from lean sources.", category: "Nutrition" },
    { week: 8, day: 4, title: "Avoid Strong Smells", content: "Stay away from triggers like perfumes or cooking odors that worsen nausea.", category: "Symptom Management" },
    { week: 8, day: 5, title: "First Ultrasound", content: "You may have your first ultrasound to check baby's heartbeat.", category: "Milestones" },
    { week: 8, day: 6, title: "Vitamin B6", content: "Ask your doctor about vitamin B6 supplements for nausea relief.", category: "Medical Care" },
    { week: 8, day: 7, title: "Fresh Air", content: "Take short walks in fresh air to help with nausea and fatigue.", category: "Wellness" },

    { week: 12, day: 1, title: "First Trimester Complete", content: "Congratulations! Miscarriage risk drops significantly after week 12.", category: "Milestone" },
    { week: 12, day: 2, title: "Share the News", content: "Many parents feel comfortable sharing pregnancy news after the first trimester.", category: "Personal" },
    { week: 12, day: 3, title: "Energy Returns", content: "You may start feeling less fatigued as your body adjusts.", category: "Physical Changes" },
    { week: 12, day: 4, title: "Dental Checkup", content: "Schedule a dental cleaning - gum disease can affect pregnancy.", category: "Medical Care" },
    { week: 12, day: 5, title: "Calcium Rich Foods", content: "Increase calcium intake to 1000mg daily for baby's bone development.", category: "Nutrition" },
    { week: 12, day: 6, title: "Maternity Clothes", content: "Start browsing maternity wear as your waistline expands.", category: "Preparation" },
    { week: 12, day: 7, title: "Kegel Exercises", content: "Begin pelvic floor exercises to strengthen muscles for delivery.", category: "Fitness" },

    { week: 16, day: 1, title: "Baby's Hearing", content: "Baby can now hear your voice - talk and sing to your bump!", category: "Development" },
    { week: 16, day: 2, title: "Iron-Rich Foods", content: "Boost iron intake with lean red meat, spinach, and fortified cereals.", category: "Nutrition" },
    { week: 16, day: 3, title: "Watch for Swelling", content: "Some swelling is normal, but report sudden swelling to your doctor.", category: "Symptom Monitoring" },
    { week: 16, day: 4, title: "Sleep Position", content: "Start sleeping on your left side to optimize blood flow to baby.", category: "Sleep" },
    { week: 16, day: 5, title: "Amniocentesis Option", content: "Discuss genetic testing options with your healthcare provider.", category: "Medical Testing" },
    { week: 16, day: 6, title: "Omega-3 Intake", content: "Eat fatty fish like salmon or take DHA supplements for brain development.", category: "Nutrition" },
    { week: 16, day: 7, title: "Stretch Mark Prevention", content: "Keep skin moisturized, though genetics play the biggest role.", category: "Self-Care" },

    { week: 20, day: 1, title: "Anatomy Scan Week", content: "Your detailed ultrasound will check baby's growth and organs.", category: "Medical Care" },
    { week: 20, day: 2, title: "Feel Baby Move", content: "Most mothers feel distinct movements by now - like butterflies or bubbles.", category: "Milestone" },
    { week: 20, day: 3, title: "Halfway Mark", content: "You're halfway through your pregnancy journey!", category: "Celebration" },
    { week: 20, day: 4, title: "Heartburn Management", content: "Eat smaller meals and avoid spicy foods to reduce acid reflux.", category: "Symptom Relief" },
    { week: 20, day: 5, title: "Stay Active", content: "Continue moderate exercise like prenatal yoga or swimming.", category: "Fitness" },
    { week: 20, day: 6, title: "Fiber Intake", content: "Increase fiber and water to prevent constipation.", category: "Nutrition" },
    { week: 20, day: 7, title: "Baby's Gender", content: "Find out baby's sex during the anatomy scan if you choose.", category: "Milestone" },

    { week: 24, day: 1, title: "Glucose Screening", content: "You'll be tested for gestational diabetes this week.", category: "Medical Testing" },
    { week: 24, day: 2, title: "Baby's Viability", content: "Baby is now considered viable with medical care if born early.", category: "Milestone" },
    { week: 24, day: 3, title: "Lung Development", content: "Baby's lungs are developing rapidly now.", category: "Development" },
    { week: 24, day: 4, title: "Braxton Hicks", content: "You may start feeling practice contractions - they're normal.", category: "Physical Changes" },
    { week: 24, day: 5, title: "Blood Sugar Control", content: "Eat balanced meals with protein to maintain steady blood sugar.", category: "Nutrition" },
    { week: 24, day: 6, title: "Back Pain Relief", content: "Use proper posture and consider a pregnancy support belt.", category: "Comfort" },
    { week: 24, day: 7, title: "Childbirth Classes", content: "Start researching and registering for childbirth education classes.", category: "Preparation" },

    { week: 28, day: 1, title: "Third Trimester!", content: "Welcome to the final stretch of your pregnancy.", category: "Milestone" },
    { week: 28, day: 2, title: "Kick Counts", content: "Start monitoring baby's movements - count 10 movements in 2 hours.", category: "Monitoring" },
    { week: 28, day: 3, title: "Tdap Vaccine", content: "Get the whooping cough vaccine to protect your newborn.", category: "Medical Care" },
    { week: 28, day: 4, title: "Baby's Sleep Cycles", content: "Baby now has regular sleep and wake patterns.", category: "Development" },
    { week: 28, day: 5, title: "Increase Checkups", content: "Prenatal visits increase to every 2 weeks now.", category: "Medical Schedule" },
    { week: 28, day: 6, title: "Breathing Exercises", content: "Practice deep breathing for labor pain management.", category: "Birth Prep" },
    { week: 28, day: 7, title: "Prepare Nursery", content: "Start setting up baby's nursery and washing baby clothes.", category: "Preparation" },

    { week: 32, day: 1, title: "Baby's Position", content: "Baby should be moving into head-down position soon.", category: "Development" },
    { week: 32, day: 2, title: "Hospital Tour", content: "Schedule a tour of your birthing facility.", category: "Preparation" },
    { week: 32, day: 3, title: "Birth Plan", content: "Start drafting your birth plan preferences.", category: "Planning" },
    { week: 32, day: 4, title: "Perineal Massage", content: "Consider perineal massage to reduce tearing risk.", category: "Birth Prep" },
    { week: 32, day: 5, title: "Baby's Brain", content: "Baby's brain is developing rapidly now.", category: "Development" },
    { week: 32, day: 6, title: "Pack Hospital Bag", content: "Start gathering items for your hospital bag.", category: "Preparation" },
    { week: 32, day: 7, title: "Rest More", content: "Take frequent breaks as your body works hard to support baby.", category: "Self-Care" },

    { week: 36, day: 1, title: "Full Term Soon", content: "Baby will be considered full-term at 37 weeks.", category: "Milestone" },
    { week: 36, day: 2, title: "Weekly Checkups", content: "Prenatal visits are now weekly until delivery.", category: "Medical Schedule" },
    { week: 36, day: 3, title: "Cervix Checks", content: "Your doctor may start checking cervical dilation.", category: "Medical Care" },
    { week: 36, day: 4, title: "Install Car Seat", content: "Have your car seat professionally inspected and installed.", category: "Safety" },
    { week: 36, day: 5, title: "Labor Signs", content: "Learn to recognize signs of labor: contractions, water breaking, bloody show.", category: "Education" },
    { week: 36, day: 6, title: "Finalize Birth Plan", content: "Review your birth plan with your partner and doctor.", category: "Planning" },
    { week: 36, day: 7, title: "Relaxation Practice", content: "Practice relaxation techniques daily for labor.", category: "Birth Prep" },

    { week: 40, day: 1, title: "Due Date Week", content: "Your due date is this week - but babies come when they're ready!", category: "Milestone" },
    { week: 40, day: 2, title: "Stay Active", content: "Walking can help encourage labor naturally.", category: "Activity" },
    { week: 40, day: 3, title: "Labor Patience", content: "Only 5% of babies arrive on their due date - be patient.", category: "Mindset" },
    { week: 40, day: 4, title: "Monitor Movements", content: "Continue counting kicks - baby should still be active.", category: "Monitoring" },
    { week: 40, day: 5, title: "Membrane Sweep", content: "Ask about membrane sweep if going past due date.", category: "Medical Options" },
    { week: 40, day: 6, title: "Stay Hydrated", content: "Keep drinking plenty of water for labor preparation.", category: "Health" },
    { week: 40, day: 7, title: "Trust Your Body", content: "Your body knows how to birth your baby - trust the process.", category: "Encouragement" }
  ];

  useEffect(() => {
    // Get current day of week (0-6, where 0 is Sunday)
    const today = new Date().getDay();
    // Convert to 1-7 (Monday = 1, Sunday = 7)
    const dayNum = today === 0 ? 7 : today;
    setDayOfWeek(dayNum);

    // Find tips for current pregnancy week
    const weekTips = healthTips.filter(tip => tip.week === pregnancyWeek);
    
    if (weekTips.length > 0) {
      // Find today's tip or fall back to closest available
      let todayTip = weekTips.find(tip => tip.day === dayNum);
      
      if (!todayTip) {
        // If no tip for today, find closest week match
        todayTip = weekTips[0];
      }
      
      setCurrentTip(todayTip);
    } else {
      // Find closest week if no exact match
      const closestTip = healthTips.reduce((closest, tip) => {
        if (!closest) return tip;
        const currentDiff = Math.abs(pregnancyWeek - tip.week);
        const closestDiff = Math.abs(pregnancyWeek - closest.week);
        return currentDiff < closestDiff ? tip : closest;
      }, null as HealthTip | null);
      
      setCurrentTip(closestTip);
    }
  }, [pregnancyWeek]);

  if (!currentTip) {
    return (
      <div className="space-y-3">
        <h3 className="text-base font-semibold flex items-center gap-2">
          <Heart className="h-4 w-4 text-rose-500" />
          Weekly Health Tip
        </h3>
        <p className="text-muted-foreground text-sm">
          Add your pregnancy details to get personalized weekly health tips!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h3 className="text-base font-semibold flex items-center gap-2">
          <Heart className="h-4 w-4 text-rose-500" />
          Daily Health Tip
        </h3>
        <Calendar className="h-4 w-4 text-primary" />
      </div>
      <div className="p-3 bg-rose-50 dark:bg-rose-950/30 rounded-lg border border-rose-100 dark:border-rose-900">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-sm text-rose-800 dark:text-rose-200">{currentTip.title}</h4>
          <span className="text-xs bg-rose-200 dark:bg-rose-900 text-rose-700 dark:text-rose-100 px-2 py-1 rounded">
            {currentTip.category}
          </span>
        </div>
        <p className="text-xs text-rose-700 dark:text-rose-300">
          {currentTip.content}
        </p>
        {isProgressive && (
          <div className="mt-2 pt-2 border-t border-rose-200 dark:border-rose-900">
            <p className="text-xs text-rose-600 dark:text-rose-400">
              💡 New tip every day • Week {currentTip.week} • Day {dayOfWeek}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
