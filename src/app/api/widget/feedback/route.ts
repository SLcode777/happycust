import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { feedbackSchema } from "@/lib/validations"
import { resolveApiKeyToProjectId } from "@/lib/widget-helpers"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = feedbackSchema.parse(body)

    // Resolve API key to project ID
    const projectId = await resolveApiKeyToProjectId(validatedData.projectId)

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: "Invalid project API key" },
        { status: 400 }
      )
    }

    // Create feedback in database
    const feedback = await db.feedback.create({
      data: {
        content: validatedData.content || "",
        email: validatedData.email,
        name: validatedData.name,
        projectId,
        status: "NEW",
        priority: "MEDIUM",
        tags: [],
      },
    })

    return NextResponse.json(
      { success: true, data: feedback },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating feedback:", error)

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Invalid input data" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: "Failed to create feedback" },
      { status: 500 }
    )
  }
}
