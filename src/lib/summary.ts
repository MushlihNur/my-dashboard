import { getMonth, getYear, parseISO } from "date-fns";

type TransactionItem = {
  date: string
  amount: number
  categories: { label: string }
}

export function aggregateByCategory(
  data: TransactionItem[],
  year: number
): Record<string, Record<number, number>> {
  const result: Record<string, Record<number, number>> = {}

  data.forEach((item) => {
    const date = parseISO(item.date)
    if (getYear(date) !== year) return

    const month = getMonth(date) + 1
    const category = item.categories.label

    if (!result[category]) result[category] = {}
    result[category][month] = (result[category][month] ?? 0) + item.amount
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