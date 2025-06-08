
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Calendar, Phone, Shield } from "lucide-react";

interface StatsCardsProps {
  pregnancyData: any;
  userStats: {
    pregnancyWeek: number;
    nextAppointment: string;
    emergencyContacts: number;
  };
}

export const StatsCards = ({ pregnancyData, userStats }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="border-rose-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pregnancy Week
            </CardTitle>
            <Heart className="h-4 w-4 text-rose-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-rose-600">
            Week {pregnancyData?.weeksPregnant || userStats.pregnancyWeek}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {pregnancyData?.weeksPregnant <= 12 ? '1st Trimester' : 
             pregnancyData?.weeksPregnant <= 26 ? '2nd Trimester' : '3rd Trimester'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Next Appointment
            </CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{userStats.nextAppointment}</div>
          <p className="text-xs text-muted-foreground mt-1">Dr. Adebayo</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Emergency Contacts
            </CardTitle>
            <Phone className="h-4 w-4 text-green-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{userStats.emergencyContacts}</div>
          <p className="text-xs text-muted-foreground mt-1">Ready to help</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Health Status
            </CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">Good</div>
          <p className="text-xs text-muted-foreground mt-1">No alerts</p>
        </CardContent>
      </Card>
    </div>
  );
};
