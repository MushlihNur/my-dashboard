import { formatRupiah } from "@/lib/format";
import { getLatestSnapshot, mockGoals } from "@/lib/mock/goals";
import { format, parseISO } from "date-fns";
import Link from "next/link";

const topGoals = mockGoals
  .filter((g) => g.status === "ongoing")
  .sort((a, b) => a.sort_order - b.sort_order)
  .slice(0, 3)

export default function GoalsHighlight() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-c3">Goals</h2>
        <Link href="/finance/goals" className="text-xs text-c2 hover:text-c3 transition">
          View all →
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {topGoals.map((goal) => {
          const snapshot = getLatestSnapshot(goal.id)
          const current = snapshot?.amount ?? 0
          const percentage = Math.min(Math.round((current / goal.target_amount) * 100), 100)

          return (
            <Link
              key={goal.id}
              href={`/finance/goals/${goal.id}`}
              className="bg-white rounded-xl border border-c4 px-4 py-3 flex flex-col gap-2 hover:shadow-sm hover:border-c2 transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">{goal.icon}</span>
                  <p className="text-sm font-medium text-c3">{goal.name}</p>
                </div>
                <p className="text-xs font-medium text-c2">{percentage}%</p>
              </div>

              <div className="w-full bg-c4 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-1.5 rounded-full bg-c2 transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-c2">
                  {formatRupiah(current)} / {formatRupiah(goal.target_amount)}
                </p>
                <p className="text-xs text-slate-400">
                  {format(parseISO(goal.deadline), "MMM yyyy")}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}