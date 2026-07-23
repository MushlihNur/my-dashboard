interface CategoryData {
  label: string
  color: string
}

interface CategoryBadgeProps {
  category: string | CategoryData
}

export default function CategoryBadge({ category }: CategoryBadgeProps) {
  const label = typeof category === "string" ? category : category.label
  const color = typeof category === "string"
    ? getCategoryColor(category)  // fallback ke mock lookup
    : category.color

  return (
    <span
      style={{
        backgroundColor: `${color}25`,
        color: color,
      }}
      className="px-2 py-0.5 rounded-full text-center text-xs font-medium"
    >
      {label}
    </span>
  )
}

function getCategoryColor(label: string): string {
  const colors: Record<string, string> = {
    "Makan Minum": "#F97316",
    "Transportasi": "#3B82F6",
    "Tempat Tinggal" :"#A855F7",
    "Pribadi": "#EC4899",
    "Kasih Sayang": "#EF4444",
    "Berbagi": "#22C55E",
    "Dana Darurat": "#EAB308",
    "Investasi": "#14B8A6",
    "Salary": "#10B981",
    "Other": "#6B7280",
  }
  return colors[label] ?? "#6B7280"
}