"use client"

import ExpenseChart from "@/components/finance/expense-chart"
import RecentTransactions from "@/components/finance/recent-transactions"
import StatsCard from "@/components/ui/stats-card"
import { getBudget } from "@/lib/api/budget"
import { getExpenses } from "@/lib/api/expenses"
import { getIncome } from "@/lib/api/income"
import { formatRupiah } from "@/lib/format"
import { ExpenseWithCategory, IncomeWithCategory, MonthlyBudget } from "@/lib/supabase/types-helper"
import { endOfMonth, format, startOfMonth } from "date-fns"
import { useEffect, useState } from "react"

const today = new Date()
const currentMonth = today.getMonth() + 1
const currentYear = today.getFullYear()
const monthStart = startOfMonth(today)
const monthEnd = endOfMonth(today)

export default function FinanceOverviewPage() {
  const [expenses, setExpenses] = useState<ExpenseWithCategory[]>([])
  const [income, setIncome] = useState<IncomeWithCategory[]>([])
  const [budget, setBudget] = useState<MonthlyBudget | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAll() {
      setLoading(true)
      try {
        const [expensesData, incomeData, budgetData] = await Promise.all([
          getExpenses(
            format(monthStart, "yyyy-MM-dd"),
            format(monthEnd, "yyyy-MM-dd")
          ),
          getIncome(
            format(monthStart, "yyyy-MM-dd"),
            format(monthEnd, "yyyy-MM-dd")
          ),
          getBudget(currentYear, currentMonth),
        ])
        setExpenses(expensesData)
        setIncome(incomeData)
        setBudget(budgetData)
      } catch (err) {
        console.error("Failed to fetch overview data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [])

  const totalIncome = income.reduce((sum, i) => sum + i.amount, 0)
  const totalExpenses = expenses.reduce((sum, i) => sum + i.amount, 0)
  const limit = budget?.limit_amount ?? 0
  const balance = limit - totalExpenses
  const balanceVariant = balance >= 0 ? "text-green-600" : "text-red-500"

  if (loading) {
    return <div className="text-center py-12 text-sm text-c2">Loading...</div>
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard label="Income" value={formatRupiah(totalIncome)} valueClassName="text-green-600" />
        <StatsCard label="Limit" value={formatRupiah(limit)} />
        <StatsCard label="Expenses" value={formatRupiah(totalExpenses)} valueClassName="text-red-500" />
        <StatsCard label="Balance" value={formatRupiah(balance)} valueClassName={balanceVariant} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ExpenseChart expenses={expenses} />
        <RecentTransactions expenses={expenses} />
      </div>
    </div>
  )
}