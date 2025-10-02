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

    const userId = session.user.id

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    // Get total counts - ONLY for projects owned by the current user
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
      db.feedback.count({
        where: { project: { userId } },
      }),
      db.review.count({
        where: { project: { userId } },
      }),
      db.issue.count({
        where: { project: { userId } },
      }),
      db.featureRequest.count({
        where: { project: { userId } },
      }),
      db.feedback.count({
        where: {
          project: { userId },
          createdAt: { gte: sevenDaysAgo },
        },
      }),
      db.review.count({
        where: {
          project: { userId },
          createdAt: { gte: sevenDaysAgo },
        },
      }),
      db.issue.count({
        where: {
          project: { userId },
          createdAt: { gte: sevenDaysAgo },
        },
      }),
      db.featureRequest.count({
        where: {
          project: { userId },
          createdAt: { gte: sevenDaysAgo },
        },
      }),
      db.featureRequest.count({
        where: {
          project: { userId },
          status: "NEW",
        },
      }),
      db.issue.count({
        where: {
          project: { userId },
          status: { in: ["NEW", "IN_PROGRESS"] },
        },
      }),
      db.review.count({
        where: {
          project: { userId },
          isPublished: false,
        },
      }),
      db.feedback.count({
        where: {
          project: { userId },
          status: "NEW",
        },
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
