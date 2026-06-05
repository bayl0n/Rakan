"use client";

import { type FormEvent } from "react";
import { PlusIcon, ReceiptIcon } from "lucide-react";

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
import { formatPer, type Per } from "@/lib/finance/periods";

import { ExpenseRecurringControls } from "./expense-recurring-controls";
import type { ExpenseDraft } from "./types";
import { PayerCombobox } from "./payer-combobox";

type ExpenseFormProps = {
  budgetBreakdown: BudgetCategoryWithAmount[];
  budgetPeriod: Per;
  draft: ExpenseDraft;
  onAddExpense: (event: FormEvent<HTMLFormElement>) => void;
  onUpdateDraft: <Field extends keyof ExpenseDraft>(
    field: Field,
    value: ExpenseDraft[Field],
  ) => void;
  payerOptions: string[];
};

export function ExpenseForm({
  budgetBreakdown,
  budgetPeriod,
  draft,
  onAddExpense,
  onUpdateDraft,
  payerOptions,
}: ExpenseFormProps) {
  return (
    <Card className="min-w-0 lg:col-span-2">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 p-4 pb-5 sm:p-6">
        <div className="min-w-0">
          <CardTitle className="text-xl font-medium">Add Expense</CardTitle>
          <CardDescription>
            Tracked against your {formatPer(budgetPeriod).toLowerCase()} budget
          </CardDescription>
        </div>
        <ReceiptIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
      </CardHeader>
      <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
        <form onSubmit={onAddExpense} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="grid gap-2">
              <Label htmlFor="expense-amount">Amount</Label>
              <Input
                id="expense-amount"
                min="0"
                step="0.01"
                type="number"
                value={draft.amount}
                onChange={(event) =>
                  onUpdateDraft("amount", event.target.value)
                }
                placeholder="0.00"
              />
            </div>
            <div className="grid gap-2">
              <Label>Category</Label>
              <Select
                value={draft.categoryId}
                onValueChange={(value) =>
                  onUpdateDraft("categoryId", value as BudgetCategoryId)
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
            <ExpenseRecurringControls
              frequency={draft.frequency}
              onFrequencyChange={(frequency) =>
                onUpdateDraft("frequency", frequency)
              }
            />
            {draft.frequency === "oneOff" ? (
              <div className="grid gap-2">
                <Label htmlFor="expense-date">Date</Label>
                <Input
                  id="expense-date"
                  type="date"
                  value={draft.date}
                  onChange={(event) =>
                    onUpdateDraft("date", event.target.value)
                  }
                />
              </div>
            ) : null}
            <div className="grid gap-2 sm:col-span-2 lg:col-span-1">
              <Label htmlFor="expense-description">Description</Label>
              <Input
                id="expense-description"
                value={draft.description}
                onChange={(event) =>
                  onUpdateDraft("description", event.target.value)
                }
                placeholder="Rent, groceries, transfer..."
              />
            </div>
            <div className="grid gap-2 sm:col-span-2 lg:col-span-1">
              <Label htmlFor="expense-payer">Payer</Label>
              <PayerCombobox
                id="expense-payer"
                onChange={(value) => onUpdateDraft("payer", value)}
                options={payerOptions}
                placeholder="Who paid?"
                value={draft.payer}
              />
            </div>
          </div>
          <Button className="w-full gap-2" type="submit">
            <PlusIcon className="h-4 w-4" />
            Add Expense
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
