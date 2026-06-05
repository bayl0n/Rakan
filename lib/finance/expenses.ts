import { formatPer, getPeriodWindow, type Per } from "./periods";

export type ExpenseFrequency = Per | "oneOff";

export type ExpenseForPeriod = {
  amount: number;
  date: string;
  frequency: ExpenseFrequency;
};

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
