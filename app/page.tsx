import { Metadata } from "next"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { NavigationBar } from "@/components/navigation-bar"
import { DollarSign, Users } from "lucide-react"
import { BudgetDashboard} from "@/components/budget-calculator"

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
            <div>Insert expenses content here</div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}