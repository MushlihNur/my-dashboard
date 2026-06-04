export type Expense = {
  id: string
  category: string
  amount: number
  date: string
  note: string
  created_at: string
}

export const EXPENSE_CATEGORIES = [
  "Makan Minum",
  "Transportasi",
  "Tempat Tinggal",
  "Pribadi",
  "Kasih Sayang",
  "Berbagi",
  "Dana Darurat",
  "Investasi",
  "Other",
]

export const mockExpenses: Expense[] = [
  { id: "1", category: "Makan Minum", amount: 60000, date: "2026-06-01", note: "Makan sate sapi", created_at: "2026-06-01T09:36:33" },
  { id: "2", category: "Makan Minum", amount: 16500, date: "2026-06-02", note: "Jajan indomaret", created_at: "2026-06-02T21:01:24" },
  { id: "3", category: "Makan Minum", amount: 33000, date: "2026-06-02", note: "Makan pecel ayam", created_at: "2026-06-02T21:01:44" },
  { id: "4", category: "Berbagi", amount: 50000, date: "2026-06-03", note: "Infaq jumat", created_at: "2026-06-03T16:18:21" },
  { id: "5", category: "Tempat Tinggal", amount: 10304, date: "2026-06-06", note: "Bayar listrik mbah golok", created_at: "2026-06-06T11:48:12" },
  { id: "6", category: "Makan Minum", amount: 30000, date: "2026-06-06", note: "Makan sate ayam", created_at: "2026-06-06T23:09:04" },
  { id: "7", category: "Transportasi", amount: 25000, date: "2026-06-06", note: "Isi bensin beat street", created_at: "2026-06-06T23:09:24" },
  { id: "8", category: "Makan Minum", amount: 30000, date: "2026-06-07", note: "Makan sate ayam", created_at: "2026-06-07T22:22:04" },
  { id: "9", category: "Kasih Sayang", amount: 50000, date: "2026-06-10", note: "Patungan kado buat BOD", created_at: "2026-06-10T13:34:39" },
  { id: "10", category: "Transportasi", amount: 30000, date: "2026-06-13", note: "Isi bensin beat street", created_at: "2026-06-13T20:25:26" },
]
