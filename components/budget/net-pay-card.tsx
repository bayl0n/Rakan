import { DollarSignIcon } from "lucide-react";

import type { Per } from "@/lib/budget";
import { formatCurrency } from "@/lib/format";

type NetPayCardProps = {
  netPayForPeriod: number;
  selectedBudgetPeriod: Per;
};

export function NetPayCard({
  netPayForPeriod,
  selectedBudgetPeriod,
}: NetPayCardProps) {
  return (
    <div className="rounded-md border bg-muted p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-medium text-muted-foreground">
            Net Pay
          </div>
          <div className="mt-2 text-3xl font-bold">
            {formatCurrency(netPayForPeriod)}
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            / {selectedBudgetPeriod}
          </div>
        </div>
        <DollarSignIcon className="h-5 w-5 text-muted-foreground" />
      </div>
    </div>
  );
}
