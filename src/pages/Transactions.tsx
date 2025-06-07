
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Navbar } from "@/components/Navbar";
import { TransactionList } from "@/components/TransactionList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Navigate } from "react-router-dom";
import { CalendarIcon, Download, Filter } from "lucide-react";
import { format } from "date-fns";

const Transactions = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [filterType, setFilterType] = useState("all");

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Mock transaction data - replace with real data
  const allTransactions = [
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
    },
    {
      id: "3",
      type: "save" as const,
      amount: 25000,
      description: "Monthly savings",
      date: "2024-01-13",
      goalName: "Vacation Fund"
    },
    {
      id: "4",
      type: "goal_created" as const,
      amount: 0,
      description: "Created new savings goal",
      date: "2024-01-12",
      goalName: "Emergency Fund"
    },
    {
      id: "5",
      type: "save" as const,
      amount: 2000,
      description: "Daily savings",
      date: "2024-01-11",
      goalName: "New Laptop"
    },
    {
      id: "6",
      type: "save" as const,
      amount: 15000,
      description: "Weekly savings",
      date: "2024-01-08",
      goalName: "Emergency Fund"
    },
    {
      id: "7",
      type: "withdraw" as const,
      amount: 5000,
      description: "Emergency withdrawal",
      date: "2024-01-05",
      goalName: "Emergency Fund"
    }
  ];

  // Filter transactions based on type
  const filteredTransactions = allTransactions.filter(transaction => {
    if (filterType === "all") return true;
    return transaction.type === filterType;
  });

  const formatCurrency = (amount: number) => `₦${amount.toLocaleString()}`;

  // Calculate totals
  const totalSaved = allTransactions
    .filter(t => t.type === "save")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalWithdrawn = allTransactions
    .filter(t => t.type === "withdraw")
    .reduce((sum, t) => sum + t.amount, 0);

  const handleExport = () => {
    // Mock export functionality
    const csv = [
      ["Date", "Type", "Amount", "Description", "Goal"],
      ...filteredTransactions.map(t => [
        t.date,
        t.type,
        t.amount,
        t.description,
        t.goalName || ""
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "bomud-transactions.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Transaction History</h1>
            <p className="text-muted-foreground">
              Track all your savings activities and withdrawals.
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Saved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success naira-format">
                {formatCurrency(totalSaved)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {allTransactions.filter(t => t.type === "save").length} transactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Withdrawn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive naira-format">
                {formatCurrency(totalWithdrawn)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {allTransactions.filter(t => t.type === "withdraw").length} transactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Net Savings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary naira-format">
                {formatCurrency(totalSaved - totalWithdrawn)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {allTransactions.length} total transactions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Transaction Type
                </label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Transactions</SelectItem>
                    <SelectItem value="save">Savings Only</SelectItem>
                    <SelectItem value="withdraw">Withdrawals Only</SelectItem>
                    <SelectItem value="goal_created">Goal Creation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Date Range
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setFilterType("all");
                    setSelectedDate(undefined);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <TransactionList transactions={filteredTransactions} />
      </div>
    </div>
  );
};

export default Transactions;
