"use client";

import {
  BanknoteIcon,
  CalculatorIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DollarSignIcon,
  GemIcon,
  PiggyBankIcon,
  WrenchIcon,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "./ui/card";
import { Input } from "./ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import { Dispatch, SetStateAction, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectGroup,
} from "./ui/select";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import {
  BudgetSplitPresetIds,
  budgetCategories,
  budgetSplitPresets,
  convertPer,
  getBudgetBreakdown,
  getBudgetSplitTotal,
  type BudgetSplit,
  type BudgetSplitPresetId,
  type PaySummary,
  Pers,
  type Per,
  type SuperMode,
  SuperModes,
} from "@/lib/budget";

interface Props {
  grossIncome: number;
  setGrossIncome: Dispatch<SetStateAction<number>>;
  per: Per;
  setPer: Dispatch<SetStateAction<Per>>;
  superMode: SuperMode;
  setSuperMode: Dispatch<SetStateAction<SuperMode>>;
  superRate: number;
  setSuperRate: Dispatch<SetStateAction<number>>;
  hasHelpDebt: boolean;
  setHasHelpDebt: Dispatch<SetStateAction<boolean>>;
  paySummary: PaySummary;
  budgetSplitPresetId: BudgetSplitPresetId;
  setBudgetSplitPresetId: Dispatch<SetStateAction<BudgetSplitPresetId>>;
  customBudgetSplit: BudgetSplit;
  setCustomBudgetSplit: Dispatch<SetStateAction<BudgetSplit>>;
  activeBudgetSplit: BudgetSplit;
}

const formSchema = z.object({
  grossIncome: z.coerce.number().min(0, {
    message: "Gross income must be greater than 0.",
  }),
  per: z.enum(Pers),
  superMode: z.enum(SuperModes),
  superRate: z.coerce.number().min(0).max(100),
  hasHelpDebt: z.enum(["yes", "no"]),
  budgetSplitPresetId: z.enum(BudgetSplitPresetIds),
  fixedExpenses: z.coerce.number().min(0).max(100),
  lifestyleExpenses: z.coerce.number().min(0).max(100),
  futureSavings: z.coerce.number().min(0).max(100),
});

