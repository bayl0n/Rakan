"use client";

import { useEffect, useRef, useState } from "react";

import { formatCurrency } from "@/lib/format";

type AnimatedCurrencyProps = {
  amount: number;
  className?: string;
  durationMs?: number;
};

function easeOutCubic(progress: number) {
  return 1 - Math.pow(1 - progress, 3);
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");

    setPrefersReducedMotion(query.matches);

    const handleChange = () => setPrefersReducedMotion(query.matches);

    query.addEventListener("change", handleChange);

    return () => query.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}

function useAnimatedNumber(value: number, durationMs: number) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [displayValue, setDisplayValue] = useState(value);
  const displayValueRef = useRef(value);

  useEffect(() => {
    if (!Number.isFinite(value)) return;

    if (prefersReducedMotion) {
      displayValueRef.current = value;
      setDisplayValue(value);
      return;
    }

    const startValue = displayValueRef.current;
    const change = value - startValue;

    if (change === 0) return;

    let animationFrameId = 0;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const nextValue = startValue + change * easeOutCubic(progress);

      displayValueRef.current = nextValue;
      setDisplayValue(nextValue);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      displayValueRef.current = value;
      setDisplayValue(value);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [durationMs, prefersReducedMotion, value]);

  return displayValue;
}

export function AnimatedCurrency({
  amount,
  className,
  durationMs = 500,
}: AnimatedCurrencyProps) {
  const displayAmount = useAnimatedNumber(amount, durationMs);

  return <span className={className}>{formatCurrency(displayAmount)}</span>;
}
