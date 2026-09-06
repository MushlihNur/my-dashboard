"use client"

import FinanceSnapshot from "@/components/home/finance-snapshot"
import GoalsHighlight from "@/components/home/goals-highlight"
import Greeting from "@/components/home/greeting"
import QuickActions from "@/components/home/quick-actions"
import { getBudget } from "@/lib/api/budget"
import { getExpenses } from "@/lib/api/expenses"
import { getIncome } from "@/lib/api/income"
import { ExpenseWithCategory, IncomeWithCategory, MonthlyBudget } from "@/lib/supabase/types-helper"
import { endOfMonth, format, startOfMonth } from "date-fns"
import { useCallback, useEffect, useState } from "react"

const today = new Date()
const currentMonth = today.getMonth() + 1
const currentYear = today.getFullYear()
const monthStart = startOfMonth(today)
const monthEnd = endOfMonth(today)

export default function HomePage() {
  const [expenses, setExpenses] = useState<ExpenseWithCategory[]>([])
  const [income, setIncome] = useState<IncomeWithCategory[]>([])
  const [budget, setBudget] = useState<MonthlyBudget | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    setLoading(true)

    try {
      const [incomeData, expensesData, budgetData] = await Promise.all([
        getIncome(
          format(monthStart, "yyyy-MM-dd"),
          format(monthEnd, "yyyy-MM-dd")
        ),
        getExpenses(
          format(monthStart, "yyyy-MM-dd"),
          format(monthEnd, "yyyy-MM-dd")
        ),
        getBudget(currentYear, currentMonth),
      ])
      setIncome(incomeData)
      setExpenses(expensesData)
      setBudget(budgetData)
    }catch {
      console.error("Failed to load expenses")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  return (
    <div className="flex flex-col gap-8">
      <Greeting />
      
      <QuickActions onSuccess={fetchAll} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FinanceSnapshot 
            expenses={expenses} 
            income={income} 
            budget={budget} 
            loading={loading} 
          />
        </div>
        <div>
          <GoalsHighlight />
        </div>
      </div>
    </div>
  )
}