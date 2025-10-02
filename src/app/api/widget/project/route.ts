import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { resolveApiKeyToProjectId } from "@/lib/widget-helpers"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const apiKey = searchParams.get("apiKey")

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "API key is required" },
        { status: 400 }
      )
    }

    // Get project info by API key
    const project = await db.project.findUnique({
      where: { apiKey },
      select: {
        id: true,
        hideBranding: true,
      },
    })

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Invalid API key" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        id: project.id,
        hideBranding: project.hideBranding,
      },
    })
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch project" },
      { status: 500 }
    )
  }
}
