"use client"

import IncomeFormDialog from "@/components/finance/income-form-dialog";
import IncomeTable from "@/components/finance/income-table";
import DateRangePicker from "@/components/ui/date-range-picker";
import { getCategoriesByType } from "@/lib/api/categories";
import { getIncome } from "@/lib/api/income";
import { Category, IncomeWithCategory } from "@/lib/supabase/types-helper";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

const today = new Date()
const defaultRange: DateRange = {
  from: startOfMonth(today),
  to: endOfMonth(today),
}

export default function IncomePage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(defaultRange)
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [income, setIncome] = useState<IncomeWithCategory[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    getCategoriesByType("income")
      .then(setCategories)
      .catch(() => setError("Failed to load categories"))
  }, [])

  const fetchIncome = useCallback(async () => {
    if (!dateRange?.from || !dateRange?.to) return

    setLoading(true)
    setError("")

    try {
      const data = await getIncome(
        format(dateRange.from, "yyyy-MM-dd"),
        format(dateRange.to, "yyyy-MM-dd")
      )
      setIncome(data)
    } catch {
      setError("Failed to load income")
    } finally {
      setLoading(false)
    }
  }, [dateRange])

  useEffect(() => {
    fetchIncome()
  }, [fetchIncome])

  const filtered = selectedCategory
    ? income.filter((i) => i.category_id === selectedCategory)
    : income

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

        <IncomeFormDialog onSuccess={fetchIncome} />
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      {loading ? (
        <div className="text-center py-12 text-sm text-c2">Loading...</div>
      ) : (
        <IncomeTable income={filtered} onSuccess={fetchIncome} />
      )}
    </div>
  )
}