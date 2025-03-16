"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Shield, Send, QrCode, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { TelegramSetupModal } from "@/components/telegram-setup-modal"

enum LoginStep {
  MOBILE_NUMBER = "mobile_number",
  OTP_METHOD = "otp_method",
  OTP_VERIFICATION = "otp_verification",
  VOTER_ID = "voter_id",
}

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState<LoginStep>(LoginStep.MOBILE_NUMBER)
  const [mobileNumber, setMobileNumber] = useState("")
  const [otpMethod, setOtpMethod] = useState<"sms" | "telegram" | "">("")
  const [otp, setOtp] = useState("")
  const [voterId, setVoterId] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [resendDisabled, setResendDisabled] = useState(false)
  const [resendCountdown, setResendCountdown] = useState(0)
  const [showTelegramSetup, setShowTelegramSetup] = useState(false)

  // Validate mobile number format (10 digits)
  const validateMobileNumber = (number: string) => {
    return /^\d{10}$/.test(number)
  }

  // Handle mobile number submission
  const handleMobileSubmit = () => {
    if (!validateMobileNumber(mobileNumber)) {
      setError("Please enter a valid 10-digit mobile number")
      return
    }
    setError(null)
    setCurrentStep(LoginStep.OTP_METHOD)
  }

  // Start countdown for OTP resend
  const startResendCountdown = () => {
    setResendDisabled(true)
    setResendCountdown(60) // 60 seconds countdown

    const interval = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setResendDisabled(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // Handle OTP method selection and send OTP
  const handleOtpMethodSelect = async () => {
    if (!otpMethod) {
      setError("Please select an OTP delivery method")
      return
    }

    // If Telegram is selected, show the setup modal first
    if (otpMethod === "telegram") {
      setShowTelegramSetup(true)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobileNumber,
          method: otpMethod,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Failed to send OTP via ${otpMethod}`)
      }

      // Start resend countdown
      startResendCountdown()

      // Show success toast
      toast({
        title: "Verification code sent",
        description: `We've sent a code to your ${otpMethod === "sms" ? "mobile number" : "Telegram account"}`,
      })

      // If in development mode and debug OTP is provided, show it
      if (data.debug?.otp) {
        toast({
          title: "Development Mode",
          description: `Your OTP is: ${data.debug.otp}`,
          duration: 10000,
        })
      }

      setCurrentStep(LoginStep.OTP_VERIFICATION)
    } catch (err) {
      console.error("Error sending OTP:", err)
      setError(err instanceof Error ? err.message : "Failed to send verification code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Add a function to handle continuing after Telegram setup
  const handleTelegramSetupComplete = () => {
    setShowTelegramSetup(false)
    handleOtpMethodSelect()
  }

  // Handle OTP resend
  const handleResendOtp = async () => {
    if (resendDisabled) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobileNumber,
          method: otpMethod,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Failed to resend OTP`)
      }

      // Start resend countdown
      startResendCountdown()

      // Show success toast
      toast({
        title: "Verification code resent",
        description: `We've sent a new code to your ${otpMethod === "sms" ? "mobile number" : "Telegram account"}`,
      })

      // If in development mode and debug OTP is provided, show it
      if (data.debug?.otp) {
        toast({
          title: "Development Mode",
          description: `Your OTP is: ${data.debug.otp}`,
          duration: 10000,
        })
      }
    } catch (err) {
      console.error("Error resending OTP:", err)
      setError(err instanceof Error ? err.message : "Failed to resend verification code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle OTP verification
  const handleOtpVerify = async () => {
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobileNumber,
          otp,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Invalid or expired verification code")
      }

      // Show success toast
      toast({
        title: "Verification successful",
        description: "Your phone number has been verified",
      })

      setCurrentStep(LoginStep.VOTER_ID)
    } catch (err) {
      console.error("Error verifying OTP:", err)
      setError(err instanceof Error ? err.message : "Failed to verify code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle voter ID verification and complete login
  const handleVoterIdVerify = async () => {
    if (!voterId.trim()) {
      setError("Please enter your Voter ID")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // In a real app, you would verify the voter ID against the database
      // For this demo, we'll simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Login successful",
        description: "You have been successfully logged in",
      })

      // Redirect to vote verification process
      router.push("/verify")
    } catch (err) {
      console.error("Error during login:", err)
      setError(err instanceof Error ? err.message : "Failed to login. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">VoteVerify</span>
          </div>
        </div>
      </header>

      <main className="flex-1 container max-w-md py-8 flex flex-col items-center justify-center">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Login to Your Account</CardTitle>
            <CardDescription>
              {currentStep === LoginStep.MOBILE_NUMBER && "Enter your mobile number to get started"}
              {currentStep === LoginStep.OTP_METHOD && "Select how you want to receive your verification code"}
              {currentStep === LoginStep.OTP_VERIFICATION && "Enter the verification code we sent you"}
              {currentStep === LoginStep.VOTER_ID && "Enter your Voter ID to continue"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Step 1: Mobile Number Input */}
            {currentStep === LoginStep.MOBILE_NUMBER && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="Enter your 10-digit mobile number"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  />
                </div>
              </div>
            )}

            {/* Step 2: OTP Method Selection */}
            {currentStep === LoginStep.OTP_METHOD && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground mb-4">
                  How would you like to receive your verification code?
                </p>
                <RadioGroup value={otpMethod} onValueChange={(value) => setOtpMethod(value as "sms" | "telegram")}>
                  <div className="flex items-center space-x-2 rounded-md border p-4 mb-3">
                    <RadioGroupItem value="sms" id="sms" />
                    <Label htmlFor="sms" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        <div>
                          <p className="font-medium">SMS</p>
                          <p className="text-sm text-muted-foreground">Receive code via text message</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md border p-4">
                    <RadioGroupItem value="telegram" id="telegram" />
                    <Label htmlFor="telegram" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <QrCode className="h-4 w-4" />
                        <div>
                          <p className="font-medium">Telegram</p>
                          <p className="text-sm text-muted-foreground">Receive code via Telegram message</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Step 3: OTP Verification */}
            {currentStep === LoginStep.OTP_VERIFICATION && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter the 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="tracking-widest text-center text-lg"
                    maxLength={6}
                  />
                  <p className="text-sm text-muted-foreground">
                    We sent a verification code to{" "}
                    {otpMethod === "sms" ? "your mobile number" : "your Telegram account"}
                  </p>
                </div>
                <div className="text-center">
                  <button
                    className={`text-sm ${resendDisabled ? "text-muted-foreground" : "text-primary hover:underline"}`}
                    onClick={handleResendOtp}
                    disabled={resendDisabled}
                  >
                    {resendDisabled ? `Resend code in ${resendCountdown}s` : "Didn't receive a code? Resend"}
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Voter ID Verification */}
            {currentStep === LoginStep.VOTER_ID && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="voterId">Voter ID</Label>
                  <Input
                    id="voterId"
                    placeholder="Enter your Voter ID"
                    value={voterId}
                    onChange={(e) => setVoterId(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">Enter your Voter ID as shown on your voter card</p>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            {currentStep === LoginStep.MOBILE_NUMBER && (
              <Button onClick={handleMobileSubmit} className="w-full">
                Continue
              </Button>
            )}

            {currentStep === LoginStep.OTP_METHOD && (
              <>
                <Button onClick={handleOtpMethodSelect} className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Verification Code"
                  )}
                </Button>
                <Button variant="ghost" onClick={() => setCurrentStep(LoginStep.MOBILE_NUMBER)} className="w-full">
                  Back
                </Button>
              </>
            )}

            {currentStep === LoginStep.OTP_VERIFICATION && (
              <>
                <Button onClick={handleOtpVerify} className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify"
                  )}
                </Button>
                <Button variant="ghost" onClick={() => setCurrentStep(LoginStep.OTP_METHOD)} className="w-full">
                  Back
                </Button>
              </>
            )}

            {currentStep === LoginStep.VOTER_ID && (
              <>
                <Button onClick={handleVoterIdVerify} className="w-full gap-2" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    <>
                      Login <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
                <Button variant="ghost" onClick={() => setCurrentStep(LoginStep.OTP_VERIFICATION)} className="w-full">
                  Back
                </Button>
              </>
            )}

            <div className="text-center w-full mt-2">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/auth/signup" className="text-primary hover:underline">
                  Sign Up
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      </main>
      {showTelegramSetup && <TelegramSetupModal isOpen={showTelegramSetup} onClose={handleTelegramSetupComplete} />}
    </div>
  )
}

