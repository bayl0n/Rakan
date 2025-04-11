"use client"

import { BanknoteIcon, CalculatorIcon, DollarSignIcon, GemIcon, PiggyBankIcon, WrenchIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Button } from "./ui/button";
import { Dispatch, SetStateAction, useState } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectLabel, SelectGroup } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Separator } from "./ui/separator";

const Pers = ["year", "month", "week", "day", "hour"] as const;
type Per = typeof Pers[number];

function convertPer(income: number, fromPer: Per, toPer: Per): number {
    // Convert to hour then convert to destination
    const hourConversion = new Map<Per, number>();

    // Break down each per by hour
    // it might be worth to include this in budget breakdown card to allow
    // these values to be adjusted as states
    hourConversion.set("year", 1976);
    hourConversion.set("month", 164.67);
    hourConversion.set("week", 38);
    hourConversion.set("day", 7.6);
    hourConversion.set("hour", 1);

    const fromPerHours = hourConversion.get(fromPer);
    const toPerHours = hourConversion.get(toPer);

    if (!fromPerHours || !toPerHours) throw new Error('Invalid per');

    const incomeHours = income / fromPerHours;

    return incomeHours * toPerHours;
}

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
        <div className="flex flex-col gap-4 sm:grid lg:grid-cols-6">
            <BudgetCalculatorForm {...childProps} />
            <BudgetBreakdownCard {...childProps} />
        </div>
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
                                                {Pers.map(per => {
                                                    return (
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
    const fixedExpensesMultiplier = 0.5;
    const lifestyleExpensesMultiplier = 0.3;
    const futureSavingsMultiplier = 0.2;

    return (
        <Card className="col-span-2 lg:col-span-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                <CardTitle className="text-2xl font-medium">
                    Breakdown
                </CardTitle>
                <WrenchIcon
                    className="h-4 w-4 text-muted-foreground"
                />
            </CardHeader>
            <CardContent>
                <Tabs defaultValue={per}>
                    <ScrollArea className="mb-4">
                        <TabsList>
                            {Pers.map(perTrigger => {
                                let currPer;
                                if (perTrigger === 'day')
                                    currPer = 'dai';
                                else
                                    currPer = perTrigger;

                                return (
                                    <TabsTrigger key={perTrigger} value={perTrigger}>
                                        {currPer[0].toUpperCase() + currPer.slice(1)}ly
                                    </TabsTrigger>
                                )
                            })}
                        </TabsList>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                    {Pers.map(perContent => {
                        return (
                            <>
                                <TabsContent key={perContent} value={perContent}>
                                    <Separator className="mb-4" />
                                    <header className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <div className="text-sm font-medium">
                                            Income
                                        </div>
                                        <DollarSignIcon
                                            className="h-4 w-4 text-muted-foreground"
                                        />
                                    </header>
                                    <section className="text-2xl font-bold">
                                        ${(convertPer(grossIncome, per, perContent)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-sm">/ {perContent}</span>
                                    </section>
                                    <Separator className="my-4" />
                                    <header className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <div className="text-sm font-medium">
                                            Fixed Expenses
                                        </div>
                                        <BanknoteIcon
                                            className="h-4 w-4 text-muted-foreground"
                                        />
                                    </header>
                                    <section className="text-2xl font-bold">
                                        ${(convertPer(grossIncome, per, perContent) * fixedExpensesMultiplier).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </section>
                                    <Separator className="my-4" />
                                    <header className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <div className="text-sm font-medium">
                                            Lifestyle Expenses
                                        </div>
                                        <GemIcon
                                            className="h-4 w-4 text-muted-foreground"
                                        />
                                    </header>
                                    <section className="text-2xl font-bold">
                                        ${(convertPer(grossIncome, per, perContent) * lifestyleExpensesMultiplier).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </section>
                                    <Separator className="my-4" />
                                    <header className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <div className="text-sm font-medium">
                                            Future Savings
                                        </div>
                                        <PiggyBankIcon
                                            className="h-4 w-4 text-muted-foreground"
                                        />
                                    </header>
                                    <section className="text-2xl font-bold">
                                        ${(convertPer(grossIncome, per, perContent) * futureSavingsMultiplier).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </section>
                                </TabsContent>
                            </>
                        )
                    })}
                </Tabs>
            </CardContent>
        </Card>
    )
}
