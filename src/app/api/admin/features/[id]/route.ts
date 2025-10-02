import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

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

    const body = await request.json()
    const { status, priority } = body

    // Verify the feature belongs to a project owned by this user
    const feature = await db.featureRequest.findUnique({
      where: { id },
      include: {
        project: true,
      },
    })

    if (!feature) {
      return NextResponse.json(
        { error: "Feature not found" },
        { status: 404 }
      )
    }

    if (feature.project.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    // Update feature
    const updated = await db.featureRequest.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(priority && { priority }),
      },
    })

    return NextResponse.json({
      success: true,
      data: updated,
    })
  } catch (error) {
    console.error("Error updating feature:", error)
    return NextResponse.json(
      { error: "Failed to update feature" },
      { status: 500 }
    )
  }
}
