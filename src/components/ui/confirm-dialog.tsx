"use client"

import { Button } from "./button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog"

interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
  loading,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) onCancel() }}>
      <DialogContent className="sm:max-w-sm bg-c1">
        <DialogHeader>
          <DialogTitle className="text-c3">{title}</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-c2 mt-1">{description}</p>

        <div className="flex gap-2 justify-end mt-4">
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            className="cursor-pointer"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}