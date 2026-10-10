"use client"

import { FamilyMember } from "@/lib/supabase/types-helper";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { Phone, Trash2 } from "lucide-react";
import Link from "next/link";

interface FamilyMemberCardProps {
  member: FamilyMember
  onDelete: () => void
}

const relationColors: Record<string, string> = {
  "Kepala Keluarga":  "bg-blue-100 text-blue-700",
  "Ayah":  "bg-blue-100 text-blue-700",
  "Ibu": "bg-pink-100 text-pink-700",
  "Kakak": "bg-purple-100 text-purple-700",
  "Adik": "bg-green-100 text-green-700",
  "Istri": "bg-rose-100 text-rose-700",
  "Suami": "bg-indigo-100 text-indigo-700",
  "Anak": "bg-yellow-100 text-yellow-700",
}

function getRelationColor(relation: string): string {
  return relationColors[relation] ?? "bg-slate-100 text-slate-700"
}

export default function FamilyMemberCard({ member, onDelete }: FamilyMemberCardProps) {
  return (
    <div className="bg-white rounded-xl border border-c4 transition relative group hover:shadow-sm hover:border-c2">
      <button
        onClick={(e) => {
          e.preventDefault()
          onDelete()
        }}
        className="absolute right-3 top-3 text-slate-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100 z-10 p-1.5 rounded-lg hover:bg-red-50 cursor-pointer"
      >
        <Trash2 size={14} />
      </button>

      <Link href={`/family/${member.id}`} className="block p-5">
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3 pr-6">
            <div className="w-10 h-10 rounded-full bg-c2 flex items-center justify-center shrink-0">
              <span className="text-white text-sm font-semibold">
                {member.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-c3">{member.name}</p>
               <span className={cn(
                "text-xs font-medium px-2 py-0.5 rounded-full",
                getRelationColor(member.relation)
              )}>
                {member.relation}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 text-xs text-c2">
            {member.birth_date && (
              <p>🎂 {format(parseISO(member.birth_date), "dd MMM yyyy")}</p>
            )}
            {member.phone && (
              <p className="flex items-center gap-1">
                <Phone size={11} />
                {member.phone}
              </p>
            )}
            {member.blood_type && (
              <p>🩸 {member.blood_type}</p>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}