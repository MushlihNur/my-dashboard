"use client"

import FamilyMemberFormDialog from "@/components/family/family-member-form-dialog"
import { Button } from "@/components/ui/button"
import ConfirmDialog from "@/components/ui/confirm-dialog"
import { deleteFamilyMember, getFamilyMemberById } from "@/lib/api/family"
import { FamilyMember } from "@/lib/supabase/types-helper"
import { notify } from "@/lib/toast"
import { format, parseISO } from "date-fns"
import { ArrowLeft, Copy } from "lucide-react"
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

function CopyButton({ value }: { value: string }) {
  function handleCopy() {
    navigator.clipboard.writeText(value)
    notify.success("Copied to clipboard")
  }

  return (
    <button
      onClick={handleCopy}
      className="p-1 rounded text-slate-300 hover:text-c2 hover:bg-c1 transition cursor-pointer"
    >
      <Copy size={12} />
    </button>
  )
}

export default function FamilyDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [member, setMember] = useState<FamilyMember | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound2, setNotFound2] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchMember = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getFamilyMemberById(id)
      setMember(data)
    } catch {
      setNotFound2(true)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchMember()
  }, [fetchMember])

  async function handleDelete() {
    if (!member) return
    setDeleteLoading(true)
    try {
      await deleteFamilyMember(member.id)
      notify.success("Family member deleted")
      router.push("/family")
    } catch {
      notify.error("Failed to delete family member")
    } finally {
      setDeleteLoading(false)
    }
  }

  if (loading) return <div className="text-center py-12 text-sm text-c2">Loading...</div>
  if (notFound2 || !member) return notFound()

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex flex-col gap-3">
        <Link href="/family" className="flex items-center gap-1.5 text-sm text-c2 hover:text-c3 transition w-fit">
          <ArrowLeft size={15} />
          Back to Family
        </Link>

        <div className="flex items-start justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-c2 flex items-center justify-center shrink-0">
              <span className="text-white font-semibold">
                {member?.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-c3">{member?.name}</h2>
              <p className="text-sm text-c2">{member?.relation}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer text-xs text-red-500 hover:text-red-600 hover:border-red-300"
              onClick={() => setShowDelete(true)}
            >
              Delete
            </Button>
            <FamilyMemberFormDialog
              member={member}
              open={isEditing}
              onClose={() => setIsEditing(false)}
              onSuccess={() => {
                setIsEditing(false)
                fetchMember()
              }}
            />
            <Button size="sm" className="cursor-pointer text-xs" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-c4 overflow-hidden">
        <div className="px-6 py-4 border-b border-c4">
          <h3 className="text-sm font-semibold text-c3">Personal Information</h3>
        </div>
        <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-xs text-c2 font-medium uppercase tracking-wide">NIK</p>
            <div className="flex items-center gap-2">
              <p className="text-sm text-c3">{member?.nik || <span className="text-slate-400">—</span>}</p>
              {member?.nik && <CopyButton value={member?.nik} />}
            </div>
          </div>
          <InfoRow label="Birth Place" value={member?.birth_place} />
          <InfoRow label="Birth Date" value={member?.birth_date ? format(parseISO(member?.birth_date), "dd MMM yyyy") : null} />
          <InfoRow label="Gender" value={member?.gender} />
          <InfoRow label="Blood Type" value={member?.blood_type} />
          <div className="flex flex-col gap-1">
            <p className="text-xs text-c2 font-medium uppercase tracking-wide">Phone</p>
            <div className="flex items-center gap-2">
              <p className="text-sm text-c3">{member.phone || <span className="text-slate-400">—</span>}</p>
              {member.phone && <CopyButton value={member.phone} />}
            </div>
          </div>
          <div className="md:col-span-2">
            <InfoRow label="Address" value={member.address} />
          </div>
          {member.notes && (
            <div className="md:col-span-2">
              <InfoRow label="Notes" value={member.notes} />
            </div>
          )}
        </div>
      </div>

      {["Education", "Health", "Medical History", "Vaccinations"].map((section) => (
        <div key={section} className="bg-white rounded-xl border border-c4 overflow-hidden opacity-60">
          <div className="px-6 py-4 border-b border-c4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-c3">{section}</h3>
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Coming Soon</span>
          </div>
          <div className="px-6 py-6 text-center text-xs text-slate-400">
            This section is under development.
          </div>
        </div>
      ))}

      <ConfirmDialog
        open={showDelete}
        title="Delete Family Member"
        description={`Are you sure you want to delete "${member.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
        loading={deleteLoading}
      />
    </div>
  ) 
}