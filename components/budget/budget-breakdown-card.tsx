"use client";

import { useState } from "react";
import { WrenchIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  convertPer,
  getBudgetBreakdown,
  type Per,
} from "@/lib/budget";

import { BudgetAllocationGrid } from "./budget-allocation-grid";
import { BudgetPeriodTabs } from "./budget-period-tabs";
import { NetPayCard } from "./net-pay-card";
import { PaySummaryGrid } from "./pay-summary-grid";
import type { BudgetDashboardProps, PaySummaryRow } from "./types";

export function BudgetBreakdownCard({
  activeBudgetSplit,
  paySummary,
  per,
}: BudgetDashboardProps) {
  const [selectedBudgetPeriod, setSelectedBudgetPeriod] = useState<Per>(per);
  const breakdown = getBudgetBreakdown(
    paySummary.annualNetPay,
    "year",
    selectedBudgetPeriod,
    activeBudgetSplit,
  );
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
    <Card className="col-span-2 lg:col-span-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <div>
          <CardTitle className="text-2xl font-medium">
            Take Home & Budget
          </CardTitle>
          <CardDescription>
            Tax, Medicare, and HELP/HECS are estimates for planning only.
          </CardDescription>
        </div>
        <WrenchIcon className="h-4 w-4 text-muted-foreground" />
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
          <PaySummaryGrid
            paySummaryRows={paySummaryRows}
            selectedBudgetPeriod={selectedBudgetPeriod}
          />
          <BudgetAllocationGrid breakdown={breakdown} />
          <p className="text-xs text-muted-foreground">
            2025-26 estimate. Excludes offsets, deductions, private health,
            salary sacrifice, and residency adjustments.
          </p>
        </section>
      </CardContent>
    </Card>
  );
}
