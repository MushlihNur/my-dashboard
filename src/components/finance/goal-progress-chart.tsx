"use client"

import { formatRupiah } from "@/lib/format"
import { GoalSnapshot } from "@/lib/supabase/types-helper"
import { eachMonthOfInterval, format, parseISO, startOfMonth } from "date-fns"
import { Brush, CartesianGrid, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface GoalProgressChartProps {
  snapshots: GoalSnapshot[]
  targetAmount: number
  deadline: string
  status: "ongoing" | "achieved" | "cancelled"
}

export default function GoalProgressChart({ snapshots, targetAmount, deadline, status }: GoalProgressChartProps) {
  if (snapshots.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-c4 p-6 flex items-center justify-center h-64">
        <p className="text-sm text-c2">No snapshot data yet.</p>
      </div>
    )
  }

  const sorted = [...snapshots].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  const firstDate = startOfMonth(parseISO(sorted[0].date))
  const deadlineDate = startOfMonth(parseISO(deadline))

  const allMonths = eachMonthOfInterval({
    start: firstDate,
    end: deadlineDate,
  })

  const actualMap: Record<string, number> = {}
  sorted.forEach((s) => {
    const label = format(parseISO(s.date), "MMM yy")
    actualMap[label] = s.amount
  })
  // console.log({actualMap})

  const firstAmount = sorted[0].amount
  const totalMonths = allMonths.length - 1
  const totalGrowth = targetAmount - firstAmount

  const chartData = allMonths.map((month, index) => {
    const label = format(month, "MMM yy")
    const actual = actualMap[label] ?? null
    const projected = status === "ongoing"
      ? Math.round(firstAmount + (totalGrowth / totalMonths) * index)
      : null

    return { date: label, actual, projected }
  })
  // console.log(chartData)

  const lastActual = sorted[sorted.length - 1]
  const lastActualLabel = format(parseISO(lastActual.date), "MMM yy")
  const projectedAtLastActual = chartData.find((d) => d.date === lastActualLabel)?.projected
  const isOnTrack = status === "ongoing" && projectedAtLastActual !== undefined
    ? lastActual.amount >= projectedAtLastActual
    : null

  return (
    <div className="bg-white rounded-xl border border-c4 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-c3">Progress Over Time</h3>
        {status === "ongoing" && isOnTrack !== null && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            isOnTrack
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }`}>
            {isOnTrack ? "✓ On Track" : "✗ Behind Schedule"}
          </span>
        )}
        {status === "achieved" && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700">
            ✓ Achieved
          </span>
        )}
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#394867" }}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#394867" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${(v / 1000000).toFixed(0)}jt`}
            width={35}
          />
          <Tooltip
            formatter={(value: number, name: string) => [
              formatRupiah(value),
              name === "actual" ? "Actual" : "Projected",
            ]}
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
              <span style={{ fontSize: "12px", color: "#394867" }}>
                {value === "actual" ? "Actual" : "Projected"}
              </span>
            )}
          />

          {status === "achieved" && (
            <ReferenceLine
              y={targetAmount}
              stroke="#22C55E"
              strokeDasharray="4 4"
              label={{
                value: "Target",
                fontSize: 10,
                fill: "#22C55E",
                position: "insideTopRight",
              }}
            />
          )}

          <Line
            type="monotone"
            dataKey="actual"
            stroke="#394867"
            strokeWidth={2}
            dot={{ r: 3, fill: "#394867" }}
            activeDot={{ r: 5 }}
            connectNulls={true}
          />

          {status === "ongoing" && (
            <Line
              type="monotone"
              dataKey="projected"
              stroke="#94A3B8"
              strokeWidth={1.5}
              strokeDasharray="5 5"
              dot={false}
              activeDot={{ r: 4 }}
              connectNulls
            />
          )}

          <Brush
            dataKey="date"
            height={24}
            stroke="#D9D9D9"
            fill="#F8FAFC"
            travellerWidth={6}
            tick={{ fontSize: 9, fill: "#394867" }}
          />
        </LineChart>
      </ResponsiveContainer>

      <p className="text-xs text-slate-400 mt-2 text-center">
        Drag the slider below the chart to zoom in/out
      </p>
    </div>
  )
}