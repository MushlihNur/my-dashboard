"use client"

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { formatRupiah } from "@/lib/format"
import { ExpenseWithCategory } from "@/lib/supabase/types-helper"

interface ExpenseChartProps {
  expenses: ExpenseWithCategory[]
}

export default function ExpenseChart({ expenses }: ExpenseChartProps) {
  const dataMap: Record<string, { total: number; color: string }> = {}
  expenses.forEach((e) => {
    const label = e.categories.label
    const color = e.categories.color
    if (!dataMap[label]) dataMap[label] = { total: 0, color }
    dataMap[label].total += e.amount
  })

  const data = Object.entries(dataMap).map(([name, { total, color }]) => ({
    name,
    value: total,
    color,
  }))

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-c4 p-6 flex items-center justify-center h-64">
        <p className="text-sm text-c2">No expense data this month.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-c4 p-6">
      <h3 className="text-sm font-medium text-c3 mb-4">Expenses by Category</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => formatRupiah(value)}
            contentStyle={{
              fontSize: "12px",
              borderRadius: "8px",
              border: "1px solid #D9D9D9",
            }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span style={{ fontSize: "12px", color: "#394867" }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}