import { getCategoriesByType } from "./categories"

export type Income = {
  id: string
  category: string
  amount: number
  date: string
  note: string
  created_at: string
}

export const INCOME_CATEGORIES = getCategoriesByType("income").map((c) => c.label)

export const mockIncome: Income[] = [
  { id: "1",  category: "Salary", amount: 7500000, date: "2026-01-01", note: "Gaji Januari 2026",  created_at: "2026-01-01T09:00:00" },
  { id: "2",  category: "Salary", amount: 7500000, date: "2026-02-01", note: "Gaji Februari 2026", created_at: "2026-02-01T09:00:00" },
  { id: "3",  category: "Salary", amount: 7500000, date: "2026-03-01", note: "Gaji Maret 2026",    created_at: "2026-03-01T09:00:00" },
  { id: "4",  category: "Salary", amount: 7500000, date: "2026-04-01", note: "Gaji April 2026",    created_at: "2026-04-01T09:00:00" },
  { id: "5",  category: "Other",  amount: 7500000, date: "2026-04-05", note: "THR Lebaran 2026",   created_at: "2026-04-05T09:00:00" },
  { id: "6",  category: "Salary", amount: 7500000, date: "2026-05-01", note: "Gaji Mei 2026",      created_at: "2026-05-01T09:00:00" },
  { id: "7",  category: "Salary", amount: 7500000, date: "2026-06-01", note: "Gaji Juni 2026",     created_at: "2026-06-01T09:00:00" },
]