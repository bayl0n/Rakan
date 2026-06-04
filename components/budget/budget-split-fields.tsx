"use client";

import type { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type BudgetSplit,
  budgetSplitPresets,
  type BudgetSplitPresetId,
} from "@/lib/budget";

import { BudgetSplitSlider } from "./budget-split-slider";
import type { BudgetSplitFormValues } from "./schema";

type BudgetSplitFieldsProps = {
  form: UseFormReturn<BudgetSplitFormValues>;
  selectedSplitPresetId: BudgetSplitPresetId;
};

export function BudgetSplitFields({
  form,
  selectedSplitPresetId,
}: BudgetSplitFieldsProps) {
  const customSplit = {
    fixedExpenses: Number(form.watch("fixedExpenses")),
    lifestyleExpenses: Number(form.watch("lifestyleExpenses")),
    futureSavings: Number(form.watch("futureSavings")),
  };
  const selectedPreset = budgetSplitPresets.find(
    (preset) => preset.id === selectedSplitPresetId,
  );
  const displayedSplit =
    selectedSplitPresetId === "custom"
      ? customSplit
      : selectedPreset?.split ?? customSplit;

  function setSplitFields(split: BudgetSplit) {
    form.setValue("fixedExpenses", split.fixedExpenses);
    form.setValue("lifestyleExpenses", split.lifestyleExpenses);
    form.setValue("futureSavings", split.futureSavings);
  }

  function selectBudgetSplit(value: BudgetSplitPresetId) {
    form.setValue("budgetSplitPresetId", value);

    if (value === "custom") return;

    const preset = budgetSplitPresets.find(
      (budgetSplitPreset) => budgetSplitPreset.id === value,
    );

    if (preset) setSplitFields(preset.split);
  }

  function updateCustomSplit(split: BudgetSplit) {
    form.setValue("budgetSplitPresetId", "custom");
    setSplitFields(split);
  }

  return (
    <>
      <FormField
        control={form.control}
        name="budgetSplitPresetId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Budget Split</FormLabel>
            <Select onValueChange={selectBudgetSplit} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select an option..." />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Presets</SelectLabel>
                  {budgetSplitPresets.map((preset) => (
                    <SelectItem key={preset.id} value={preset.id}>
                      {preset.label}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <FormDescription>
              Choose a preset or configure percentages yourself.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <BudgetSplitSlider
        onSplitChange={updateCustomSplit}
        split={displayedSplit}
      />
    </>
  );
}
