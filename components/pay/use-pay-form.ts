"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { payFormSchema, type PayFormValues } from "./schema";
import type { PayDetailsFormProps } from "./types";

export function usePayForm({
  grossIncome,
  hasHelpDebt,
  per,
  setGrossIncome,
  setHasHelpDebt,
  setPer,
  setSuperMode,
  setSuperRate,
  setTaxYear,
  superMode,
  superRate,
  taxYear,
}: PayDetailsFormProps) {
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(true);
  const form = useForm<PayFormValues>({
    resolver: zodResolver(payFormSchema),
    mode: "onChange",
    defaultValues: {
      grossIncome,
      per,
      superMode,
      superRate,
      hasHelpDebt,
      taxYear,
    },
  });

  useEffect(() => {
    const subscription = form.watch((values) => {
      const result = payFormSchema.safeParse(values);

      if (!result.success) return;

      setGrossIncome(result.data.grossIncome);
      setPer(result.data.per);
      setSuperMode(result.data.superMode);
      setSuperRate(result.data.superRate);
      setHasHelpDebt(result.data.hasHelpDebt);
      setTaxYear(result.data.taxYear);
    });

    return () => subscription.unsubscribe();
  }, [
    form,
    setGrossIncome,
    setHasHelpDebt,
    setPer,
    setSuperMode,
    setSuperRate,
    setTaxYear,
  ]);

  return {
    form,
    setShowAdvancedSettings,
    showAdvancedSettings,
  };
}
