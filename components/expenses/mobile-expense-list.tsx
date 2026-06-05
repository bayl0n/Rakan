"use client";

import {
  CheckIcon,
  XIcon,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  BudgetCategoryId,
  BudgetCategoryWithAmount,
} from "@/lib/finance/budget";
import { formatExpenseFrequency } from "@/lib/finance/expenses";
import { formatCurrency } from "@/lib/format";

import { ExpenseActionsMenu } from "./expense-actions-menu";
import { ExpenseRecurringControls } from "./expense-recurring-controls";
import { PayerCombobox } from "./payer-combobox";
import type { Expense, ExpenseDraft } from "./types";

type MobileExpenseListProps = {
  budgetBreakdown: BudgetCategoryWithAmount[];
  editingDraft: ExpenseDraft | null;
  editingExpenseId: string | null;
  expenses: Expense[];
  onCancelEditingExpense: () => void;
  onDeleteExpense: (expenseId: string) => void;
  onSaveEditingExpense: () => void;
  onStartEditingExpense: (expense: Expense) => void;
  onUpdateEditingDraft: <Field extends keyof ExpenseDraft>(
    field: Field,
    value: ExpenseDraft[Field],
  ) => void;
  payerOptions: string[];
};

export function MobileExpenseList({
  budgetBreakdown,
  editingDraft,
  editingExpenseId,
  expenses,
  onCancelEditingExpense,
  onDeleteExpense,
  onSaveEditingExpense,
  onStartEditingExpense,
  onUpdateEditingDraft,
  payerOptions,
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
                {editingExpenseId === expense.id && editingDraft ? (
                  <>
                    <div className="grid gap-3">
                      <div className="grid gap-2">
                        <Label htmlFor={`mobile-expense-amount-${expense.id}`}>
                          Amount
                        </Label>
                        <Input
                          id={`mobile-expense-amount-${expense.id}`}
                          min="0"
                          step="0.01"
                          type="number"
                          value={editingDraft.amount}
                          onChange={(event) =>
                            onUpdateEditingDraft("amount", event.target.value)
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Category</Label>
                        <Select
                          value={editingDraft.categoryId}
                          onValueChange={(value) =>
                            onUpdateEditingDraft(
                              "categoryId",
                              value as BudgetCategoryId,
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {budgetBreakdown.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={category.id}
                              >
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <ExpenseRecurringControls
                        frequency={editingDraft.frequency}
                        onFrequencyChange={(frequency) =>
                          onUpdateEditingDraft("frequency", frequency)
                        }
                      />
                      {editingDraft.frequency === "oneOff" ? (
                        <div className="grid gap-2">
                          <Label htmlFor={`mobile-expense-date-${expense.id}`}>
                            Date
                          </Label>
                          <Input
                            id={`mobile-expense-date-${expense.id}`}
                            type="date"
                            value={editingDraft.date}
                            onChange={(event) =>
                              onUpdateEditingDraft("date", event.target.value)
                            }
                          />
                        </div>
                      ) : null}
                      <div className="grid gap-2">
                        <Label
                          htmlFor={`mobile-expense-description-${expense.id}`}
                        >
                          Description
                        </Label>
                        <Input
                          id={`mobile-expense-description-${expense.id}`}
                          value={editingDraft.description}
                          onChange={(event) =>
                            onUpdateEditingDraft(
                              "description",
                              event.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor={`mobile-expense-payer-${expense.id}`}>
                          Payer
                        </Label>
                        <PayerCombobox
                          id={`mobile-expense-payer-${expense.id}`}
                          onChange={(value) =>
                            onUpdateEditingDraft("payer", value)
                          }
                          options={payerOptions}
                          placeholder="Who paid?"
                          value={editingDraft.payer}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        className="gap-2"
                        size="sm"
                        type="button"
                        onClick={onSaveEditingExpense}
                      >
                        <CheckIcon className="h-4 w-4" />
                        Save
                      </Button>
                      <Button
                        className="gap-2"
                        size="sm"
                        type="button"
                        variant="outline"
                        onClick={onCancelEditingExpense}
                      >
                        <XIcon className="h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
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
                      <div className="shrink-0">
                        <ExpenseActionsMenu
                          expense={expense}
                          onDeleteExpense={onDeleteExpense}
                          onStartEditingExpense={onStartEditingExpense}
                        />
                      </div>
                    </div>
                    <div className="grid min-w-0 grid-cols-2 gap-3 text-sm">
                      <div className="min-w-0">
                        <div className="text-xs text-muted-foreground">
                          Amount
                        </div>
                        <div className="break-words font-medium">
                          {formatCurrency(expense.amount)}
                        </div>
                      </div>
                      <div className="min-w-0 text-right">
                        <div className="text-xs text-muted-foreground">
                          Tracked
                        </div>
                        <div className="break-words font-medium">
                          {formatCurrency(expense.amountForPeriod)}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs text-muted-foreground">
                          Date
                        </div>
                        <div className="break-words">{expense.date}</div>
                      </div>
                      <div className="min-w-0 text-right">
                        <div className="text-xs text-muted-foreground">
                          Payer
                        </div>
                        <div className="truncate">{expense.payer}</div>
                      </div>
                    </div>
                  </>
                )}
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
