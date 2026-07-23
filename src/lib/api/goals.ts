import { createClient } from "../supabase/client";
import { Goal, GoalSnapshot } from "../supabase/types-helper";

export async function getGoals(): Promise<Goal[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .order("sort_order", { ascending: true })

  if (error) throw error
  return data
}

export async function getGoalById(id: string): Promise<Goal> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .eq("id", id)
    .single()

  if (error) throw error
  return data
}

export async function addGoal(payload: {
  name: string
  icon: string
  target_amount: number
  deadline: string
}): Promise<Goal> {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { count } = await supabase
    .from("goals")
    .select("*", { count: "exact", head: true })

  const { data, error } = await supabase
    .from("goals")
    .insert({
      ...payload,
      user_id:user.id,
      status: "ongoing",
      sort_order: (count ?? 0) + 1,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateGoal(id: string, payload: {
  name?: string
  icon?: string
  target_amount?: number
  deadline?: string
  status?: string
  sort_order?: number
}): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from("goals")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", id)

  if (error) throw error
}

export async function updateGoalSortOrder(
  goals: { id: string; sort_order: number }[]
): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.rpc("update_goals_sort_order", {
    updates: goals,
  })

  if (error) throw error
}

export async function deleteGoal(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from("goals")
    .delete()
    .eq("id", id)

  if (error) throw error
}

export async function getGoalSnapshots(goalId: string): Promise<GoalSnapshot[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("goal_snapshots")
    .select("*")
    .eq("goal_id", goalId)
    .order("date", { ascending: true })
  
  if (error) throw error
  return data
}

export async function addGoalSnapshot(payload: {
  goal_id: string
  amount: number
  date: string
  note?: string
}): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from("goal_snapshots")
    .insert(payload)

  if (error) throw error
}

export async function updateGoalSnapshot(id: string, payload: {
  amount?: number
  date?: string
  note?: string
}): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from("goal_snapshots")
    .update(payload)
    .eq("id", id)

  if (error) throw error
}

export async function deleteGoalSnapshot(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from("goal_snapshots")
    .delete()
    .eq("id", id)

  if (error) throw error
}

export async function getLatestGoalSnapshot(goalId: string): Promise<GoalSnapshot | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("goal_snapshots")
    .select("*")
    .eq("goal_id", goalId)
    .order("date", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw error
  return data
}