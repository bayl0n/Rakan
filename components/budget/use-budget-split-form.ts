"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  getBudgetSplitTotal,
  type BudgetSplit,
} from "@/lib/finance/budget";

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
    mode: "onChange",
    defaultValues: {
      budgetSplitPresetId,
      fixedExpenses: customBudgetSplit.fixedExpenses,
      lifestyleExpenses: customBudgetSplit.lifestyleExpenses,
      futureSavings: customBudgetSplit.futureSavings,
    },
  });
  const selectedSplitPresetId = form.watch("budgetSplitPresetId");

  useEffect(() => {
    const subscription = form.watch((values) => {
      const result = budgetSplitFormSchema.safeParse(values);

      if (!result.success) return;

      const customSplit: BudgetSplit = {
        fixedExpenses: result.data.fixedExpenses,
        lifestyleExpenses: result.data.lifestyleExpenses,
        futureSavings: result.data.futureSavings,
      };

      if (
        result.data.budgetSplitPresetId === "custom" &&
        getBudgetSplitTotal(customSplit) !== 100
      ) {
        form.setError("futureSavings", {
          message: "Custom split must total 100%.",
        });
        return;
      }

      form.clearErrors("futureSavings");
      setBudgetSplitPresetId(result.data.budgetSplitPresetId);
      setCustomBudgetSplit(customSplit);
    });

    return () => subscription.unsubscribe();
  }, [form, setBudgetSplitPresetId, setCustomBudgetSplit]);

  return {
    form,
    selectedSplitPresetId,
  };
}
