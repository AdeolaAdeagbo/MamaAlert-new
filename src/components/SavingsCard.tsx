
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  frequency: "daily" | "weekly" | "monthly";
  amountPerSave: number;
  isLocked: boolean;
  lockEndDate?: string;
}

interface SavingsCardProps {
  goal: SavingsGoal;
}

export function SavingsCard({ goal }: SavingsCardProps) {
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const formatCurrency = (amount: number) => `₦${amount.toLocaleString()}`;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{goal.name}</CardTitle>
          <div className="flex gap-2">
            <Badge variant="secondary" className="text-xs">
              {goal.frequency}
            </Badge>
            {goal.isLocked && (
              <Badge variant="destructive" className="text-xs">
                Locked
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progress.toFixed(1)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Current</p>
              <p className="font-semibold text-primary naira-format">
                {formatCurrency(goal.currentAmount)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Target</p>
              <p className="font-semibold naira-format">
                {formatCurrency(goal.targetAmount)}
              </p>
            </div>
          </div>
          
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground">
              Saving {formatCurrency(goal.amountPerSave)} {goal.frequency}
            </p>
            {goal.isLocked && goal.lockEndDate && (
              <p className="text-xs text-destructive mt-1">
                Locked until {new Date(goal.lockEndDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
