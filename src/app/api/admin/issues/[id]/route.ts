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

    // Verify the issue belongs to a project owned by this user
    const issue = await db.issue.findUnique({
      where: { id },
      include: {
        project: true,
      },
    })

    if (!issue) {
      return NextResponse.json(
        { error: "Issue not found" },
        { status: 404 }
      )
    }

    if (issue.project.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    // Update issue
    const updated = await db.issue.update({
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
    console.error("Error updating issue:", error)
    return NextResponse.json(
      { error: "Failed to update issue" },
      { status: 500 }
    )
  }
}
