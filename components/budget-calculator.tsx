"use client"

import { Calculator } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Button } from "./ui/button";
import { useState } from "react";

const formSchema = z.object({
    grossIncome: z.coerce.number().min(0, {
        message: "Gross income must be greater than 0.",
    }),
});

export function BudgetDashboard({...props}) {
    const [grossIncome, useGrossIncome] = useState(50000);

    function OnSubmit(values: z.infer<typeof formSchema>) {
        useGrossIncome(values.grossIncome);
    }

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Gross Income
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        ${grossIncome.toLocaleString(undefined, {minimumFractionDigits: 2})}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Expenses
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        ${(grossIncome * 0.5).toLocaleString(undefined, {minimumFractionDigits: 2})}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Luxury
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        ${(grossIncome * 0.3).toLocaleString(undefined, {minimumFractionDigits: 2})}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Savings
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        ${(grossIncome * 0.2).toLocaleString(undefined, {minimumFractionDigits: 2})}
                    </div>
                </CardContent>
            </Card>
            <BudgetCalculatorForm grossIncome={grossIncome} onSubmit={OnSubmit} />
        </>
    )
}

export function BudgetCalculatorForm({ grossIncome, onSubmit }: { grossIncome: number, onSubmit: any }) {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            grossIncome: grossIncome,
        },
    });

    return (
        <Card className="col-span-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                <CardTitle className="text-xl font-medium">
                    Budget Calculator
                </CardTitle>
                <Calculator
                    className="h-4 w-4 text-muted-foreground"
                />
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="grossIncome"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Gross Income</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="Gross Income" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is your gross income.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}