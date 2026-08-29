export type Goal = {
  id: string
  name: string
  icon: string
  target_amount: number
  deadline: string
  status: "ongoing" | "achieved" | "cancelled"
  sort_order: number
  created_at: string
}

export type GoalSnapshot = {
  id: string
  goal_id: string
  amount: number
  note?: string
  date: string
  created_at: string
}

export const mockGoals: Goal[] = [
  {
    id: "goal-1",
    name: "Dana Darurat",
    icon: "🛡️",
    target_amount: 30000000,
    deadline: "2026-12-31",
    status: "ongoing",
    sort_order: 1,
    created_at: "2024-01-01T00:00:00",
  },
  {
    id: "goal-2",
    name: "Beli Macbook",
    icon: "💻",
    target_amount: 25000000,
    deadline: "2026-12-31",
    status: "achieved",
    sort_order: 2,
    created_at: "2024-01-01T00:00:00",
  },
  {
    id: "goal-3",
    name: "Financial Freedom",
    icon: "🏖️",
    target_amount: 1000000000,
    deadline: "2040-12-31",
    status: "ongoing",
    sort_order: 3,
    created_at: "2024-01-01T00:00:00",
  },
  {
    id: "goal-4",
    name: "Umroh",
    icon: "🕋",
    target_amount: 30000000,
    deadline: "2027-12-31",
    status: "ongoing",
    sort_order: 4,
    created_at: "2024-01-01T00:00:00",
  },
]

export const mockGoalSnapshots: GoalSnapshot[] = [
  // Dana Darurat
  { id: "s-1",  goal_id: "goal-1", amount: 5000000,  note: "Initial",          date: "2024-01-31", created_at: "2024-01-31T00:00:00" },
  { id: "s-2",  goal_id: "goal-1", amount: 6000000,  note: "Top up BSI",        date: "2024-02-29", created_at: "2024-02-29T00:00:00" },
  { id: "s-3",  goal_id: "goal-1", amount: 7500000,  note: "Top up BSI",        date: "2024-03-31", created_at: "2024-03-31T00:00:00" },
  { id: "s-4",  goal_id: "goal-1", amount: 9000000,  note: "Top up BSI",        date: "2024-04-30", created_at: "2024-04-30T00:00:00" },
  { id: "s-5",  goal_id: "goal-1", amount: 10500000, note: "Top up BSI",        date: "2024-05-31", created_at: "2024-05-31T00:00:00" },
  { id: "s-6",  goal_id: "goal-1", amount: 12000000, note: "Top up BSI",        date: "2024-06-30", created_at: "2024-06-30T00:00:00" },
  { id: "s-7",  goal_id: "goal-1", amount: 13000000, note: "Top up BSI",        date: "2025-01-31", created_at: "2025-01-31T00:00:00" },
  { id: "s-8",  goal_id: "goal-1", amount: 14000000, note: "Top up BSI",        date: "2025-06-30", created_at: "2025-06-30T00:00:00" },
  { id: "s-9",  goal_id: "goal-1", amount: 15279066, note: "Top up BSI + Bibit", date: "2026-01-31", created_at: "2026-01-31T00:00:00" },
  { id: "s-10", goal_id: "goal-1", amount: 15311336, note: "Bibit naik",         date: "2026-02-28", created_at: "2026-02-28T00:00:00" },
  { id: "s-11", goal_id: "goal-1", amount: 15367233, note: "Bibit naik",         date: "2026-03-31", created_at: "2026-03-31T00:00:00" },
  { id: "s-12", goal_id: "goal-1", amount: 15396865, note: "Bibit naik",         date: "2026-04-30", created_at: "2026-04-30T00:00:00" },
  { id: "s-13", goal_id: "goal-1", amount: 15396865, note: "Tidak ada perubahan", date: "2026-05-31", created_at: "2026-05-31T00:00:00" },

  // Beli Macbook
  { id: "s-14", goal_id: "goal-2", amount: 11063734,  note: "Bibit",            date: "2026-01-31", created_at: "2026-01-31T00:00:00" },
  { id: "s-15", goal_id: "goal-2", amount: 10583654,  note: "Bibit turun",      date: "2026-02-28", created_at: "2026-02-28T00:00:00" },
  { id: "s-16", goal_id: "goal-2", amount: 11475690,  note: "Bibit naik",       date: "2026-03-31", created_at: "2026-03-31T00:00:00" },
  { id: "s-17", goal_id: "goal-2", amount: 13058454,  note: "Bibit naik",       date: "2026-04-30", created_at: "2026-04-30T00:00:00" },
  { id: "s-18", goal_id: "goal-2", amount: 14963075,  note: "Bibit naik",       date: "2026-05-31", created_at: "2026-05-31T00:00:00" },

  // Financial Freedom
  { id: "s-19", goal_id: "goal-3", amount: 5000000,   note: "Initial",          date: "2024-01-31", created_at: "2024-01-31T00:00:00" },
  { id: "s-20", goal_id: "goal-3", amount: 8000000,   note: "Top up Bibit",     date: "2024-06-30", created_at: "2024-06-30T00:00:00" },
  { id: "s-21", goal_id: "goal-3", amount: 12000000,  note: "Top up Bibit",     date: "2025-01-31", created_at: "2025-01-31T00:00:00" },
  { id: "s-22", goal_id: "goal-3", amount: 16588319,  note: "Bibit naik",       date: "2026-01-31", created_at: "2026-01-31T00:00:00" },
  { id: "s-23", goal_id: "goal-3", amount: 18609845,  note: "Bibit naik",       date: "2026-04-30", created_at: "2026-04-30T00:00:00" },

  // Umroh
  { id: "s-24", goal_id: "goal-4", amount: 1852884,   note: "Initial",          date: "2026-04-30", created_at: "2026-04-30T00:00:00" },
  { id: "s-25", goal_id: "goal-4", amount: 2963703,   note: "Top up Bibit",     date: "2026-05-31", created_at: "2026-05-31T00:00:00" },
]

export function getLatestSnapshot(goalId: string): GoalSnapshot | undefined {
  return mockGoalSnapshots
    .filter((s) => s.goal_id === goalId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
}

export function getGoalSnapshots(goalId: string): GoalSnapshot[] {
  return mockGoalSnapshots
    .filter((s) => s.goal_id === goalId)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}