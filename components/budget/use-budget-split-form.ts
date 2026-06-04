"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  getBudgetSplitTotal,
  type BudgetSplit,
} from "@/lib/budget";

import {
  budgetSplitFormSchema,
  type BudgetSplitFormValues,
} from "./schema";
import type { BudgetSplitFormProps } from "./types";

export function useBudgetSplitForm({
  budgetSplitPresetId,
  customBudgetSplit,
  setBudgetSplitPresetId,
  setCustomBudgetSplit,
}: BudgetSplitFormProps) {
  const form = useForm<BudgetSplitFormValues>({
    resolver: zodResolver(budgetSplitFormSchema),
    defaultValues: {
      budgetSplitPresetId,
      fixedExpenses: customBudgetSplit.fixedExpenses,
      lifestyleExpenses: customBudgetSplit.lifestyleExpenses,
      futureSavings: customBudgetSplit.futureSavings,
    },
  });
  const selectedSplitPresetId = form.watch("budgetSplitPresetId");

  function submitBudgetSplit(values: BudgetSplitFormValues) {
    const customSplit: BudgetSplit = {
      fixedExpenses: values.fixedExpenses,
      lifestyleExpenses: values.lifestyleExpenses,
      futureSavings: values.futureSavings,
    };

    if (
      values.budgetSplitPresetId === "custom" &&
      getBudgetSplitTotal(customSplit) !== 100
    ) {
      form.setError("futureSavings", {
        message: "Custom split must total 100%.",
      });
      return;
    }

    setBudgetSplitPresetId(values.budgetSplitPresetId);
    setCustomBudgetSplit(customSplit);
  }

  return {
    form,
    selectedSplitPresetId,
    submitBudgetSplit,
  };
}
