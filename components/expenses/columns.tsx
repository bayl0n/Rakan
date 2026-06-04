"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  formatExpenseFrequency,
  type ExpenseFrequency,
} from "@/lib/budget";
import { formatCurrency } from "@/lib/format";

import type { Expense } from "./types";

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
        return formatCurrency(value);
      },
    },
    {
      accessorKey: "amountForPeriod",
      header: "Tracked",
      cell: (info) => {
        const value = Number(info.getValue());
        return formatCurrency(value);
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
