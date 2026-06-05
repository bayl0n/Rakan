export const Pers = ["year", "month", "week", "day", "hour"] as const;

export type Per = (typeof Pers)[number];

export function convertIncomeForPeriod(
  income: number,
  fromPer: Per,
  toPer: Per,
): number {
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

export function formatPer(per: Per) {
  if (per === "day") return "Daily";

  return `${per[0].toUpperCase()}${per.slice(1)}ly`;
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
