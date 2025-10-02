"use client"

import { useState, useRef } from "react"
import { useTranslations } from "next-intl"
import { ArrowLeft, X, Upload, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSubmitIssue } from "@/hooks/use-widget-api"
import { useWidgetConfig } from "./widget-context"
import { SuccessAnimation } from "./success-animation"
import { useUploadThing } from "@/lib/uploadthing-utils"

interface ReportIssueFormProps {
  onBack: () => void
  onClose: () => void
}

export function ReportIssueForm({ onBack, onClose }: ReportIssueFormProps) {
  const t = useTranslations("widget.issue")
  const { projectId } = useWidgetConfig()
  const [description, setDescription] = useState("")
  const [screenshot, setScreenshot] = useState<File | null>(null)
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const submitIssue = useSubmitIssue()
  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      if (res && res[0]) {
        setScreenshotUrl(res[0].url)
      }
    },
    onUploadError: (error: Error) => {
      console.error("Error uploading file:", error)
      alert("Failed to upload screenshot. Please try again.")
      setScreenshot(null)
    },
  })

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 4 * 1024 * 1024) {
      alert("File size must be less than 4MB")
      return
    }

    setScreenshot(file)

    // Upload to UploadThing
    await startUpload([file])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!description) return

    submitIssue.mutate(
      {
        description,
        screenshotUrl,
        name,
        email,
        projectId,
      },
      {
        onSuccess: () => {
          setShowSuccess(true)
          // Reset form
          setDescription("")
          setScreenshot(null)
          setScreenshotUrl(null)
          setName("")
          setEmail("")
          setTimeout(() => {
            setShowSuccess(false)
            onBack() // Return to menu
          }, 2000)
        },
        onError: (error) => {
          console.error("Error submitting issue:", error)
          alert("Failed to submit issue. Please try again.")
        },
      }
    )
  }

  if (showSuccess) {
    return <SuccessAnimation message={t("successMessage") || "Issue reported successfully!"} />
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="rounded-sm opacity-70 hover:opacity-100">
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </button>

        <h2 className="text-lg font-semibold absolute left-1/2 -translate-x-1/2">
          {t("title")}
        </h2>

        <button onClick={onClose} className="rounded-sm opacity-70 hover:opacity-100">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="description">{t("description")}</Label>
          <Textarea
            id="description"
            placeholder={t("descriptionPlaceholder")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>{t("screenshot")}</Label>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                {screenshot ? screenshot.name : t("attachFile")}
              </>
            )}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {screenshot && screenshotUrl && (
            <div className="mt-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={screenshotUrl}
                alt="Screenshot preview"
                className="w-full h-32 object-cover rounded border"
              />
            </div>
          )}
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
          <Label htmlFor="email">{t("email")}</Label>
          <Input
            id="email"
            type="email"
            placeholder={t("emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={submitIssue.isPending || !description || isUploading}
        >
          {submitIssue.isPending ? "Submitting..." : t("submit")}
        </Button>
      </form>
    </div>
  )
}
