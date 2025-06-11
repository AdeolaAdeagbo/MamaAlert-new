
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Heart, CheckCircle } from "lucide-react";

interface SymptomLog {
  id: string;
  symptom_type: string;
  severity: number;
  description: string;
  timestamp: string;
}

interface HealthAlert {
  id: string;
  type: "warning" | "info" | "success";
  title: string;
  message: string;
  priority: "high" | "medium" | "low";
}

interface HealthAlertsProps {
  userId: string;
  recentSymptoms?: SymptomLog[];
}

export const HealthAlerts = ({ userId, recentSymptoms = [] }: HealthAlertsProps) => {
  const [alerts, setAlerts] = useState<HealthAlert[]>([]);

  useEffect(() => {
    generateHealthAlerts();
  }, [userId, recentSymptoms]);

  const generateHealthAlerts = () => {
    console.log('Generating health alerts with symptoms:', recentSymptoms);
    
    const newAlerts: HealthAlert[] = [];

    // Analyze recent symptoms (last 7 days)
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const recentSevereSymptoms = recentSymptoms.filter(symptom => {
      const symptomDate = new Date(symptom.timestamp);
      return symptomDate >= lastWeek && symptom.severity >= 7;
    });

    console.log('Recent severe symptoms:', recentSevereSymptoms);

    if (recentSevereSymptoms.length > 0) {
      newAlerts.push({
        id: "severe-symptoms",
        type: "warning",
        title: "High Severity Symptoms Detected",
        message: `You've logged ${recentSevereSymptoms.length} high-severity symptoms recently. Consider contacting your healthcare provider.`,
        priority: "high"
      });
    }

    // Check for frequent headaches
    const headaches = recentSymptoms.filter(symptom => 
      symptom.symptom_type.toLowerCase().includes("headache") && 
      new Date(symptom.timestamp) >= lastWeek
    );

    if (headaches.length >= 3) {
      newAlerts.push({
        id: "frequent-headaches",
        type: "warning",
        title: "Frequent Headaches",
        message: "You've been experiencing frequent headaches. This could indicate high blood pressure - please consult your doctor.",
        priority: "medium"
      });
    }

    // Check for bleeding symptoms
    const bleedingSymptoms = recentSymptoms.filter(symptom => 
      symptom.symptom_type.toLowerCase().includes("bleeding") || 
      symptom.symptom_type.toLowerCase().includes("spotting")
    );

    if (bleedingSymptoms.length > 0) {
      newAlerts.push({
        id: "bleeding-alert",
        type: "warning",
        title: "Bleeding Symptoms Logged",
        message: "You've logged bleeding symptoms. Please contact your healthcare provider immediately for evaluation.",
        priority: "high"
      });
    }

    // Check for nausea/vomiting patterns
    const nauseaSymptoms = recentSymptoms.filter(symptom => 
      symptom.symptom_type.toLowerCase().includes("nausea") || 
      symptom.symptom_type.toLowerCase().includes("vomiting")
    );

    if (nauseaSymptoms.length >= 4) {
      newAlerts.push({
        id: "severe-nausea",
        type: "warning",
        title: "Severe Morning Sickness",
        message: "You've been experiencing frequent nausea/vomiting. Monitor hydration and consider contacting your doctor if it persists.",
        priority: "medium"
      });
    }

    // Check for no recent symptoms (positive alert)
    if (recentSymptoms.length === 0) {
      newAlerts.push({
        id: "no-symptoms",
        type: "success",
        title: "Great Health Status!",
        message: "You haven't logged any concerning symptoms recently. Keep up the good health habits!",
        priority: "low"
      });
    }

    // General pregnancy tips based on week (using localStorage as fallback)
    const pregnancyData = JSON.parse(
      localStorage.getItem(`pregnancy-data-${userId}`) || "{}"
    );

    if (pregnancyData.weeksPregnant) {
      if (pregnancyData.weeksPregnant >= 20 && pregnancyData.weeksPregnant <= 24) {
        newAlerts.push({
          id: "anatomy-scan",
          type: "info",
          title: "Anatomy Scan Reminder",
          message: "You're in the ideal window for your anatomy scan (20-24 weeks). Make sure to schedule if you haven't already.",
          priority: "medium"
        });
      }

      if (pregnancyData.weeksPregnant >= 35) {
        newAlerts.push({
          id: "birth-prep",
          type: "info",
          title: "Birth Preparation",
          message: "You're in your final weeks! Make sure your hospital bag is packed and birth plan is ready.",
          priority: "medium"
        });
      }
    }

    console.log('Generated alerts:', newAlerts);
    setAlerts(newAlerts);
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Heart className="h-5 w-5 text-blue-500" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "warning":
        return "border-amber-200 bg-amber-50";
      case "success":
        return "border-green-200 bg-green-50";
      default:
        return "border-blue-200 bg-blue-50";
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-500 text-white">High Priority</Badge>;
      case "medium":
        return <Badge className="bg-yellow-500 text-white">Medium Priority</Badge>;
      default:
        return <Badge variant="outline">Low Priority</Badge>;
    }
  };

  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-500" />
            Health Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No health alerts at this time. Keep logging your symptoms for personalized insights!
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
          Health Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border ${getAlertColor(alert.type)}`}
            >
              <div className="flex items-start gap-3">
                {getAlertIcon(alert.type)}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{alert.title}</h4>
                    {getPriorityBadge(alert.priority)}
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
