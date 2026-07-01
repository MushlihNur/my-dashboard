import { Expense } from "@/lib/mock/expenses";
import { Income } from "@/lib/mock/income";
import { getMonth, getYear, parseISO } from "date-fns";

export function aggregateByCategory(
  data: (Expense | Income)[],
  year: number
): Record<string, Rercord<number, number>> {
  const result: Record<string, Record<number, number>> = {}

  data.forEach((item) => {
    const date = parseISO(item.date)
    if (getYear(date) !== year) return

    const month = getMonth(date) + 1
    if (!result[item.category]) result[item.category] = {}
    result[item.category][month] = (result[item.category][month] ?? 0) + item.amount
  })

  return result
}

export function totalPerMonth(
  aggregated: Record<string, Record<number, number>>
): Record<number, number> {
  const result: Record<number, number> = {}

  Object.values(aggregated).forEach((monthMap) => {
    Object.entries(monthMap).forEach(([month, amount]) => {
      const m = Number(month)
      result[m] = (result[m] ?? 0) + amount
    })
  })

  return result
}

export function grandTotal(monthTotals: Record<number, number>): number {
  return Object.values(monthTotals).reduce((sum, v) => sum + v, 0)
}