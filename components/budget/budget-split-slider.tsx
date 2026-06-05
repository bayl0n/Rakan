"use client";

import { useRef, useState } from "react";
import type { ChangeEvent, PointerEvent } from "react";

import {
  type BudgetCategoryId,
  budgetCategories,
  type BudgetSplit,
} from "@/lib/finance/budget";

type BudgetSplitSliderProps = {
  onSplitChange: (split: BudgetSplit) => void;
  split: BudgetSplit;
};

type SplitHandle = "first" | "second";

function clampPercent(value: number) {
  if (!Number.isFinite(value)) return 0;

  return Math.min(Math.max(Math.round(value), 0), 100);
}

function getSplitWithFirstHandle(split: BudgetSplit, firstHandle: number) {
  const nextFirstHandle = Math.min(
    clampPercent(firstHandle),
    clampPercent(split.fixedExpenses + split.lifestyleExpenses),
  );
  const secondHandle = clampPercent(
    split.fixedExpenses + split.lifestyleExpenses,
  );

  return {
    fixedExpenses: nextFirstHandle,
    lifestyleExpenses: secondHandle - nextFirstHandle,
    futureSavings: 100 - secondHandle,
  };
}

function getSplitWithSecondHandle(split: BudgetSplit, secondHandle: number) {
  const firstHandle = clampPercent(split.fixedExpenses);
  const nextSecondHandle = Math.max(clampPercent(secondHandle), firstHandle);

  return {
    fixedExpenses: firstHandle,
    lifestyleExpenses: nextSecondHandle - firstHandle,
    futureSavings: 100 - nextSecondHandle,
  };
}

export function BudgetSplitSlider({
  onSplitChange,
  split,
}: BudgetSplitSliderProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const activeHandleRef = useRef<SplitHandle | null>(null);
  const [activeHandle, setActiveHandle] = useState<SplitHandle | null>(null);
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
    onSplitChange(getSplitWithFirstHandle(split, Number(event.target.value)));
  }

  function updateSecondHandle(event: ChangeEvent<HTMLInputElement>) {
    onSplitChange(getSplitWithSecondHandle(split, Number(event.target.value)));
  }

  function getPointerPercent(clientX: number) {
    const barBounds = barRef.current?.getBoundingClientRect();

    if (!barBounds || barBounds.width === 0) return 0;

    return clampPercent(((clientX - barBounds.left) / barBounds.width) * 100);
  }

  function updateHandleFromPercent(handle: SplitHandle, percent: number) {
    onSplitChange(
      handle === "first"
        ? getSplitWithFirstHandle(split, percent)
        : getSplitWithSecondHandle(split, percent),
    );
  }

  function getNearestHandle(percent: number): SplitHandle {
    const firstDistance = Math.abs(percent - firstHandle);
    const secondDistance = Math.abs(percent - secondHandle);

    return firstDistance <= secondDistance ? "first" : "second";
  }

  function startBarDrag(event: PointerEvent<HTMLDivElement>) {
    const percent = getPointerPercent(event.clientX);
    const nearestHandle = getNearestHandle(percent);

    event.currentTarget.setPointerCapture(event.pointerId);
    activeHandleRef.current = nearestHandle;
    setActiveHandle(nearestHandle);
    updateHandleFromPercent(nearestHandle, percent);
  }

  function updateBarDrag(event: PointerEvent<HTMLDivElement>) {
    const handle = activeHandleRef.current ?? activeHandle;

    if (!handle) return;

    updateHandleFromPercent(handle, getPointerPercent(event.clientX));
  }

  function stopBarDrag(event: PointerEvent<HTMLDivElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    activeHandleRef.current = null;
    setActiveHandle(null);
  }

  function updateCategoryPercent(
    categoryId: BudgetCategoryId,
    value: number,
  ) {
    const nextPercent = clampPercent(value);

    if (categoryId === "fixedExpenses") {
      const futureSavings = Math.min(
        clampPercent(split.futureSavings),
        100 - nextPercent,
      );

      onSplitChange({
        fixedExpenses: nextPercent,
        lifestyleExpenses: 100 - nextPercent - futureSavings,
        futureSavings,
      });
      return;
    }

    if (categoryId === "lifestyleExpenses") {
      const fixedExpenses = clampPercent(split.fixedExpenses);
      const lifestyleExpenses = Math.min(nextPercent, 100 - fixedExpenses);

      onSplitChange({
        fixedExpenses,
        lifestyleExpenses,
        futureSavings: 100 - fixedExpenses - lifestyleExpenses,
      });
      return;
    }

    const fixedExpenses = Math.min(
      clampPercent(split.fixedExpenses),
      100 - nextPercent,
    );

    onSplitChange({
      fixedExpenses,
      lifestyleExpenses: 100 - fixedExpenses - nextPercent,
      futureSavings: nextPercent,
    });
  }

  return (
    <div className="space-y-3">
      <div className="relative pt-3">
        <div
          className="flex h-8 cursor-pointer touch-none items-center"
          onPointerCancel={stopBarDrag}
          onPointerDown={startBarDrag}
          onPointerMove={updateBarDrag}
          onPointerUp={stopBarDrag}
          ref={barRef}
        >
          <div className="flex h-4 w-full overflow-hidden rounded-full bg-muted">
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
        </div>
        <input
          aria-label="Fixed expenses split"
          className="pointer-events-none absolute inset-x-0 top-3 h-8 w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-background [&::-moz-range-thumb]:bg-foreground [&::-moz-range-thumb]:shadow-sm [&::-moz-range-thumb]:transition-colors [&::-moz-range-track]:bg-transparent [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:transition-colors"
          max="100"
          min="0"
          onChange={updateFirstHandle}
          step="1"
          type="range"
          value={firstHandle}
        />
        <input
          aria-label="Lifestyle expenses split"
          className="pointer-events-none absolute inset-x-0 top-3 h-8 w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-background [&::-moz-range-thumb]:bg-foreground [&::-moz-range-thumb]:shadow-sm [&::-moz-range-thumb]:transition-colors [&::-moz-range-track]:bg-transparent [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:transition-colors"
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
            <div className="flex shrink-0 items-center gap-1">
              <input
                aria-label={`${segment.label} percentage`}
                className="h-8 w-16 rounded-md border border-input bg-background px-2 text-right text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                max="100"
                min="0"
                onChange={(event) =>
                  updateCategoryPercent(segment.id, Number(event.target.value))
                }
                step="1"
                type="number"
                value={segment.percent}
              />
              <span className="text-muted-foreground">%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
