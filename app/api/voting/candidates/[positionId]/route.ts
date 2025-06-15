import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database/db"

export async function GET(request: NextRequest, { params }: { params: { positionId: string } }) {
  try {
    const positionId = Number.parseInt(params.positionId)

    if (isNaN(positionId)) {
      return NextResponse.json({ error: "Invalid position ID" }, { status: 400 })
    }

    // Check if position exists
    const position = await db.getPosition(positionId)
    if (!position) {
      return NextResponse.json({ error: "Position not found" }, { status: 404 })
    }

    // Get candidates for this position
    const candidates = await db.getCandidatesByPosition(positionId)

    return NextResponse.json({
      success: true,
      position,
      candidates,
    })
  } catch (error) {
    console.error("Get candidates error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
