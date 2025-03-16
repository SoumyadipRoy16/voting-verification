import { type NextRequest, NextResponse } from "next/server"
import { registerTelegramUser } from "@/lib/telegram-service"

// This endpoint would be registered as a webhook with Telegram
// to receive updates when users interact with your bot
export async function POST(request: NextRequest) {
  try {
    // Parse the request body from Telegram
    const update = await request.json()

    // Check if this is a message update
    if (update.message) {
      const { message } = update
      const chatId = message.chat.id.toString()

      // Check if this is a /start command
      if (message.text && message.text === "/start") {
        // Send welcome message
        await sendTelegramMessage(
          chatId,
          "Welcome to VoteVerify! 🗳️\n\n" +
            "I'll help you receive verification codes for your VoteVerify account.\n\n" +
            "Please send your phone number to link it with your Telegram account. " +
            "You can use the button below to share your contact.",
        )

        // Send a request for the user's phone number
        await sendPhoneNumberRequest(chatId)
      }

      // Check if this is a contact share (phone number)
      if (message.contact && message.contact.phone_number) {
        const phoneNumber = message.contact.phone_number

        // Register the user's phone number with their Telegram chat ID
        const result = await registerTelegramUser(phoneNumber, chatId)

        if (result.success) {
          await sendTelegramMessage(
            chatId,
            "✅ Your phone number has been successfully linked!\n\n" +
              "You will now receive verification codes through this chat when you log in to VoteVerify.",
          )
        } else {
          await sendTelegramMessage(
            chatId,
            "❌ There was a problem linking your phone number. Please try again later or contact support.",
          )
        }
      }
    }

    // Always respond with 200 OK to Telegram
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Error processing Telegram webhook:", error)
    return NextResponse.json({ ok: true }) // Still return 200 to Telegram
  }
}

// Helper function to send a message via Telegram Bot API
async function sendTelegramMessage(chatId: string, text: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN

  if (!botToken) {
    throw new Error("Telegram bot token is not configured")
  }

  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: "Markdown",
    }),
  })
}

// Helper function to send a request for the user's phone number
async function sendPhoneNumberRequest(chatId: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN

  if (!botToken) {
    throw new Error("Telegram bot token is not configured")
  }

  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: "Please share your phone number to continue:",
      reply_markup: {
        keyboard: [
          [
            {
              text: "Share my phone number",
              request_contact: true,
            },
          ],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    }),
  })
}

