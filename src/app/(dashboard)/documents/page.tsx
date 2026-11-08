"use client"

import DocumentCard from "@/components/documents/document-card"
import DocumentFormDialog from "@/components/documents/document-form-dialog"
import ConfirmDialog from "@/components/ui/confirm-dialog"
import { deleteDocument, getDocuments } from "@/lib/api/documents"
import { Document, DocumentWithSignedUrl } from "@/lib/supabase/types-helper"
import { notify } from "@/lib/toast"
import { FolderOpen } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentWithSignedUrl[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingDoc, setDeletingDoc] = useState<Document | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchDocuments = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getDocuments()
      setDocuments(data)
      console.log({data})
    } catch {
      console.error("Failed to fetch goals")
      notify.error("Failed to fetch goals")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

  async function handleDelete() {
    if (!deletingDoc) return
    setDeleteLoading(true)
    try {
      await deleteDocument(deletingDoc.id)
      notify.success("Document deleted")
      setDeletingDoc(null)
      fetchDocuments()
    } catch {
      notify.error("Failed to delete document")
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-c3">Documents</h1>
          <p className="text-sm text-c2 mt-1">Store and manage your important documents</p>
        </div>
        <DocumentFormDialog onSuccess={fetchDocuments} />
      </div>

      {loading ? (
        <div className="text-center py-12 text-sm text-c2">Loading...</div>
      ) : documents.length === 0 ? (
        <div className="text-center py-16 flex flex-col items-center gap-3">
          <FolderOpen size={40} className="text-slate-300" />
          <p className="text-sm font-medium text-c3">No documents yet</p>
          <p className="text-xs text-c2">Add your first document to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {documents.map((doc) => (
            <DocumentCard 
              key={doc.id}
              document={doc}
              onDelete={() => setDeletingDoc(doc)}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deletingDoc}
        title="Delete Document"
        description={`Are you sure you want to delete "${deletingDoc?.name}"? The file will also be permanently deleted.`}
        onConfirm={handleDelete}
        onCancel={() => setDeletingDoc(null)}
        loading={deleteLoading}
      />
    </div>
  )
}