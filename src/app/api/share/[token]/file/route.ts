import { buildWatermarkLines, getShareByToken } from "@/lib/share"
// import sharp from "sharp"
import { PDFDocument, StandardFonts, degrees, rgb } from "pdf-lib"
import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

const escapeXml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

const toLatin = (s: string) => s.replace(/[^\x20-\x7E]/g, "?")

async function watermarkImage(input: Buffer, lines: string[]) {
  const sharp = (await import("sharp")).default
  const oriented = await sharp(input).rotate().toBuffer()
  const { width = 1000, height = 1000, format } = await sharp(oriented).metadata()

  const fontSize = Math.max(14, Math.round(width / 45))
  const lineHeight = fontSize * 1.3
  const stepX = fontSize * 24
  const stepY = lineHeight * lines.length + fontSize * 6
  const span = Math.max(width, height) * 1.5

  const cells: string[] = []
  for (let y = -span; y < span; y += stepY) {
    for (let x = -span; x < span; x += stepX) {
      const tspans = lines
        .map((l, i) => `<tspan x="${x}" dy="${i === 0 ? 0 : lineHeight}">${escapeXml(l)}</tspan>`)
        .join("")
      cells.push(`<text x="${x}" y="${y}">${tspans}</text>`)
    }
  }

  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <g transform="rotate(-30 ${width / 2} ${height / 2})"
       font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="bold"
       fill="#000" fill-opacity="0.22" stroke="#fff" stroke-opacity="0.35" stroke-width="${fontSize / 14}">
      ${cells.join("")}
    </g></svg>`

  const outFormat = format === "png" ? "png" : format === "webp" ? "webp" : "jpeg"
  const buffer = await sharp(oriented)
    .composite([{ input: Buffer.from(svg) }])
    .toFormat(outFormat)
    .toBuffer()

  return { buffer, contentType: `image/${outFormat}` }
}

async function watermarkPdf(input: Buffer, lines: string[]) {
  const pdf  = await PDFDocument.load(input, { ignoreEncryption: true })
  const font = await pdf.embedFont(StandardFonts.HelveticaBold)
  const safeLines = lines.map(toLatin)
  const angle = 30
  const rad   = (angle * Math.PI) / 180

  for (const page of pdf.getPages()) {
    const { width, height } = page.getSize()
    const size = Math.max(10, Math.round(width / 50))
    const lineHeight = size * 1.3
    const stepX = size * 24
    const stepY = lineHeight * safeLines.length + size * 6

    for (let y = -width; y < height; y += stepY) {
      for (let x = -stepX; x < width; x += stepX) {
        safeLines.forEach((line, i) => {
          page.drawText(line, {
            x: x + i * lineHeight * Math.sin(rad),
            y: y - i * lineHeight * Math.cos(rad),
            size,
            font,
            color: rgb(0, 0, 0),
            opacity: 0.2,
            rotate: degrees(angle),
          })
        })
      }
    }
  }

  return { buffer: Buffer.from(await pdf.save()), contentType: "application/pdf" }
}

export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const result = await getShareByToken(token)

  if (result.status !== "valid" || !result.document.file_path) {
    return NextResponse.json(
      { error: "Not available" },
      { status: result.status === "expired" ? 410 : 404 }
    )
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase.storage
    .from("documents")
    .download(result.document.file_path)

  if (error || !data) return NextResponse.json({ error: "File not found" }, { status: 404 })

  const input = Buffer.from(await data.arrayBuffer())
  const lines = buildWatermarkLines(result.share)

  try {
    const { buffer, contentType } = result.document.file_path.toLowerCase().endsWith(".pdf")
      ? await watermarkPdf(input, lines)
      : await watermarkImage(input, lines)
    
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": "inline",
        "Cache-Control": "private, no-store",
      },
    })
  } catch {
    return NextResponse.json({ error: "File could not be processed" }, { status: 422 })
  }
}