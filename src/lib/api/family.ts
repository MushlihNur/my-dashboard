import { createClient } from "../supabase/client";
import { FamilyMember } from "../supabase/types-helper";

export async function getFamilyMembers(): Promise<FamilyMember[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("family_members")
    .select(`*`)
    .order("created_at", {ascending: true})

  if (error) throw error
  return data as FamilyMember[]
}

export async function getFamilyMemberById(id: string): Promise<FamilyMember> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("family_members")
    .select("*")
    .eq("id", id)
    .single()

  if (error) throw error
  return data
}

export async function addFamilyMember(payload: {
  name: string
  relation: string
  nik?: string
  birth_place?: string
  birth_date?: string
  gender?: string
  phone?: string
  address?: string
  blood_type?: string
  notes?: string
}): Promise<void> {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { error } = await supabase
    .from("family_members")
    .insert({ ...payload, user_id: user.id })

  if (error) throw error
}

export async function updateFamilyMember(id: string, payload: Partial<Omit<FamilyMember, "id" | "user_id" | "created_at" | "updated_at">>): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from("family_members")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", id)

  if (error) throw error
}

export async function deleteFamilyMember(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from("family_members")
    .delete()
    .eq("id", id)

  if (error) throw error
}