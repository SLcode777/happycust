import { NextRequest, NextResponse } from "next/server"
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

    const projects = await db.project.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        _count: {
          select: {
            feedbacks: true,
            reviews: true,
            issues: true,
            featureRequests: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({
      success: true,
      data: projects,
    })
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { name, slug, domain } = body

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existing = await db.project.findUnique({
      where: { slug },
    })

    if (existing) {
      return NextResponse.json(
        { error: "A project with this slug already exists" },
        { status: 400 }
      )
    }

    const project = await db.project.create({
      data: {
        name,
        slug,
        domain: domain || null,
        userId: session.user.id,
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: project,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    )
  }
}
