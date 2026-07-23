"use client"

import { getLatestGoalSnapshot } from "@/lib/api/goals";
import { formatRupiah } from "@/lib/format";
import { Goal, GoalSnapshot } from "@/lib/supabase/types-helper";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { format, parseISO } from "date-fns";
import { GripVertical, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

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

interface GoalCardProps {
  goal: Goal
  onDelete: () => void
}

export default function GoalCard({ goal, onDelete }: GoalCardProps) {
  const [snapshot, setSnapshot] = useState<GoalSnapshot | null>(null)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: goal.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  useEffect(() => {
    getLatestGoalSnapshot(goal.id).then(setSnapshot)
  }, [goal.id])

  const current = snapshot?.amount ?? 0
  const percentage = Math.min(Math.round((current / goal.target_amount) * 100), 100)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-white rounded-xl border border-c4 transition relative group",
        isDragging ? "opacity-50 shadow-lg" : "hover:shadow-sm hover:border-c2"
      )}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-400 cursor-grab active:cursor-grabbing transition opacity-0 group-hover:opacity-100 z-10"
        onClick={(e) => e.preventDefault()}
      >
        <GripVertical size={16} />
      </button>

      {/* Delete button */}
      <button
        onClick={(e) => {
          e.preventDefault()
          onDelete()
        }}
        className="absolute right-0 top-0 text-slate-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100 z-10 p-1.5 rounded-lg hover:bg-red-50 cursor-pointer"
      >
        <Trash2 size={14} />
      </button>

      <Link href={`/finance/goals/${goal.id}`} className="block p-5 pl-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-2 pr-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">{goal.icon}</span>
              <div>
                <p className="text-sm font-semibold text-c3">{goal.name}</p>
                {goal.deadline && (
                  <p className="text-xs text-slate-400 mt-0.5">
                    Target: {format(parseISO(goal.deadline), "MMM yyyy")}
                  </p>
                )}
              </div>
            </div>

            <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium shrink-0", statusStyles[goal.status ?? "ongoing"])}>
              {statusLabels[goal.status ?? "ongoing"]}
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="w-full bg-c4 rounded-full h-2 overflow-hidden">
              <div
                className={cn(
                  "h-2 rounded-full transition-all",
                  goal.status === "achieved" ? "bg-green-500" : "bg-c2"
                )}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-c2">{formatRupiah(current)}</span>
              <span className="text-xs font-medium text-c3">{percentage}%</span>
              <span className="text-xs text-c2">{formatRupiah(goal.target_amount)}</span>
            </div>
          </div>

          {snapshot && (
            <p className="text-xs text-slate-400">
              Last updated: {format(parseISO(snapshot.date), "dd MMM yyyy")}
              {snapshot.note && ` · ${snapshot.note}`}
            </p>
          )}
        </div>
      </Link>
    </div>
  )
}