"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import FormInput from "../ui/form-input";
import DatePicker from "../ui/date-picker";
import { Goal } from "@/lib/supabase/types-helper";
import { addGoal, updateGoal } from "@/lib/api/goals";

interface GoalFormDialogProps {
  goal?: Goal
  onSuccess: () => void
}

const STATUS_OPTIONS = [
  { value: "ongoing", label: "Ongoing"   },
  { value: "achieved", label: "Achieved"  },
  { value: "cancelled", label: "Cancelled" },
]

export default function GoalFormDialog({ goal, onSuccess }: GoalFormDialogProps) {
  const isEdit = !!goal

  const [open, setOpen] = useState(false)
  const [name, setName] = useState(goal?.name ?? "")
  const [icon, setIcon] = useState(goal?.icon ?? "")
  const [targetAmount, setTargetAmount] = useState(goal?.target_amount ? String(goal.target_amount) : "")
  const [deadline, setDeadline] = useState(goal?.deadline ?? "")
  const [status, setStatus] = useState<Goal["status"]>(goal?.status ?? "ongoing")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (open) {
      setName(goal?.name ?? "")
      setIcon(goal?.icon ?? "")
      setTargetAmount(goal?.target_amount ? String(goal.target_amount) : "")
      setDeadline(goal?.deadline ?? "")
      setStatus(goal?.status ?? "ongoing")
      setError("")
    }
  }, [open, goal])

  function handleClose() {
    setOpen(false)
    setError("")
  }

  async function handleSave() {
    if (!name || !targetAmount || !deadline) return

    setLoading(true)
    setError("")

    try {
      if (isEdit && goal) {
        await updateGoal(goal.id, {
          name,
          icon,
          target_amount: Number(targetAmount),
          deadline,
          status,
        })
      } else {
        await addGoal({
          name,
          icon: icon || "🎯",
          target_amount: Number(targetAmount),
          deadline,
        })
      }
      handleClose()
      onSuccess()
    } catch {
      setError("Failed to save goal. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) handleClose(); else setOpen(true) }}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button variant="outline" size="sm" className="cursor-pointer text-xs">
            Edit Goal
          </Button>
        ) : (
          <Button className="gap-2 cursor-pointer">
            <Plus size={16} />
            Add Goal
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-c1">
        <DialogHeader>
          <DialogTitle className="text-c3">
            {isEdit ? "Edit Goal" : "Add Goal"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-2">
          <div className="flex gap-3">
            <div className="flex flex-col gap-1.5 w-20">
              <label className="text-sm font-medium text-c3">Icon</label>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="🎯"
                className="w-full px-3 py-2 text-sm border border-c4 rounded-lg outline-none focus:ring-2 focus:ring-c3 focus:border-transparent transition text-center text-lg"
                maxLength={2}
              />
            </div>
            <div className="flex-1">
              <FormInput
                label="Goal Name"
                placeholder="e.g. Beli Motor"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <FormInput
            label="Target Amount"
            type="number"
            placeholder="30.000.000"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            formatNumber
          />

          <DatePicker 
            label="Deadline"
            value={deadline}
            onChange={(val) => setDeadline(val)}
          />

          {isEdit && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-c3">Status</label>
              <select
                value={status ?? "ongoing"}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-c4 rounded-lg outline-none focus:ring-2 focus:ring-c3 focus:border-transparent transition bg-white text-c3"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          )}

          {!isEdit && (
            <p className="text-xs text-c2 bg-white rounded-lg border border-c4 px-4 py-3">
              💡 After creating the goal, add your first snapshot to set the initial amount.
            </p>
          )}

          {error && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex gap-2 justify-end mt-2">
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              className="cursor-pointer"
              onClick={handleSave}
              disabled={loading || !name || !targetAmount || !deadline}
            >
              {loading ? "Saving..." : isEdit ? "Save Changes" : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}