
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Heart, MapPin } from "lucide-react";

const upcomingAppointments = [
  {
    id: "1",
    title: "Routine Prenatal Checkup",
    date: "Jan 22, 2024",
    time: "10:00 AM",
    doctor: "Dr. Adebayo",
    location: "Lagos University Teaching Hospital"
  },
  {
    id: "2",
    title: "Ultrasound Scan",
    date: "Feb 5, 2024", 
    time: "2:30 PM",
    doctor: "Dr. Okonkwo",
    location: "First Consultant Medical Centre"
  }
];

export const UpcomingAppointments = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-500" />
          Upcoming Appointments
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingAppointments.map((appointment) => (
            <div key={appointment.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">{appointment.title}</h4>
                <Badge variant="outline">{appointment.date}</Badge>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{appointment.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  <span>{appointment.doctor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{appointment.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
