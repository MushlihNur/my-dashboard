import { createClient } from "../supabase/client";
import { MonthlyBudget } from "../supabase/types-helper";

export async function getBudget(year: number, month: number): Promise<MonthlyBudget | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("monthly_budgets")
    .select("*")
    .eq("year", year)
    .eq("month", month)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function upsertBudget(payload: {
  year: number
  month: number
  limit_amount: number
}): Promise<void> {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")
    
  const { error } = await supabase
    .from("monthly_budgets")
    .upsert({
      ...payload,
      user_id: user.id,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: "user_id,year,month",
    })

  if (error) throw error
}

export async function getBudgetsByYear(year: number): Promise<MonthlyBudget[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("monthly_budgets")
    .select("*")
    .eq("year", year)
    .order("month", { ascending: true })

  if (error) throw error
  return data
}