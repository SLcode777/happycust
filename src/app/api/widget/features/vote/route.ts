import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { voteSchema } from "@/lib/validations"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = voteSchema.parse(body)

    // Check if user already voted (using fingerprint)
    const existingVote = await db.vote.findUnique({
      where: {
        featureRequestId_fingerprint: {
          featureRequestId: validatedData.featureRequestId,
          fingerprint: validatedData.fingerprint,
        },
      },
    })

    if (existingVote) {
      // Remove vote (toggle)
      await db.vote.delete({
        where: {
          id: existingVote.id,
        },
      })

      return NextResponse.json({
        success: true,
        action: "removed",
        message: "Vote removed successfully",
      })
    }

    // Add vote
    const vote = await db.vote.create({
      data: {
        featureRequestId: validatedData.featureRequestId,
        fingerprint: validatedData.fingerprint,
        email: validatedData.email || null,
      },
    })

    return NextResponse.json(
      {
        success: true,
        action: "added",
        data: vote,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error voting:", error)

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Invalid input data" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: "Failed to process vote" },
      { status: 500 }
    )
  }
}
