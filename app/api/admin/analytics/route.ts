import { type NextRequest, NextResponse } from "next/server"
import { adminAuth } from "@/lib/auth/admin"
import { voteAnalyticsService } from "@/lib/analytics/vote-analytics"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get("admin")

    if (!walletAddress || !adminAuth.isAdmin(walletAddress)) {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 })
    }

    const analytics = await voteAnalyticsService.generateAnalytics()

    return NextResponse.json({
      success: true,
      analytics,
    })
  } catch (error) {
    console.error("Analytics error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
