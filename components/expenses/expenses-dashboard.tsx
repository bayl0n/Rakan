import { Expense, columns } from "./columns";
import { DataTable } from "./data-table";

async function getData(): Promise<Expense[]> {
    return ([
        {
            id: "728ed52f",
            amount: 100,
            status: "pending",
            payer: "Kal El",
        },
        {
            id: "489e1d42",
            amount: 125,
            status: "processing",
            payer: "Vlad",
        },
        {
            id: "489e1d42",
            amount: 125,
            status: "processing",
            payer: "Vlad",
        },
    ])
};

export default async function ExpensesDashboard() {
    const data = await getData();

    return (
        <div className="flex">
            <DataTable columns={columns} data={data} />
        </div>
    )
}
