"use client";

import { useState } from "react";
import { WalletCardsIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { convertPer, type PaySummary, type Per } from "@/lib/budget";

import { BudgetPeriodTabs } from "./budget-period-tabs";
import { GrossIncomeSplitCard } from "./gross-income-split-card";
import { NetPayCard } from "./net-pay-card";
import { PaySummaryGrid } from "./pay-summary-grid";
import type { PaySummaryRow } from "./types";

type PayBreakdownCardProps = {
  paySummary: PaySummary;
  per: Per;
};

export function PayBreakdownCard({
  paySummary,
  per,
}: PayBreakdownCardProps) {
  const [selectedBudgetPeriod, setSelectedBudgetPeriod] = useState<Per>(per);
  const netPayForPeriod = convertPer(
    paySummary.annualNetPay,
    "year",
    selectedBudgetPeriod,
  );
  const paySummaryRows: PaySummaryRow[] = [
    {
      label: "Gross Pay",
      amount: paySummary.annualTaxableIncome,
    },
    {
      label: "Estimated Tax",
      amount: paySummary.annualIncomeTax,
    },
    {
      label: "Medicare Levy",
      amount: paySummary.annualMedicareLevy,
    },
    {
      label: "HELP/HECS Repayment",
      amount: paySummary.annualHelpRepayment,
    },
    {
      label: "Superannuation",
      amount: paySummary.annualSuper,
    },
  ];

  return (
    <Card className="min-w-0 lg:col-span-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <div>
          <CardTitle className="text-2xl font-medium">Take Home Pay</CardTitle>
          <CardDescription>
            Tax, Medicare, and HELP/HECS are estimates for planning only.
          </CardDescription>
        </div>
        <WalletCardsIcon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <BudgetPeriodTabs
          onSelectedBudgetPeriodChange={setSelectedBudgetPeriod}
          selectedBudgetPeriod={selectedBudgetPeriod}
        />
        <Separator className="mb-4" />
        <section className="space-y-4">
          <NetPayCard
            netPayForPeriod={netPayForPeriod}
            selectedBudgetPeriod={selectedBudgetPeriod}
          />
          <GrossIncomeSplitCard
            paySummary={paySummary}
            selectedBudgetPeriod={selectedBudgetPeriod}
          />
          <PaySummaryGrid
            paySummaryRows={paySummaryRows}
            selectedBudgetPeriod={selectedBudgetPeriod}
          />
          <p className="text-xs text-muted-foreground">
            2025-26 estimate. Excludes offsets, deductions, private health,
            salary sacrifice, and residency adjustments.
          </p>
        </section>
      </CardContent>
    </Card>
  );
}
