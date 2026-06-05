"use client";

import { CalculatorIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Pers } from "@/lib/finance/periods";

import { AdvancedPaySettings } from "./advanced-pay-settings";
import type { PayDetailsFormProps } from "./types";
import { usePayForm } from "./use-pay-form";

export function PayDetailsForm(props: PayDetailsFormProps) {
  const {
    form,
    setShowAdvancedSettings,
    showAdvancedSettings,
  } = usePayForm(props);

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
            className="space-y-8"
            noValidate
            onSubmit={(event) => event.preventDefault()}
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
                    value={field.value}
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
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