function formatCurrency(amount: number) {
  return amount.toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function BudgetDashboard(props: Props) {
  return (
    <div className="flex flex-col gap-4 sm:grid lg:grid-cols-6">
      <BudgetCalculatorForm {...props} />
      <BudgetBreakdownCard {...props} />
    </div>
  );
}

export function BudgetCalculatorForm({
  grossIncome,
  setGrossIncome,
  per,
  setPer,
  superMode,
  setSuperMode,
  superRate,
  setSuperRate,
  hasHelpDebt,
  setHasHelpDebt,
  budgetSplitPresetId,
  setBudgetSplitPresetId,
  customBudgetSplit,
  setCustomBudgetSplit,
}: Props) {
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      grossIncome: grossIncome,
      per: per,
      superMode: superMode,
      superRate: superRate,
      hasHelpDebt: hasHelpDebt ? "yes" : "no",
      budgetSplitPresetId: budgetSplitPresetId,
      fixedExpenses: customBudgetSplit.fixedExpenses,
      lifestyleExpenses: customBudgetSplit.lifestyleExpenses,
      futureSavings: customBudgetSplit.futureSavings,
    },
  });
  const selectedSplitPresetId = form.watch("budgetSplitPresetId");
  const customSplitTotal =
    Number(form.watch("fixedExpenses")) +
    Number(form.watch("lifestyleExpenses")) +
    Number(form.watch("futureSavings"));

  function useSubmit(values: z.infer<typeof formSchema>) {
    const customSplit: BudgetSplit = {
      fixedExpenses: values.fixedExpenses,
      lifestyleExpenses: values.lifestyleExpenses,
      futureSavings: values.futureSavings,
    };

    if (
      values.budgetSplitPresetId === "custom" &&
      getBudgetSplitTotal(customSplit) !== 100
    ) {
      form.setError("futureSavings", {
        message: "Custom split must total 100%.",
      });
      return;
    }

    setGrossIncome(values.grossIncome);
    setPer(values.per);
    setSuperMode(values.superMode);
    setSuperRate(values.superRate);
    setHasHelpDebt(values.hasHelpDebt === "yes");
    setBudgetSplitPresetId(values.budgetSplitPresetId);
    setCustomBudgetSplit(customSplit);
  }

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
          <form onSubmit={form.handleSubmit(useSubmit)} className="space-y-8">
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            <div className="space-y-4">
              <Button
                className="w-full justify-between"
                type="button"
                variant="ghost"
                onClick={() =>
                  setShowAdvancedSettings((currentValue) => !currentValue)
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
                              <SelectItem value="no">
                                No HELP/HECS debt
                              </SelectItem>
                              <SelectItem value="yes">
                                Has HELP/HECS debt
                              </SelectItem>
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
                              <SelectItem value="onTop">
                                Super on top
                              </SelectItem>
                              <SelectItem value="included">
                                Super included
                              </SelectItem>
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
                        <FormDescription>
                          Default estimate is 12%.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ) : null}
            </div>
            <FormField
              control={form.control}
              name="budgetSplitPresetId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Split</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                          <Input
                            max="100"
                            min="0"
                            step="1"
                            type="number"
                            {...field}
                          />
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
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export function BudgetBreakdownCard({
  per,
  paySummary,
  activeBudgetSplit,
}: Props) {
  const [selectedBudgetPeriod, setSelectedBudgetPeriod] = useState<Per>(per);
  const breakdown = getBudgetBreakdown(
    paySummary.annualNetPay,
    "year",
    selectedBudgetPeriod,
    activeBudgetSplit,
  );
  const netPayForPeriod = convertPer(
    paySummary.annualNetPay,
    "year",
    selectedBudgetPeriod,
  );
  const paySummaryRows = [
    {
      label: "Gross Pay",
      amount: paySummary.annualTaxableIncome,
    },
    {
      label: "Estimated Tax",
      amount: paySummary.annualIncomeTax,
    },
    {
      label: "Medicare Levy",
      amount: paySummary.annualMedicareLevy,
    },
    {
      label: "HELP/HECS Repayment",
      amount: paySummary.annualHelpRepayment,
    },
    {
      label: "Superannuation",
      amount: paySummary.annualSuper,
    },
  ];

  return (
    <Card className="col-span-2 lg:col-span-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <div>
          <CardTitle className="text-2xl font-medium">
            Take Home & Budget
          </CardTitle>
          <CardDescription>
            Tax, Medicare, and HELP/HECS are estimates for planning only.
          </CardDescription>
        </div>
        <WrenchIcon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <Tabs
          value={selectedBudgetPeriod}
          onValueChange={(value) => setSelectedBudgetPeriod(value as Per)}
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
        <Separator className="mb-4" />
        <section className="space-y-4">
          <div className="rounded-md border bg-muted p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Net Pay
                </div>
                <div className="mt-2 text-3xl font-bold">
                  {formatCurrency(netPayForPeriod)}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  / {selectedBudgetPeriod}
                </div>
              </div>
              <DollarSignIcon className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          <section className="space-y-3">
            <header className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="text-sm font-medium">Deductions & Super</div>
              <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
            </header>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {paySummaryRows.map((row) => (
                <div key={row.label} className="rounded-md border p-3">
                  <div className="text-xs font-medium text-muted-foreground">
                    {row.label}
                  </div>
                  <div className="mt-1 text-xl font-bold">
                    {formatCurrency(
                      convertPer(row.amount, "year", selectedBudgetPeriod),
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="space-y-3">
            <div className="text-sm font-medium">Budget Allocation</div>
            <div className="grid gap-3 md:grid-cols-3">
              {breakdown.map((category) => {
                const Icon =
                  category.id === "fixedExpenses"
                    ? BanknoteIcon
                    : category.id === "lifestyleExpenses"
                      ? GemIcon
                      : PiggyBankIcon;

                return (
                  <div
                    key={category.id}
                    className="space-y-3 rounded-md border p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-medium">
                        {category.label}
                      </div>
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">
                      {formatCurrency(category.amount)}
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{category.percent}% of net pay</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${category.percent}%`,
                          backgroundColor: category.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
          <p className="text-xs text-muted-foreground">
            2025-26 estimate. Excludes offsets, deductions, private health,
            salary sacrifice, and residency adjustments.
          </p>
        </section>
      </CardContent>
    </Card>
  );
}
