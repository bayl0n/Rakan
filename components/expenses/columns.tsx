const ExpenseStatuses = ["pending", "processing", "success", "failed"] as const;
type ExpenseStatus = typeof ExpenseStatuses[number];

type Expense = {
    id: string,
    amount: number,
    status: ExpenseStatus,
    payer: string
}

export const expenses: Expense[] = [
    {
        id: "728ed52f",
        amount: 100,
        status: "pending",
        payer: "George Hotz",
      },
      {
        id: "489e1d42",
        amount: 125,
        status: "processing",
        payer: "Sam Altman",
      },
]