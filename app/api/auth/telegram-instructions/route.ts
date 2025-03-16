import { type NextRequest, NextResponse } from "next/server"

// This endpoint provides instructions for setting up Telegram verification
export async function GET(request: NextRequest) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN

    if (!botToken) {
      return NextResponse.json(
        {
          success: false,
          error: "Telegram bot is not configured",
        },
        { status: 500 },
      )
    }

    // Get bot information
    const response = await fetch(`https://api.telegram.org/bot${botToken}/getMe`)
    const data = await response.json()

    if (!data.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.description || "Failed to get bot information",
        },
        { status: 500 },
      )
    }

    const botUsername = data.result.username

    return NextResponse.json({
      success: true,
      instructions: {
        step1: "Open Telegram and search for the bot: @" + botUsername,
        step2: "Start a chat with the bot by clicking the Start button or sending /start",
        step3: "Follow the instructions to share your phone number with the bot",
        step4: "Once your phone number is registered, you can receive verification codes via Telegram",
        botLink: `https://t.me/${botUsername}`,
      },
    })
  } catch (error) {
    console.error("Error getting Telegram instructions:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to get Telegram instructions",
      },
      { status: 500 },
    )
  }
}

