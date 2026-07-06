"use client"

import GoalCard from "@/components/finance/goal-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { closestCenter, DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { Goal, mockGoals } from "@/lib/mock/goals";
import { arrayMove, rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import GoalFormDialog from "@/components/finance/goal-form-dialog";

type StatusFilter = "all" | "ongoing" | "achieved" | "cancelled"

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>(
    [...mockGoals].sort((a, b) => a.sort_order - b.sort_order)
  )
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      }
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setGoals((prev) => {
      const oldIndex = prev.findIndex((g) => g.id === active.id)
      const newIndex = prev.findIndex((g) => g.id === over.id)
      return arrayMove(prev, oldIndex, newIndex)
    })
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

        <GoalFormDialog />
      </div>
      
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
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {filteredGoals.length === 0 && (
        <div className="text-center py-12 text-sm text-c2">
          No goals found.
        </div>
      )}
    </div>
  )
}