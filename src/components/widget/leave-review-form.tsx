"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { ArrowLeft, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useSubmitReview } from "@/hooks/use-widget-api"
import { useWidgetConfig } from "./widget-context"
import { SuccessAnimation } from "./success-animation"

interface LeaveReviewFormProps {
  onBack: () => void
  onClose: () => void
}

export function LeaveReviewForm({ onBack, onClose }: LeaveReviewFormProps) {
  const t = useTranslations("widget.review")
  const { projectId } = useWidgetConfig()
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [content, setContent] = useState("")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [socialMedia, setSocialMedia] = useState("")
  const [consent, setConsent] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const submitReview = useSubmitReview()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rating || !content || !email) return

    submitReview.mutate(
      {
        rating,
        content,
        email,
        name,
        socialMediaProfile: socialMedia,
        consentForMarketing: consent,
        projectId,
      },
      {
        onSuccess: () => {
          setShowSuccess(true)
          // Reset form
          setRating(0)
          setContent("")
          setEmail("")
          setName("")
          setSocialMedia("")
          setConsent(false)
          setTimeout(() => {
            setShowSuccess(false)
            onBack() // Return to menu
          }, 2000)
        },
        onError: (error) => {
          console.error("Error submitting review:", error)
          alert("Failed to submit review. Please try again.")
        },
      }
    )
  }

  if (showSuccess) {
    return <SuccessAnimation message={t("successMessage") || "Review submitted successfully!"} />
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
        <div className="space-y-2">
          <Label>{t("overallRating")}</Label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= (hoveredRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">{t("shareExperience")}</Label>
          <Textarea
            id="content"
            placeholder={t("sharePlaceholder")}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">{t("email")}</Label>
          <Input
            id="email"
            type="email"
            placeholder={t("emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <p className="text-xs text-muted-foreground">{t("emailNote")}</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">{t("name")}</Label>
          <Input
            id="name"
            placeholder={t("namePlaceholder")}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="social">{t("socialMedia")}</Label>
          <Input
            id="social"
            placeholder={t("socialMediaPlaceholder")}
            value={socialMedia}
            onChange={(e) => setSocialMedia(e.target.value)}
          />
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="consent"
            checked={consent}
            onCheckedChange={(checked) => setConsent(checked as boolean)}
          />
          <label
            htmlFor="consent"
            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t("consent")}
          </label>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={submitReview.isPending || !rating || !content || !email}
        >
          {submitReview.isPending ? "Submitting..." : t("continue")}
        </Button>
      </form>
    </div>
  )
}
