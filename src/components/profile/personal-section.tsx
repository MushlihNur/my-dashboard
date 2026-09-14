"use client"

import { Profile } from "@/lib/supabase/types-helper"
import { useState } from "react"
import { Button } from "../ui/button"
import FormInput from "../ui/form-input"
import DatePicker from "../ui/date-picker"
import { notify } from "@/lib/toast"
import { updateProfile } from "@/lib/api/profile"

interface PersonalSectionProps {
  profile:   Profile | null
  onSuccess: () => void
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs text-c2 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-sm text-c3">{value || <span className="text-slate-400">—</span>}</p>
    </div>
  )
}

export default function PersonalSection({profile, onSuccess}: PersonalSectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  const [name, setName] = useState(profile?.name ?? "")
  const [nik,  setNik]  = useState(profile?.nik  ?? "")
  const [birthPlace, setBirthPlace] = useState(profile?.birth_place ?? "")
  const [birthDate, setBirthDate] = useState(profile?.birth_date ?? "")
  const [gender, setGender] = useState(profile?.gender ?? "")
  const [phone, setPhone] = useState(profile?.phone ?? "")
  const [address, setAddress] = useState(profile?.address ?? "")
  
  function handleCancel() {
    setIsEditing(false)
    setName(profile?.name ?? "")
    setNik(profile?.nik ?? "")
    setBirthPlace(profile?.birth_place ?? "")
    setBirthDate(profile?.birth_date ?? "")
    setGender(profile?.gender ?? "")
    setPhone(profile?.phone ?? "")
    setAddress(profile?.address ?? "")
  }

  async function handleSave() {
    setLoading(true)
    try {
      await updateProfile({
        name,
        nik,
        birth_place: birthPlace,
        birth_date:  birthDate || null,
        gender,
        phone,
        address,
      })
      notify.success("Profile updated")
      setIsEditing(false)
      onSuccess()
    } catch {
      notify.error("Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-c4 overflow-hidden">
      <div className="px-6 py-4 border-b border-c4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-c3">Personal Information</h2>
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer text-xs"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </Button>
        )}
      </div>

      <div className="px-6 py-4">
        {!isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRow label="Full Name" value={profile?.name} />
            <InfoRow label="NIK" value={profile?.nik} />
            <InfoRow label="Birth Place" value={profile?.birth_place} />
            <InfoRow label="Birth Date" value={profile?.birth_date} />
            <InfoRow label="Gender" value={profile?.gender} />
            <InfoRow label="Phone" value={profile?.phone} />
            <div className="md:col-span-2">
              <InfoRow label="Address" value={profile?.address} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Full Name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
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
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-c3">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-c4 rounded-lg outline-none focus:ring-2 focus:ring-c3 focus:border-transparent transition bg-white text-c3"
                >
                  <option value="" hidden>Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <FormInput
                label="Phone"
                placeholder="08XXXXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <FormInput
              label="Address"
              placeholder="Jl. ..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <div className="flex gap-2 justify-end pt-2 border-t border-c4">
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="cursor-pointer"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}