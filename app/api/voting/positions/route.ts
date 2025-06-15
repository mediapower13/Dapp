import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database/db"

export async function GET(request: NextRequest) {
  try {
    const positions = await db.getAllPositions()

    return NextResponse.json({
      success: true,
      positions: positions.filter((p) => p.isActive),
    })
  } catch (error) {
    console.error("Get positions error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
