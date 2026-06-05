"use client";

import type { UseFormReturn } from "react-hook-form";
import { ChevronDownIcon, ChevronUpIcon, SettingsIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { TaxYears } from "@/lib/finance/pay";

import type { PayFormValues } from "./schema";

type AdvancedPaySettingsProps = {
  form: UseFormReturn<PayFormValues>;
  onShowAdvancedSettingsChange: (showAdvancedSettings: boolean) => void;
  showAdvancedSettings: boolean;
};

const optionButtonClassName =
  "h-auto min-h-10 whitespace-normal px-3 py-2 text-center leading-snug";

export function AdvancedPaySettings({
  form,
  onShowAdvancedSettingsChange,
  showAdvancedSettings,
}: AdvancedPaySettingsProps) {
  return (
    <div className="space-y-4">
      <Button
        className="w-full justify-between"
        type="button"
        variant="ghost"
        onClick={() => onShowAdvancedSettingsChange(!showAdvancedSettings)}
      >
        <span className="flex items-center gap-2">
          <SettingsIcon className="h-4 w-4" />
          More settings
        </span>
        {showAdvancedSettings ? (
          <ChevronUpIcon className="h-4 w-4" />
        ) : (
          <ChevronDownIcon className="h-4 w-4" />
        )}
      </Button>
      {showAdvancedSettings ? (
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="taxYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tax Year</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a tax year..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Australian income year</SelectLabel>
                      {TaxYears.map((taxYear) => (
                        <SelectItem key={taxYear} value={taxYear}>
                          {taxYear}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Applies resident tax rates and HELP/HECS thresholds for that
                  income year.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hasHelpDebt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>HELP/HECS Debt</FormLabel>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    className={optionButtonClassName}
                    type="button"
                    variant={!field.value ? "default" : "outline"}
                    onClick={() => field.onChange(false)}
                  >
                    No HELP/HECS debt
                  </Button>
                  <Button
                    className={optionButtonClassName}
                    type="button"
                    variant={field.value ? "default" : "outline"}
                    onClick={() => field.onChange(true)}
                  >
                    Has HELP/HECS debt
                  </Button>
                </div>
                <FormDescription>
                  Adds an estimated compulsory repayment.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="superMode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Superannuation</FormLabel>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    className={optionButtonClassName}
                    type="button"
                    variant={field.value === "onTop" ? "default" : "outline"}
                    onClick={() => field.onChange("onTop")}
                  >
                    Super on top
                  </Button>
                  <Button
                    className={optionButtonClassName}
                    type="button"
                    variant={field.value === "included" ? "default" : "outline"}
                    onClick={() => field.onChange("included")}
                  >
                    Super included
                  </Button>
                </div>
                <FormDescription>
                  Whether your entered income includes super.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="superRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Super Guarantee Rate</FormLabel>
                <FormControl>
                  <Input
                    max="100"
                    min="0"
                    step="0.1"
                    type="number"
                    placeholder="12"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Default estimate is 12%.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ) : null}
    </div>
  );
}
