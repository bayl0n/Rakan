"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  formatExpenseFrequency,
  type BudgetCategoryId,
  type ExpenseFrequency,
} from "@/lib/budget";

export type Expense = {
  id: string;
  amount: number;
  amountForPeriod: number;
  categoryId: BudgetCategoryId;
  categoryLabel: string;
  frequency: ExpenseFrequency;
  payer: string;
  description: string;
  date: string;
};

export function getExpenseColumns(
  onDeleteExpense: (expenseId: string) => void,
): ColumnDef<Expense>[] {
  return [
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      accessorKey: "categoryLabel",
      header: "Category",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "payer",
      header: "Payer",
    },
    {
      accessorKey: "frequency",
      header: "Frequency",
      cell: (info) =>
        formatExpenseFrequency(info.getValue() as ExpenseFrequency),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: (info) => {
        const value = Number(info.getValue());
        return value.toLocaleString("en-AU", {
          style: "currency",
          currency: "AUD",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
    {
      accessorKey: "amountForPeriod",
      header: "Tracked",
      cell: (info) => {
        const value = Number(info.getValue());
        return value.toLocaleString("en-AU", {
          style: "currency",
          currency: "AUD",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          aria-label="Delete expense"
          size="icon"
          variant="ghost"
          onClick={() => onDeleteExpense(row.original.id)}
        >
          <Trash2Icon className="h-4 w-4" />
        </Button>
      ),
    },
  ];
}
