import { format } from "date-fns"

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

export default function Greeting() {
  const today = new Date()

  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl font-semibold text-c3">
        {getGreeting()}, Mushlih 👋
      </h1>
      <p className="text-sm text-c2">
        {format(today, "EEEE, d MMMM yyyy")}
      </p>
    </div>
  )
}