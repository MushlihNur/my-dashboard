"use client"

import ExpensesTable from "@/components/finance/expenses-table";
import { useCallback, useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { endOfMonth, format, startOfMonth } from "date-fns";
import DateRangePicker from "@/components/ui/date-range-picker";
import { Category, ExpenseWithCategory } from "@/lib/supabase/types-helper";
import { getCategoriesByType } from "@/lib/api/categories";
import { getExpenses } from "@/lib/api/expenses";
import ExpenseFormDialog from "@/components/finance/expense-form-dialog";

const today = new Date()
const defaultRange: DateRange = {
  from: startOfMonth(today),
  to: endOfMonth(today),
}

export default function ExpensesPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(defaultRange)
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [expenses, setExpenses] = useState<ExpenseWithCategory[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    getCategoriesByType("expense")
      .then(setCategories)
      .catch(() => setError("Failed to load categories"))
  }, [])

  const fetchExpenses = useCallback(async () => {
    if (!dateRange?.from || !dateRange?.to) return

    setLoading(true)
    setError("")

    try {
      const data = await getExpenses(
        format(dateRange.from, "yyyy-MM-dd"),
        format(dateRange.to, "yyyy-MM-dd"),
      )
      setExpenses(data)
    } catch {
      setError("Failed to load expenses")
    } finally {
      setLoading(false)
    }
  }, [dateRange])

  useEffect(() => {
    fetchExpenses()
  }, [fetchExpenses])

  const filtered = selectedCategory
    ? expenses.filter((e) => e.category_id === selectedCategory)
    : expenses

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3 flex-wrap justify-between">
        <div className="flex items-center gap-3">
          <DateRangePicker 
            value={dateRange}
            onChange={setDateRange}
            className="w-64"
          />
      
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 text-sm border border-c4 rounded-lg outline-none focus:ring-2 focus:ring-c3 bg-white text-c3 cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>
        </div>

        <ExpenseFormDialog onSuccess={fetchExpenses} />
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      {loading ? (
        <div className="text-center py-12 text-sm text-c2">Loading...</div>
      ) : (
        <ExpensesTable expenses={filtered} onSuccess={fetchExpenses} />
      )}
    </div>
  )
}