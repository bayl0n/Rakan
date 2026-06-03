"use client";

import { useState } from "react";

import { BudgetDashboard } from "@/components/budget-calculator";
import ExpensesDashboard from "@/components/expenses/expenses-dashboard";
import { NavigationBar } from "@/components/navigation-bar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  budgetSplitPresets,
  calculatePaySummary,
  type BudgetSplit,
  type BudgetSplitPresetId,
  defaultBudgetSplit,
  type Per,
  type SuperMode,
  Pers,
} from "@/lib/budget";

export function RakanDashboard() {
  const [grossIncome, setGrossIncome] = useState<number>(50000);
  const [per, setPer] = useState<Per>(Pers[0]);
  const [superMode, setSuperMode] = useState<SuperMode>("onTop");
  const [superRate, setSuperRate] = useState<number>(12);
  const [hasHelpDebt, setHasHelpDebt] = useState<boolean>(false);
  const [budgetSplitPresetId, setBudgetSplitPresetId] =
    useState<BudgetSplitPresetId>("barefoot");
  const [customBudgetSplit, setCustomBudgetSplit] =
    useState<BudgetSplit>(defaultBudgetSplit);
  const paySummary = calculatePaySummary({
    grossIncome,
    per,
    superMode,
    superRate,
    hasHelpDebt,
  });
  const presetSplit =
    budgetSplitPresets.find((preset) => preset.id === budgetSplitPresetId)
      ?.split ?? defaultBudgetSplit;
  const activeBudgetSplit =
    budgetSplitPresetId === "custom" ? customBudgetSplit : presetSplit;

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-4 pt-4 sm:p-6 lg:p-8 lg:pt-6">
        <NavigationBar />
        <Tabs defaultValue="budget" className="space-y-4">
          <TabsList>
            <TabsTrigger value="budget">Budget</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
          </TabsList>
          <TabsContent value="budget" className="space-y-4">
            <BudgetDashboard
              grossIncome={grossIncome}
              setGrossIncome={setGrossIncome}
              per={per}
              setPer={setPer}
              superMode={superMode}
              setSuperMode={setSuperMode}
              superRate={superRate}
              setSuperRate={setSuperRate}
              hasHelpDebt={hasHelpDebt}
              setHasHelpDebt={setHasHelpDebt}
              paySummary={paySummary}
              budgetSplitPresetId={budgetSplitPresetId}
              setBudgetSplitPresetId={setBudgetSplitPresetId}
              customBudgetSplit={customBudgetSplit}
              setCustomBudgetSplit={setCustomBudgetSplit}
              activeBudgetSplit={activeBudgetSplit}
            />
          </TabsContent>
          <TabsContent value="expenses" className="space-y-4">
            <ExpensesDashboard
              budgetIncome={paySummary.annualNetPay}
              budgetSplit={activeBudgetSplit}
              incomePeriod="year"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
