
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart, Phone, MapPin, Activity } from "lucide-react";

interface QuickActionsProps {
  pregnancyData: any;
}

export const QuickActions = ({ pregnancyData }: QuickActionsProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/pregnancy-details">
            <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
              <Heart className="h-6 w-6 text-rose-500" />
              <span className="text-sm">
                {pregnancyData ? 'Edit Details' : 'Add Details'}
              </span>
            </Button>
          </Link>
          
          <Link to="/symptom-logger">
            <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
              <Heart className="h-6 w-6 text-rose-500" />
              <span className="text-sm">Log Symptoms</span>
            </Button>
          </Link>
          
          <Link to="/symptom-guide">
            <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
              <Activity className="h-6 w-6 text-blue-500" />
              <span className="text-sm">Symptom Guide</span>
            </Button>
          </Link>
          
          <Link to="/emergency-contacts">
            <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
              <Phone className="h-6 w-6 text-green-500" />
              <span className="text-sm">Contacts</span>
            </Button>
          </Link>
          
          <Link to="/healthcare-centers">
            <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
              <MapPin className="h-6 w-6 text-purple-500" />
              <span className="text-sm">Find Care</span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
