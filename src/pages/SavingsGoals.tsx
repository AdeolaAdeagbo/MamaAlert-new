
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
import { useToast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";
import { Plus, Heart } from "lucide-react";

const SavingsGoals = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: "",
    targetAmount: "",
    frequency: "weekly",
    amountPerSave: "",
    healthCategory: "emergency"
  });

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Mock health-related savings goals
  const savingsGoals = [
    {
      id: "1",
      name: "Health Emergency Fund",
      targetAmount: 500000,
      currentAmount: 125000,
      frequency: "weekly" as const,
      amountPerSave: 15000,
      isLocked: true,
      lockEndDate: "2024-12-31"
    },
    {
      id: "2",
      name: "Dental Care Fund",
      targetAmount: 200000,
      currentAmount: 75000,
      frequency: "daily" as const,
      amountPerSave: 2000,
      isLocked: true
    },
    {
      id: "3",
      name: "Vision Care Savings",
      targetAmount: 150000,
      currentAmount: 50000,
      frequency: "monthly" as const,
      amountPerSave: 25000,
      isLocked: true
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
      title: "Health Goal Created!",
      description: `Your health savings goal "${newGoal.name}" has been created successfully.`,
    });

    setIsCreateDialogOpen(false);
    setNewGoal({
      name: "",
      targetAmount: "",
      frequency: "weekly",
      amountPerSave: "",
      healthCategory: "emergency"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Health Savings Goals</h1>
            <p className="text-muted-foreground">
              Save for your health expenses with locked funds dedicated to healthcare needs.
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                New Health Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Health Savings Goal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="goalName">Health Goal Name</Label>
                  <Input
                    id="goalName"
                    placeholder="e.g., Dental Care Fund"
                    value={newGoal.name}
                    onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="healthCategory">Health Category</Label>
                  <Select value={newGoal.healthCategory} onValueChange={(value) => setNewGoal({ ...newGoal, healthCategory: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emergency">Health Emergency</SelectItem>
                      <SelectItem value="dental">Dental Care</SelectItem>
                      <SelectItem value="vision">Vision Care</SelectItem>
                      <SelectItem value="medication">Medication</SelectItem>
                      <SelectItem value="checkup">Regular Checkups</SelectItem>
                      <SelectItem value="surgery">Surgery Fund</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="targetAmount">Target Amount (₦)</Label>
                  <Input
                    id="targetAmount"
                    type="number"
                    placeholder="200000"
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
                    placeholder="5000"
                    value={newGoal.amountPerSave}
                    onChange={(e) => setNewGoal({ ...newGoal, amountPerSave: e.target.value })}
                  />
                </div>

                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <Heart className="h-4 w-4 inline mr-1 text-red-500" />
                    All health savings are automatically locked and can only be used for verified health expenses.
                  </p>
                </div>

                <Button onClick={handleCreateGoal} className="w-full gradient-primary">
                  Create Health Goal
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
              <Heart className="h-16 w-16 mx-auto mb-6 text-red-500 opacity-50" />
              <h3 className="text-xl font-medium mb-3">No health savings goals yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Start your health savings journey by creating your first goal. 
                Build a safety net for medical expenses, dental care, or health emergencies.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Health Goal
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Health Savings Tips */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-6">Health Savings Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Emergency First</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Prioritize building a health emergency fund to cover unexpected 
                  medical expenses and hospital visits.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Regular Checkups</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Save for preventive care and regular checkups to catch 
                  health issues early and avoid costly treatments.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Locked for Health</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  All funds are locked and can only be used for verified 
                  health expenses, ensuring your health fund stays protected.
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
