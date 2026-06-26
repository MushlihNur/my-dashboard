"use client"

import ExpenseChart from "@/components/finance/expense-chart"
import RecentTransactions from "@/components/finance/recent-transactions"
import StatsCard from "@/components/finance/stats-card"
import { getBudget } from "@/lib/mock/budget"
import { mockExpenses } from "@/lib/mock/expenses"
import { mockIncome } from "@/lib/mock/income"
import { endOfMonth, isWithinInterval, parseISO, startOfMonth } from "date-fns"
import { useMemo } from "react"

const today = new Date()
const currentMonth = today.getMonth() + 1
const currentYear = today.getFullYear()

export default function FinanceOverviewPage() {
  const monthStart = startOfMonth(today)
  const monthEnd = endOfMonth(today)

  const thisMonthExpenses = useMemo(() => 
    mockExpenses.filter((e) => 
      isWithinInterval(parseISO(e.date), { start: monthStart, end: monthEnd })
    ), []
  )

  const thisMonthIncome = useMemo(() => 
    mockIncome.filter((i) => 
      isWithinInterval(parseISO(i.date), { start: monthStart, end: monthEnd })
    ), []
  )

  const totalIncome = thisMonthIncome.reduce((sum, i) => sum + i.amount, 0)
  const totalExpenses = thisMonthExpenses.reduce((sum, i) => sum + i.amount, 0)
  const budget = getBudget(currentYear, currentMonth)
  const limit = budget?.limit ?? 0
  const balance = limit - totalExpenses
  const balanceVariant = balance >= 0 ? "positive" : "negative"

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard label="Income" amount={totalIncome} variant="positive" />
        <StatsCard label="Limit" amount={limit} variant="default" />
        <StatsCard label="Expenses" amount={totalExpenses} variant="negative" />
        <StatsCard label="Balance" amount={balance} variant={balanceVariant} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ExpenseChart expenses={thisMonthExpenses} />
        <RecentTransactions expenses={thisMonthExpenses} />
      </div>
    </div>
  )
}