"use client";

import { useState } from "react";
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
  superMode,
  superRate,
}: PayDetailsFormProps) {
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const form = useForm<PayFormValues>({
    resolver: zodResolver(payFormSchema),
    defaultValues: {
      grossIncome,
      per,
      superMode,
      superRate,
      hasHelpDebt,
    },
  });

  function submitPayDetails(values: PayFormValues) {
    setGrossIncome(values.grossIncome);
    setPer(values.per);
    setSuperMode(values.superMode);
    setSuperRate(values.superRate);
    setHasHelpDebt(values.hasHelpDebt);
  }

  return {
    form,
    setShowAdvancedSettings,
    showAdvancedSettings,
    submitPayDetails,
  };
}
