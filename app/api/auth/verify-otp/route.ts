import { type NextRequest, NextResponse } from "next/server"
import { verifyOtp } from "@/lib/otp-service"

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json()
    const { mobileNumber, otp } = body

    if (!mobileNumber || !otp) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Validate OTP format
    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json({ success: false, error: "Invalid OTP format" }, { status: 400 })
    }

    // Verify the OTP
    const verification = verifyOtp(mobileNumber, otp)

    if (!verification.valid) {
      return NextResponse.json(
        {
          success: false,
          error: verification.message || "Invalid or expired OTP. Please try again.",
        },
        { status: 400 },
      )
    }

    // Return success response if OTP is valid
    return NextResponse.json({
      success: true,
      message: "OTP verified successfully",
    })
  } catch (error) {
    console.error("Error verifying OTP:", error)
    return NextResponse.json({ success: false, error: "Failed to process OTP verification" }, { status: 500 })
  }
}

