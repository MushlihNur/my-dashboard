export type MonthlyBudget = {
  year: number
  month: number
  limit: number
}

export const mockBudget: MonthlyBudget[] = [
  { year: 2026, month: 1, limit: 4500000 },
  { year: 2026, month: 2, limit: 4500000 },
  { year: 2026, month: 3, limit: 4500000 },
  { year: 2026, month: 4, limit: 4500000 },
  { year: 2026, month: 5, limit: 4500000 },
  { year: 2026, month: 6, limit: 4500000 },
]

export function getBudget(year: number, month: number): MonthlyBudget | undefined {
  return mockBudget.find((b) => b.year === year && b.month === month)
}