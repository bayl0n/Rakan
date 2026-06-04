"use client";

import { CalculatorIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
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
import { Pers } from "@/lib/budget";

import { AdvancedPaySettings } from "./advanced-pay-settings";
import { BudgetSplitFields } from "./budget-split-fields";
import type { BudgetDashboardProps } from "./types";
import { useBudgetForm } from "./use-budget-form";

export function BudgetCalculatorForm(props: BudgetDashboardProps) {
  const {
    customSplitTotal,
    form,
    selectedSplitPresetId,
    setShowAdvancedSettings,
    showAdvancedSettings,
    submitBudgetDetails,
  } = useBudgetForm(props);

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <div>
          <CardTitle className="text-xl font-medium">Pay Details</CardTitle>
          <CardDescription>
            Estimate take-home pay before building your budget.
          </CardDescription>
        </div>
        <CalculatorIcon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submitBudgetDetails)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="grossIncome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gross Income</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Gross Income"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>This is your gross income.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="per"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pay Frequency</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Frequency</SelectLabel>
                        {Pers.map((per) => {
                          return (
                            <SelectItem key={per} value={per}>
                              {per}
                            </SelectItem>
                          );
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormDescription>How often you are paid.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AdvancedPaySettings
              form={form}
              onShowAdvancedSettingsChange={setShowAdvancedSettings}
              showAdvancedSettings={showAdvancedSettings}
            />
            <BudgetSplitFields
              customSplitTotal={customSplitTotal}
              form={form}
              selectedSplitPresetId={selectedSplitPresetId}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
