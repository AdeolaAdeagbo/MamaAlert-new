
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

export const PregnancyPrompt = () => {
  return (
    <Card className="mb-8 border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50">
      <CardContent className="pt-6">
        <div className="text-center">
          <h2 className="text-xl font-bold text-amber-800 mb-4">Complete Your Pregnancy Profile</h2>
          <p className="text-amber-700 mb-6">
            Help us provide you with personalized care by sharing your pregnancy details. 
            This information will help us send you relevant alerts and track your symptoms better.
          </p>
          <Link to="/pregnancy-details">
            <Button className="bg-amber-600 hover:bg-amber-700 text-white">
              <Heart className="h-4 w-4 mr-2" />
              Add Pregnancy Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
