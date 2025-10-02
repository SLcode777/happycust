import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { resolveApiKeyToProjectId } from "@/lib/widget-helpers"

// Enable CORS for public API
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const apiKey = searchParams.get("projectId")
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : undefined

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "Project API key is required" },
        { status: 400, headers: corsHeaders }
      )
    }

    // Resolve API key to project ID
    const projectId = await resolveApiKeyToProjectId(apiKey)

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: "Invalid project API key" },
        { status: 404, headers: corsHeaders }
      )
    }

    // Get published reviews with marketing consent
    const reviews = await db.review.findMany({
      where: {
        projectId,
        isPublished: true,
        consentForMarketing: true,
      },
      select: {
        id: true,
        rating: true,
        content: true,
        name: true,
        socialMediaProfile: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    })

    return NextResponse.json(
      {
        success: true,
        data: reviews,
        count: reviews.length,
      },
      { headers: corsHeaders }
    )
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch reviews" },
      { status: 500, headers: corsHeaders }
    )
  }
}
