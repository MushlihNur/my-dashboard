import { createClient } from "../supabase/client";
import { ExpenseWithCategory } from "../supabase/types-helper";

export async function getExpenses(from: string, to: string): Promise<ExpenseWithCategory[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("expenses")
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
  return data as ExpenseWithCategory[]
}

export async function addExpense(payload: {
  category_id: string
  amount: number
  date: string
  note?: string
}): Promise<void> {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")
  
  const { error } = await supabase
    .from("expenses")
    .insert({
      ...payload,
      user_id: user.id
    })
  console.log({user, error})
  
  if (error) throw error
}

export async function updateExpense(id: string, payload: {
  category_id?: string
  amount?: number
  date?: string
  note?: string
}): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from("expenses")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", id)

  if (error) throw error
}

export async function deleteExpense(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id)

  if (error) throw error
}

export async function getExpensesByYear(year: number): Promise<ExpenseWithCategory[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("expenses")
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
  return data as ExpenseWithCategory[]
}