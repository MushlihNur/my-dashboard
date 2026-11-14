"use client"

import DocumentFormDialog from "@/components/documents/document-form-dialog"
import ShareDocumentDialog from "@/components/documents/share-document-dialog"
import ShareHistorySection from "@/components/documents/share-history-section"
import { Button } from "@/components/ui/button"
import ConfirmDialog from "@/components/ui/confirm-dialog"
import { deleteDocument, getDocumentById } from "@/lib/api/documents"
import { IS_DEMO } from "@/lib/demo"
import { DocumentWithSignedUrl } from "@/lib/supabase/types-helper"
import { notify } from "@/lib/toast"
import { addDays, format, isPast, isWithinInterval, parseISO } from "date-fns"
import { AlertTriangle, ArrowLeft, Clock, Download, FileText } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound, useParams, useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs text-c2 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-sm text-c3">{value || <span className="text-slate-400">—</span>}</p>
    </div>
  )
}

export default function DocumentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [document, setDocument] = useState<DocumentWithSignedUrl | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound2, setNotFound2] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [shareRefresh, setShareRefresh] = useState(0)

  const fetchDocument = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getDocumentById(id)
      setDocument(data)
    } catch {
      setNotFound2(true)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchDocument()
  }, [fetchDocument])

  async function handleDelete() {
    if (!document) return
    setDeleteLoading(true)
    try {
      await deleteDocument(document.id)
      notify.success("Document deleted")
      router.push("/documents")
    } catch (err: unknown) {
      notify.error(
        err.message.includes("Demo mode") 
          ? "Demo mode: documents are read-only"
          : "Failed to delete document"
      )
    } finally {
      setDeleteLoading(false)
    }
  }

  if (loading) return <div className="text-center py-12 text-sm text-c2">Loading...</div>
  if (notFound2 || !document) return notFound()

  const isExpired = document.expired_at ? isPast(parseISO(document.expired_at)) : false
  const expireSoon = document.expired_at && !isExpired
    ? isWithinInterval(parseISO(document.expired_at), {
        start: new Date(),
        end: addDays(new Date(), 30),
      })
    : false

  const isImage = document.signed_url?.match(/\.(jpg|jpeg|png|webp)/i)
  const isPdf = document.file_path?.match(/\.pdf$/i)
    
  return (
    <div className="flex flex-col gap-6">
      {/* Back + header */}
      <div className="flex flex-col gap-3">
        <Link href="/documents" className="flex items-center gap-1.5 text-sm text-c2 hover:text-c3 transition w-fit">
          <ArrowLeft size={15} />
          Back to Documents
        </Link>

        <div className="flex items-start justify-between flex-wrap gap-3">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-xl font-semibold text-c3">{document.name}</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-c1 text-c2 px-2 py-0.5 rounded-full border border-c4">
                {document.type}
              </span>
              {isExpired && (
                <span className="text-xs bg-red-50 text-red-500 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <AlertTriangle size={10} />
                  Expired
                </span>
              )}
              {expireSoon && !isExpired && (
                <span className="text-xs bg-yellow-50 text-yellow-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Clock size={10} />
                  Expiring soon
                </span>
              )}
            </div>
          </div>

          {!IS_DEMO && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer text-xs text-red-500 hover:text-red-600 hover:border-red-300"
                onClick={() => setShowDelete(true)}
              >
                Delete
              </Button>
              <DocumentFormDialog
                document={document}
                open={isEditing}
                onClose={() => setIsEditing(false)}
                onSuccess={() => {
                  setIsEditing(false)
                  fetchDocument()
                }}
              />
              <Button
                size="sm"
                className="cursor-pointer text-xs"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
              <ShareDocumentDialog
                documentId={document.id}
                documentName={document.name}
                onSuccess={() => setShareRefresh(prev => prev + 1)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Container Grid: Mobile = 1 kolom (atas-bawah), Desktop (lg) = 2 kolom (kanan-kiri) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Document preview */}
        <div className="bg-white rounded-xl border border-c4 overflow-hidden w-full">
          <div className="px-5 py-4 border-b border-c4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-c3">Preview</h3>
            {document.signed_url && (
              <a
                href={document.signed_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-c2 hover:text-c3 transition"
              >
                <Download size={13} />
                Download
              </a>
            )}
          </div>

          <div className="p-5">
            {isImage && document.signed_url ? (
              // Image preview (Mendukung portrait & landscape dengan max-height yang pas)
              <div className="relative flex items-center justify-center bg-slate-50 rounded-lg overflow-hidden min-h-[300px] max-h-[450px]">
                <Image 
                  src={document.signed_url}
                  alt={document.name}
                  fill
                  className="object-contain rounded-lg p-2"
                  unoptimized={true}
                />
              </div>
            ) : isPdf && document.signed_url ? (
              // PDF preview
              <iframe
                src={document.signed_url}
                className="w-full h-[420px] rounded-lg border border-c4"
                title={document.name}
              />
            ) : (
              // No file / unsupported
              <div className="flex flex-col items-center justify-center py-16 gap-3 bg-slate-50 rounded-lg">
                <FileText size={48} className="text-slate-300" />
                <p className="text-sm text-slate-400">
                  {document.file_path ? "Preview not available" : "No file uploaded"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Document info */}
        <div className="bg-white rounded-xl border border-c4 overflow-hidden w-full">
          <div className="px-5 py-4 border-b border-c4">
            <h3 className="text-sm font-semibold text-c3">Information</h3>
          </div>
          <div className="px-5 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRow label="Document Type" value={document.type} />
            <InfoRow
              label="Expiry Date"
              value={document.expired_at
                ? format(parseISO(document.expired_at), "dd MMM yyyy")
                : null
              }
            />
            <InfoRow
              label="Added On"
              value={format(parseISO(document.created_at ?? ""), "dd MMM yyyy")}
            />
            <InfoRow
              label="Last Updated"
              value={format(parseISO(document.updated_at ?? ""), "dd MMM yyyy")}
            />
            <div className="md:col-span-2">
              <InfoRow label="Notes" value={document.notes} />
            </div>
          </div>
        </div>
      </div>

      <ShareHistorySection 
        documentId={document.id}
        documentName={document.name}
        refresh={shareRefresh}
      />

      <ConfirmDialog
        open={showDelete}
        title="Delete Document"
        description={`Are you sure you want to delete "${document.name}"? The file will also be permanently deleted.`}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
        loading={deleteLoading}
      />
    </div>
  )
}