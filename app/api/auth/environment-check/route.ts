import { type NextRequest, NextResponse } from "next/server"
import { checkRequiredEnvVars } from "@/lib/env"

// This endpoint checks if all required environment variables are set
export async function GET(request: NextRequest) {
  const envVarsConfigured = checkRequiredEnvVars()

  return NextResponse.json({
    success: true,
    configured: envVarsConfigured,
    demoMode: process.env.NEXT_PUBLIC_DEMO_MODE === "true",
  })
}

