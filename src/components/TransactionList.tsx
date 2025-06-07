
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp, TrendingDown } from "lucide-react";

interface Transaction {
  id: string;
  type: "save" | "withdraw" | "goal_created";
  amount: number;
  description: string;
  date: string;
  goalName?: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  limit?: number;
}

export function TransactionList({ transactions, limit }: TransactionListProps) {
  const displayTransactions = limit ? transactions.slice(0, limit) : transactions;
  const formatCurrency = (amount: number) => `₦${amount.toLocaleString()}`;

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "save":
        return <TrendingUp className="h-4 w-4 text-success" />;
      case "withdraw":
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      default:
        return <Calendar className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "save":
        return "text-success";
      case "withdraw":
        return "text-destructive";
      default:
        return "text-foreground";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center space-x-3">
                {getTransactionIcon(transaction.type)}
                <div>
                  <p className="font-medium text-sm">{transaction.description}</p>
                  {transaction.goalName && (
                    <p className="text-xs text-muted-foreground">{transaction.goalName}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {new Date(transaction.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold naira-format ${getTransactionColor(transaction.type)}`}>
                  {transaction.type === "withdraw" ? "-" : "+"}{formatCurrency(transaction.amount)}
                </p>
                <Badge variant="outline" className="text-xs">
                  {transaction.type.replace("_", " ")}
                </Badge>
              </div>
            </div>
          ))}
          {displayTransactions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No transactions yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
