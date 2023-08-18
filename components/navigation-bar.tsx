"use client"
import { ThemeToggle } from "@/components/theme-toggle"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
    NavigationMenuViewport,
} from "@/components/ui/navigation-menu"

import { BirdIcon } from "lucide-react"

export function NavigationBar() {
    return (
        <div className="flex items-center justify-between space-y-2">
            <div className="flex">
                <h2 className="tracking-tight transition font-display text-3xl font-bold sm:text-[3rem] bg-gradient-to-r from-20% bg-clip-text text-transparent from-emerald-500 to-yellow-500 dark:from-emerald-400 dark:to-yellow-300">
                    Rakan
                </h2>
                <BirdIcon className="text-yellow-500 dark:text-yellow-300 text-6xl text-[3rem]" />
                <NavigationMenu className="mx-4 hidden sm:block">
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>Product</NavigationMenuTrigger>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>Financials</NavigationMenuTrigger>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>Docs</NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
            <div className="flex items-center space-x-2">
                <ThemeToggle />
            </div>
        </div>
    )
}