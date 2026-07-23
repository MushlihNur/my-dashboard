import { createClient } from "../supabase/client";
import { IncomeWithCategory } from "../supabase/types-helper";

export async function getIncome(from: string, to: string): Promise<IncomeWithCategory[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("income")
    .select(`
      *,
      categories (
        label,
        color
      )
    `)
    .gte("date", from)
    .lte("date", to)
    .order("date", {ascending: false})

  if (error) throw error
  return data as IncomeWithCategory[]
}

export async function addIncome(payload: {
  category_id: string
  amount: number
  date: string
  note?: string
}): Promise<void> {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { error } = await supabase
    .from("income")
    .insert({
      ...payload,
      user_id: user.id,
    })

  if (error) throw error
}

export async function updateIncome(id: string, payload: {
  category_id?: string
  amount?: number
  date?: string
  note?: string
}): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from("income")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", id)

  if (error) throw error
}

export async function deleteIncome(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from("income")
    .delete()
    .eq("id", id)

  if (error) throw error
}

export async function getIncomeByYear(year: number): Promise<IncomeWithCategory[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("income")
    .select(`
      *,
      categories (
        label,
        color
      )
    `)
    .gte("date", `${year}-01-01`)
    .lte("date", `${year}-12-31`)
    .order("date", { ascending: true })

  if (error) throw error
  return data as IncomeWithCategory[]
}