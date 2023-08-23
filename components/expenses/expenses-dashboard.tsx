import { ExpensesDataTable } from "./data-table";

export default function ExpensesDashboard() {
    return (
        <div className="flex flex-col gap-4 sm:grid lg:grid-cols-6">
            Expenses Dashboard
            <ExpensesDataTable/>
        </div>
    )
}
