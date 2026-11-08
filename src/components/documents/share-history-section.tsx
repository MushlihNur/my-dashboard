"use client"

import { getDocumentShares } from "@/lib/api/documents"
import { DocumentShare } from "@/lib/supabase/types-helper"
import { notify } from "@/lib/toast"
import { cn } from "@/lib/utils"
import { format, isPast, parseISO } from "date-fns"
import { useCallback, useEffect, useState } from "react"
import ShareDocumentDialog from "./share-document-dialog"
import { Button } from "../ui/button"
import { Check, Copy, Pencil } from "lucide-react"

function CopyLinkButton({ token }: { token: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    const link = `${window.location.origin}/share/${token}`
    await navigator.clipboard.writeText(link)
    setCopied(true)
    notify.success("Link copied")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-lg text-c2 hover:bg-c1 hover:text-c3 transition cursor-pointer shrink-0"
    >
      {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
    </button>
  )
}

interface ShareHistorySectionProps {
  documentId: string
  documentName: string
  refresh: number
}

export default function ShareHistorySection({ documentId, documentName, refresh }: ShareHistorySectionProps) {
  const [shares, setShares] = useState<DocumentShare[]>([])
  const [loading, setLoading] = useState(true)
  
  const [editingShare, setEditingShare] = useState<DocumentShare | null>(null)

  const fetchShares = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getDocumentShares(documentId)
      setShares(data)
    } catch {
      notify.error("Failed to load share history")
    } finally {
      setLoading(false)
    }
  }, [documentId])

  useEffect(() => {
    fetchShares()
  }, [fetchShares, refresh])

  return (
    <div className="bg-white rounded-xl border border-c4 overflow-hidden">
      <div className="px-5 py-4 border-b border-c4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-c3">Share History</h3>
        <span className="text-xs text-c2">{shares.length} links</span>
      </div>

      {loading ? (
        <div className="text-center py-8 text-sm text-c2">Loading...</div>
      ) : shares.length === 0 ? (
        <div className="text-center py-8 text-xs text-slate-400">
          No share links created yet.
        </div>
      ) : (
        <div className="divide-y divide-c4">
          {shares.map((share) => {
            const isExpired = isPast(parseISO(share.expired_at))
            const link = `${typeof window !== "undefined" ? window.location.origin : ""}/share/${share.token}`

            return (
              <div key={share.id} className="px-5 py-4 flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-c3">{share.recipient}</p>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full font-medium",
                      isExpired
                        ? "bg-slate-100 text-slate-500"
                        : "bg-green-100 text-green-700"
                    )}>
                      {isExpired ? "Expired" : "Active"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button 
                      size="sm" 
                      className="h-8 w-8 p-0" 
                      onClick={() => setEditingShare(share)}
                    >
                      <Pencil size={12} />
                    </Button>
                  </div>
                </div>

                <p className="text-xs text-c2">{share.purpose}</p>

                <div className="flex items-center gap-2 bg-c1 rounded-lg px-3 py-1.5">
                  <p className="text-xs text-slate-400 truncate flex-1">{link}</p>
                  {!isExpired && <CopyLinkButton token={share.token} />}
                </div>

                <p className="text-xs text-slate-400">
                  {isExpired ? "Expired" : "Expires"}: {format(parseISO(share.expired_at), "dd MMM yyyy, HH:mm")}
                </p>
              </div>
            )
          })}
        </div>
      )}

      {editingShare && (
        <ShareDocumentDialog 
          share={editingShare || undefined}
          open={!!editingShare}
          documentId={documentId}
          documentName={documentName}
          onClose={() => setEditingShare(null)}
          onSuccess={() => {
            setEditingShare(null)
            fetchShares()
          }}
        />
      )}
    </div>
  )
}