"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { Check, Copy, Share2 } from "lucide-react"
import FormInput from "../ui/form-input"
import DatePicker from "../ui/date-picker"
import { notify } from "@/lib/toast"
import { endOfDay, format } from "date-fns"
import { createDocumentShare, updateDocumentShare } from "@/lib/api/documents"
import { DocumentShare } from "@/lib/supabase/types-helper"

interface ShareDocumentDialogProps {
  share?: DocumentShare
  open?: boolean
  documentId: string
  documentName: string
  onClose?: () => void
  onSuccess?: () => void
}

export default function ShareDocumentDialog({
  share,
  open: controlledOpenShareDoc,
  documentId,
  documentName,
  onClose,
  onSuccess,
}: ShareDocumentDialogProps) {
  const isEditShare = !!share

  const [openShareDocDialog, setOpenShareDocDialog] = useState(false)
  const openShareDoc = isEditShare ? (controlledOpenShareDoc ?? false) : openShareDocDialog

  const [loading, setLoading] = useState(false)
  const [generatedLink, setGeneratedLink] = useState<string | null>(null)
  const [recipient, setRecipient] = useState("")
  const [purpose, setPurpose] = useState("")
  const [expiry, setExpiry] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (openShareDoc) {
      if (share) {
        setRecipient(share.recipient ?? "")
        setPurpose(share.purpose ?? "")
        setExpiry(share.expired_at ?? "")
        
        const link = `${window.location.origin}/share/${share.token}`
        setGeneratedLink(link)
      } else {
        setRecipient("")
        setPurpose("")
        setExpiry("")
        setGeneratedLink(null)
        setCopied(false)
      }
    }
  }, [openShareDoc, share])

  function handleClose() {
    if (isEditShare) onClose?.()
    else setOpenShareDocDialog(false)
  }

  async function handleGenerate() {
    try {
      const finalExpiry = endOfDay(new Date(expiry)).toISOString()

      const newShare = await createDocumentShare({
        document_id: documentId,
        recipient,
        purpose,
        expired_at: finalExpiry
      })

      const link = `${window.location.origin}/share/${newShare.token}`
      setGeneratedLink(link)

      onSuccess?.()
    } catch (err: unknown) {
      const error = err as Error;
      notify.error(
        error.message.includes("Demo mode") 
          ? "Demo mode: documents are read-only"
          : "Failed to generate share link"
      )
    }
  }

  async function handleSave() {
    if (!share) return
    try {
      const finalExpiry = endOfDay(new Date(expiry)).toISOString()

      await updateDocumentShare(share.id, finalExpiry)
      notify.success("Expiry updated")

      onSuccess?.()
    } catch (err: unknown) {
      const error = err as Error;
      notify.error(
        error.message.includes("Demo mode") 
          ? "Demo mode: documents are read-only"
          : "Failed to update share link"
      )
    }
  }

  async function handleSubmit(e?: React.FormEvent<HTMLFormElement>) {
    e?.preventDefault()
    if (loading || !recipient || !purpose || !expiry) return

    setLoading(true)
    if (isEditShare) {
      await handleSave()
    } else {
      await handleGenerate()
    }
    setLoading(false)
  }

  async function handleCopy() {
    if (!generatedLink) return
    await navigator.clipboard.writeText(generatedLink)
    setCopied(true)
    notify.success("Link copied to clipboard")
    setTimeout(() => setCopied(false), 2000)
  }

  const dialogContent = (
    <DialogContent className="sm:max-w-md bg-c1 max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-c3">
          {isEditShare ? "Edit Share Document" : "Share Document"}
        </DialogTitle>
      </DialogHeader>

      <div className="flex flex-col gap-4 mt-2">
        {/* Document name info */}
        <div className="bg-white rounded-lg border border-c4 px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-c2">Document</span>
          <span className="text-sm font-medium text-c3 truncate max-w-48">{documentName}</span>
        </div>

        {!generatedLink || isEditShare ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FormInput 
              label="Recipient Name"
              placeholder="e.g. John Doe"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              readOnly={isEditShare}
            />

            <FormInput 
              label="Purpose of Sharing"
              placeholder="e.g. Audit, Population Census"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              readOnly={isEditShare}
            />

            <DatePicker 
              label="Link Expiry"
              value={expiry}
              onChange={(val) => setExpiry(val)}
            />

            <p className="text-xs text-slate-400 bg-white rounded-lg border border-c4 px-4 py-3">
              ⚠️ The recipient will see this document with a watermark containing their name and the purpose. This link will expire automatically.
            </p>

            {/* Tampilkan link di mode edit agar user bisa copy ulang jika butuh */}
            {isEditShare && generatedLink && (
              <div className="flex items-center gap-2 bg-white border border-c4 rounded-lg px-3 py-2">
                <span className="text-xs text-c2 flex-1 w-0 truncate">{generatedLink}</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="shrink-0 text-c2 hover:text-c3 transition cursor-pointer"
                >
                  {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                </button>
              </div>
            )}

            <div className="flex gap-2 justify-end mt-2">
              <Button type="button" variant="outline" className="cursor-pointer" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="cursor-pointer"
                disabled={loading || !recipient || !purpose || !expiry}
              >
                {loading 
                  ? (isEditShare ? "Saving..." : "Generating...") 
                  : (isEditShare ? "Save Changes" : "Generate Link")}
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col gap-4 mt-2">
            <div className="flex flex-col bg-green-50 border border-green-200 rounded-lg px-4 py-3">
              <p className="text-xs font-medium text-green-700 mb-1">Link generated successfully!</p>
              <p className="text-xs text-green-600">
                Expires: {expiry ? format(endOfDay(new Date(expiry)), "dd MMM yyyy, HH:mm") : "-"}
              </p>
            </div>

            <div className="flex items-center gap-2 bg-white border border-c4 rounded-lg px-3 py-2">
              <p className="text-xs text-c2 flex-1 w-0 truncate">{generatedLink}</p>
              <button
                type="button"
                onClick={handleCopy}
                className="shrink-0 text-c2 hover:text-c3 transition cursor-pointer"
              >
                {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
              </button>
            </div>

            <div className="flex gap-2 justify-end mt-2">
              <Button 
                type="button"
                variant="outline" 
                className="cursor-pointer" 
                onClick={handleClose}
              >
                Close
              </Button>
              <Button 
                type="button"
                className="cursor-pointer" 
                onClick={handleCopy}
              >
                {copied ? "Copied!" : "Copy Link"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </DialogContent>
  )

  if (!isEditShare) {
    return (
      <Dialog open={openShareDocDialog} onOpenChange={setOpenShareDocDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="cursor-pointer text-xs gap-1.5">
            <Share2 size={13} />
            Share
          </Button>
        </DialogTrigger>
        {dialogContent}
      </Dialog>
    )
  }

  return (
    <Dialog open={openShareDoc} onOpenChange={(val) => { if (!val) handleClose() }}>
      {dialogContent}
    </Dialog>
  )
}