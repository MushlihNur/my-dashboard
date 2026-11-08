import { formatWib, getShareByToken } from "@/lib/share";
import { ShieldAlert } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Shared Document | My Dashboard" }

export default async function SharePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const result = await getShareByToken(token)

  return (
    <div className="min-h-screen bg-c1">
      <header className="bg-c3 px-6 py-4">
        <p className="text-white font-semibold">My Dashboard</p>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6">
        {result.status !== "valid" ? (
          <div className="bg-white rounded-xl border border-c4 px-6 py-16 flex flex-col items-center gap-3 text-center">
            <ShieldAlert size={40} className="text-slate-300" />
            <h1 className="text-lg font-semibold text-c3">
              {result.status === "expired" ? "This link has expired" : "This link is not valid"}
            </h1>
            <p className="text-sm text-c2">
              Please contact the person who shared it with you.
            </p>
          </div>
        ) : (
          <>
            <div>
              <h1 className="text-2xl font-semibold text-c3">Shared Document</h1>
              <p className="text-sm text-c2 mt-1">{result.document.name}</p>
            </div>

            <div className="bg-white rounded-xl border border-c4 px-5 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-c2 font-medium uppercase tracking-wide">Shared with</p>
                <p className="text-sm text-c3 mt-1">{result.share.recipient}</p>
              </div>
              <div>
                <p className="text-xs text-c2 font-medium uppercase tracking-wide">Purpose</p>
                <p className="text-sm text-c3 mt-1">{result.share.purpose}</p>
              </div>
              <div>
                <p className="text-xs text-c2 font-medium uppercase tracking-wide">Link expires</p>
                <p className="text-sm text-c3 mt-1">{formatWib(result.share.expired_at)}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-c4 overflow-hidden p-4">
              {!result.document.file_path ? (
                <div className="flex flex-col items-center py-16 gap-3">
                  <FileText size={48} className="text-slate-300" />
                  <p className="text-sm text-slate-400">No file attached</p>
                </div>
              ) : result.document.file_path.toLowerCase().endsWith(".pdf") ? (
                <iframe
                  src={`/api/share/${token}/file#toolbar=0`}
                  className="w-full h-[700px] rounded-lg border border-c4"
                  title={result.document.name}
                />
              ) : (
                <img
                  src={`/api/share/${token}/file`}
                  alt={result.document.name}
                  draggable={false}
                  className="w-full h-auto rounded-lg"
                />
              )}
            </div>

            <p className="text-xs text-slate-400 bg-white rounded-lg border border-c4 px-4 py-3">
              ⚠️ This document was shared for the purpose stated above and is watermarked with your
              details. Your access time is recorded in the watermark. Please do not distribute it further.
            </p>
          </>
        )}
      </main>
    </div>
  )
}