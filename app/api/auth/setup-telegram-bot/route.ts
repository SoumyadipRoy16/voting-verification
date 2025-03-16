import { type NextRequest, NextResponse } from "next/server"

// This is an admin-only endpoint to set up the Telegram bot webhook
export async function POST(request: NextRequest) {
  try {
    // Check for admin authorization
    // In a real app, you would implement proper authentication
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ") || authHeader.split(" ")[1] !== process.env.ADMIN_API_KEY) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN
    if (!botToken) {
      return NextResponse.json({ success: false, error: "Telegram bot token not configured" }, { status: 500 })
    }

    // Get the webhook URL from the request body
    const { webhookUrl } = await request.json()

    if (!webhookUrl) {
      return NextResponse.json({ success: false, error: "Webhook URL is required" }, { status: 400 })
    }

    // Set the webhook with Telegram
    const response = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: webhookUrl,
        allowed_updates: ["message"],
      }),
    })

    const data = await response.json()

    if (!data.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.description || "Failed to set webhook",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Telegram webhook set successfully",
      result: data.result,
    })
  } catch (error) {
    console.error("Error setting up Telegram webhook:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to set up Telegram webhook",
      },
      { status: 500 },
    )
  }
}

