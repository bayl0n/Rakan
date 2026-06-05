"use client";

import { Label, Pie, PieChart } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { BudgetCategoryWithAmount } from "@/lib/finance/budget";

type BudgetPieChartProps = {
  categories: BudgetCategoryWithAmount[];
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

export function BudgetPieChart({ categories }: BudgetPieChartProps) {
  const total = categories.reduce((sum, category) => sum + category.amount, 0);
  const chartData = categories.map((category) => ({
    category: category.id,
    label: category.shortLabel,
    amount: category.amount,
    percent: category.percent,
    fill: `var(--color-${category.id})`,
  }));
  const currencyFormatter = new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  });

  return (
    <section className="flex flex-col">
      <header className="items-center pb-0 text-center">
        <h3 className="text-lg font-semibold leading-none tracking-tight">
          Budget Breakdown
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Fixed expenses, lifestyle, and future savings
        </p>
      </header>

      <div className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  nameKey="category"
                  hideLabel
                  formatter={(value, name, item) =>
                    `${currencyFormatter.format(Number(value))} (${item.payload.percent}%)`
                  }
                />
              }
            />

            <Pie
              data={chartData}
              dataKey="amount"
              innerRadius="62%"
              nameKey="category"
              outerRadius="88%"
              paddingAngle={3}
              strokeWidth={4}
            >
              <Label
                content={({ viewBox }) => {
                  if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) {
                    return null;
                  }

                  return (
                    <text
                      dominantBaseline="middle"
                      textAnchor="middle"
                      x={viewBox.cx}
                      y={viewBox.cy}
                    >
                      <tspan
                        className="fill-muted-foreground"
                        fontSize={12}
                        x={viewBox.cx}
                        y={Number(viewBox.cy) - 10}
                      >
                        Total
                      </tspan>
                      <tspan
                        className="fill-foreground"
                        fontSize={18}
                        fontWeight={700}
                        x={viewBox.cx}
                        y={Number(viewBox.cy) + 14}
                      >
                        {currencyFormatter.format(total)}
                      </tspan>
                    </text>
                  );
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </div>
      <div className="grid gap-2">
        {chartData.map((item) => (
          <div
            key={item.category}
            className="flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm"
          >
            <div className="flex min-w-0 items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: item.fill }}
              />
              <span className="truncate font-medium">{item.label}</span>
            </div>
            <div className="shrink-0 text-right">
              <div className="font-medium">
                {currencyFormatter.format(item.amount)}
              </div>
              <div className="text-xs text-muted-foreground">
                {item.percent}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
