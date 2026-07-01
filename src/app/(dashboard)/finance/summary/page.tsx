"use client"

import SummaryTable from "@/components/finance/summary-table";
import { mockExpenses } from "@/lib/mock/expenses";
import { mockIncome } from "@/lib/mock/income";
import { useState } from "react";

const AVAILABLE_YEARS = [2024, 2025, 2026]

export default function SummaryPage() {
  const [selectedYear, setSeletedYear] = useState(new Date().getFullYear())

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3 overflow-x-scroll scrollbar-none">
        {AVAILABLE_YEARS.map((year) => (
          <button
            key={year}
            onClick={() => setSeletedYear(year)}
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

      <SummaryTable
        expenses={mockExpenses}
        income={mockIncome}
        year={selectedYear}
      />
    </div>
  )
}