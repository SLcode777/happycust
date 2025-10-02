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

    // Get all projects for this user
    const projects = await db.project.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
      },
    })

    const projectIds = projects.map((p) => p.id)

    // Get all reviews for user's projects
    const reviews = await db.review.findMany({
      where: {
        projectId: { in: projectIds },
      },
      include: {
        project: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: [
        { isPublished: "asc" },
        { createdAt: "desc" },
      ],
    })

    return NextResponse.json({
      success: true,
      data: reviews,
    })
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    )
  }
}
