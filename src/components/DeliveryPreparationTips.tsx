
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Clock, Heart } from "lucide-react";

interface DeliveryPreparationTipsProps {
  pregnancyWeek: number;
}

export const DeliveryPreparationTips = ({ pregnancyWeek }: DeliveryPreparationTipsProps) => {
  if (pregnancyWeek < 36) return null;

  const getDeliveryTips = () => {
    if (pregnancyWeek >= 40) {
      return {
        title: "Full Term - Labor Watch",
        urgency: "high",
        tips: [
          "Watch for signs of labor: regular contractions, water breaking, bloody show",
          "Time contractions - call doctor when they're 5 minutes apart for 1 hour",
          "Stay calm and trust your body - you're ready for this!",
          "Keep your hospital bag ready and transport arranged"
        ],
        emergencySigns: [
          "Severe bleeding",
          "Baby's movements have decreased significantly",
          "Severe headache with vision changes",
          "Intense abdominal pain that doesn't ease"
        ]
      };
    } else if (pregnancyWeek >= 38) {
      return {
        title: "Early Full Term - Final Preparations",
        urgency: "medium",
        tips: [
          "Practice breathing exercises and labor positions",
          "Finalize your birth plan and share with your partner",
          "Install and check car seat installation",
          "Prepare freezer meals for after delivery"
        ],
        emergencySigns: [
          "Regular contractions before 37 weeks",
          "Sudden gush of fluid (water breaking)",
          "Severe swelling in face and hands",
          "Persistent severe headaches"
        ]
      };
    } else {
      return {
        title: "Late Preterm - Delivery Preparation",
        urgency: "low",
        tips: [
          "Pack your hospital bag with essentials",
          "Learn the signs of premature labor",
          "Keep important documents ready",
          "Practice relaxation techniques"
        ],
        emergencySigns: [
          "Regular contractions before 37 weeks",
          "Bleeding or fluid leakage",
          "Severe abdominal pain",
          "Baby's movements decrease significantly"
        ]
      };
    }
  };

  const deliveryInfo = getDeliveryTips();

  const hospitalBagChecklist = [
    "Nigerian ID card and hospital cards",
    "Comfortable nightgowns and underwear",
    "Nursing bras and maternity pads",
    "Baby clothes (newborn and 0-3 months)",
    "Baby blankets and receiving cloths",
    "Phone charger and camera",
    "Snacks and drinks for labor",
    "Comfortable slippers and robe"
  ];

  const laborSigns = [
    "Regular contractions that get stronger and closer together",
    "Water breaking (clear or slightly pink fluid)",
    "Bloody show (mucus plug with blood)",
    "Lower back pain that comes and goes",
    "Pressure in pelvis and need to push"
  ];

  return (
    <div className="space-y-6">
      <Card className={`border-2 ${
        deliveryInfo.urgency === 'high' ? 'border-red-500 bg-red-50' :
        deliveryInfo.urgency === 'medium' ? 'border-orange-500 bg-orange-50' :
        'border-blue-500 bg-blue-50'
      }`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-rose-500" />
              {deliveryInfo.title}
            </CardTitle>
            <Badge variant={deliveryInfo.urgency === 'high' ? 'destructive' : 'secondary'}>
              Week {pregnancyWeek}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Preparation Tips
            </h4>
            <ul className="space-y-1">
              {deliveryInfo.tips.map((tip, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-4 w-4" />
              Emergency Signs - Call Doctor Immediately
            </h4>
            <ul className="space-y-1">
              {deliveryInfo.emergencySigns.map((sign, index) => (
                <li key={index} className="text-sm flex items-start gap-2 text-red-700">
                  <span className="text-red-500 mt-1">•</span>
                  {sign}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-blue-500" />
              Hospital Bag Checklist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {hospitalBagChecklist.map((item, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-500" />
              True Labor Signs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {laborSigns.map((sign, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  {sign}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
