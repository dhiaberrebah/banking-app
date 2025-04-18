import { CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react"

type ApplicationState = "not_started" | "in_progress" | "submitted" | "pending" | "approved" | "rejected"

interface ApplicationStatusProps {
  currentState: ApplicationState
}

export function ApplicationStatus({ currentState }: ApplicationStatusProps) {
  const steps = [
    { id: "submitted", label: "Submitted", icon: CheckCircle },
    { id: "pending", label: "Under Review", icon: Clock },
    { id: "approved", label: "Decision", icon: currentState === "rejected" ? XCircle : CheckCircle },
  ]

  const getStepStatus = (stepId: string) => {
    const stateOrder = ["not_started", "in_progress", "submitted", "pending", "approved", "rejected"]
    const currentIndex = stateOrder.indexOf(currentState)
    const stepIndex = stateOrder.indexOf(stepId)

    if (currentIndex < 2) return "upcoming" // Not yet submitted
    if (stepId === "approved" && currentState === "rejected") return "rejected"
    if (stateOrder.indexOf(stepId) <= currentIndex) return "completed"
    return "upcoming"
  }

  return (
    <div className="space-y-6">
      {currentState !== "not_started" && currentState !== "in_progress" && (
        <div className="space-y-4">
          {steps.map((step, index) => {
            const status = getStepStatus(step.id)
            const StepIcon = step.icon

            return (
              <div key={step.id} className="relative">
                {index !== 0 && (
                  <div
                    className={`absolute top-0 left-4 -ml-px h-full w-0.5 ${
                      status === "upcoming" ? "bg-gray-200" : status === "rejected" ? "bg-red-200" : "bg-blue-200"
                    }`}
                    aria-hidden="true"
                    style={{ top: "-1rem", height: "calc(100% + 1rem)" }}
                  />
                )}

                <div className="relative flex items-start group">
                  <span className="h-9 flex items-center">
                    <span
                      className={`relative z-10 w-8 h-8 flex items-center justify-center rounded-full ${
                        status === "upcoming"
                          ? "bg-gray-100 border-2 border-gray-300"
                          : status === "rejected"
                            ? "bg-red-100 text-red-600"
                            : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {status === "upcoming" ? (
                        <span className="h-2.5 w-2.5 bg-gray-300 rounded-full"></span>
                      ) : (
                        <StepIcon className="h-5 w-5" />
                      )}
                    </span>
                  </span>

                  <div className="ml-4 min-w-0">
                    <div className="text-sm font-medium text-gray-900">{step.label}</div>
                    <div className="text-sm text-gray-500">
                      {step.id === "submitted" && (
                        <span>Your application has been submitted</span>
                      )}
                      {step.id === "pending" &&
                        (currentState === "pending" || currentState === "approved" || currentState === "rejected") && (
                          <span>Our team is reviewing your application</span>
                        )}
                      {step.id === "approved" && currentState === "approved" && (
                        <span className="text-green-600">Your application has been approved</span>
                      )}
                      {step.id === "approved" && currentState === "rejected" && (
                        <span className="text-red-600">Your application has been declined</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {(currentState === "not_started" || currentState === "in_progress") && (
        <div className="text-center py-8">
          <div className="mb-4 mx-auto w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-blue-500" />
          </div>
          <h3 className="text-lg font-medium text-blue-900 mb-2">No Application Yet</h3>
          <p className="text-sm text-gray-600">
            {currentState === "not_started"
              ? "You haven't started an application yet."
              : "Please complete and submit your application."}
          </p>
        </div>
      )}
    </div>
  )
}
