import { convertIncomeForPeriod, type Per } from "./periods";

export const SuperModes = ["onTop", "included"] as const;

export type SuperMode = (typeof SuperModes)[number];

export const TaxYears = ["2025-26", "2024-25", "2023-24"] as const;

export type TaxYear = (typeof TaxYears)[number];

export type PayDetails = {
  grossIncome: number;
  per: Per;
  superMode: SuperMode;
  superRate: number;
  hasHelpDebt: boolean;
  taxYear: TaxYear;
};

export type PaySummary = {
  annualPackage: number;
  annualTaxableIncome: number;
  annualIncomeTax: number;
  annualMedicareLevy: number;
  annualHelpRepayment: number;
  annualSuper: number;
  annualNetPay: number;
};

type TaxBracket = {
  baseTax: number;
  lowerBound: number;
  rate: number;
  upperBound?: number;
};

type RepaymentRateBracket = {
  lowerBound: number;
  rate: number;
  upperBound?: number;
};

const residentIncomeTaxBrackets: Record<TaxYear, readonly TaxBracket[]> = {
  "2023-24": [
    { lowerBound: 0, upperBound: 18200, baseTax: 0, rate: 0 },
    { lowerBound: 18200, upperBound: 45000, baseTax: 0, rate: 0.19 },
    { lowerBound: 45000, upperBound: 120000, baseTax: 5092, rate: 0.325 },
    { lowerBound: 120000, upperBound: 180000, baseTax: 29467, rate: 0.37 },
    { lowerBound: 180000, baseTax: 51667, rate: 0.45 },
  ],
  "2024-25": [
    { lowerBound: 0, upperBound: 18200, baseTax: 0, rate: 0 },
    { lowerBound: 18200, upperBound: 45000, baseTax: 0, rate: 0.16 },
    { lowerBound: 45000, upperBound: 135000, baseTax: 4288, rate: 0.3 },
    { lowerBound: 135000, upperBound: 190000, baseTax: 31288, rate: 0.37 },
    { lowerBound: 190000, baseTax: 51638, rate: 0.45 },
  ],
  "2025-26": [
    { lowerBound: 0, upperBound: 18200, baseTax: 0, rate: 0 },
    { lowerBound: 18200, upperBound: 45000, baseTax: 0, rate: 0.16 },
    { lowerBound: 45000, upperBound: 135000, baseTax: 4288, rate: 0.3 },
    { lowerBound: 135000, upperBound: 190000, baseTax: 31288, rate: 0.37 },
    { lowerBound: 190000, baseTax: 51638, rate: 0.45 },
  ],
};

const helpRepaymentRates: Partial<
  Record<TaxYear, readonly RepaymentRateBracket[]>
> = {
  "2023-24": [
    { lowerBound: 0, upperBound: 51550, rate: 0 },
    { lowerBound: 51550, upperBound: 59519, rate: 0.01 },
    { lowerBound: 59519, upperBound: 63090, rate: 0.02 },
    { lowerBound: 63090, upperBound: 66876, rate: 0.025 },
    { lowerBound: 66876, upperBound: 70889, rate: 0.03 },
    { lowerBound: 70889, upperBound: 75141, rate: 0.035 },
    { lowerBound: 75141, upperBound: 79650, rate: 0.04 },
    { lowerBound: 79650, upperBound: 84430, rate: 0.045 },
    { lowerBound: 84430, upperBound: 89495, rate: 0.05 },
    { lowerBound: 89495, upperBound: 94866, rate: 0.055 },
    { lowerBound: 94866, upperBound: 100558, rate: 0.06 },
    { lowerBound: 100558, upperBound: 106591, rate: 0.065 },
    { lowerBound: 106591, upperBound: 112986, rate: 0.07 },
    { lowerBound: 112986, upperBound: 119765, rate: 0.075 },
    { lowerBound: 119765, upperBound: 126951, rate: 0.08 },
    { lowerBound: 126951, upperBound: 134569, rate: 0.085 },
    { lowerBound: 134569, upperBound: 142643, rate: 0.09 },
    { lowerBound: 142643, upperBound: 151201, rate: 0.095 },
    { lowerBound: 151201, rate: 0.1 },
  ],
  "2024-25": [
    { lowerBound: 0, upperBound: 54435, rate: 0 },
    { lowerBound: 54435, upperBound: 62851, rate: 0.01 },
    { lowerBound: 62851, upperBound: 66621, rate: 0.02 },
    { lowerBound: 66621, upperBound: 70619, rate: 0.025 },
    { lowerBound: 70619, upperBound: 74856, rate: 0.03 },
    { lowerBound: 74856, upperBound: 79347, rate: 0.035 },
    { lowerBound: 79347, upperBound: 84108, rate: 0.04 },
    { lowerBound: 84108, upperBound: 89155, rate: 0.045 },
    { lowerBound: 89155, upperBound: 94504, rate: 0.05 },
    { lowerBound: 94504, upperBound: 100175, rate: 0.055 },
    { lowerBound: 100175, upperBound: 106186, rate: 0.06 },
    { lowerBound: 106186, upperBound: 112557, rate: 0.065 },
    { lowerBound: 112557, upperBound: 119310, rate: 0.07 },
    { lowerBound: 119310, upperBound: 126468, rate: 0.075 },
    { lowerBound: 126468, upperBound: 134057, rate: 0.08 },
    { lowerBound: 134057, upperBound: 142101, rate: 0.085 },
    { lowerBound: 142101, upperBound: 150627, rate: 0.09 },
    { lowerBound: 150627, upperBound: 159664, rate: 0.095 },
    { lowerBound: 159664, rate: 0.1 },
  ],
};

