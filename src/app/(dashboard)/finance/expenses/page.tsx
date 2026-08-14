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
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const today = new Date()

export default function ExpensesPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const fromParam = searchParams.get("from")
  const toParam = searchParams.get("to")
  const categoryParam = searchParams.get("category") || ""

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: fromParam ? new Date(fromParam) : startOfMonth(today),
    to: toParam ? new Date(toParam) : endOfMonth(today),
  })
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam)

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

  const handleDateChange = (range: DateRange | undefined) => {
    setDateRange(range)

    const params = new URLSearchParams(searchParams.toString())

    if (range?.from) {
      params.set("from", format(range.from, "yyyy-MM-dd"))
    } else {
      params.delete("from")
    }
    
    if (range?.to) {
      params.set("to", format(range.to, "yyyy-MM-dd"))
    } else {
      params.delete("to")
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const handleCategoryChange = (val: string) => {
    setSelectedCategory(val)
    
    const params = new URLSearchParams(searchParams.toString())
    if (val) {
      params.set("category", val)
    } else {
      params.delete("category")
    }
    
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const filtered = selectedCategory
    ? expenses.filter((e) => e.category_id === selectedCategory)
    : expenses

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3 flex-wrap justify-between">
        <div className="flex items-center gap-3">
          <DateRangePicker 
            value={dateRange}
            onChange={handleDateChange}
            className="w-64"
          />
      
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
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