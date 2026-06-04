"use client";

import { PiggyBankIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { BudgetSplitFields } from "./budget-split-fields";
import type { BudgetSplitFormProps } from "./types";
import { useBudgetSplitForm } from "./use-budget-split-form";

export function BudgetSplitForm(props: BudgetSplitFormProps) {
  const {
    form,
    selectedSplitPresetId,
    submitBudgetSplit,
  } = useBudgetSplitForm(props);

  return (
    <Card className="min-w-0 lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <div>
          <CardTitle className="text-xl font-medium">Budget Split</CardTitle>
          <CardDescription>
            Choose a preset or configure percentages yourself.
          </CardDescription>
        </div>
        <PiggyBankIcon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submitBudgetSplit)}
            className="space-y-8"
          >
            <BudgetSplitFields
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
