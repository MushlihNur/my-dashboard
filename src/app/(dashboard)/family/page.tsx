"use client"

import FamilyMemberCard from "@/components/family/family-member-card"
import FamilyMemberFormDialog from "@/components/family/family-member-form-dialog"
import ConfirmDialog from "@/components/ui/confirm-dialog"
import { deleteFamilyMember, getFamilyMembers } from "@/lib/api/family"
import { FamilyMember } from "@/lib/supabase/types-helper"
import { notify } from "@/lib/toast"
import { Users } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

export default function FamilyPage() {
  const [members, setMembers] = useState<FamilyMember[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingMember, setDeletingMember] = useState<FamilyMember | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)


  const fetchMembers = useCallback(async () => {
    setLoading(true)

    try {
      const data = await getFamilyMembers()
      setMembers(data)
    } catch {
      notify.error("Failed to load family members")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

  async function handleDelete() {
    if (!deletingMember) return
    setDeleteLoading(true)

    try {
      await deleteFamilyMember(deletingMember.id)
      notify.success("Family member deleted")
      setDeletingMember(null)
      fetchMembers()
    } catch {
      notify.error("Failed to delete family member")
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-c3">Family</h1>
          <p className="text-sm text-c2 mt-1">Manage your family members</p>
        </div>

        <FamilyMemberFormDialog onSuccess={fetchMembers} />
      </div>

      {loading ? (
        <div className="text-center py-12 text-sm text-c2">Loading...</div>
      ) : members.length === 0 ? (
        <div className="text-center py-16 flex flex-col items-center gap-3">
          <Users size={40} className="text-slate-300" />
          <p className="text-sm font-medium text-c3">No family members yet</p>
          <p className="text-xs text-c2">Add your first family member to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {members.map((member) => (
            <FamilyMemberCard
              key={member.id}
              member={member}
              onDelete={() => setDeletingMember(member)}
            />
          ))}
        </div>
      )}

      <ConfirmDialog 
        open={!!deletingMember}
        title="Delete Family Member"
        description={`Are you sure you want to delete "${deletingMember?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeletingMember(null)}
        loading={deleteLoading}
      />
    </div>
  )
}