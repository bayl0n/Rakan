"use client";

import { PayBreakdownCard } from "./pay-breakdown-card";
import { PayDetailsForm } from "./pay-details-form";
import type { PayDashboardProps } from "./types";

export function PayDashboard(props: PayDashboardProps) {
  return (
    <div className="flex flex-col gap-4 sm:grid lg:grid-cols-6">
      <PayDetailsForm
        grossIncome={props.grossIncome}
        setGrossIncome={props.setGrossIncome}
        per={props.per}
        setPer={props.setPer}
        superMode={props.superMode}
        setSuperMode={props.setSuperMode}
        superRate={props.superRate}
        setSuperRate={props.setSuperRate}
        hasHelpDebt={props.hasHelpDebt}
        setHasHelpDebt={props.setHasHelpDebt}
        taxYear={props.taxYear}
        setTaxYear={props.setTaxYear}
      />
      <PayBreakdownCard paySummary={props.paySummary} per={props.per} />
    </div>
  );
}
