import { getCategoryByLabel } from "@/lib/mock/categories"

export default function CategoryBadge({ category }: { category: string }) {
  const cat = getCategoryByLabel(category)
  const color = cat?.color ?? "#6B7280"

  return (
    <span
      style={{
        backgroundColor: `${color}25`,
        color: color,
      }}
      className="px-2 py-0.5 rounded-full text-center text-xs font-medium"
    >
      {category}
    </span>
  )
}