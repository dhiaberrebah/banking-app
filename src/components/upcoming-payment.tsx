import { CalendarDays } from "lucide-react"

const upcomingPayments = [
  {
    id: 1,
    name: "Electricity Bill",
    amount: 85.5,
    dueDate: "2023-04-15",
    provider: "STEG",
    daysLeft: 3,
    urgency: "high",
  },
  {
    id: 2,
    name: "Water Bill",
    amount: 45.75,
    dueDate: "2023-04-20",
    provider: "SONEDE",
    daysLeft: 8,
    urgency: "medium",
  },
  {
    id: 3,
    name: "Internet Bill",
    amount: 65.0,
    dueDate: "2023-04-25",
    provider: "Ooredoo",
    daysLeft: 13,
    urgency: "low",
  },
]

export function UpcomingPayments() {
  return (
    <div className="space-y-4">
      {upcomingPayments.map((payment) => (
        <div key={payment.id} className="rounded-lg border p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <CalendarDays className="h-4 w-4 text-[var(--muted)] mr-2" />
              <span className="font-medium">{payment.name}</span>
            </div>
            <span className="font-bold">{payment.amount.toLocaleString()} TND</span>
          </div>

          <div className="flex items-center justify-between mb-2 text-sm text-[var(--muted)]">
            <span>{payment.provider}</span>
            <span>Due: {new Date(payment.dueDate).toLocaleDateString()}</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span>Time remaining</span>
              <span className={payment.daysLeft <= 3 ? "text-red-500 font-medium" : ""}>
                {payment.daysLeft} days left
              </span>
            </div>
            <div className="progress">
              <div
                className={`progress-indicator ${
                  payment.urgency === "high"
                    ? "bg-red-500"
                    : payment.urgency === "medium"
                      ? "bg-amber-500"
                      : "bg-green-500"
                }`}
                style={{ width: `${100 - (payment.daysLeft / 30) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="mt-3">
            <button className="btn btn-primary w-full">Pay Now</button>
          </div>
        </div>
      ))}
    </div>
  )
}
