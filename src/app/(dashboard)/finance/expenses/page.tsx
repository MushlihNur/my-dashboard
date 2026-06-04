"use client"

import AddExpenseDialog from "@/components/finance/add-expenses-dialog";
import ExpensesTable from "@/components/finance/expenses-table";
import { EXPENSE_CATEGORIES, mockExpenses } from "@/lib/mock/expenses";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { endOfMonth, isWithinInterval, parseISO, startOfMonth } from "date-fns";
import DateRangePicker from "@/components/ui/date-range-picker";

const today = new Date()
const defaultRange: DateRange = {
  from: startOfMonth(today),
  to: endOfMonth(today),
}

export default function ExpensesPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(defaultRange)
  const [selectedCategory, setSelectedCategory] = useState<string>("")

  const filtered = mockExpenses.filter((e) => {
    const expenseDate = parseISO(e.date)

    const inRange = 
      dateRange?.from && dateRange?.to
        ? isWithinInterval(expenseDate, {
          start: dateRange.from,
          end: dateRange.to
        })
        : true

    const inCategory = selectedCategory ? e.category === selectedCategory : true

    return inRange && inCategory
  })

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
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <AddExpenseDialog />
      </div>

      <ExpensesTable expenses={filtered} />
    </div>
  )
}