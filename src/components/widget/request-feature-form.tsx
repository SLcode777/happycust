"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { ArrowLeft, X, ChevronUp, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useQueryClient } from "@tanstack/react-query"
import { useFeatureRequests, useVoteFeature, useCreateFeatureRequest } from "@/hooks/use-widget-api"
import { useWidgetConfig } from "./widget-context"
import { generateFingerprint } from "@/lib/fingerprint"
import { SuccessAnimation } from "./success-animation"

interface ReportFeatureFormProps {
  onBack: () => void
  onClose: () => void
}

export function RequestFeatureForm({ onBack, onClose }: ReportFeatureFormProps) {
  const t = useTranslations("widget.feature")
  const { projectId } = useWidgetConfig()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [userFingerprint] = useState(() => generateFingerprint())

  const { data: featuresData, isLoading, refetch } = useFeatureRequests(
    projectId,
    search,
    userFingerprint
  )
  const voteFeature = useVoteFeature()
  const createFeature = useCreateFeatureRequest()

  const [newFeatureTitle, setNewFeatureTitle] = useState("")
  const [newFeatureDescription, setNewFeatureDescription] = useState("")
  const [newFeatureName, setNewFeatureName] = useState("")
  const [newFeatureEmail, setNewFeatureEmail] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)

  const features = featuresData?.data || []

  const handleVote = async (featureId: string) => {
    voteFeature.mutate(
      {
        featureRequestId: featureId,
        fingerprint: userFingerprint,
      },
      {
        onSuccess: () => {
          // Refetch features to update vote counts and hasVoted status
          refetch()
        },
        onError: (error) => {
          console.error("Error voting:", error)
        },
      }
    )
  }

  const handleCreateFeature = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFeatureTitle || !newFeatureDescription) return

    createFeature.mutate(
      {
        title: newFeatureTitle,
        description: newFeatureDescription,
        name: newFeatureName,
        email: newFeatureEmail,
        projectId,
      },
      {
        onSuccess: (response) => {
          // Auto-vote for the newly created feature (even if not visible yet)
          const newFeatureId = response.data?.id
          if (newFeatureId) {
            voteFeature.mutate({
              featureRequestId: newFeatureId,
              fingerprint: userFingerprint,
            })
          }

          setShowSuccess(true)

          // Reset form
          setNewFeatureTitle("")
          setNewFeatureDescription("")
          setNewFeatureName("")
          setNewFeatureEmail("")
          setShowAddForm(false)

          // Refetch to update the list (won't show the new feature until approved)
          refetch()

          setTimeout(() => {
            setShowSuccess(false)
          }, 2000)
        },
        onError: (error) => {
          console.error("Error creating feature:", error)
          alert("Failed to create feature request. Please try again.")
        },
      }
    )
  }

  if (showSuccess) {
    return <SuccessAnimation message={t("successMessage") || "Feature request submitted successfully!"} />
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="rounded-sm opacity-70 hover:opacity-100">
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </button>

        <h2 className="text-lg font-semibold">
          {t("title")}
        </h2>

        <button onClick={onClose} className="rounded-sm opacity-70 hover:opacity-100">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>

      <div className="space-y-4">
        {!showAddForm ? (
          <>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("search")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <Button
              onClick={() => setShowAddForm(true)}
              className="w-full"
              variant="secondary"
            >
              <Plus className="mr-2 h-4 w-4" />
              {t("addNew")}
            </Button>
          </>
        ) : (
          <form onSubmit={handleCreateFeature} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title (Required)</Label>
              <Input
                id="title"
                placeholder="e.g., Dark mode support"
                value={newFeatureTitle}
                onChange={(e) => setNewFeatureTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Required)</Label>
              <Textarea
                id="description"
                placeholder="Describe the feature you'd like to see..."
                value={newFeatureDescription}
                onChange={(e) => setNewFeatureDescription(e.target.value)}
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Your Name (Optional)</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={newFeatureName}
                onChange={(e) => setNewFeatureName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Your Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={newFeatureEmail}
                onChange={(e) => setNewFeatureEmail(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={createFeature.isPending || !newFeatureTitle || !newFeatureDescription}
              >
                {createFeature.isPending ? "Creating..." : "Create"}
              </Button>
            </div>
          </form>
        )}

        {!showAddForm && (
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <p className="text-center text-muted-foreground py-4">Loading...</p>
            ) : features.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No feature requests yet. Be the first to suggest one!
              </p>
            ) : (
            features.map((feature: any) => (
              <div
                key={feature.id}
                className={`flex gap-3 p-4 border rounded-lg hover:bg-accent transition-colors ${
                  feature.hasVoted ? "bg-primary/5 border-primary/30" : ""
                }`}
              >
                <button
                  onClick={() => handleVote(feature.id)}
                  className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded border transition-colors ${
                    feature.hasVoted
                      ? "bg-primary text-primary-foreground hover:bg-primary/80"
                      : "hover:bg-background"
                  }`}
                  title={feature.hasVoted ? "Click to remove your vote" : "Click to vote"}
                >
                  <ChevronUp className="h-4 w-4" />
                  <span className={`text-sm ${feature.hasVoted ? "font-bold" : "font-medium"}`}>
                    {feature.votes}
                  </span>
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`${feature.hasVoted ? "font-bold" : "font-medium"}`}>
                      {feature.title}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                        feature.status === "PLANNED"
                          ? "bg-blue-100 text-blue-700"
                          : feature.status === "UNDER_CONSIDERATION"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {feature.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))
          )}
          </div>
        )}
      </div>
    </div>
  )
}
