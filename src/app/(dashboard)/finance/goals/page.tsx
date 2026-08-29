"use client"

import GoalCard from "@/components/finance/goal-card";
import { useCallback, useEffect, useState } from "react";
import { closestCenter, DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import GoalFormDialog from "@/components/finance/goal-form-dialog";
import { Goal } from "@/lib/supabase/types-helper";
import { deleteGoal, getGoals, updateGoalSortOrder } from "@/lib/api/goals";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { notify } from "@/lib/toast";

type StatusFilter = "all" | "ongoing" | "achieved" | "cancelled"

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [deletingGoal, setDeletingGoal] = useState<Goal | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchGoals = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getGoals()
      setGoals(data)
    } catch {
      console.error("Failed to fetch goals")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchGoals()
  }, [fetchGoals])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      }
    })
  )

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = goals.findIndex((g) => g.id === active.id)
    const newIndex = goals.findIndex((g) => g.id === over.id)
    const reordered = arrayMove(goals, oldIndex, newIndex)

    setGoals(reordered)

    await updateGoalSortOrder(
      reordered.map((g, index) => ({ id: g.id, sort_order: index + 1 }))
    )
  }

  async function handleDelete() {
    if (!deletingGoal) return
    setDeleteLoading(true)

    try {
      await deleteGoal(deletingGoal?.id)
      setDeletingGoal(null)
      notify.success("Goal deleted")
      fetchGoals()
    } catch {
      console.error("Failed to delete goal")
      notify.error("Failed to delete goal")
    } finally {
      setDeleteLoading(false)
    }
  }

  const filteredGoals = goals.filter((g) => 
    statusFilter === "all" ? true : g.status === statusFilter
  )

  const filterOptions: { label: string; value: StatusFilter }[] = [
    { label: "All", value: "all" },
    { label: "Ongoing", value: "ongoing" },
    { label: "Achieved", value: "achieved" },
    { label: "Cancelled", value: "cancelled" },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                statusFilter === opt.value
                  ? "bg-c3 text-white"
                  : "bg-white border border-c4 text-c2 hover:border-c3 hover:text-c3"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <GoalFormDialog onSuccess={fetchGoals} />
      </div>
      
      {loading ? (
        <div className="text-center py-12 text-sm text-c2">Loading...</div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filteredGoals.map((g) => g.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredGoals.map((goal) => (
                <GoalCard 
                  key={goal.id}
                  goal={goal}
                  onDelete={() => setDeletingGoal(goal)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {filteredGoals.length === 0 && !loading && (
        <div className="text-center py-12 text-sm text-c2">
          No goals found.
        </div>
      )}

      <ConfirmDialog 
        open={!!deletingGoal}
        title="Delete Goal"
        description={`Are you sure you want to delete "${deletingGoal?.name}"? All snapshots will also be deleted. This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeletingGoal(null)}
        loading={deleteLoading}
      />
    </div>
  )
}