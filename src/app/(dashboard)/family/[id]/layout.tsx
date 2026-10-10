import { createClient } from "@/lib/supabase/server"

export async function generateMetadata({params}: {params: Promise<{ id: string }>}) {
  const resolvedParams = await params

  const supabase = await createClient()
  const { data } = await supabase
    .from("family_members")
    .select("name")
    .eq("id", resolvedParams.id)
    .single()

  return {
    title: data?.name ? `${data.name} | My Dashboard` : "Family Member | My Dashboard"
  }
}

export default function FamilyDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}