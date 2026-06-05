import type { Dispatch, SetStateAction } from "react";

import type { Per } from "@/lib/finance/periods";
import type { PaySummary, SuperMode, TaxYear } from "@/lib/finance/pay";

export type PayDashboardProps = {
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
  taxYear: TaxYear;
  setTaxYear: Dispatch<SetStateAction<TaxYear>>;
  paySummary: PaySummary;
};

export type PayDetailsFormProps = Omit<PayDashboardProps, "paySummary">;

export type PaySummaryRow = {
  label: string;
  amount: number;
};
