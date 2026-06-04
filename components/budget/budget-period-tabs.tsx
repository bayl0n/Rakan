"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pers, type Per } from "@/lib/budget";

type BudgetPeriodTabsProps = {
  onSelectedBudgetPeriodChange: (period: Per) => void;
  selectedBudgetPeriod: Per;
};

export function BudgetPeriodTabs({
  onSelectedBudgetPeriodChange,
  selectedBudgetPeriod,
}: BudgetPeriodTabsProps) {
  return (
    <Tabs
      value={selectedBudgetPeriod}
      onValueChange={(value) => onSelectedBudgetPeriodChange(value as Per)}
    >
      <ScrollArea className="mb-4">
        <TabsList>
          {Pers.map((perTrigger) => {
            let currPer;
            if (perTrigger === "day") currPer = "dai";
            else currPer = perTrigger;

            return (
              <TabsTrigger key={perTrigger} value={perTrigger}>
                {currPer[0].toUpperCase() + currPer.slice(1)}ly
              </TabsTrigger>
            );
          })}
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </Tabs>
  );
}
