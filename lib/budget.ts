export const Pers = ["year", "month", "week", "day", "hour"] as const;

export type Per = (typeof Pers)[number];

export const SuperModes = ["onTop", "included"] as const;

export type SuperMode = (typeof SuperModes)[number];

export type PayDetails = {
  grossIncome: number;
  per: Per;
  superMode: SuperMode;
  superRate: number;
  hasHelpDebt: boolean;
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

export type ExpenseFrequency = Per | "oneOff";

export type ExpenseForPeriod = {
  amount: number;
  date: string;
  frequency: ExpenseFrequency;
};

export type BudgetCategoryId =
  | "fixedExpenses"
  | "lifestyleExpenses"
  | "futureSavings";

export type BudgetCategory = {
  id: BudgetCategoryId;
  label: string;
  shortLabel: string;
  color: string;
};

export type BudgetCategoryWithAmount = BudgetCategory & {
  amount: number;
  percent: number;
};

export type BudgetSplit = Record<BudgetCategoryId, number>;

export const BudgetSplitPresetIds = [
  "barefoot",
  "needsFocused",
  "savingsFocused",
  "custom",
] as const;

export type BudgetSplitPresetId = (typeof BudgetSplitPresetIds)[number];

export type BudgetSplitPreset = {
  id: BudgetSplitPresetId;
  label: string;
  description: string;
  split: BudgetSplit;
};

export const budgetCategories = [
  {
    id: "fixedExpenses",
    label: "Fixed Expenses",
    shortLabel: "Fixed",
    color: "hsl(var(--chart-1))",
  },
  {
    id: "lifestyleExpenses",
    label: "Lifestyle Expenses",
    shortLabel: "Lifestyle",
    color: "hsl(var(--chart-2))",
  },
  {
    id: "futureSavings",
    label: "Future Savings",
    shortLabel: "Savings",
    color: "hsl(var(--chart-3))",
  },
] as const satisfies readonly BudgetCategory[];

export const budgetSplitPresets = [
  {
    id: "barefoot",
    label: "Current / Barefoot-style",
    description: "50% fixed, 30% lifestyle, 20% savings",
    split: {
      fixedExpenses: 50,
      lifestyleExpenses: 30,
      futureSavings: 20,
    },
  },
  {
    id: "needsFocused",
    label: "Needs-focused",
    description: "60% fixed, 20% lifestyle, 20% savings",
    split: {
      fixedExpenses: 60,
      lifestyleExpenses: 20,
      futureSavings: 20,
    },
  },
  {
    id: "savingsFocused",
    label: "Savings-focused",
    description: "50% fixed, 20% lifestyle, 30% savings",
    split: {
      fixedExpenses: 50,
      lifestyleExpenses: 20,
      futureSavings: 30,
    },
  },
] as const satisfies readonly BudgetSplitPreset[];

export const defaultBudgetSplit = budgetSplitPresets[0].split;

export function getBudgetSplitTotal(split: BudgetSplit) {
  return budgetCategories.reduce(
    (total, category) => total + split[category.id],
    0,
  );
}

export function convertPer(income: number, fromPer: Per, toPer: Per): number {
  const hourConversion = new Map<Per, number>();

  hourConversion.set("year", 1976);
  hourConversion.set("month", 164.67);
  hourConversion.set("week", 38);
  hourConversion.set("day", 7.6);
  hourConversion.set("hour", 1);

  const fromPerHours = hourConversion.get(fromPer);
  const toPerHours = hourConversion.get(toPer);

  if (!fromPerHours || !toPerHours) throw new Error("Invalid per");

  const incomeHours = income / fromPerHours;

  return incomeHours * toPerHours;
}

export function estimateAustralianResidentIncomeTax(taxableIncome: number) {
  if (taxableIncome <= 18200) return 0;
  if (taxableIncome <= 45000) return (taxableIncome - 18200) * 0.16;
  if (taxableIncome <= 135000) return 4288 + (taxableIncome - 45000) * 0.3;
  if (taxableIncome <= 190000) return 31288 + (taxableIncome - 135000) * 0.37;

  return 51638 + (taxableIncome - 190000) * 0.45;
}

export function estimateMedicareLevy(taxableIncome: number) {
  return taxableIncome * 0.02;
}

export function estimateHelpRepayment(repaymentIncome: number) {
  if (repaymentIncome <= 67000) return 0;
  if (repaymentIncome <= 125000) return (repaymentIncome - 67000) * 0.15;
  if (repaymentIncome <= 179285) return 8700 + (repaymentIncome - 125000) * 0.17;

  return repaymentIncome * 0.1;
}

export function calculatePaySummary({
  grossIncome,
  per,
  superMode,
  superRate,
  hasHelpDebt,
}: PayDetails): PaySummary {
  const annualPackage = convertPer(grossIncome, per, "year");
  const superRateDecimal = Math.max(superRate, 0) / 100;
  const annualTaxableIncome =
    superMode === "included"
      ? annualPackage / (1 + superRateDecimal)
      : annualPackage;
  const annualSuper =
    superMode === "included"
      ? annualPackage - annualTaxableIncome
      : annualTaxableIncome * superRateDecimal;
  const annualIncomeTax =
    estimateAustralianResidentIncomeTax(annualTaxableIncome);
  const annualMedicareLevy = estimateMedicareLevy(annualTaxableIncome);
  const annualHelpRepayment = hasHelpDebt
    ? estimateHelpRepayment(annualTaxableIncome)
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

export function formatPer(per: Per) {
  if (per === "day") return "Daily";

  return `${per[0].toUpperCase()}${per.slice(1)}ly`;
}

export function formatExpenseFrequency(frequency: ExpenseFrequency) {
  if (frequency === "oneOff") return "One-off";

  return formatPer(frequency);
}

export function convertRecurringAmount(
  amount: number,
  fromPer: Per,
  toPer: Per,
): number {
  const yearConversion = new Map<Per, number>();

  yearConversion.set("year", 1);
  yearConversion.set("month", 12);
  yearConversion.set("week", 52);
  yearConversion.set("day", 365);
  yearConversion.set("hour", 8760);

  const fromPerPeriodsPerYear = yearConversion.get(fromPer);
  const toPerPeriodsPerYear = yearConversion.get(toPer);

  if (!fromPerPeriodsPerYear || !toPerPeriodsPerYear) {
    throw new Error("Invalid per");
  }

  return (amount * fromPerPeriodsPerYear) / toPerPeriodsPerYear;
}

function parseDateOnly(date: string) {
  return new Date(`${date}T00:00:00`);
}

function formatDateOnly(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getPeriodWindow(anchorDate: string, period: Per) {
  const start = parseDateOnly(anchorDate);
  const end = parseDateOnly(anchorDate);

  if (period === "year") {
    start.setMonth(0, 1);
    end.setFullYear(start.getFullYear() + 1, 0, 1);
  } else if (period === "month") {
    start.setDate(1);
    end.setFullYear(start.getFullYear(), start.getMonth() + 1, 1);
  } else if (period === "week") {
    const daysSinceMonday = (start.getDay() + 6) % 7;
    start.setDate(start.getDate() - daysSinceMonday);
    end.setTime(start.getTime());
    end.setDate(start.getDate() + 7);
  } else {
    end.setDate(start.getDate() + 1);
  }

  return {
    start: formatDateOnly(start),
    end: formatDateOnly(end),
  };
}

function formatDisplayDate(date: string, options: Intl.DateTimeFormatOptions) {
  return parseDateOnly(date).toLocaleDateString("en-AU", options);
}

export function formatPeriodWindow(anchorDate: string, period: Per) {
  const window = getPeriodWindow(anchorDate, period);

  if (period === "year") {
    return formatDisplayDate(window.start, { year: "numeric" });
  }

  if (period === "month") {
    return formatDisplayDate(window.start, {
      month: "long",
      year: "numeric",
    });
  }

  if (period === "week") {
    const end = parseDateOnly(window.end);
    end.setDate(end.getDate() - 1);

    return `${formatDisplayDate(window.start, {
      day: "numeric",
      month: "short",
    })} - ${end.toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })}`;
  }

  return formatDisplayDate(window.start, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function movePeriod(
  anchorDate: string,
  period: Per,
  direction: "previous" | "next",
) {
  const date = parseDateOnly(anchorDate);
  const distance = direction === "previous" ? -1 : 1;

  if (period === "year") {
    date.setFullYear(date.getFullYear() + distance);
  } else if (period === "month") {
    date.setMonth(date.getMonth() + distance);
  } else if (period === "week") {
    date.setDate(date.getDate() + distance * 7);
  } else {
    date.setDate(date.getDate() + distance);
  }

  return formatDateOnly(date);
}

export function isDateInPeriod(date: string, anchorDate: string, period: Per) {
  const window = getPeriodWindow(anchorDate, period);

  return date >= window.start && date < window.end;
}

export function getExpenseAmountForPeriod(
  expense: ExpenseForPeriod,
  period: Per,
  anchorDate: string,
) {
  if (expense.frequency === "oneOff") {
    return isDateInPeriod(expense.date, anchorDate, period) ? expense.amount : 0;
  }

  return convertRecurringAmount(expense.amount, expense.frequency, period);
}

export function getBudgetBreakdown(
  grossIncome: number,
  fromPer: Per,
  toPer: Per,
  split: BudgetSplit = defaultBudgetSplit,
): BudgetCategoryWithAmount[] {
  const incomeForPeriod = convertPer(grossIncome, fromPer, toPer);

  return budgetCategories.map((category) => ({
    ...category,
    amount: incomeForPeriod * (split[category.id] / 100),
    percent: split[category.id],
  }));
}
