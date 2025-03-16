import { sendSmsOtp } from "./sms-service"
import { sendTelegramOtp } from "./telegram-service"

// OTP storage - in production, use a database
// This is just for demonstration purposes
interface OtpRecord {
  otp: string
  expiresAt: Date
  attempts: number
}

// In-memory store - in production, use Redis or a database
const otpStore: Record<string, OtpRecord> = {}

/**
 * Generate a random OTP
 */
export function generateOtp(length = 6): string {
  return Math.floor(100000 + Math.random() * 900000)
    .toString()
    .substring(0, length)
}

/**
 * Store an OTP with expiration
 */
export function storeOtp(identifier: string, otp: string, expiresInMinutes = 10): void {
  const expiresAt = new Date()
  expiresAt.setMinutes(expiresAt.getMinutes() + expiresInMinutes)

  otpStore[identifier] = {
    otp,
    expiresAt,
    attempts: 0,
  }
}

/**
 * Verify an OTP
 */
export function verifyOtp(identifier: string, otp: string): { valid: boolean; message?: string } {
  const record = otpStore[identifier]

  if (!record) {
    return { valid: false, message: "No OTP found. Please request a new code." }
  }

  if (new Date() > record.expiresAt) {
    delete otpStore[identifier]
    return { valid: false, message: "OTP has expired. Please request a new code." }
  }

  // Increment attempts
  record.attempts += 1

  // Limit attempts to prevent brute force
  if (record.attempts > 3) {
    delete otpStore[identifier]
    return { valid: false, message: "Too many failed attempts. Please request a new code." }
  }

  if (record.otp !== otp) {
    return { valid: false, message: "Invalid OTP. Please try again." }
  }

  // OTP is valid, remove it from store to prevent reuse
  delete otpStore[identifier]
  return { valid: true }
}

/**
 * Send OTP via the selected method
 */
export async function sendOtp(
  phoneNumber: string,
  method: "sms" | "telegram",
): Promise<{ success: boolean; error?: string }> {
  try {
    // Generate OTP
    const otp = generateOtp()

    // Store OTP
    storeOtp(phoneNumber, otp)

    // Send OTP via selected method
    if (method === "sms") {
      return await sendSmsOtp(phoneNumber, otp)
    } else if (method === "telegram") {
      return await sendTelegramOtp(phoneNumber, otp)
    } else {
      return { success: false, error: "Invalid delivery method" }
    }
  } catch (error) {
    console.error("Error sending OTP:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send OTP",
    }
  }
}

