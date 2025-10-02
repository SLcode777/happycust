import { useMutation, useQuery } from "@tanstack/react-query"
import type {
  FeedbackInput,
  ReviewInput,
  IssueInput,
  FeatureRequestInput,
  VoteInput,
} from "@/lib/validations"

const API_BASE = "/api/widget"

// Feedback
export function useSubmitFeedback() {
  return useMutation({
    mutationFn: async (data: FeedbackInput) => {
      const response = await fetch(`${API_BASE}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to submit feedback")
      }

      return response.json()
    },
  })
}

// Reviews
export function useSubmitReview() {
  return useMutation({
    mutationFn: async (data: ReviewInput) => {
      const response = await fetch(`${API_BASE}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to submit review")
      }

      return response.json()
    },
  })
}

// Issues
export function useSubmitIssue() {
  return useMutation({
    mutationFn: async (data: IssueInput) => {
      const response = await fetch(`${API_BASE}/issues`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to submit issue")
      }

      return response.json()
    },
  })
}

// Feature Requests
export function useFeatureRequests(
  projectId: string,
  search: string = "",
  fingerprint?: string
) {
  return useQuery({
    queryKey: ["features", projectId, search, fingerprint],
    queryFn: async () => {
      const params = new URLSearchParams({ projectId, search })
      if (fingerprint) {
        params.append("fingerprint", fingerprint)
      }
      const response = await fetch(`${API_BASE}/features?${params}`)

      if (!response.ok) {
        throw new Error("Failed to fetch features")
      }

      return response.json()
    },
  })
}

export function useCreateFeatureRequest() {
  return useMutation({
    mutationFn: async (data: FeatureRequestInput) => {
      const response = await fetch(`${API_BASE}/features`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to create feature request")
      }

      return response.json()
    },
  })
}

export function useVoteFeature() {
  return useMutation({
    mutationFn: async (data: VoteInput) => {
      const response = await fetch(`${API_BASE}/features/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to vote")
      }

      return response.json()
    },
  })
}
