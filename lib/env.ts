// Helper function to check if required environment variables are set
export function checkRequiredEnvVars() {
    const requiredVars = ["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_PHONE_NUMBER", "TELEGRAM_BOT_TOKEN"]
  
    const missingVars = requiredVars.filter((varName) => !process.env[varName])
  
    if (missingVars.length > 0) {
      console.warn(`Warning: Missing environment variables: ${missingVars.join(", ")}`)
      console.warn("OTP functionality may not work correctly without these variables.")
      console.warn("For development, you can use the demo mode which will show OTPs in the UI.")
  
      // Set demo mode if env vars are missing
      if (typeof process !== "undefined" && process.env) {
        process.env.NEXT_PUBLIC_DEMO_MODE = "true"
      }
  
      return false
    }
  
    return true
  }
  
  