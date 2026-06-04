"use client";

import { Trash2Icon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatExpenseFrequency } from "@/lib/budget";
import { formatCurrency } from "@/lib/format";

import type { Expense } from "./types";

type MobileExpenseListProps = {
  expenses: Expense[];
  onDeleteExpense: (expenseId: string) => void;
};

export function MobileExpenseList({
  expenses,
  onDeleteExpense,
}: MobileExpenseListProps) {
  return (
    <div className="md:hidden">
      <Card className="min-w-0">
        <CardHeader className="p-4 pb-3 sm:p-6">
          <CardTitle className="text-xl font-medium">Expenses</CardTitle>
          <CardDescription>
            {expenses.length ? `${expenses.length} tracked` : "No expenses added yet"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 p-4 pt-0 sm:p-6 sm:pt-0">
          {expenses.length ? (
            expenses.map((expense) => (
              <div
                key={expense.id}
                className="min-w-0 space-y-3 rounded-md border p-3 sm:p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate font-medium">
                      {expense.description}
                    </div>
                    <div className="mt-1 truncate text-xs text-muted-foreground">
                      {expense.categoryLabel} &middot;{" "}
                      {formatExpenseFrequency(expense.frequency)}
                    </div>
                  </div>
                  <Button
                    aria-label="Delete expense"
                    className="shrink-0"
                    size="icon"
                    type="button"
                    variant="ghost"
                    onClick={() => onDeleteExpense(expense.id)}
                  >
                    <Trash2Icon className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid min-w-0 grid-cols-2 gap-3 text-sm">
                  <div className="min-w-0">
                    <div className="text-xs text-muted-foreground">Amount</div>
                    <div className="break-words font-medium">
                      {formatCurrency(expense.amount)}
                    </div>
                  </div>
                  <div className="min-w-0 text-right">
                    <div className="text-xs text-muted-foreground">Tracked</div>
                    <div className="break-words font-medium">
                      {formatCurrency(expense.amountForPeriod)}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-muted-foreground">Date</div>
                    <div className="break-words">{expense.date}</div>
                  </div>
                  <div className="min-w-0 text-right">
                    <div className="text-xs text-muted-foreground">Payer</div>
                    <div className="truncate">{expense.payer}</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
              Add an expense to start tracking this period.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
