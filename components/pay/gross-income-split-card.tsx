import { convertIncomeForPeriod, type Per } from "@/lib/finance/periods";
import type { PaySummary } from "@/lib/finance/pay";
import { formatCurrency } from "@/lib/format";

type GrossIncomeSplitCardProps = {
  paySummary: PaySummary;
  selectedBudgetPeriod: Per;
};

type GrossIncomeSplitSegment = {
  amount: number;
  color: string;
  label: string;
};

function getPercent(amount: number, total: number) {
  if (total <= 0) return 0;

  return Math.min(Math.max((amount / total) * 100, 0), 100);
}

export function GrossIncomeSplitCard({
  paySummary,
  selectedBudgetPeriod,
}: GrossIncomeSplitCardProps) {
  const grossForPeriod = convertIncomeForPeriod(
    paySummary.annualTaxableIncome,
    "year",
    selectedBudgetPeriod,
  );
  const superForPeriod = convertIncomeForPeriod(
    paySummary.annualSuper,
    "year",
    selectedBudgetPeriod,
  );
  const isSuperIncluded =
    Math.abs(paySummary.annualPackage - paySummary.annualTaxableIncome) > 0.01;
  const segments: GrossIncomeSplitSegment[] = [
    {
      label: "Net Pay",
      amount: convertIncomeForPeriod(
        paySummary.annualNetPay,
        "year",
        selectedBudgetPeriod,
      ),
      color: "hsl(var(--chart-1))",
    },
    {
      label: "Estimated Tax",
      amount: convertIncomeForPeriod(
        paySummary.annualIncomeTax,
        "year",
        selectedBudgetPeriod,
      ),
      color: "hsl(var(--destructive))",
    },
    {
      label: "Medicare Levy",
      amount: convertIncomeForPeriod(
        paySummary.annualMedicareLevy,
        "year",
        selectedBudgetPeriod,
      ),
      color: "hsl(var(--chart-2))",
    },
    {
      label: "HELP/HECS Repayment",
      amount: convertIncomeForPeriod(
        paySummary.annualHelpRepayment,
        "year",
        selectedBudgetPeriod,
      ),
      color: "hsl(var(--chart-5))",
    },
  ].filter((segment) => segment.amount > 0);
  const superDescription = isSuperIncluded
    ? "included in the entered package"
    : "paid on top of the entered gross income";

  return (
    <section className="space-y-3">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="text-sm font-medium">Gross Income Split</div>
        <div className="text-xs text-muted-foreground">
          {formatCurrency(grossForPeriod)} / {selectedBudgetPeriod}
        </div>
      </div>
      <div className="overflow-hidden rounded-full bg-muted">
        <div className="flex h-3">
          {segments.length ? (
            segments.map((segment) => (
              <div
                key={segment.label}
                className="h-full"
                style={{
                  width: `${getPercent(segment.amount, grossForPeriod)}%`,
                  backgroundColor: segment.color,
                }}
              />
            ))
          ) : (
            <div className="h-full w-full bg-muted" />
          )}
        </div>
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        {segments.map((segment) => {
          const percent = getPercent(segment.amount, grossForPeriod);

          return (
            <div
              key={segment.label}
              className="flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: segment.color }}
                />
                <span className="truncate font-medium">{segment.label}</span>
              </div>
              <div className="shrink-0 text-right">
                <div className="font-medium">
                  {formatCurrency(segment.amount)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {percent.toFixed(0)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="rounded-md border border-dashed px-3 py-2 text-sm">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <div className="font-medium">Superannuation</div>
          <div className="shrink-0 font-medium">
            {formatCurrency(superForPeriod)} / {selectedBudgetPeriod}
          </div>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Super is {superDescription}.
        </p>
      </div>
    </section>
  );
}
