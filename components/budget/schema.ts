import * as z from "zod";

import { BudgetSplitPresetIds } from "@/lib/finance/budget";

export const budgetSplitFormSchema = z.object({
  budgetSplitPresetId: z.enum(BudgetSplitPresetIds),
  fixedExpenses: z.coerce.number().min(0).max(100),
  lifestyleExpenses: z.coerce.number().min(0).max(100),
  futureSavings: z.coerce.number().min(0).max(100),
});

export type BudgetSplitFormValues = z.infer<typeof budgetSplitFormSchema>;
