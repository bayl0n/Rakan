"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  formatPeriodWindow,
  formatPer,
  Pers,
  type Per,
} from "@/lib/finance/periods";

type ExpensePeriodControlsProps = {
  activePeriodAnchorDate: string;
  budgetPeriod: Per;
  onBudgetPeriodChange: (period: Per) => void;
  onPeriodAnchorDateChange: (date: string) => void;
  onShiftViewingPeriod: (direction: "previous" | "next") => void;
  periodAnchorDate: string;
};

export function ExpensePeriodControls({
  activePeriodAnchorDate,
  budgetPeriod,
  onBudgetPeriodChange,
  onPeriodAnchorDateChange,
  onShiftViewingPeriod,
  periodAnchorDate,
}: ExpensePeriodControlsProps) {
  return (
    <Card className="min-w-0">
      <CardHeader className="space-y-4 p-4 pb-4 sm:p-6 sm:pb-4">
        <div className="min-w-0">
          <CardTitle className="text-xl font-medium">Expenses Period</CardTitle>
          <CardDescription>
            Budget, recurring expenses, and one-offs are tracked in this period
          </CardDescription>
        </div>
        <Tabs
          value={budgetPeriod}
          onValueChange={(value) => onBudgetPeriodChange(value as Per)}
        >
          <ScrollArea className="max-w-full">
            <TabsList className="w-max">
              {Pers.map((per) => (
                <TabsTrigger key={per} value={per}>
                  {formatPer(per)}
                </TabsTrigger>
              ))}
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </Tabs>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <Label>Viewing</Label>
            <div className="grid grid-cols-[40px_minmax(0,1fr)_40px] items-center gap-2 sm:flex">
              <Button
                aria-label="View previous period"
                className="shrink-0"
                size="icon"
                type="button"
                variant="outline"
                onClick={() => onShiftViewingPeriod("previous")}
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <div className="min-w-0 overflow-hidden rounded-md border bg-muted px-2 py-2 text-center text-sm font-medium sm:min-w-[180px] sm:px-4">
                <span className="block truncate">
                  {formatPeriodWindow(activePeriodAnchorDate, budgetPeriod)}
                </span>
              </div>
              <Button
                aria-label="View next period"
                className="shrink-0"
                size="icon"
                type="button"
                variant="outline"
                onClick={() => onShiftViewingPeriod("next")}
              >
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="grid gap-2 sm:max-w-[180px]">
            <Label htmlFor="period-anchor-date">Jump to date</Label>
            <Input
              id="period-anchor-date"
              type="date"
              value={periodAnchorDate}
              onChange={(event) => onPeriodAnchorDateChange(event.target.value)}
            />
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
