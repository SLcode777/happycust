import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { issueSchema } from "@/lib/validations"
import { resolveApiKeyToProjectId } from "@/lib/widget-helpers"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = issueSchema.parse(body)

    // Resolve API key to project ID
    const projectId = await resolveApiKeyToProjectId(validatedData.projectId)

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: "Invalid project API key" },
        { status: 400 }
      )
    }

    // Create issue in database
    const issue = await db.issue.create({
      data: {
        description: validatedData.description,
        screenshotUrl: validatedData.screenshotUrl,
        name: validatedData.name,
        email: validatedData.email || null,
        projectId,
        status: "NEW",
        priority: "MEDIUM",
        tags: [],
      },
    })

    return NextResponse.json(
      { success: true, data: issue },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating issue:", error)

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Invalid input data" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: "Failed to create issue" },
      { status: 500 }
    )
  }
}
