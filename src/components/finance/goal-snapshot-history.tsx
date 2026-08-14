"use client"

import { formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight, Minus, Trash2, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";
import ConfirmDialog from "../ui/confirm-dialog";
import SnapshotFormDialog from "./snapshot-form-dialog";
import { GoalSnapshot } from "@/lib/supabase/types-helper";
import { notify } from "@/lib/toast";

interface GoalSnapshotHistoryProps {
  snapshots: GoalSnapshot[]
  goalName: string
  currentAmount: number
  onDeleteSnapshot: (id: string) => Promise<void>
  onSuccess: () => void
}

const PER_PAGE = 5

export default function GoalSnapshotHistory({ 
  snapshots, 
  goalName, 
  currentAmount, 
  onDeleteSnapshot, 
  onSuccess,
}: GoalSnapshotHistoryProps) {
  const [page, setPage] = useState(1)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const sorted = [...snapshots].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const totalPages = Math.ceil(sorted.length / PER_PAGE)
  const paginated  = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  function getChange(index: number): number | null {
    const globalIndex = (page - 1) * PER_PAGE + index
    const current  = sorted[globalIndex]
    const previous = sorted[globalIndex + 1]
    if (!previous) return null
    return current.amount - previous.amount
  }

  async function handleDelete() {
    if (!deletingId) return
    setDeleteLoading(true)

    try {
      await onDeleteSnapshot(deletingId)
      setDeletingId(null)
      notify.success("Snapshot deleted")

      const newTotal = sorted.length - 1
      const newMaxPage = Math.ceil(newTotal / PER_PAGE)
      if (page > newMaxPage) setPage(Math.max(1, newMaxPage))
    } catch {
      notify.error("Failed to delete snapshot")
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-c4 overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-c4 flex items-center justify-between">
          <h3 className="text-sm font-medium text-c3">Snapshot History</h3>
          <span className="text-xs text-c2">{snapshots.length} records</span>
        </div>

        {sorted.length === 0 ? (
          <div className="text-center py-10 text-sm text-c2">No history yet.</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-c4 bg-slate-50 sticky top-0">
                    <th className="text-left px-4 py-3 text-c2 font-medium text-xs">Date</th>
                    <th className="text-left px-4 py-3 text-c2 font-medium text-xs">Note</th>
                    <th className="text-right px-4 py-3 text-c2 font-medium text-xs">Amount</th>
                    <th className="text-right px-4 py-3 text-c2 font-medium text-xs">Change</th>
                    <th className="text-right px-4 py-3 text-c2 font-medium text-xs"></th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((snapshot, index) => {
                    const change = getChange(index)

                    return (
                      <tr key={snapshot.id} className="border-b border-c4/50 last:border-0 hover:bg-slate-50 transition group">
                        <td className="px-4 py-3 text-xs text-c3 whitespace-nowrap">
                          {format(parseISO(snapshot.date), "dd MMM yyyy")}
                        </td>
                        <td className="px-4 py-3 text-xs text-c2">
                          {snapshot.note ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-xs text-right font-medium text-c3 whitespace-nowrap">
                          {formatRupiah(snapshot.amount)}
                        </td>
                        <td className="px-4 py-3 text-xs text-right whitespace-nowrap">
                          {change === null ? (
                            <span className="text-slate-300">—</span>
                          ) : change > 0 ? (
                            <span className="text-green-600 flex items-center justify-end gap-1">
                              <TrendingUp size={12} />
                              +{formatRupiah(change)}
                            </span>
                          ) : change < 0 ? (
                            <span className="text-red-500 flex items-center justify-end gap-1">
                              <TrendingDown size={12} />
                              {formatRupiah(change)}
                            </span>
                          ) : (
                            <span className="text-slate-400 flex items-center justify-end gap-1">
                              <Minus size={12} />
                              {formatRupiah(0)}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <SnapshotFormDialog 
                              snapshot={snapshot}
                              goalName={goalName}
                              currentAmount={currentAmount}
                              onSuccess={onSuccess}
                            />
                            <button
                              onClick={() => setDeletingId(snapshot.id)}
                              className="p-1 rounded text-slate-300 hover:text-red-500 hover:bg-red-50 transition cursor-pointer opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="px-4 py-3 border-t border-c4 flex items-center justify-between">
                <p className="text-xs text-c2">
                  {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, sorted.length)} of {sorted.length}
                </p>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className="p-1.5 rounded-lg border border-c4 text-c2 hover:border-c3 hover:text-c3 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    <ChevronLeft size={14} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={cn(
                        "w-7 h-7 rounded-lg text-xs font-medium transition cursor-pointer",
                        p === page
                          ? "bg-c3 text-white"
                          : "border border-c4 text-c2 hover:border-c3 hover:text-c3"
                      )}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages}
                    className="p-1.5 rounded-lg border border-c4 text-c2 hover:border-c3 hover:text-c3 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmDialog 
        open={!!deletingId}
        title="Delete Snapshot"
        description="Are you sure you want to delete this snapshot? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
        loading={deleteLoading}
      />
    </>
  )
}