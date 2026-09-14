import { createClient } from "../supabase/client";
import { Profile } from "../supabase/types-helper";

export async function getProfile(): Promise<{ profile: Profile; email: string }> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (error) throw error
  
  return {
    profile: data,
    email: user.email ?? ""
  }
}

export async function updateProfile(payload: Partial<Omit<Profile, "id" | "created_at" | "updated_at">>): Promise<void> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { error } = await supabase
    .from("profiles")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", user.id)

  if (error) throw error
}

export async function updatePassword(newPassword: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) throw error
}