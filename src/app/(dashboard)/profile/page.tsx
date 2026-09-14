"use client"

import AccountSection from "@/components/profile/account-section"
import PersonalSection from "@/components/profile/personal-section"
import { getProfile } from "@/lib/api/profile"
import { Profile } from "@/lib/supabase/types-helper"
import { notify } from "@/lib/toast"
import { useCallback, useEffect, useState } from "react"

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [email, setEmail] = useState<string>("")
  const [loading, setLoading] = useState(true)

  async function fetchProfile() {
    try {
      const { profile: profileData, email: userEmail } = await getProfile()
      
      setProfile(profileData)
      setEmail(userEmail)
    } catch(err) {
      console.error("Failed to fetch profile:", err)
      notify.error(`Failed to fetch profile: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  if (loading) {
    return <div className="text-center py-12 text-sm text-c2">Loading...</div>
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold text-c3">Profile</h1>
        <p className="text-sm text-c2 mt-1">Manage your account and personal information</p>
      </div>

      <AccountSection 
        email={email}
        onSuccess={fetchProfile}
      />

      <PersonalSection 
        profile={profile}
        onSuccess={fetchProfile}
      />
    </div>
  )
}