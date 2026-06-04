import { WalletCardsIcon } from "lucide-react";
import { Cell, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatPer, type Per } from "@/lib/budget";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

import type { CategorySummary, ExpenseChartDatum } from "./types";

const chartConfig = {
  spent: {
    label: "Spent",
    color: "hsl(var(--destructive))",
  },
  remaining: {
    label: "Remaining",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

type BudgetRemainingCardProps = {
  budgetPeriod: Per;
  categorySummaries: CategorySummary[];
  chartData: ExpenseChartDatum[];
  totalSpentPercent: number;
};

export function BudgetRemainingCard({
  budgetPeriod,
  categorySummaries,
  chartData,
  totalSpentPercent,
}: BudgetRemainingCardProps) {
  return (
    <Card className="min-w-0">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 p-4 pb-2 sm:p-6 sm:pb-2">
        <div className="min-w-0">
          <CardTitle className="text-xl font-medium">
            Budget Remaining
          </CardTitle>
          <CardDescription>
            {totalSpentPercent.toFixed(0)}% spent for this{" "}
            {formatPer(budgetPeriod).toLowerCase()} period
          </CardDescription>
        </div>
        <WalletCardsIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
      </CardHeader>
      <CardContent className="grid gap-6 p-4 pt-0 sm:p-6 sm:pt-0 xl:grid-cols-[220px_1fr]">
        <ChartContainer
          config={chartConfig}
          className="mx-auto flex aspect-square h-[140px] sm:hidden"
        >
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  hideLabel
                  nameKey="status"
                  formatter={(value) => formatCurrency(Number(value))}
                />
              }
            />
            <Pie
              data={chartData}
              dataKey="amount"
              innerRadius={34}
              nameKey="status"
              outerRadius={54}
              strokeWidth={2}
            >
              {chartData.map((entry) => (
                <Cell key={entry.status} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <ChartContainer
          config={chartConfig}
          className="mx-auto hidden aspect-square h-[220px] sm:flex"
        >
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  hideLabel
                  nameKey="status"
                  formatter={(value) => formatCurrency(Number(value))}
                />
              }
            />
            <Pie
              data={chartData}
              dataKey="amount"
              innerRadius={58}
              nameKey="status"
              outerRadius={92}
              strokeWidth={2}
            >
              {chartData.map((entry) => (
                <Cell key={entry.status} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="min-w-0 space-y-4">
          {categorySummaries.map((category) => (
            <div key={category.id} className="min-w-0 space-y-2">
              <div className="grid gap-1 sm:flex sm:items-center sm:justify-between sm:gap-3">
                <div className="min-w-0 truncate text-sm font-medium">
                  {category.label}
                </div>
                <div
                  className={cn(
                    "break-words text-sm font-medium sm:text-right",
                    category.remaining < 0 && "text-destructive",
                  )}
                >
                  {formatCurrency(category.remaining)} left
                </div>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${category.spentPercent}%`,
                    backgroundColor: category.color,
                  }}
                />
              </div>
              <div className="grid gap-1 text-xs text-muted-foreground sm:flex sm:justify-between">
                <span className="break-words">
                  {formatCurrency(category.spent)} spent
                </span>
                <span className="break-words sm:text-right">
                  {formatCurrency(category.amount)} budget
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
