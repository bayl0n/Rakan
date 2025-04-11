"use client";
import { ColumnDef } from "@tanstack/react-table";

const ExpenseStatuses = ["pending", "processing", "success", "failed"] as const;
type ExpenseStatus = typeof ExpenseStatuses[number];

export type Expense = {
    id: string,
    amount: number,
    status: ExpenseStatus,
    payer: string
}

export const columns: ColumnDef<Expense>[] = [
    {
        accessorKey: "status",
        header: "Status",
        cell: info => {
            const value = info.getValue() as ExpenseStatus;
            return value ? value.charAt(0).toUpperCase() + value.slice(1) : '';
          },
    },
    {
        accessorKey: "payer",
        header: "Payer",
    },
    {
        accessorKey: "amount",
        header: "Amount",
        cell: info => {
            const value = Number(info.getValue());
            return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          }
    },
]