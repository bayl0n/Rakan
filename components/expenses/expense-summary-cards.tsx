import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

type ExpenseSummaryCardsProps = {
  totalBudget: number;
  totalRemaining: number;
  totalSpent: number;
};

export function ExpenseSummaryCards({
  totalBudget,
  totalRemaining,
  totalSpent,
}: ExpenseSummaryCardsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3 lg:gap-4">
      <Card className="min-w-0">
        <CardHeader className="p-4 pb-2 sm:p-6 sm:pb-2">
          <CardTitle className="text-sm font-medium">Budget</CardTitle>
        </CardHeader>
        <CardContent className="break-words p-4 pt-0 text-lg font-bold sm:p-6 sm:pt-0 sm:text-2xl">
          {formatCurrency(totalBudget)}
        </CardContent>
      </Card>
      <Card className="min-w-0">
        <CardHeader className="p-4 pb-2 sm:p-6 sm:pb-2">
          <CardTitle className="text-sm font-medium">Spent</CardTitle>
        </CardHeader>
        <CardContent className="break-words p-4 pt-0 text-lg font-bold sm:p-6 sm:pt-0 sm:text-2xl">
          {formatCurrency(totalSpent)}
        </CardContent>
      </Card>
      <Card className="min-w-0">
        <CardHeader className="p-4 pb-2 sm:p-6 sm:pb-2">
          <CardTitle className="text-sm font-medium">Left</CardTitle>
        </CardHeader>
        <CardContent
          className={cn(
            "break-words p-4 pt-0 text-lg font-bold sm:p-6 sm:pt-0 sm:text-2xl",
            totalRemaining < 0 && "text-destructive",
          )}
        >
          {formatCurrency(totalRemaining)}
        </CardContent>
      </Card>
    </div>
  );
}
