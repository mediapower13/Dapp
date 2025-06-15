import { type NextRequest, NextResponse } from "next/server"
import { notificationService } from "@/lib/utils/notifications"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    let notifications
    if (userId) {
      notifications = notificationService.getUserNotifications(userId)
    } else {
      notifications = notificationService.getGlobalNotifications()
    }

    return NextResponse.json({
      success: true,
      notifications,
    })
  } catch (error) {
    console.error("Get notifications error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, notificationId, userId } = await request.json()

    if (action === "mark_read") {
      const success = notificationService.markAsRead(notificationId, userId)

      if (success) {
        return NextResponse.json({
          success: true,
          message: "Notification marked as read",
        })
      } else {
        return NextResponse.json({ error: "Notification not found" }, { status: 404 })
      }
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Notification action error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
