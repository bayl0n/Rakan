"use client";
import { ColumnDef } from "@tanstack/react-table";
import {
  CheckIcon,
  XIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type BudgetCategoryId,
  type BudgetCategoryWithAmount,
} from "@/lib/finance/budget";
import {
  type ExpenseFrequency,
  formatExpenseFrequency,
} from "@/lib/finance/expenses";
import { Pers } from "@/lib/finance/periods";
import { formatCurrency } from "@/lib/format";

import { ExpenseActionsMenu } from "./expense-actions-menu";
import { PayerCombobox } from "./payer-combobox";
import type { Expense, ExpenseDraft } from "./types";

export type ExpenseTableMeta = {
  budgetBreakdown: BudgetCategoryWithAmount[];
  editingExpenseId: string | null;
  editingDraft: ExpenseDraft | null;
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

function getExpenseTableMeta(table: { options: { meta?: unknown } }) {
  return table.options.meta as ExpenseTableMeta;
}

export function getExpenseColumns(): ColumnDef<Expense>[] {
  const isEditing = (
    expenseId: string,
    editingExpenseId: string | null,
    editingDraft: ExpenseDraft | null,
  ) => editingExpenseId === expenseId && editingDraft;

  return [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row, table }) => {
        const { editingDraft, editingExpenseId, onUpdateEditingDraft } =
          getExpenseTableMeta(table);

        return isEditing(row.original.id, editingExpenseId, editingDraft) &&
          editingDraft ? (
          editingDraft.frequency === "oneOff" ? (
            <Input
              aria-label="Expense date"
              className="min-w-36"
              type="date"
              value={editingDraft.date}
              onChange={(event) =>
                onUpdateEditingDraft("date", event.target.value)
              }
            />
          ) : (
            <span className="text-muted-foreground">Recurring</span>
          )
        ) : (
          row.original.date
        );
      },
    },
    {
      accessorKey: "categoryLabel",
      header: "Category",
      cell: ({ row, table }) => {
        const {
          budgetBreakdown,
          editingDraft,
          editingExpenseId,
          onUpdateEditingDraft,
        } = getExpenseTableMeta(table);

        return isEditing(row.original.id, editingExpenseId, editingDraft) &&
          editingDraft ? (
          <Select
            value={editingDraft.categoryId}
            onValueChange={(value) =>
              onUpdateEditingDraft("categoryId", value as BudgetCategoryId)
            }
          >
            <SelectTrigger aria-label="Expense category" className="min-w-40">
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
        ) : (
          row.original.categoryLabel
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row, table }) => {
        const { editingDraft, editingExpenseId, onUpdateEditingDraft } =
          getExpenseTableMeta(table);

        return isEditing(row.original.id, editingExpenseId, editingDraft) &&
          editingDraft ? (
          <Input
            aria-label="Expense description"
            className="min-w-44"
            value={editingDraft.description}
            onChange={(event) =>
              onUpdateEditingDraft("description", event.target.value)
            }
          />
        ) : (
          row.original.description
        );
      },
    },
    {
      accessorKey: "payer",
      header: "Payer",
      cell: ({ row, table }) => {
        const {
          editingDraft,
          editingExpenseId,
          onUpdateEditingDraft,
          payerOptions,
        } = getExpenseTableMeta(table);

        return isEditing(row.original.id, editingExpenseId, editingDraft) &&
          editingDraft ? (
          <div className="min-w-44">
            <PayerCombobox
              id={`expense-payer-${row.original.id}`}
              onChange={(value) => onUpdateEditingDraft("payer", value)}
              options={payerOptions}
              placeholder="Who paid?"
              value={editingDraft.payer}
            />
          </div>
        ) : (
          row.original.payer
        );
      },
    },
    {
      accessorKey: "frequency",
      header: "Frequency",
      cell: ({ row, table }) => {
        const { editingDraft, editingExpenseId, onUpdateEditingDraft } =
          getExpenseTableMeta(table);

        return isEditing(row.original.id, editingExpenseId, editingDraft) &&
          editingDraft ? (
          <Select
            value={editingDraft.frequency}
            onValueChange={(value) =>
              onUpdateEditingDraft("frequency", value as ExpenseFrequency)
            }
          >
            <SelectTrigger aria-label="Expense frequency" className="min-w-36">
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
        ) : (
          formatExpenseFrequency(row.original.frequency)
        );
      },
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row, table }) => {
        const { editingDraft, editingExpenseId, onUpdateEditingDraft } =
          getExpenseTableMeta(table);

        return isEditing(row.original.id, editingExpenseId, editingDraft) &&
          editingDraft ? (
          <Input
            aria-label="Expense amount"
            className="min-w-28"
            min="0"
            step="0.01"
            type="number"
            value={editingDraft.amount}
            onChange={(event) =>
              onUpdateEditingDraft("amount", event.target.value)
            }
          />
        ) : (
          formatCurrency(row.original.amount)
        );
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
      cell: ({ row, table }) => {
        const {
          editingDraft,
          editingExpenseId,
          onCancelEditingExpense,
          onDeleteExpense,
          onSaveEditingExpense,
          onStartEditingExpense,
        } = getExpenseTableMeta(table);

        return isEditing(row.original.id, editingExpenseId, editingDraft) ? (
          <div className="flex justify-end gap-1">
            <Button
              aria-label="Save expense"
              size="icon"
              variant="ghost"
              onClick={onSaveEditingExpense}
            >
              <CheckIcon className="h-4 w-4" />
            </Button>
            <Button
              aria-label="Cancel editing expense"
              size="icon"
              variant="ghost"
              onClick={onCancelEditingExpense}
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex justify-end">
            <ExpenseActionsMenu
              expense={row.original}
              onDeleteExpense={onDeleteExpense}
              onStartEditingExpense={onStartEditingExpense}
            />
          </div>
        );
      },
    },
  ];
}
