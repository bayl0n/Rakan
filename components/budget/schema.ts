import * as z from "zod";

import {
  BudgetSplitPresetIds,
  Pers,
  SuperModes,
} from "@/lib/budget";

export const budgetFormSchema = z.object({
  grossIncome: z.coerce.number().min(0, {
    message: "Gross income must be greater than 0.",
  }),
  per: z.enum(Pers),
  superMode: z.enum(SuperModes),
  superRate: z.coerce.number().min(0).max(100),
  hasHelpDebt: z.enum(["yes", "no"]),
  budgetSplitPresetId: z.enum(BudgetSplitPresetIds),
  fixedExpenses: z.coerce.number().min(0).max(100),
  lifestyleExpenses: z.coerce.number().min(0).max(100),
  futureSavings: z.coerce.number().min(0).max(100),
});

export type BudgetFormValues = z.infer<typeof budgetFormSchema>;
