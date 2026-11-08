import { createClient } from "../supabase/client";
import { Document, DocumentShare, DocumentWithSignedUrl } from "../supabase/types-helper";
import {v4 as uuidv4} from "uuid";

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

async function detectFileType(file: File): Promise<"jpg" | "png" | "webp" | "pdf" | null> {
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer())
  const startsWith = (sig: number[], ofset = 0) => sig.every((b, i) => bytes[ofset + i] === b)

  if (startsWith([0xff, 0xd8, 0xff])) return "jpg"
  if (startsWith([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "png"
  if (startsWith([0x52, 0x49, 0x46, 0x46]) && startsWith([0x57, 0x45, 0x42, 0x50], 8)) return "webp"
  if (startsWith([0x25, 0x50, 0x44, 0x46])) return "pdf"
  return null
}

async function uploadValidatedFile(userId: string, file: File): Promise<string> {
  if (file.size > MAX_FILE_SIZE) throw new Error("File is larger than 10 MB")

  const type = await detectFileType(file)
  if (!type) throw new Error("File content is not a valid JPG, PNG, WebP, or PDF")

  const supabase = createClient()
  const filePath = `${userId}/${uuidv4()}.${type}`

  const { error } = await supabase.storage
    .from("documents")
    .upload(filePath, file, {
      contentType: type === "pdf" ? "application/pdf" : `image/${type === "jpg" ? "jpeg" : type}`,
    })

  if (error) throw error
  
  return filePath
}

async function withSignedUrl(doc: Document): Promise<DocumentWithSignedUrl> {
  if (!doc.file_path) return doc
  const supabase = createClient()
  const { data } = await supabase
    .storage
    .from("documents")
    .createSignedUrl(doc.file_path, 60 * 60)
  return { ...doc, signed_url: data?.signedUrl }
}

export async function getDocuments(): Promise<DocumentWithSignedUrl[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .order("created_at", {ascending: true})

  if (error) throw error
  return Promise.all(data.map(withSignedUrl))
}

export async function getDocumentById(id: string): Promise<DocumentWithSignedUrl> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("id", id)
    .single()

  if (error) throw error
  return withSignedUrl(data)
}

export async function addDocument(payload: {
  type: string
  name: string
  notes?: string
  expired_at?: string
  file: File
}): Promise<void> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")
  
  let file_path: string | undefined

  if (payload.file) {
    file_path = await uploadValidatedFile(user.id, payload.file)
  }

  const { error } = await supabase
    .from("documents")
    .insert({
      user_id: user.id,
      type: payload.type,
      name: payload.name,
      notes: payload.notes || null,
      expired_at: payload.expired_at || null,
      file_path,
    })

  if (error) throw error
}

export async function updateDocument(id: string, payload: {
  type?: string
  name?: string
  notes?: string | null
  expired_at?: string | null
  file?: File
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  let file_path: string | undefined
  let oldFilePath: string | null = null

  if (payload.file) {
    const { data: existing } = await supabase
      .from("documents")
      .select("file_path")
      .eq("id", id)
      .single()
    oldFilePath = existing?.file_path ?? null

    file_path = await uploadValidatedFile(user.id, payload.file)
  }

  const { error } = await supabase
    .from("documents")
    .update({
      ...(payload.type !== undefined && { type: payload.type }),
      ...(payload.name !== undefined && { name: payload.name }),
      ...(payload.notes !== undefined && { notes: payload.notes }),
      ...(payload.expired_at !== undefined && { expired_at: payload.expired_at }),
      ...(file_path && { file_path }),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) throw error

  if (oldFilePath) {
    await supabase.storage.from("documents").remove([oldFilePath])
  }
}

export async function deleteDocument(id: string): Promise<void> {
  const supabase = createClient()

  const { data } = await supabase
    .from("documents")
    .select("file_path")
    .eq("id", id)
    .single()

  if (data?.file_path) {
    await supabase.storage.from("documents").remove([data.file_path])
  }

  const { error } = await supabase.from("documents").delete().eq("id", id)
  if (error) throw error
}

export async function getDocumentShares(documentId: string): Promise<DocumentShare[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("document_shares")
    .select("*")
    .eq("document_id", documentId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function createDocumentShare(payload: {
  document_id: string
  recipient: string
  purpose: string
  expired_at: string
}): Promise<DocumentShare> {
  const supabase = createClient()
  const token = uuidv4()

  const { data, error } = await supabase
    .from("document_shares")
    .insert({ ...payload, token })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateDocumentShare(id: string, expired_at: string): Promise<void> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from("document_shares")
    .update({ expired_at })
    .eq("id", id)
  if (error) throw error
}