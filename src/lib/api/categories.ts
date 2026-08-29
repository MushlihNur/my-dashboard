import { createClient } from "../supabase/client";
import { Category } from "../supabase/types-helper";

export async function getCategories(): Promise<Category[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("type")

  if (error) throw error
  return data
}

export async function getCategoriesByType(
  type: "expense" | "income" | "all"
): Promise<Category[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .or(`type.eq.${type},type.eq.all`)
    .order("label")

  if (error) throw error
  return data
}