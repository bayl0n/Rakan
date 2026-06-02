"use client";

import { LabelList, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

type BudgetPieChartProps = {
  fixedExpenses: number;
  lifestyleExpenses: number;
  futureSavings: number;
};

const chartConfig = {
  amount: {
    label: "Amount",
  },
  fixedExpenses: {
    label: "Fixed",
    color: "hsl(var(--chart-1))",
  },
  lifestyleExpenses: {
    label: "Lifestyle",
    color: "hsl(var(--chart-2))",
  },
  futureSavings: {
    label: "Savings",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function BudgetPieChart({
  fixedExpenses,
  lifestyleExpenses,
  futureSavings,
}: BudgetPieChartProps) {
  const chartData = [
    {
      category: "fixedExpenses",
      amount: fixedExpenses,
      fill: "var(--color-fixedExpenses)",
    },
    {
      category: "lifestyleExpenses",
      amount: lifestyleExpenses,
      fill: "var(--color-lifestyleExpenses)",
    },
    {
      category: "futureSavings",
      amount: futureSavings,
      fill: "var(--color-futureSavings)",
    },
  ];

  return (
    <Card className="flex flex-col border-none">
      <CardHeader className="items-center pb-0">
        <CardTitle>Budget Breakdown</CardTitle>
        <CardDescription>
          Fixed expenses, lifestyle, and future savings
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[500px] [&_.recharts-text]:fill-background"
        >
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  nameKey="category"
                  hideLabel
                  formatter={(value) =>
                    new Intl.NumberFormat("en-AU", {
                      style: "currency",
                      currency: "AUD",
                      maximumFractionDigits: 0,
                    }).format(Number(value))
                  }
                />
              }
            />

            <Pie data={chartData} dataKey="amount" nameKey="category">
              <LabelList
                dataKey="category"
                className="fill-background"
                stroke="none"
                fontSize={16}
                fontWeight={600}
                formatter={(value) =>
                  chartConfig[value as keyof typeof chartConfig]?.label
                }
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
