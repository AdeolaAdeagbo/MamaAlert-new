
import { useAuth } from "@/components/AuthProvider";
import { Navbar } from "@/components/Navbar";
import { SavingsCard } from "@/components/SavingsCard";
import { TransactionList } from "@/components/TransactionList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Navigate, Link } from "react-router-dom";
import { TrendingUp, Target, Calendar, Wallet } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Mock data - replace with real data from your backend
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
    }
  ];

  const recentTransactions = [
    {
      id: "1",
      type: "save" as const,
      amount: 15000,
      description: "Weekly savings",
      date: "2024-01-15",
      goalName: "Emergency Fund"
    },
    {
      id: "2",
      type: "save" as const,
      amount: 2000,
      description: "Daily savings",
      date: "2024-01-14",
      goalName: "New Laptop"
    }
  ];

  const formatCurrency = (amount: number) => `₦${amount.toLocaleString()}`;
  const totalProgress = user.totalSavings / 1000000 * 100; // Assuming 1M target for demo

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user.firstName}!
          </h1>
          <p className="text-muted-foreground">
            Here's your savings progress and recent activity.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="gradient-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Savings
                </CardTitle>
                <Wallet className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary naira-format">
                {formatCurrency(user.totalSavings)}
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-3 w-3 text-success mr-1" />
                <span className="text-xs text-success">+12% this month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Goals
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.activeGoals}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Tracking progress
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  This Month
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold naira-format">
                {formatCurrency(45000)}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                15 days left
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Average/Day
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold naira-format">
                {formatCurrency(3000)}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Last 30 days
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Overall Progress */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Overall Savings Progress</CardTitle>
              <span className="text-sm text-muted-foreground">
                {totalProgress.toFixed(1)}% of ₦1,000,000 goal
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={totalProgress} className="h-4" />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>₦0</span>
              <span>₦1,000,000</span>
            </div>
          </CardContent>
        </Card>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Savings Goals */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Your Savings Goals</h2>
              <Link to="/savings">
                <Button variant="outline" size="sm">
                  Manage Goals
                </Button>
              </Link>
            </div>
            
            {savingsGoals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savingsGoals.map((goal) => (
                  <SavingsCard key={goal.id} goal={goal} />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No savings goals yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first savings goal to start building wealth.
                  </p>
                  <Link to="/savings">
                    <Button className="gradient-primary">
                      Create Your First Goal
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Recent Transactions */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Recent Activity</h2>
              <Link to="/transactions">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
            <TransactionList transactions={recentTransactions} limit={5} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
