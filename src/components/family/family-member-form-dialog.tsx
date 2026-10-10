"use client"

import { FamilyMember } from "@/lib/supabase/types-helper"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import FormInput from "../ui/form-input"
import { Button } from "../ui/button"
import DatePicker from "../ui/date-picker"
import { Plus } from "lucide-react"
import { addFamilyMember, updateFamilyMember } from "@/lib/api/family"
import { notify } from "@/lib/toast"

const RELATION_OPTIONS = [
  "Ayah", "Ibu", "Kakak", "Adik",
  "Istri", "Suami", "Anak",
  "Kakek", "Nenek", "Paman", "Bibi",
  "Other",
]

const BLOOD_TYPE_OPTIONS = ["A", "B", "AB", "O"]

interface FamilyMemberFormDialogProps {
  member?: FamilyMember
  open?: boolean
  onClose?: () => void
  onSuccess: () => void
}

export default function FamilyMemberFormDialog({
  member,
  open: controlledOpen,
  onClose,
  onSuccess,
}: FamilyMemberFormDialogProps) {
  const isEdit = !!member

  const [internalOpen, setInternalOpen] = useState(false)
  const open = isEdit ? (controlledOpen ?? false) : internalOpen

  const [name, setName] = useState("")
  const [relation, setRelation] = useState("")
  const [otherRelation, setOtherRelation] = useState("")
  const [nik, setNik] = useState("")
  const [birthPlace, setBirthPlace] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [gender, setGender] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [bloodType, setBloodType] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      if (member) {
        const isOther = member?.relation && !RELATION_OPTIONS.slice(0, -1).includes(member?.relation)
        setName(member?.name ?? "")
        setRelation(isOther ? "Other" : (member?.relation ?? ""))
        setOtherRelation(isOther ? (member?.relation ?? "") : "")
        setNik(member?.nik ?? "")
        setBirthPlace(member?.birth_place ?? "")
        setBirthDate(member?.birth_date ?? "")
        setGender(member?.gender ?? "")
        setPhone(member?.phone ?? "")
        setAddress(member?.address ?? "")
        setBloodType(member?.blood_type ?? "")
        setNotes(member?.notes ?? "")
      } else {
        setName("")
        setRelation("")
        setOtherRelation("")
        setNik("")
        setBirthPlace("")
        setBirthDate("")
        setGender("")
        setPhone("")
        setAddress("")
        setBloodType("")
        setNotes("")
      }
    }
  }, [open, member])

  function handleClose() {
    if (isEdit) onClose?.()
    else setInternalOpen(false)
  }

  async function handleSave() {
    if (!name || !relation) return
    setLoading(true)

    const finalRelation = relation === "Other" ? otherRelation : relation

    const payload = {
      name,
      relation: finalRelation,
      nik: nik || undefined,
      birth_place: birthPlace || undefined,
      birth_date: birthDate || undefined,
      gender: gender || undefined,
      phone: phone || undefined,
      address: address || undefined,
      blood_type: bloodType || undefined,
      notes: notes || undefined,
    }

    try {
      if (isEdit && member) {
        await updateFamilyMember(member.id, payload)
        notify.success("Family member updated")
      } else {
        await addFamilyMember(payload)
        notify.success("Family member added")
      }
      handleClose()
      onSuccess()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : ""
      if (message.includes("Demo limit reached")) {
        notify.error("Demo limit reached. Cannot add more data in demo mode.")
      } else {
        notify.error("Failed to save family member")
      }
    } finally {
      setLoading(false)
    }
  }

  const dialogContent = (
    <DialogContent className="sm:max-w-lg bg-c1 max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-c3">
          {isEdit ? "Edit Family Member" : "Add Family Member"}
        </DialogTitle>
      </DialogHeader>

      <div className="flex flex-col gap-4 mt-2">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <FormInput
              label="Full Name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Relation */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-c3">Relation</label>
            <select
              value={relation}
              onChange={(e) => setRelation(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-c4 rounded-lg outline-none focus:ring-2 focus:ring-c3 bg-white text-c3"
            >
              <option value="" hidden>Select relation</option>
              {RELATION_OPTIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Other relation free text */}
          {relation === "Other" && (
            <FormInput
              label="Specify Relation"
              placeholder="e.g. Sepupu"
              value={otherRelation}
              onChange={(e) => setOtherRelation(e.target.value)}
            />
          )}

          <FormInput
            label="NIK"
            placeholder="3271XXXXXXXXXXXX"
            value={nik}
            onChange={(e) => setNik(e.target.value)}
          />

          <FormInput
            label="Birth Place"
            placeholder="Jakarta"
            value={birthPlace}
            onChange={(e) => setBirthPlace(e.target.value)}
          />

          <DatePicker
            label="Birth Date"
            value={birthDate}
            onChange={(val) => setBirthDate(val)}
          />

          {/* Gender */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-c3">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-c4 rounded-lg outline-none focus:ring-2 focus:ring-c3 bg-white text-c3"
            >
              <option value="" hidden>Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* Blood type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-c3">Blood Type</label>
            <select
              value={bloodType}
              onChange={(e) => setBloodType(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-c4 rounded-lg outline-none focus:ring-2 focus:ring-c3 bg-white text-c3"
            >
              <option value="" hidden>Select blood type</option>
              {BLOOD_TYPE_OPTIONS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <FormInput
            label="Phone"
            placeholder="08XXXXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <div className="col-span-2">
            <FormInput
              label="Address"
              placeholder="Jl. ..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="col-span-2">
            <FormInput
              label="Notes"
              placeholder="Additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2 justify-end mt-2">
          <Button variant="outline" className="cursor-pointer" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            className="cursor-pointer"
            onClick={handleSave}
            disabled={loading || !name || !relation || (relation === "Other" && !otherRelation)}
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
            Add Member
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