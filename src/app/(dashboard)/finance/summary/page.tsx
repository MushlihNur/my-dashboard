"use client"

import SummaryTable from "@/components/finance/summary-table";
import { getBudgetsByYear } from "@/lib/api/budget";
import { getExpensesByYear } from "@/lib/api/expenses";
import { getIncomeByYear } from "@/lib/api/income";
import { ExpenseWithCategory, IncomeWithCategory, MonthlyBudget } from "@/lib/supabase/types-helper";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const AVAILABLE_YEARS = [2024, 2025, 2026]

function SummaryContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const yearParam = searchParams.get('year')
  const selectedYear = yearParam ? parseInt(yearParam, 10) : new Date().getFullYear()

  const [expenses, setExpenses] = useState<ExpenseWithCategory[]>([])
  const [income, setIncome] = useState<IncomeWithCategory[]>([])
  const [budgets, setBudgets] = useState<MonthlyBudget[]>([])
  const [loading, setLoading] = useState(true)

  const handleYearChange = (newYear: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('year', newYear.toString())
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  useEffect(() => {
    async function fetchAll() {
      setLoading(true)
      try {
        const [expensesData, incomeData, budgetsData] = await Promise.all([
          getExpensesByYear(selectedYear),
          getIncomeByYear(selectedYear),
          getBudgetsByYear(selectedYear),
        ])
        setExpenses(expensesData)
        setIncome(incomeData)
        setBudgets(budgetsData)
      } catch (err) {
        console.error("Failed to fetch summary data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [selectedYear])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3 overflow-x-scroll scrollbar-none">
        {AVAILABLE_YEARS.map((year) => (
          <button
            key={year}
            onClick={() => handleYearChange(year)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer ${
              selectedYear === year
                ? "bg-c3 text-white"
                : "bg-white border border-c4 text-c2 hover:border-c3 hover:text-c3"
            }`}
          >
            {year}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-sm text-c2">Loading...</div>
      ) : (
        <SummaryTable
          expenses={expenses}
          income={income}
          budgets={budgets}
          year={selectedYear}
        />
      )}
    </div>
  )
}

export default function SummaryPage() {
 return (
    <Suspense fallback={<div className="text-center py-12 text-sm text-c2">Loading...</div>}>
      <SummaryContent />
    </Suspense>
  ) 
}