import { Calculator } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Input } from "./ui/input";

export function SalaryCalculatorCard() {
    return (
        <Card className="col-span-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-medium">
                    Salary Calculator
                </CardTitle>
                <Calculator
                    className="h-4 w-4 text-muted-foreground"
                />
            </CardHeader>
            <CardContent>
                <Input type="number" placeholder="Gross Income"/>
            </CardContent>
        </Card>
    )
}