"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import FormInput from "../ui/form-input"
import { updatePassword } from "@/lib/api/profile"
import { notify } from "@/lib/toast"

interface AccountSectionProps {
  email: string
  onSuccess: () => void
}

export default function AccountSection({email, onSuccess}: AccountSectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [newPass, setNewPass] = useState("")
  const [confirmPass, setConfirmPass] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSave() {
    if (newPass !== confirmPass) {
      notify.error("Passwords do not match")
      return
    }
    if (newPass.length < 6) {
      notify.error("Password must be at least 6 characters")
      return
    }

    setLoading(true)
    try {
      await updatePassword(newPass)
      notify.success("Password updated")
      setIsEditing(false)
      setNewPass("")
      setConfirmPass("")
    } catch {
      notify.error("Failed to update password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-c4 overflow-hidden">
      <div className="px-6 py-4 border-b border-c4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-c3">Account</h2>
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer text-xs"
            onClick={() => setIsEditing(true)}
          >
            Change Password
          </Button>
        )}
      </div>

      <div className="px-6 py-4 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-xs text-c2 font-medium uppercase tracking-wide">Email</p>
          <p className="text-sm text-c3">{email}</p>
        </div>

        {isEditing && (
          <div className="flex flex-col gap-4 pt-2 border-t border-c4">
            <FormInput
              label="New Password"
              type="password"
              placeholder="••••••••"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
            />
            <FormInput
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer"
                onClick={() => {
                  setIsEditing(false)
                  setNewPass("")
                  setConfirmPass("")
                }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="cursor-pointer"
                onClick={handleSave}
                disabled={loading || !newPass || !confirmPass}
              >
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}