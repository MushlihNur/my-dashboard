"use client"

import { Document, DocumentWithSignedUrl } from "@/lib/supabase/types-helper"
import { cn } from "@/lib/utils"
import { addDays, format, isPast, isWithinInterval, parseISO } from "date-fns"
import { AlertTriangle, Clock, FileText, Trash2 } from "lucide-react"
import Link from "next/link"

interface DocumentCardProps {
  document: DocumentWithSignedUrl
  onDelete: () => void
}

export default function DocumentCard({ document, onDelete }: DocumentCardProps) {
  const isExpired = document.expired_at ? isPast(parseISO(document.expired_at)) : false
  const expireSoon = document.expired_at && !isExpired
    ? isWithinInterval(parseISO(document.expired_at), {
        start: new Date(),
        end: addDays(new Date(), 30),
      })
    : false

  return (
    <div className={cn(
      "bg-white rounded-xl border transition relative group hover:shadow-sm",
      isExpired   ? "border-red-200"    : 
      expireSoon  ? "border-yellow-200" : 
      "border-c4 hover:border-c2"
    )}>
      <button
        onClick={(e) => { e.preventDefault(); onDelete() }}
        className="absolute right-3 top-3 text-slate-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100 z-10 p-1.5 rounded-lg hover:bg-red-50 cursor-pointer"
      >
        <Trash2 size={14} />
      </button>

      <Link href={`/documents/${document.id}`} className="block p-5">
        <div className="flex flex-col gap-3">
          <div className="w-full h-24 rounded-lg overflow-hidden bg-slate-50 border border-c4 flex items-center justify-center">
            {document.signed_url && document.signed_url.match(/\.(jpg|jpeg|png|webp)/i) ? (
              <img
                src={document.signed_url}
                alt={document.name}
                className="w-full h-full object-cover"
              />
            ) : document.file_path ? (
              <FileText size={32} className="text-slate-300" />
            ) : (
              <FileText size={32} className="text-slate-200" />
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-semibold text-c3 truncate">{document.name}</p>
            <span className="text-xs text-c1 bg-c2 px-2 py-0.5 rounded-full w-fit">
              {document.type}
            </span>

            {document.expired_at && (
              <div className={cn(
                "flex items-center gap-1 text-xs",
                isExpired ? "text-red-500" :
                expireSoon ? "text-yellow-600" :
                "text-slate-400"
              )}>
                {isExpired ? <AlertTriangle size={11} /> :
                 expireSoon ? <Clock size={11} /> :
                 null}
                {isExpired
                  ? `Expired ${format(parseISO(document.expired_at), "dd MMM yyyy")}`
                  : `Expires ${format(parseISO(document.expired_at), "dd MMM yyyy")}`
                }
              </div>
            )}        
          </div>
        </div>
      </Link>
    </div>
  )
}