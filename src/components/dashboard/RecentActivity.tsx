
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

const recentActivity = [
  {
    id: "1",
    type: "symptom",
    title: "Logged morning sickness",
    time: "2 hours ago",
    status: "normal"
  },
  {
    id: "2", 
    type: "appointment",
    title: "Appointment reminder set",
    time: "1 day ago",
    status: "normal"
  },
  {
    id: "3",
    type: "contact",
    title: "Added emergency contact",
    time: "3 days ago", 
    status: "normal"
  }
];

export const RecentActivity = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-rose-500" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className="w-2 h-2 bg-rose-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
