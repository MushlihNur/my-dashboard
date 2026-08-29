"use client"

import GoalFormDialog from "@/components/finance/goal-form-dialog"
import GoalProgressChart from "@/components/finance/goal-progress-chart"
import GoalSnapshotHistory from "@/components/finance/goal-snapshot-history"
import SnapshotFormDialog from "@/components/finance/snapshot-form-dialog"
import StatsCard from "@/components/ui/stats-card"
import { deleteGoalSnapshot, getGoalById, getGoalSnapshots, getLatestGoalSnapshot } from "@/lib/api/goals"
import { formatRupiah } from "@/lib/format"
import { Goal, GoalSnapshot } from "@/lib/supabase/types-helper"
import { cn } from "@/lib/utils"
import { format, parseISO } from "date-fns"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound, useParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

const statusStyles: Record<string, string> = {
  ongoing: "bg-blue-100 text-blue-700",
  achieved: "bg-green-100 text-green-700",
  cancelled: "bg-slate-100 text-slate-500",
}

const statusLabels: Record<string, string> = {
  ongoing: "Ongoing",
  achieved: "Achieved",
  cancelled: "Cancelled",
}

export default function GoalDetailPage() {
  const { id } = useParams<{ id: string }>()
  
  const [goal, setGoal] = useState<Goal | null>(null)
  const [snapshots, setSnapshots] = useState<GoalSnapshot[]>([])
  const [latest, setLatest] = useState<GoalSnapshot | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound2, setNotFound2] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [goalData, snapshotsData, latestData] = await Promise.all([
        getGoalById(id),
        getGoalSnapshots(id),
        getLatestGoalSnapshot(id),
      ])
      setGoal(goalData)
      setSnapshots(snapshotsData)
      setLatest(latestData)
    } catch {
      setNotFound2(true)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading) {
    return <div className="text-center py-12 text-sm text-c2">Loading...</div>
  }

  if (notFound2 || !goal) return notFound()

  const current = latest?.amount ?? 0
  const percentage = Math.min(Math.round((current / goal.target_amount) * 100), 100)
  const remaining = Math.max(goal.target_amount - current, 0)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Link
          href="/finance/goals"
          className="flex items-center gap-1.5 text-sm text-c2 hover:text-c3 transition w-fit"
        >
          <ArrowLeft size={15} />
          Back to Goals
        </Link>

        <div className="flex items-start justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{goal.icon}</span>
            <div>
              <h2 className="text-xl font-semibold text-c3">{goal.name}</h2>
              {goal.deadline && (
                <p className="text-sm text-slate-400">
                  Deadline: {format(parseISO(goal.deadline), "MMMM yyyy")}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", statusStyles[goal.status ?? "ongoing"])}>
              {statusLabels[goal.status ?? "ongoing"]}
            </span>
            <GoalFormDialog goal={goal} onSuccess={fetchData} />
            <SnapshotFormDialog 
              goalId={goal.id} 
              goalName={goal.name} 
              currentAmount={current} 
              onSuccess={fetchData}
            />
          </div>
        </div>
      </div>

      {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4"> */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard label="Current" value={formatRupiah(current)} />
        <StatsCard label="Target"    value={formatRupiah(goal.target_amount)} />
        <StatsCard label="Remaining" value={formatRupiah(remaining)} />
        <StatsCard
          label="Progress"
          value={`${percentage}%`}
          valueClassName={percentage >= 100 ? "text-green-600" : "text-c3"}
        />
      </div>

      <div className="bg-white rounded-xl border border-c4 px-5 py-4 flex flex-col gap-2">
        <div className="flex justify-between text-xs text-c2">
          <span>{formatRupiah(current)}</span>
          <span>{formatRupiah(goal.target_amount)}</span>
        </div>
        <div className="w-full bg-c4 rounded-full h-3 overflow-hidden">
          <div
            className={cn(
              "h-3 rounded-full transition-all",
              goal.status === "achieved" ? "bg-green-500" : "bg-c2"
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GoalProgressChart 
          snapshots={snapshots} 
          targetAmount={goal.target_amount} 
          deadline={goal.deadline} 
          status={(goal.status as "ongoing" | "achieved" | "cancelled") ?? "ongoing"}
        />
        <GoalSnapshotHistory
          snapshots={snapshots} 
          goalName={goal.name}
          currentAmount={current}
          onDeleteSnapshot={async (snapshotId) => {
            await deleteGoalSnapshot(snapshotId)
            fetchData()
          }}
          onSuccess={fetchData}
        />
      </div>
    </div>
  )
}