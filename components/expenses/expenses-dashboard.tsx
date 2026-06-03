"use client";

import { type FormEvent, useMemo, useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  ReceiptIcon,
  WalletCardsIcon,
} from "lucide-react";
import { Cell, Pie, PieChart } from "recharts";

import { getExpenseColumns, type Expense } from "./columns";
import { DataTable } from "./data-table";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  BudgetCategoryId,
  BudgetSplit,
  ExpenseFrequency,
  Per,
} from "@/lib/budget";
import {
  formatExpenseFrequency,
  formatPeriodWindow,
  formatPer,
  getExpenseAmountForPeriod,
  getBudgetBreakdown,
  movePeriod,
  Pers,
} from "@/lib/budget";
import { cn } from "@/lib/utils";

type ExpenseDraft = {
  amount: string;
  categoryId: BudgetCategoryId;
  frequency: ExpenseFrequency;
  payer: string;
  description: string;
  date: string;
};

type ExpensesDashboardProps = {
  budgetIncome: number;
  budgetSplit: BudgetSplit;
  incomePeriod: Per;
};

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

const today = new Date().toISOString().slice(0, 10);

function formatCurrency(amount: number) {
  return amount.toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function ExpensesDashboard({
  budgetIncome,
  budgetSplit,
  incomePeriod,
}: ExpensesDashboardProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgetPeriod, setBudgetPeriod] = useState<Per>(incomePeriod);
  const [periodAnchorDate, setPeriodAnchorDate] = useState<string>(today);
  const activePeriodAnchorDate = periodAnchorDate || today;
  const budgetBreakdown = getBudgetBreakdown(
    budgetIncome,
    incomePeriod,
    budgetPeriod,
    budgetSplit,
  );
  const [draft, setDraft] = useState<ExpenseDraft>({
    amount: "",
    categoryId: budgetBreakdown[0]?.id ?? "fixedExpenses",
    frequency: "month",
    payer: "",
    description: "",
    date: today,
  });
  const trackedExpenses = expenses.map((expense) => ({
    ...expense,
    amountForPeriod: getExpenseAmountForPeriod(
      expense,
      budgetPeriod,
      activePeriodAnchorDate,
    ),
  }));

  const totalBudget = budgetBreakdown.reduce(
    (total, category) => total + category.amount,
    0,
  );
  const totalSpent = trackedExpenses.reduce(
    (total, expense) => total + expense.amountForPeriod,
    0,
  );
  const totalRemaining = totalBudget - totalSpent;
  const totalSpentPercent =
    totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;

  const categorySummaries = budgetBreakdown.map((category) => {
    const spent = expenses
      .filter((expense) => expense.categoryId === category.id)
      .reduce(
        (total, expense) =>
          total +
          getExpenseAmountForPeriod(
            expense,
            budgetPeriod,
            activePeriodAnchorDate,
          ),
        0,
      );
    const remaining = category.amount - spent;
    const spentPercent =
      category.amount > 0 ? Math.min((spent / category.amount) * 100, 100) : 0;

    return {
      ...category,
      spent,
      remaining,
      spentPercent,
    };
  });

  const chartData = [
    {
      status: "spent",
      amount: totalSpent,
      fill: "var(--color-spent)",
    },
    {
      status: "remaining",
      amount: Math.max(totalRemaining, 0),
      fill: "var(--color-remaining)",
    },
  ];

  const columns = useMemo(
    () =>
      getExpenseColumns((expenseId) => {
        setExpenses((currentExpenses) =>
          currentExpenses.filter((expense) => expense.id !== expenseId),
        );
      }),
    [],
  );

  function updateDraft<Field extends keyof ExpenseDraft>(
    field: Field,
    value: ExpenseDraft[Field],
  ) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [field]: value,
    }));
  }

  function addExpense(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const amount = Number(draft.amount);
    const category = budgetBreakdown.find(
      (budgetCategory) => budgetCategory.id === draft.categoryId,
    );

    if (!category || !Number.isFinite(amount) || amount <= 0) return;

    setExpenses((currentExpenses) => [
      {
        id: crypto.randomUUID(),
        amount,
        amountForPeriod: getExpenseAmountForPeriod(
          {
            amount,
            date: draft.date || today,
            frequency: draft.frequency,
          },
          budgetPeriod,
          activePeriodAnchorDate,
        ),
        categoryId: category.id,
        categoryLabel: category.label,
        frequency: draft.frequency,
        payer: draft.payer.trim() || "Unassigned",
        description: draft.description.trim() || "Expense",
        date: draft.date || today,
      },
      ...currentExpenses,
    ]);
    setDraft((currentDraft) => ({
      ...currentDraft,
      amount: "",
      payer: "",
      description: "",
      date: today,
    }));
  }

  function shiftViewingPeriod(direction: "previous" | "next") {
    setPeriodAnchorDate((currentAnchorDate) =>
      movePeriod(currentAnchorDate || today, budgetPeriod, direction),
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-6">
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <div>
            <CardTitle className="text-xl font-medium">Add Expense</CardTitle>
            <CardDescription>
              Tracked against your {formatPer(budgetPeriod).toLowerCase()} budget
            </CardDescription>
          </div>
          <ReceiptIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <form onSubmit={addExpense} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="expense-amount">Amount</Label>
              <Input
                id="expense-amount"
                min="0"
                step="0.01"
                type="number"
                value={draft.amount}
                onChange={(event) => updateDraft("amount", event.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="grid gap-2">
              <Label>Category</Label>
              <Select
                value={draft.categoryId}
                onValueChange={(value) =>
                  updateDraft("categoryId", value as BudgetCategoryId)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {budgetBreakdown.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Frequency</Label>
              <Select
                value={draft.frequency}
                onValueChange={(value) =>
                  updateDraft("frequency", value as ExpenseFrequency)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oneOff">
                    {formatExpenseFrequency("oneOff")}
                  </SelectItem>
                  {Pers.map((per) => (
                    <SelectItem key={per} value={per}>
                      {formatExpenseFrequency(per)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="expense-description">Description</Label>
              <Input
                id="expense-description"
                value={draft.description}
                onChange={(event) =>
                  updateDraft("description", event.target.value)
                }
                placeholder="Rent, groceries, transfer..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="expense-payer">Payer</Label>
              <Input
                id="expense-payer"
                value={draft.payer}
                onChange={(event) => updateDraft("payer", event.target.value)}
                placeholder="Who paid?"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="expense-date">Date</Label>
              <Input
                id="expense-date"
                type="date"
                value={draft.date}
                onChange={(event) => updateDraft("date", event.target.value)}
              />
            </div>
            <Button className="w-full gap-2" type="submit">
              <PlusIcon className="h-4 w-4" />
              Add Expense
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-4">
        <Card>
          <CardHeader className="space-y-4 pb-4">
            <div>
              <CardTitle className="text-xl font-medium">
                Expenses Period
              </CardTitle>
              <CardDescription>
                Budget, recurring expenses, and one-offs are tracked in this
                period
              </CardDescription>
            </div>
            <Tabs
              value={budgetPeriod}
              onValueChange={(value) => setBudgetPeriod(value as Per)}
            >
              <ScrollArea>
                <TabsList>
                  {Pers.map((per) => (
                    <TabsTrigger key={per} value={per}>
                      {formatPer(per)}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </Tabs>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="space-y-2">
                <Label>Viewing</Label>
                <div className="flex items-center gap-2">
                  <Button
                    aria-label="View previous period"
                    size="icon"
                    type="button"
                    variant="outline"
                    onClick={() => shiftViewingPeriod("previous")}
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </Button>
                  <div className="min-w-[180px] rounded-md border bg-muted px-4 py-2 text-center text-sm font-medium">
                    {formatPeriodWindow(activePeriodAnchorDate, budgetPeriod)}
                  </div>
                  <Button
                    aria-label="View next period"
                    size="icon"
                    type="button"
                    variant="outline"
                    onClick={() => shiftViewingPeriod("next")}
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="grid max-w-[180px] gap-2">
                <Label htmlFor="period-anchor-date">Jump to date</Label>
                <Input
                  id="period-anchor-date"
                  type="date"
                  value={periodAnchorDate}
                  onChange={(event) => setPeriodAnchorDate(event.target.value)}
                />
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Budget</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">
              {formatCurrency(totalBudget)}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Spent</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">
              {formatCurrency(totalSpent)}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Left</CardTitle>
            </CardHeader>
            <CardContent
              className={cn(
                "text-2xl font-bold",
                totalRemaining < 0 && "text-destructive",
              )}
            >
              {formatCurrency(totalRemaining)}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-xl font-medium">
                Budget Remaining
              </CardTitle>
              <CardDescription>
                {totalSpentPercent.toFixed(0)}% spent for this{" "}
                {formatPer(budgetPeriod).toLowerCase()} period
              </CardDescription>
            </div>
            <WalletCardsIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-[220px_1fr]">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square h-[220px]"
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
            <div className="space-y-4">
              {categorySummaries.map((category) => (
                <div key={category.id} className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-medium">{category.label}</div>
                    <div
                      className={cn(
                        "text-right text-sm font-medium",
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
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatCurrency(category.spent)} spent</span>
                    <span>{formatCurrency(category.amount)} budget</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <DataTable columns={columns} data={trackedExpenses} />
      </div>
    </div>
  );
}
