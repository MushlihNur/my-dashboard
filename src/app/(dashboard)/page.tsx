import FinanceSnapshot from "@/components/home/finance-snapshot"
import GoalsHighlight from "@/components/home/goals-highlight"
import Greeting from "@/components/home/greeting"
import QuickActions from "@/components/home/quick-actions"

export default function HomePage() {
  return (
    <div className="flex flex-col gap-8">
      <Greeting />
      
      <QuickActions />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FinanceSnapshot />
        </div>
        <div>
          <GoalsHighlight />
        </div>
      </div>
    </div>
  )
}