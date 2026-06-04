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
import { Input } from "@/components/ui/input";
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
  budgetCategories,
  budgetSplitPresets,
  type BudgetSplitPresetId,
} from "@/lib/budget";

import { BudgetSplitSlider } from "./budget-split-slider";
import type { BudgetFormValues } from "./schema";

type BudgetSplitFieldsProps = {
  customSplitTotal: number;
  form: UseFormReturn<BudgetFormValues>;
  selectedSplitPresetId: BudgetSplitPresetId;
};

export function BudgetSplitFields({
  customSplitTotal,
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
      {selectedSplitPresetId === "custom" ? (
        <div className="space-y-4 rounded-md border p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm font-medium">Custom split</div>
            <div
              className={
                customSplitTotal === 100
                  ? "text-sm text-muted-foreground"
                  : "text-sm font-medium text-destructive"
              }
            >
              Total: {customSplitTotal}%
            </div>
          </div>
          {budgetCategories.map((category) => (
            <FormField
              key={category.id}
              control={form.control}
              name={category.id}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{category.label}</FormLabel>
                  <FormControl>
                    <Input max="100" min="0" step="1" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          {customSplitTotal !== 100 ? (
            <p className="text-sm text-destructive">
              Custom split must total 100% before it can be applied.
            </p>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
