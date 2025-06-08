
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

export const HealthTip = () => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-rose-500" />
          Health Tip
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-4 bg-rose-50 rounded-lg">
          <h4 className="font-medium text-rose-800 mb-2">Week 24 Tip</h4>
          <p className="text-sm text-rose-700">
            Your baby's hearing is developing! Talk, sing, or play music for your little one. 
            Stay hydrated and continue taking your prenatal vitamins.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
