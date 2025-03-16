import { Twilio } from "twilio"

// Initialize Twilio client
const initTwilioClient = () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN

  if (!accountSid || !authToken) {
    throw new Error("Twilio credentials are not configured")
  }

  return new Twilio(accountSid, authToken)
}

/**
 * Send an SMS OTP to the provided phone number
 */
export async function sendSmsOtp(phoneNumber: string, otp: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Format phone number to E.164 format if not already
    const formattedNumber = formatPhoneNumber(phoneNumber)

    const client = initTwilioClient()
    const message = await client.messages.create({
      body: `Your VoteVerify verification code is: ${otp}. This code will expire in 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedNumber,
    })

    return {
      success: true,
      messageId: message.sid,
    }
  } catch (error) {
    console.error("Error sending SMS:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send SMS",
    }
  }
}

/**
 * Format phone number to E.164 format
 * This is a simple implementation - in production, you'd want more robust validation
 */
function formatPhoneNumber(phoneNumber: string): string {
  // Remove any non-digit characters
  const digitsOnly = phoneNumber.replace(/\D/g, "")

  // If the number doesn't start with +, add the country code (assuming US +1 here)
  if (!phoneNumber.startsWith("+")) {
    return `+1${digitsOnly}` // Assuming US numbers by default
  }

  return phoneNumber
}

