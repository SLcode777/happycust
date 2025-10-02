import { z } from "zod"

// Feedback validation
export const feedbackSchema = z.object({
  content: z.string().optional(),
  email: z.string().email().optional(),
  name: z.string().optional(),
  projectId: z.string(),
})

export type FeedbackInput = z.infer<typeof feedbackSchema>

// Review validation
export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  content: z.string().min(1, "Please share your experience"),
  email: z.string().email("Please enter a valid email"),
  name: z.string().optional(),
  socialMediaProfile: z.string().url().optional().or(z.literal("")),
  consentForMarketing: z.boolean().default(false),
  projectId: z.string(),
})

export type ReviewInput = z.infer<typeof reviewSchema>

// Issue validation
export const issueSchema = z.object({
  description: z.string().min(1, "Please describe the issue"),
  screenshotUrl: z.string().url().optional(),
  name: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  projectId: z.string(),
})

export type IssueInput = z.infer<typeof issueSchema>

// Feature request validation
export const featureRequestSchema = z.object({
  title: z.string().min(1, "Please enter a title"),
  description: z.string().min(1, "Please enter a description"),
  email: z.string().email().optional().or(z.literal("")),
  name: z.string().optional(),
  projectId: z.string(),
})

export type FeatureRequestInput = z.infer<typeof featureRequestSchema>

// Vote validation
export const voteSchema = z.object({
  featureRequestId: z.string(),
  fingerprint: z.string(),
  email: z.string().email().optional().or(z.literal("")),
})

export type VoteInput = z.infer<typeof voteSchema>

// Survey response validation
export const surveyResponseSchema = z.object({
  surveyId: z.string(),
  answers: z.record(z.any()),
  email: z.string().email().optional().or(z.literal("")),
  name: z.string().optional(),
})

export type SurveyResponseInput = z.infer<typeof surveyResponseSchema>
