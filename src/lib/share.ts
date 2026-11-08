import "server-only"
import { Document, DocumentShare } from "./supabase/types-helper";
import { createAdminClient } from "./supabase/admin";

export type ShareLookup = 
  | { status: "valid"; share: DocumentShare; document: Document }
  | { status: "expired" }
  | { status: "invalid" }

export async function getShareByToken(token: string): Promise<ShareLookup> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("document_shares")
    .select("*, documents(*)")
    .eq("token", token)
    .maybeSingle()

  if (error || !data || !data.documents) return { status: "invalid" }

  const { documents, ...share } = data
  if (new Date(share.expired_at) < new Date()) return { status: "expired" }

  return { status: "valid", share, document: documents as unknown as Document }
}

export function formatWib(date: Date | string): string {
  return (
    new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Jakarta",
    }).format(new Date(date)) + " WIB"
  )
}

export function buildWatermarkLines(share: DocumentShare): string[] {
  return [
    `Shared with: ${share.recipient}`,
    `Purpose: ${share.purpose}`,
    `Accessed: ${formatWib(new Date())}`,
    `Link expires: ${formatWib(share.expired_at)}`,
  ]
}