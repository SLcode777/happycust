import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function GET() {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    // Get total counts
    const [
      feedbacks,
      reviews,
      issues,
      features,
      recentFeedbacks,
      recentReviews,
      recentIssues,
      recentFeatures,
      pendingFeatures,
      unresolvedIssues,
      unpublishedReviews,
      newFeedbacks,
    ] = await Promise.all([
      db.feedback.count(),
      db.review.count(),
      db.issue.count(),
      db.featureRequest.count(),
      db.feedback.count({
        where: { createdAt: { gte: sevenDaysAgo } },
      }),
      db.review.count({
        where: { createdAt: { gte: sevenDaysAgo } },
      }),
      db.issue.count({
        where: { createdAt: { gte: sevenDaysAgo } },
      }),
      db.featureRequest.count({
        where: { createdAt: { gte: sevenDaysAgo } },
      }),
      db.featureRequest.count({
        where: { status: "NEW" },
      }),
      db.issue.count({
        where: { status: { in: ["NEW", "IN_PROGRESS"] } },
      }),
      db.review.count({
        where: { isPublished: false },
      }),
      db.feedback.count({
        where: { status: "NEW" },
      }),
    ])

    return NextResponse.json({
      feedbacks,
      reviews,
      issues,
      features,
      recentFeedbacks,
      recentReviews,
      recentIssues,
      recentFeatures,
      pendingFeatures,
      unresolvedIssues,
      unpublishedReviews,
      newFeedbacks,
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    )
  }
}
