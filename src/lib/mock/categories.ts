export type Category = {
  id: string
  label: string
  color: string
  type: string
}

export const categories: Category[] = [
  {
    "id":"makan-minum",
    "label":"Makan Minum",
    "color":"#F97316",
    "type":"expense"
  },
  {
    "id":"transportasi",
    "label":"Transportasi",
    "color":"#3B82F6",
    "type":"expense"
  },
  {
    "id":"tempat-tinggal",
    "label":"Tempat Tinggal",
    "color":"#A855F7",
    "type":"expense"
  },
  {
    "id":"pribadi",
    "label":"Pribadi",
    "color":"#EC4899",
    "type":"expense"
  },
  {
    "id":"kasih-sayang",
    "label":"Kasih Sayang",
    "color":"#EF4444",
    "type":"expense"
  },
  {
    "id":"berbagi",
    "label":"Berbagi",
    "color":"#22C55E",
    "type":"expense"
  },
  {
    "id":"dana-darurat",
    "label":"Dana Darurat",
    "color":"#EAB308",
    "type":"expense"
  },
  {
    "id":"investasi",
    "label":"Investasi",
    "color":"#14B8A6",
    "type":"expense"
  },
  {
    "id":"salary",
    "label":"Salary",
    "color":"#10B981",
    "type":"income"
  },
  {
    "id":"other",
    "label":"Other",
    "color":"#6B7280",
    "type":"all"
  }
]

export function getCategoryByLabel(label: string): Category | undefined {
  return categories.find((c) => c.label === label)
}

export function getCategoriesByType(type: string): Category[] {
  return categories.filter((c) => c.type === type || c.type === "all")
}