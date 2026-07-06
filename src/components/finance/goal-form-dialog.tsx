"use client"

import { Goal } from "@/lib/mock/goals";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useState } from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import FormInput from "../ui/form-input";
import DatePicker from "../ui/date-picker";

interface GoalFormDialogProps {
  goal?: Goal
}

const STATUS_OPTIONS = [
  { value: "ongoing", label: "Ongoing"   },
  { value: "achieved", label: "Achieved"  },
  { value: "cancelled", label: "Cancelled" },
]

export default function GoalFormDialog({ goal }: GoalFormDialogProps) {
  const isEdit = !!goal

  const [open, setOpen] = useState(false)
  const [name, setName] = useState(goal?.name ?? "")
  const [icon, setIcon] = useState(goal?.icon ?? "")
  const [targetAmount, setTargetAmount] = useState(goal?.target_amount ? String(goal.target_amount) : "")
  const [deadline, setDeadline] = useState(goal?.deadline ?? "")
  const [status, setStatus] = useState<Goal["status"]>(goal?.status ?? "ongoing")

  function handleClose() {
    setOpen(false)
    setName(goal?.name ?? "")
    setIcon(goal?.icon ?? "")
    setTargetAmount(goal?.target_amount ? String(goal.target_amount) : "")
    setDeadline(goal?.deadline ?? "")
    setStatus(goal?.status ?? "ongoing")
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
                value={status}
                onChange={(e) => setStatus(e.target.value as Goal["status"])}
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

          <div className="flex gap-2 justify-end mt-2">
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              className="cursor-pointer"
              disabled={!name || !targetAmount || !deadline}
            >
              {isEdit ? "Save Changes" : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}