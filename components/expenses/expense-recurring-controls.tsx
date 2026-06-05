"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type ExpenseFrequency,
  formatExpenseFrequency,
} from "@/lib/finance/expenses";
import {
  type Per,
  Pers,
} from "@/lib/finance/periods";

type ExpenseRecurringControlsProps = {
  frequency: ExpenseFrequency;
  onFrequencyChange: (frequency: ExpenseFrequency) => void;
};

const defaultRecurringFrequency: Per = "month";

export function ExpenseRecurringControls({
  frequency,
  onFrequencyChange,
}: ExpenseRecurringControlsProps) {
  const isRecurring = frequency !== "oneOff";
  const [lastRecurringFrequency, setLastRecurringFrequency] = useState<Per>(
    isRecurring ? frequency : defaultRecurringFrequency,
  );

  function selectOneOff() {
    if (isRecurring) setLastRecurringFrequency(frequency);
    onFrequencyChange("oneOff");
  }

  function selectRecurring() {
    if (isRecurring) return;
    onFrequencyChange(lastRecurringFrequency);
  }

  function updateRecurringFrequency(value: Per) {
    setLastRecurringFrequency(value);
    onFrequencyChange(value);
  }

  return (
    <div className="grid gap-2">
      <Label>Expense type</Label>
      <div className="grid grid-cols-2 gap-2">
        <Button
          aria-pressed={!isRecurring}
          type="button"
          variant={!isRecurring ? "default" : "outline"}
          onClick={selectOneOff}
        >
          One-off
        </Button>
        <Button
          aria-pressed={isRecurring}
          type="button"
          variant={isRecurring ? "default" : "outline"}
          onClick={selectRecurring}
        >
          Recurring
        </Button>
      </div>
      {isRecurring ? (
        <Select
          value={frequency}
          onValueChange={(value) => updateRecurringFrequency(value as Per)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a frequency" />
          </SelectTrigger>
          <SelectContent>
            {Pers.map((per) => (
              <SelectItem key={per} value={per}>
                {formatExpenseFrequency(per)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : null}
    </div>
  );
}
