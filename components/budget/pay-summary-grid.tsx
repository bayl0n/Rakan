import { DollarSignIcon } from "lucide-react";

import { convertPer, type Per } from "@/lib/budget";
import { formatCurrency } from "@/lib/format";

import type { PaySummaryRow } from "./types";

type PaySummaryGridProps = {
  paySummaryRows: PaySummaryRow[];
  selectedBudgetPeriod: Per;
};

export function PaySummaryGrid({
  paySummaryRows,
  selectedBudgetPeriod,
}: PaySummaryGridProps) {
  return (
    <section className="space-y-3">
      <header className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="text-sm font-medium">Deductions & Super</div>
        <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
      </header>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {paySummaryRows.map((row) => (
          <div key={row.label} className="rounded-md border p-3">
            <div className="text-xs font-medium text-muted-foreground">
              {row.label}
            </div>
            <div className="mt-1 text-xl font-bold">
              {formatCurrency(
                convertPer(row.amount, "year", selectedBudgetPeriod),
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