export function estimateAustralianResidentIncomeTax(
  taxableIncome: number,
  taxYear: TaxYear,
) {
  const bracket = residentIncomeTaxBrackets[taxYear].find(
    ({ lowerBound, upperBound }) =>
      taxableIncome > lowerBound &&
      (upperBound === undefined || taxableIncome <= upperBound),
  );

  if (!bracket) return 0;

  return bracket.baseTax + (taxableIncome - bracket.lowerBound) * bracket.rate;
}

export function estimateMedicareLevy(taxableIncome: number) {
  return taxableIncome * 0.02;
}

function estimateMarginalHelpRepayment(repaymentIncome: number) {
  if (repaymentIncome <= 67000) return 0;
  if (repaymentIncome <= 125000) return (repaymentIncome - 67000) * 0.15;
  if (repaymentIncome <= 179285) return 8700 + (repaymentIncome - 125000) * 0.17;

  return repaymentIncome * 0.1;
}

export function estimateHelpRepayment(
  repaymentIncome: number,
  taxYear: TaxYear,
) {
  if (taxYear === "2025-26") {
    return estimateMarginalHelpRepayment(repaymentIncome);
  }

  const bracket = (helpRepaymentRates[taxYear] ?? []).find(
    ({ lowerBound, upperBound }) =>
      repaymentIncome >= lowerBound &&
      (upperBound === undefined || repaymentIncome < upperBound),
  );

  return repaymentIncome * (bracket?.rate ?? 0);
}

export function calculatePaySummary({
  grossIncome,
  per,
  superMode,
  superRate,
  hasHelpDebt,
  taxYear,
}: PayDetails): PaySummary {
  const annualPackage = convertIncomeForPeriod(grossIncome, per, "year");
  const superRateDecimal = Math.max(superRate, 0) / 100;
  const annualTaxableIncome =
    superMode === "included"
      ? annualPackage / (1 + superRateDecimal)
      : annualPackage;
  const annualSuper =
    superMode === "included"
      ? annualPackage - annualTaxableIncome
      : annualTaxableIncome * superRateDecimal;
  const annualIncomeTax = estimateAustralianResidentIncomeTax(
    annualTaxableIncome,
    taxYear,
  );
  const annualMedicareLevy = estimateMedicareLevy(annualTaxableIncome);
  const annualHelpRepayment = hasHelpDebt
    ? estimateHelpRepayment(annualTaxableIncome, taxYear)
    : 0;
  const annualNetPay =
    annualTaxableIncome -
    annualIncomeTax -
    annualMedicareLevy -
    annualHelpRepayment;

  return {
    annualPackage,
    annualTaxableIncome,
    annualIncomeTax,
    annualMedicareLevy,
    annualHelpRepayment,
    annualSuper,
    annualNetPay,
  };
}
