"use client"

import { BanknoteIcon, CalculatorIcon, DollarSignIcon, EggFriedIcon, GemIcon, PiggyBankIcon, WrenchIcon } from "lucide-react";
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
import { reduceEachTrailingCommentRange } from "typescript";

const Pers = ["year", "month", "week", "day", "hour"] as const;
type Per = typeof Pers[number];

function convertPer(income: number, fromPer: Per, toPer: Per) {
    if (fromPer === toPer) return income;

    // start with year
    const conversionMap = new Map<Per, any>();

    conversionMap.set("hour", {
        "year": 8760,
        "month": 730,
        "week": 168,
        "day": 24,
    });

    return income;
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
        <>
            {/* <h1 className="mt-10 scroll-m-20 pb-1 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                Budget
            </h1> */}
            <div className="flex flex-col-reverse gap-4 sm:grid md:grid-cols-2 lg:grid-cols-6">
                <Card className="col-span-3">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Income
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
                            Fixed Expenses
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
                            Lifestyle Expenses
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
                            Future Savings
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
                <BudgetBreakdownCard {...childProps} />
            </div>
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
        <Card className="col-span-3">
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
    return (
        <Card className="col-span-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                <CardTitle className="text-2xl font-medium">
                    Breakdown
                </CardTitle>
                <WrenchIcon
                    className="h-4 w-4 text-muted-foreground"
                />
            </CardHeader>
            <CardContent>
                {/* Desktop View */}
                <Tabs className="sm:block" defaultValue={per}>
                    <ScrollArea>
                        <TabsList>
                            {Pers.map(perTrigger => {
                                let currPer;
                                if (perTrigger === 'day')
                                    currPer = 'dai';
                                else
                                    currPer = perTrigger;

                                return (
                                    <TabsTrigger className="text-xs" key={perTrigger} value={perTrigger}>
                                        {currPer[0].toUpperCase() + currPer.slice(1)}ly
                                    </TabsTrigger>
                                )
                            })}
                        </TabsList>
                        <ScrollBar orientation="horizontal"/>
                    </ScrollArea>
                    {Pers.map(perContent => {
                        return (
                            <TabsContent key={perContent} value={perContent}>
                                Converting {per} to {perContent}
                            </TabsContent>
                        )
                    })}
                </Tabs>
            </CardContent>
        </Card>
    )
}