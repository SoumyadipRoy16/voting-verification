import { type NextRequest, NextResponse } from "next/server"
import { sendOtp, storeOtp } from "@/lib/otp-service"

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json()
    const { mobileNumber, method } = body

    if (!mobileNumber || !method) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Validate mobile number format
    if (!/^\d{10}$/.test(mobileNumber)) {
      return NextResponse.json({ success: false, error: "Invalid mobile number format" }, { status: 400 })
    }

    // Validate method
    if (method !== "sms" && method !== "telegram") {
      return NextResponse.json({ success: false, error: "Invalid OTP delivery method" }, { status: 400 })
    }

    // In development or test mode, generate a static OTP for easier testing
    if (process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      const otp = "123456"
      storeOtp(mobileNumber, otp)

      return NextResponse.json({
        success: true,
        message: `OTP sent successfully via ${method}`,
        debug: { otp }, // Only for development/demo
      })
    }

    // Send OTP via the selected method
    const result = await sendOtp(mobileNumber, method as "sms" | "telegram")

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || `Failed to send OTP via ${method}. Please try again.`,
        },
        { status: 500 },
      )
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: `OTP sent successfully via ${method}`,
    })
  } catch (error) {
    console.error("Error sending OTP:", error)
    return NextResponse.json({ success: false, error: "Failed to process OTP request" }, { status: 500 })
  }
}

