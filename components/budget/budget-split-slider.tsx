"use client";

import type { ChangeEvent } from "react";

import {
  budgetCategories,
  type BudgetSplit,
} from "@/lib/budget";

type BudgetSplitSliderProps = {
  onSplitChange: (split: BudgetSplit) => void;
  split: BudgetSplit;
};

function clampPercent(value: number) {
  if (!Number.isFinite(value)) return 0;

  return Math.min(Math.max(Math.round(value), 0), 100);
}

export function BudgetSplitSlider({
  onSplitChange,
  split,
}: BudgetSplitSliderProps) {
  const firstHandle = clampPercent(split.fixedExpenses);
  const secondHandle = clampPercent(
    split.fixedExpenses + split.lifestyleExpenses,
  );
  const segments = budgetCategories.map((category) => ({
    ...category,
    percent: clampPercent(split[category.id]),
  }));
  const segmentTotal = segments.reduce(
    (total, segment) => total + segment.percent,
    0,
  );

  function updateFirstHandle(event: ChangeEvent<HTMLInputElement>) {
    const nextFirstHandle = Math.min(
      clampPercent(Number(event.target.value)),
      secondHandle,
    );

    onSplitChange({
      fixedExpenses: nextFirstHandle,
      lifestyleExpenses: secondHandle - nextFirstHandle,
      futureSavings: 100 - secondHandle,
    });
  }

  function updateSecondHandle(event: ChangeEvent<HTMLInputElement>) {
    const nextSecondHandle = Math.max(
      clampPercent(Number(event.target.value)),
      firstHandle,
    );

    onSplitChange({
      fixedExpenses: firstHandle,
      lifestyleExpenses: nextSecondHandle - firstHandle,
      futureSavings: 100 - nextSecondHandle,
    });
  }

  return (
    <div className="space-y-3">
      <div className="relative pt-3">
        <div className="flex h-4 overflow-hidden rounded-full bg-muted">
          {segments.map((segment) => (
            <div
              key={segment.id}
              className="h-full"
              style={{
                width:
                  segmentTotal > 0
                    ? `${(segment.percent / segmentTotal) * 100}%`
                    : `${100 / segments.length}%`,
                backgroundColor: segment.color,
              }}
            />
          ))}
        </div>
        <input
          aria-label="Fixed expenses split"
          className="pointer-events-none absolute inset-x-0 top-1 h-8 w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-background [&::-moz-range-thumb]:bg-foreground [&::-moz-range-thumb]:shadow-sm [&::-moz-range-thumb]:transition-colors [&::-moz-range-track]:bg-transparent [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:transition-colors"
          max="100"
          min="0"
          onChange={updateFirstHandle}
          step="1"
          type="range"
          value={firstHandle}
        />
        <input
          aria-label="Lifestyle expenses split"
          className="pointer-events-none absolute inset-x-0 top-1 h-8 w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-background [&::-moz-range-thumb]:bg-foreground [&::-moz-range-thumb]:shadow-sm [&::-moz-range-thumb]:transition-colors [&::-moz-range-track]:bg-transparent [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:transition-colors"
          max="100"
          min="0"
          onChange={updateSecondHandle}
          step="1"
          type="range"
          value={secondHandle}
        />
      </div>
      <div className="grid gap-2 text-sm">
        {segments.map((segment) => (
          <div
            key={segment.id}
            className="flex items-center justify-between gap-3"
          >
            <div className="flex min-w-0 items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              <span className="truncate font-medium">{segment.label}</span>
            </div>
            <span className="shrink-0 text-muted-foreground">
              {segment.percent}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
