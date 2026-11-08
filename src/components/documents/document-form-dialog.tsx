"use client"

import { Document, DocumentWithSignedUrl } from "@/lib/supabase/types-helper"
import React, { useEffect, useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import FormInput from "../ui/form-input"
import DatePicker from "../ui/date-picker"
import { Plus, Upload, X } from "lucide-react"
import { Button } from "../ui/button"
import { addDocument, updateDocument } from "@/lib/api/documents"
import { notify } from "@/lib/toast"

interface DocumentFormDialogProps {
  document?: DocumentWithSignedUrl
  open?: boolean
  onClose?: () => void
  onSuccess?: () => void
}

export default function DocumentFormDialog({
  document,
  open: controlledOpen,
  onClose,
  onSuccess,
}: DocumentFormDialogProps) {
  const isEdit = !!document

  const [internalOpen, setInternalOpen] = useState(false)
  const open = isEdit ? (controlledOpen ?? false) : internalOpen

  const [name, setName] = useState("")
  const [type, setType] = useState("")
  const [otherType, setOtherType] = useState("")
  const [notes, setNotes] = useState("")
  const [expiredAt, setExpiredAt] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      if (document) {
        setName(document.name ?? "")
        setType(document.type ?? "")
        setNotes(document.notes ?? "")
        setExpiredAt(document.expired_at?? "")
        setPreview(document.signed_url ?? null)
      } else {
        setName("")
        setType("")
        setNotes("")
        setExpiredAt("")
        setFile(null)
        setPreview(null)
      }
    }
  }, [open, document])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]
    if (!selected) return
    setFile(selected)

    if (selected.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(selected))
      setFileName(selected?.name)
    } else {
      setPreview(null)
      setFileName(null)
    }
  }

  function handleClose() {
    if (isEdit) onClose?.()
    else setInternalOpen(false)
    setFile(null)
    setPreview(null)
  }

  async function handleSave() {
    if (!name || !type) return
    setLoading(true)

    try {
      if (isEdit && document) {
        await updateDocument(document.id, {
          name,
          type,
          notes: notes || undefined,
          expired_at: expiredAt || undefined,
          file: file ?? undefined,
        })
      } else {
        await addDocument({
          name,
          type,
          notes: notes || undefined,
          expired_at: expiredAt || undefined,
          file,
        })
        notify.success("Document added")
      }
      handleClose()
      onSuccess()
    } catch {
      notify.error("Failed to save document")
    } finally {
      setLoading(false)
    }
  }

  const dialogContent = (
    <DialogContent className="sm:max-w-md bg-c1 max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-c3">
          {isEdit ? "Edit Document" : "Add Document"}
        </DialogTitle>
      </DialogHeader>

      <div className="flex flex-col gap-4 mt-2">
        <FormInput
          label="Document Name"
          placeholder="e.g. KTP Mushlih"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <FormInput
          label="Document Type"
          placeholder="e.g. KTP"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />

        <DatePicker
          label="Expiry Date"
          value={expiredAt}
          onChange={(val) => setExpiredAt(val)}
          placeholder="Pick expiry date (optional)"
        />

        <FormInput
          label="Notes"
          placeholder="e.g. SIM A, berlaku sampai 2028"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-c3">File</label>

          {preview && (
            <>
              <div className="relative w-full h-32 rounded-lg overflow-hidden border border-c4">
                <img src={preview} alt="preview" className="w-full h-full object-contain" />
                <button
                  onClick={() => { setFile(null); setPreview(null) }}
                  className="absolute top-2 right-2 bg-white rounded-full p-0.5 shadow cursor-pointer"
                >
                  <X size={12} />
                </button>
              </div>
              <p className="relative">{fileName}</p>
            </>
          )}

          {!preview && file && (
            <div className="flex items-center gap-2 bg-white border border-c4 rounded-lg px-3 py-2">
              <span className="text-xs text-c2 flex-1 truncate">{file.name}</span>
              <button onClick={() => setFile(null)} className="text-slate-400 hover:text-red-500 cursor-pointer">
                <X size={12} />
              </button>
            </div>
          )}

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 w-full px-3 py-2.5 text-sm border border-dashed border-c4 rounded-lg text-c2 hover:border-c3 hover:text-c3 transition cursor-pointer bg-white"
          >
            <Upload size={14} />
            {file ? "Change File" : "Upload File"}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />
          <p className="text-xs text-slate-400">JPG, PNG, WebP, or PDF. Max 10MB.</p>
        </div>

        <div className="flex gap-2 justify-end mt-2">
          <Button variant="outline" className="cursor-pointer" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            className="cursor-pointer"
            onClick={handleSave}
            disabled={loading || !name || !type}
          >
            {loading ? "Saving..." : isEdit ? "Save Changes" : "Save"}
          </Button>
        </div>
      </div>
    </DialogContent>
  )

  if (!isEdit) {
    return (
      <Dialog open={internalOpen} onOpenChange={setInternalOpen}>
        <DialogTrigger asChild>
          <Button className="gap-2 cursor-pointer">
            <Plus size={16} />
            Add Document
          </Button>
        </DialogTrigger>
        {dialogContent}
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) handleClose() }}>
      {dialogContent}
    </Dialog>
  )
}