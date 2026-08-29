import { getCategoriesByType } from "./categories"

export type Expense = {
  id: string
  category: string
  amount: number
  date: string
  note: string
  created_at: string
}

export const EXPENSE_CATEGORIES = getCategoriesByType("expense").map((c) => c.label)

export const mockExpenses: Expense[] = [
  // Januari 2026
  { id: "jan-1", category: "Makan Minum", amount: 850000,  date: "2026-01-05", note: "Makan sehari-hari", created_at: "2026-01-05T09:00:00" },
  { id: "jan-2", category: "Transportasi", amount: 200000,  date: "2026-01-10", note: "Bensin & transportasi", created_at: "2026-01-10T09:00:00" },
  { id: "jan-3", category: "Tempat Tinggal", amount: 500000,  date: "2026-01-01", note: "Kos januari", created_at: "2026-01-01T09:00:00" },
  { id: "jan-4", category: "Berbagi", amount: 200000,  date: "2026-01-03", note: "Infaq & sedekah", created_at: "2026-01-03T09:00:00" },
  { id: "jan-5", category: "Investasi", amount: 500000,  date: "2026-01-15", note: "Top up Bibit", created_at: "2026-01-15T09:00:00" },

  // Februari 2026
  { id: "feb-1", category: "Makan Minum", amount: 780000,  date: "2026-02-05", note: "Makan sehari-hari", created_at: "2026-02-05T09:00:00" },
  { id: "feb-2", category: "Transportasi", amount: 180000,  date: "2026-02-10", note: "Bensin & transportasi", created_at: "2026-02-10T09:00:00" },
  { id: "feb-3", category: "Tempat Tinggal", amount: 500000,  date: "2026-02-01", note: "Kos februari", created_at: "2026-02-01T09:00:00" },
  { id: "feb-4", category: "Pribadi", amount: 250000,  date: "2026-02-14", note: "Perawatan pribadi", created_at: "2026-02-14T09:00:00" },
  { id: "feb-5", category: "Berbagi", amount: 150000,  date: "2026-02-03", note: "Infaq & sedekah", created_at: "2026-02-03T09:00:00" },

  // Maret 2026
  { id: "mar-1", category: "Makan Minum", amount: 900000,  date: "2026-03-05", note: "Makan sehari-hari", created_at: "2026-03-05T09:00:00" },
  { id: "mar-2", category: "Transportasi", amount: 220000,  date: "2026-03-10", note: "Bensin & transportasi", created_at: "2026-03-10T09:00:00" },
  { id: "mar-3", category: "Tempat Tinggal", amount: 500000,  date: "2026-03-01", note: "Kos maret", created_at: "2026-03-01T09:00:00" },
  { id: "mar-4", category: "Kasih Sayang", amount: 300000,  date: "2026-03-20", note: "Hadiah", created_at: "2026-03-20T09:00:00" },
  { id: "mar-5", category: "Investasi", amount: 750000,  date: "2026-03-15", note: "Top up Bibit", created_at: "2026-03-15T09:00:00" },

  // April 2026
  { id: "apr-1",  category: "Makan Minum", amount: 60000,  date: "2026-04-01", note: "Makan sate sapi", created_at: "2026-04-01T09:36:33" },
  { id: "apr-2",  category: "Makan Minum", amount: 16500,  date: "2026-04-02", note: "Jajan indomaret", created_at: "2026-04-02T21:01:24" },
  { id: "apr-3",  category: "Makan Minum", amount: 33000,  date: "2026-04-02", note: "Makan pecel ayam", created_at: "2026-04-02T21:01:44" },
  { id: "apr-4",  category: "Berbagi", amount: 50000,  date: "2026-04-03", note: "Infaq jumat", created_at: "2026-04-03T16:18:21" },
  { id: "apr-5",  category: "Tempat Tinggal", amount: 10304,  date: "2026-04-06", note: "Bayar listrik mbah golok", created_at: "2026-04-06T11:48:12" },
  { id: "apr-6",  category: "Makan Minum", amount: 30000,  date: "2026-04-06", note: "Makan sate ayam", created_at: "2026-04-06T23:09:04" },
  { id: "apr-7",  category: "Transportasi", amount: 25000,  date: "2026-04-06", note: "Isi bensin beat street", created_at: "2026-04-06T23:09:24" },
  { id: "apr-8",  category: "Makan Minum", amount: 30000,  date: "2026-04-07", note: "Makan sate ayam", created_at: "2026-04-07T22:22:04" },
  { id: "apr-9",  category: "Kasih Sayang", amount: 50000,  date: "2026-04-10", note: "Patungan kado buat BOD", created_at: "2026-04-10T13:34:39" },
  { id: "apr-10", category: "Transportasi", amount: 30000,  date: "2026-04-13", note: "Isi bensin beat street", created_at: "2026-04-13T20:25:26" },

  // Mei 2026
  { id: "mei-1", category: "Makan Minum", amount: 920000,  date: "2026-05-05", note: "Makan sehari-hari", created_at: "2026-05-05T09:00:00" },
  { id: "mei-2", category: "Transportasi", amount: 210000,  date: "2026-05-10", note: "Bensin & transportasi", created_at: "2026-05-10T09:00:00" },
  { id: "mei-3", category: "Tempat Tinggal", amount: 500000,  date: "2026-05-01", note: "Kos mei", created_at: "2026-05-01T09:00:00" },
  { id: "mei-4", category: "Pribadi", amount: 300000,  date: "2026-05-10", note: "Beli baju lebaran", created_at: "2026-05-10T09:00:00" },
  { id: "mei-5", category: "Berbagi", amount: 500000,  date: "2026-05-03", note: "Zakat fitrah", created_at: "2026-05-03T09:00:00" },
  { id: "mei-6", category: "Investasi", amount: 750000,  date: "2026-05-15", note: "Top up Bibit", created_at: "2026-05-15T09:00:00" },

  // Juni 2026
  { id: "jun-1", category: "Makan Minum", amount: 30000,  date: "2026-06-06", note: "Makan sate ayam", created_at: "2026-06-06T23:09:04" },
  { id: "jun-2", category: "Transportasi", amount: 25000,  date: "2026-06-06", note: "Isi bensin beat street", created_at: "2026-06-06T23:09:24" },
  { id: "jun-3", category: "Makan Minum", amount: 30000,  date: "2026-06-07", note: "Makan sate ayam", created_at: "2026-06-07T22:22:04" },
  { id: "jun-4", category: "Kasih Sayang", amount: 50000,  date: "2026-06-10", note: "Patungan kado buat BOD", created_at: "2026-06-10T13:34:39" },
  { id: "jun-5", category: "Transportasi", amount: 30000,  date: "2026-06-13", note: "Isi bensin beat street", created_at: "2026-06-13T20:25:26" },
]