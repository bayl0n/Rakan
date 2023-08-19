"use client"

import { BanknoteIcon, CalculatorIcon, DollarSignIcon, EggFriedIcon, GemIcon, PiggyBankIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Button } from "./ui/button";
import { Dispatch, SetStateAction, useState } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectLabel, SelectGroup } from "./ui/select";

const Pers = ["year", "month", "week", "day", "hour"] as const;
type Per = typeof Pers[number];

interface Props {
    grossIncome: number,
    useGrossIncome: Dispatch<SetStateAction<number>>,
    per: Per,
    usePer: Dispatch<SetStateAction<Per>>
}

const formSchema = z.object({
    grossIncome: z.coerce.number().min(0, {
        message: "Gross income must be greater than 0.",
    }),
    per: z.enum(Pers),
});

export function BudgetDashboard({ ...props }) {
    const [grossIncome, useGrossIncome] = useState<number>(50000);
    const [per, usePer] = useState<Per>(Pers[0]);

    const childProps: Props = {
        grossIncome,
        useGrossIncome,
        per,
        usePer,
    };

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Gross Income
                    </CardTitle>
                    <DollarSignIcon
                        className="h-4 w-4 text-muted-foreground"
                    />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        ${grossIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / {per}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Expenses
                    </CardTitle>
                    <BanknoteIcon
                        className="h-4 w-4 text-muted-foreground"
                    />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        ${(grossIncome * 0.5).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Luxury
                    </CardTitle>
                    <GemIcon
                        className="h-4 w-4 text-muted-foreground"
                    />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        ${(grossIncome * 0.3).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Savings
                    </CardTitle>
                    <PiggyBankIcon
                        className="h-4 w-4 text-muted-foreground"
                    />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        ${(grossIncome * 0.2).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                </CardContent>
            </Card>
            <BudgetCalculatorForm {...childProps} />
        </>
    )
}

export function BudgetCalculatorForm({ grossIncome, useGrossIncome, per, usePer }: Props) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            grossIncome: grossIncome,
            per: per,
        },
    });

    function useSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        useGrossIncome(values.grossIncome);
        usePer(values.per);
    }

    return (
        <Card className="col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                <CardTitle className="text-xl font-medium">
                    Budget Calculator
                </CardTitle>
                <CalculatorIcon
                    className="h-4 w-4 text-muted-foreground"
                />
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(useSubmit)} className="space-y-8">
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
                        <FormField
                            control={form.control}
                            name="per"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Per</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={per}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select an option..." />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Per</SelectLabel>
                                        { Pers.map(per => {
                                            return(
                                                <SelectItem key={per} value={per}>{per}</SelectItem>
                                            )
                                        })}
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                    How often you are paid.
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

export function BudgetBreakdownCard({ grossIncome, useGrossIncome, per, usePer }: Props) {
    return (
        <Card className="col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                <CardTitle className="text-2xl font-medium">
                    Breakdown
                </CardTitle>
                <EggFriedIcon
                    className="h-4 w-4 text-muted-foreground"
                />
            </CardHeader>
            <CardContent>
            </CardContent>
        </Card>
    )
}