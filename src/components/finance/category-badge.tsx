const categoryColors: Record<string, string> = {
  "Makan Minum": "bg-orange-100 text-orange-700",
  "Transportasi": "bg-blue-100 text-blue-700",
  "Tempat Tinggal": "bg-purple-100 text-purple-700",
  "Pribadi": "bg-pink-100 text-pink-700",
  "Kasih Sayang": "bg-red-100 text-red-700",
  "Berbagi": "bg-green-100 text-green-700",
  "Dana Darurat": "bg-yellow-100 text-yellow-700",
  "Investasi": "bg-teal-100 text-teal-700",
  "Other": "bg-slate-100 text-slate-700",
}

export default function CategoryBadge({ category }: { category: string }) {
  const color = categoryColors[category] ?? "bg-slate-100 text-slate-700"

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {category}
    </span>
  )
}