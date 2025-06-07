
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Navbar } from "@/components/Navbar";
import { SavingsCard } from "@/components/SavingsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";
import { Plus, Target } from "lucide-react";

const SavingsGoals = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: "",
    targetAmount: "",
    frequency: "weekly",
    amountPerSave: "",
    isLocked: false,
    lockPeriodMonths: "6"
  });

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Mock data - replace with real data
  const savingsGoals = [
    {
      id: "1",
      name: "Emergency Fund",
      targetAmount: 500000,
      currentAmount: 125000,
      frequency: "weekly" as const,
      amountPerSave: 15000,
      isLocked: true,
      lockEndDate: "2024-12-31"
    },
    {
      id: "2",
      name: "New Laptop",
      targetAmount: 200000,
      currentAmount: 75000,
      frequency: "daily" as const,
      amountPerSave: 2000,
      isLocked: false
    },
    {
      id: "3",
      name: "Vacation Fund",
      targetAmount: 300000,
      currentAmount: 50000,
      frequency: "monthly" as const,
      amountPerSave: 25000,
      isLocked: false
    }
  ];

  const handleCreateGoal = () => {
    // Validate inputs
    if (!newGoal.name || !newGoal.targetAmount || !newGoal.amountPerSave) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Mock creation - replace with real API call
    toast({
      title: "Goal Created!",
      description: `Your savings goal "${newGoal.name}" has been created successfully.`,
    });

    setIsCreateDialogOpen(false);
    setNewGoal({
      name: "",
      targetAmount: "",
      frequency: "weekly",
      amountPerSave: "",
      isLocked: false,
      lockPeriodMonths: "6"
    });
  };

  const formatCurrency = (amount: number) => `₦${amount.toLocaleString()}`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Savings Goals</h1>
            <p className="text-muted-foreground">
              Create and manage your savings goals to build wealth systematically.
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                New Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Savings Goal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="goalName">Goal Name</Label>
                  <Input
                    id="goalName"
                    placeholder="e.g., Emergency Fund"
                    value={newGoal.name}
                    onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="targetAmount">Target Amount (₦)</Label>
                  <Input
                    id="targetAmount"
                    type="number"
                    placeholder="500000"
                    value={newGoal.targetAmount}
                    onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="frequency">Savings Frequency</Label>
                  <Select value={newGoal.frequency} onValueChange={(value) => setNewGoal({ ...newGoal, frequency: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="amountPerSave">Amount per Save (₦)</Label>
                  <Input
                    id="amountPerSave"
                    type="number"
                    placeholder="15000"
                    value={newGoal.amountPerSave}
                    onChange={(e) => setNewGoal({ ...newGoal, amountPerSave: e.target.value })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="lockToggle">Enable Lock Period</Label>
                    <p className="text-sm text-muted-foreground">
                      Prevent early withdrawals to build discipline
                    </p>
                  </div>
                  <Switch
                    id="lockToggle"
                    checked={newGoal.isLocked}
                    onCheckedChange={(checked) => setNewGoal({ ...newGoal, isLocked: checked })}
                  />
                </div>

                {newGoal.isLocked && (
                  <div>
                    <Label htmlFor="lockPeriod">Lock Period</Label>
                    <Select value={newGoal.lockPeriodMonths} onValueChange={(value) => setNewGoal({ ...newGoal, lockPeriodMonths: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 months</SelectItem>
                        <SelectItem value="6">6 months</SelectItem>
                        <SelectItem value="12">1 year</SelectItem>
                        <SelectItem value="24">2 years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Button onClick={handleCreateGoal} className="w-full gradient-primary">
                  Create Goal
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Goals Grid */}
        {savingsGoals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savingsGoals.map((goal) => (
              <SavingsCard key={goal.id} goal={goal} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-16">
            <CardContent>
              <Target className="h-16 w-16 mx-auto mb-6 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-medium mb-3">No savings goals yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Start your savings journey by creating your first goal. 
                Whether it's an emergency fund, vacation, or a new gadget, 
                we'll help you save systematically.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Goal
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Tips Section */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-6">Savings Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Start Small</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Begin with small amounts you can comfortably save. 
                  Consistency matters more than the amount.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Use Lock Periods</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Enable lock periods for important goals like emergency funds 
                  to build financial discipline.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Set Realistic Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Choose target amounts and frequencies that align with your 
                  income and expenses for sustainable saving.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavingsGoals;
