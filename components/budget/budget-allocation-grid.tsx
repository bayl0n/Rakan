import {
  BanknoteIcon,
  GemIcon,
  PiggyBankIcon,
} from "lucide-react";

import type { BudgetCategoryWithAmount } from "@/lib/budget";
import { formatCurrency } from "@/lib/format";

type BudgetAllocationGridProps = {
  breakdown: BudgetCategoryWithAmount[];
};

export function BudgetAllocationGrid({
  breakdown,
}: BudgetAllocationGridProps) {
  return (
    <section className="space-y-3">
      <div className="text-sm font-medium">Budget Allocation</div>
      <div className="grid gap-3 md:grid-cols-3">
        {breakdown.map((category) => {
          const Icon =
            category.id === "fixedExpenses"
              ? BanknoteIcon
              : category.id === "lifestyleExpenses"
                ? GemIcon
                : PiggyBankIcon;

          return (
            <div key={category.id} className="space-y-3 rounded-md border p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-medium">{category.label}</div>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">
                {formatCurrency(category.amount)}
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{category.percent}% of net pay</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${category.percent}%`,
                    backgroundColor: category.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
