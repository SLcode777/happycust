"use client"

import { useSearchParams } from "next/navigation"
import { FeedbackWidget } from "@/components/widget/feedback-widget"

export default function WidgetPage() {
  const searchParams = useSearchParams()
  const projectId = searchParams.get("projectId")

  if (!projectId) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
          <p className="text-gray-600">Missing projectId parameter</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent">
      <FeedbackWidget projectId={projectId} embedded />
    </div>
  )
}
