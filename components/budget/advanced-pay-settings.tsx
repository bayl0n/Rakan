"use client";

import type { UseFormReturn } from "react-hook-form";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

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

import type { BudgetFormValues } from "./schema";

type AdvancedPaySettingsProps = {
  form: UseFormReturn<BudgetFormValues>;
  onShowAdvancedSettingsChange: (showAdvancedSettings: boolean) => void;
  showAdvancedSettings: boolean;
};

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
        onClick={() =>
          onShowAdvancedSettingsChange(!showAdvancedSettings)
        }
      >
        Advanced settings
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
            name="hasHelpDebt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>HELP/HECS Debt</FormLabel>
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
                      <SelectLabel>HELP/HECS</SelectLabel>
                      <SelectItem value="no">No HELP/HECS debt</SelectItem>
                      <SelectItem value="yes">Has HELP/HECS debt</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
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
                      <SelectLabel>Super</SelectLabel>
                      <SelectItem value="onTop">Super on top</SelectItem>
                      <SelectItem value="included">Super included</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
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
