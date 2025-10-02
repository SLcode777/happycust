import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { featureRequestSchema } from "@/lib/validations"
import { resolveApiKeyToProjectId } from "@/lib/widget-helpers"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const apiKey = searchParams.get("projectId")
    const search = searchParams.get("search") || ""
    const fingerprint = searchParams.get("fingerprint")

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "Project API key is required" },
        { status: 400 }
      )
    }

    // Resolve API key to project ID
    const projectId = await resolveApiKeyToProjectId(apiKey)

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: "Invalid project API key" },
        { status: 400 }
      )
    }

    // Get feature requests with vote counts (exclude NEW status - pending admin approval)
    const features = await db.featureRequest.findMany({
      where: {
        projectId,
        status: { not: "NEW" }, // Only show approved features
        OR: search
          ? [
              { title: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ]
          : undefined,
      },
      include: {
        _count: {
          select: { votes: true },
        },
        votes: fingerprint
          ? {
              where: {
                fingerprint,
              },
              select: {
                id: true,
              },
            }
          : false,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Transform data to include vote count and user's vote status
    const featuresWithVotes = features.map((feature) => ({
      id: feature.id,
      title: feature.title,
      description: feature.description,
      status: feature.status,
      votes: feature._count.votes,
      hasVoted: fingerprint && feature.votes && feature.votes.length > 0,
      createdAt: feature.createdAt,
    }))

    return NextResponse.json({
      success: true,
      data: featuresWithVotes,
    })
  } catch (error) {
    console.error("Error fetching features:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch features" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = featureRequestSchema.parse(body)

    // Resolve API key to project ID
    const projectId = await resolveApiKeyToProjectId(validatedData.projectId)

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: "Invalid project API key" },
        { status: 400 }
      )
    }

    // Create feature request in database
    const feature = await db.featureRequest.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        email: validatedData.email || null,
        name: validatedData.name,
        projectId,
        priority: "MEDIUM",
        tags: [],
      },
    })

    return NextResponse.json(
      { success: true, data: feature },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating feature request:", error)

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Invalid input data" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: "Failed to create feature request" },
      { status: 500 }
    )
  }
}
