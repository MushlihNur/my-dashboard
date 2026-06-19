"use client"

import AddIncomeDialog from "@/components/finance/add-income-dialog";
import IncomeTable from "@/components/finance/income-table";
import DateRangePicker from "@/components/ui/date-range-picker";
import { INCOME_CATEGORIES, mockIncome } from "@/lib/mock/income";
import { endOfMonth, isWithinInterval, parseISO, startOfMonth } from "date-fns";
import { useState } from "react";
import { DateRange } from "react-day-picker";

const today = new Date()
const defaultRange: DateRange = {
  from: startOfMonth(today),
  to: endOfMonth(today),
}

export default function IncomePage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(defaultRange)
  const [selectedCategory, setSelectedCategory] = useState<string>("")

  const filtered = mockIncome.filter((i) => {
    const incomeDate = parseISO(i.date)

    const inRange =
      dateRange?.from && dateRange?.to
        ? isWithinInterval(incomeDate, {
            start: dateRange.from,
            end: dateRange.to,
          })
        : true
    
    const inCategory = selectedCategory ? i.category === selectedCategory : true

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
            {INCOME_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <AddIncomeDialog />
      </div>

      <IncomeTable income={filtered} />
    </div>
  )
}