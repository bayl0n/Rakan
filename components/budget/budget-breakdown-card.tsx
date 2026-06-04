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
  getBudgetBreakdown,
  type Per,
} from "@/lib/budget";

import { BudgetAllocationGrid } from "./budget-allocation-grid";
import { BudgetPeriodTabs } from "./budget-period-tabs";
import type { BudgetDashboardProps } from "./types";

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

  return (
    <Card className="min-w-0 lg:col-span-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <div>
          <CardTitle className="text-2xl font-medium">Budget Allocation</CardTitle>
          <CardDescription>
            Your take-home pay split across fixed expenses, lifestyle, and savings.
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
          <BudgetAllocationGrid breakdown={breakdown} />
        </section>
      </CardContent>
    </Card>
  );
}
