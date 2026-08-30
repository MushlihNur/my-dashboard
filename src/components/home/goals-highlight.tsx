"use client"

import { getGoals, getLatestGoalSnapshot } from "@/lib/api/goals";
import { formatRupiah } from "@/lib/format";
import { GoalWithSnapshot } from "@/lib/supabase/types-helper";
import { format, parseISO } from "date-fns";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export default function GoalsHighlight() {
  const [goals, setGoals] = useState<GoalWithSnapshot[]>([])
  const [loading, setLoading] = useState(true)

  const fetchGoalsData = useCallback(async () => {
    setLoading(true)

    try {
      const data = await getGoals()

      const topGoals = data
        .filter((g) => g.status === "ongoing")
        .sort((a, b) => a.sort_order! - b.sort_order!)
        .slice(0, 3)

      const goalsWithSnapshots = await Promise.all(
        topGoals.map(async (goal) => {
          const snapshot = await getLatestGoalSnapshot(goal.id)

          return {
            ...goal,
            goal_snapshots: {
              amount: snapshot?.amount ?? 0
            }
          } as GoalWithSnapshot
        })
      )

      setGoals(goalsWithSnapshots)
    } catch {
      console.error("Failed to fetch goals")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchGoalsData()
  }, [fetchGoalsData])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-c3">Goals</h2>
        <Link href="/finance/goals" className="text-xs text-c2 hover:text-c3 transition">
          View all →
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {loading ? (
          <div className="text-center py-12 text-sm text-c2">Loading...</div>
        ) : goals.length === 0 ? (
          <div className="bg-white rounded-xl border border-c4 py-10 flex flex-col items-center justify-center">
            <p className="text-xs text-c2">No active goals yet.</p>
          </div>
        ) : (
          goals.map((goal) => {
            const current = goal.goal_snapshots?.amount ?? 0
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
          })
        )}
      </div>
    </div>
  )
}