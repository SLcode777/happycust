"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useSubmitFeedback } from "@/hooks/use-widget-api"
import { useWidgetConfig } from "./widget-context"
import { SuccessAnimation } from "./success-animation"

interface ShareFeedbackFormProps {
  onBack: () => void
  onClose: () => void
}

export function ShareFeedbackForm({ onBack, onClose }: ShareFeedbackFormProps) {
  const t = useTranslations("widget.feedback")
  const { projectId } = useWidgetConfig()
  const [content, setContent] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)

  const submitFeedback = useSubmitFeedback()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    submitFeedback.mutate(
      { content, projectId },
      {
        onSuccess: () => {
          setShowSuccess(true)
          setContent("") // Reset form
          setTimeout(() => {
            setShowSuccess(false)
            onBack() // Return to menu
          }, 2000)
        },
        onError: (error) => {
          console.error("Error submitting feedback:", error)
          alert("Failed to submit feedback. Please try again.")
        },
      }
    )
  }

  if (showSuccess) {
    return <SuccessAnimation message={t("successMessage") || "Feedback submitted successfully!"} />
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="rounded-sm opacity-70 hover:opacity-100">
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </button>

        <h2 className="text-lg font-semibold">
          {t("title")}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder={t("placeholder")}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          className="resize-none"
        />

        <Button type="submit" className="w-full" disabled={submitFeedback.isPending}>
          {submitFeedback.isPending ? "Submitting..." : t("submit")}
        </Button>
      </form>
    </div>
  )
}
