import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { reviewSchema } from "@/lib/validations"
import { resolveApiKeyToProjectId } from "@/lib/widget-helpers"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = reviewSchema.parse(body)

    // Resolve API key to project ID
    const projectId = await resolveApiKeyToProjectId(validatedData.projectId)

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: "Invalid project API key" },
        { status: 400 }
      )
    }

    // Create review in database
    const review = await db.review.create({
      data: {
        rating: validatedData.rating,
        content: validatedData.content,
        email: validatedData.email,
        name: validatedData.name,
        socialMediaProfile: validatedData.socialMediaProfile || null,
        consentForMarketing: validatedData.consentForMarketing,
        isPublished: false, // Admin will publish manually
        projectId,
      },
    })

    return NextResponse.json(
      { success: true, data: review },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating review:", error)

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Invalid input data" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: "Failed to create review" },
      { status: 500 }
    )
  }
}
