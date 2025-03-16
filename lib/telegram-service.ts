/**
 * Send an OTP via Telegram Bot
 */
export async function sendTelegramOtp(phoneNumber: string, otp: string): Promise<{ success: boolean; error?: string }> {
    try {
      const botToken = process.env.TELEGRAM_BOT_TOKEN
  
      if (!botToken) {
        throw new Error("Telegram bot token is not configured")
      }
  
      // In a real implementation, you would need to:
      // 1. Have a database mapping phone numbers to Telegram chat IDs
      // 2. Have users register with your bot first
      // For this demo, we'll simulate finding a chat ID
      const chatId = await getChatIdByPhoneNumber(phoneNumber)
  
      if (!chatId) {
        return {
          success: false,
          error: "User not registered with Telegram bot",
        }
      }
  
      // Send message via Telegram Bot API
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: `Your VoteVerify verification code is: ${otp}. This code will expire in 10 minutes.`,
          parse_mode: "Markdown",
        }),
      })
  
      const data = await response.json()
  
      if (!data.ok) {
        throw new Error(data.description || "Failed to send Telegram message")
      }
  
      return { success: true }
    } catch (error) {
      console.error("Error sending Telegram message:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to send Telegram message",
      }
    }
  }
  
  /**
   * Get Telegram chat ID by phone number
   * In a real implementation, this would query your database
   */
  async function getChatIdByPhoneNumber(phoneNumber: string): Promise<string | null> {
    // This is a mock implementation
    // In a real app, you would:
    // 1. Have a database table mapping phone numbers to Telegram chat IDs
    // 2. Query that table to find the chat ID for this phone number
  
    // For demo purposes, we'll return a fake chat ID for any phone number
    // In production, return null if the user hasn't registered with your bot
    return "123456789" // Fake chat ID for demo
  }
  
  /**
   * Register a user's phone number with their Telegram chat ID
   * This would be called when a user first interacts with your Telegram bot
   */
  export async function registerTelegramUser(
    phoneNumber: string,
    chatId: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // In a real implementation, you would store this mapping in your database
      console.log(`Registering phone ${phoneNumber} with Telegram chat ID ${chatId}`)
  
      // Simulate successful registration
      return { success: true }
    } catch (error) {
      console.error("Error registering Telegram user:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to register Telegram user",
      }
    }
  }
  
  