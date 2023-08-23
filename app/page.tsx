import { Metadata } from "next"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { NavigationBar } from "@/components/navigation-bar"
import { BudgetDashboard} from "@/components/budget-calculator"
import ExpensesDashboard from "@/components/expenses/expenses-dashboard"

export const metadata: Metadata = {
  title: "Rakan",
  description: "An application by Nathan Baylon",
}

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <NavigationBar />
        <Tabs defaultValue="budget" className="space-y-4">
          <TabsList>
            <TabsTrigger value="budget">
              Budget
            </TabsTrigger>
            <TabsTrigger value="expenses">
              Expenses
            </TabsTrigger>
          </TabsList>
          <TabsContent value="budget" className="space-y-4">
            <BudgetDashboard/>
          </TabsContent>
          <TabsContent value="expenses" className="space-y-4">
            <ExpensesDashboard/>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}