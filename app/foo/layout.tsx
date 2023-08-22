import { NavigationBar } from "@/components/navigation-bar";

export default function FooLayout({children}: {children: React.ReactNode}) {
    return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <NavigationBar/>
        {children}
      </div>
    </div>
    )
}