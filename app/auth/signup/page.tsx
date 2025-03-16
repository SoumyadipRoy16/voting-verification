"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Shield, Send, QrCode, ArrowRight, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { TelegramSetupModal } from "@/components/telegram-setup-modal"

enum SignupStep {
  MOBILE_NUMBER = "mobile_number",
  OTP_METHOD = "otp_method",
  OTP_VERIFICATION = "otp_verification",
  VOTER_CARD_SCAN = "voter_card_scan",
  USER_DETAILS = "user_details",
  COMPLETE = "complete",
}

export default function SignupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState<SignupStep>(SignupStep.MOBILE_NUMBER)
  const [mobileNumber, setMobileNumber] = useState("")
  const [otpMethod, setOtpMethod] = useState<"sms" | "telegram" | "">("")
  const [otp, setOtp] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [resendDisabled, setResendDisabled] = useState(false)
  const [resendCountdown, setResendCountdown] = useState(0)
  const [userDetails, setUserDetails] = useState({
    name: "",
    voterId: "",
    dob: "",
    address: "",
  })

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
    setCurrentStep(SignupStep.OTP_METHOD)
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

      setCurrentStep(SignupStep.OTP_VERIFICATION)
    } catch (err) {
      console.error("Error sending OTP:", err)
      setError(err instanceof Error ? err.message : "Failed to send verification code. Please try again.")
    } finally {
      setIsLoading(false)
    }
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

      setCurrentStep(SignupStep.VOTER_CARD_SCAN)
    } catch (err) {
      console.error("Error verifying OTP:", err)
      setError(err instanceof Error ? err.message : "Failed to verify code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Simulate voter card scan result
  const simulateVoterCardScan = () => {
    // In a real app, this would come from the scanning component
    const scanResults = {
      name: "John Doe",
      voterId: "ABC1234567",
      dob: "1990-01-01",
      address: "123 Democracy Street, Civic Center, State - 100001",
    }

    setUserDetails(scanResults)
    setCurrentStep(SignupStep.USER_DETAILS)
  }

  // Handle final registration
  const handleCompleteRegistration = async () => {
    // In a real app, you would submit all collected data to your API
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Registration complete",
        description: "Your account has been successfully created",
      })

      setCurrentStep(SignupStep.COMPLETE)
    } catch (err) {
      console.error("Error completing registration:", err)
      setError(err instanceof Error ? err.message : "Failed to complete registration. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Navigate to verification page after registration
  const proceedToVerification = () => {
    router.push("/verify")
  }

  // Add a function to handle continuing after Telegram setup
  const handleTelegramSetupComplete = () => {
    setShowTelegramSetup(false)
    handleOtpMethodSelect()
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
            <CardTitle className="text-2xl">Create Your Account</CardTitle>
            <CardDescription>
              {currentStep === SignupStep.MOBILE_NUMBER && "Enter your mobile number to get started"}
              {currentStep === SignupStep.OTP_METHOD && "Select how you want to receive your verification code"}
              {currentStep === SignupStep.OTP_VERIFICATION && "Enter the verification code we sent you"}
              {currentStep === SignupStep.VOTER_CARD_SCAN && "Please scan your voter ID card"}
              {currentStep === SignupStep.USER_DETAILS && "Confirm your details"}
              {currentStep === SignupStep.COMPLETE && "Your account has been successfully created"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Step 1: Mobile Number Input */}
            {currentStep === SignupStep.MOBILE_NUMBER && (
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
                  <p className="text-sm text-muted-foreground">We'll send a verification code to this number</p>
                </div>
              </div>
            )}

            {/* Step 2: OTP Method Selection */}
            {currentStep === SignupStep.OTP_METHOD && (
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
            {currentStep === SignupStep.OTP_VERIFICATION && (
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

            {/* Step 4: Voter Card Scan */}
            {currentStep === SignupStep.VOTER_CARD_SCAN && (
              <div className="space-y-4 text-center">
                <div className="border-2 border-dashed rounded-md p-8 flex flex-col items-center justify-center min-h-[200px]">
                  <QrCode className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Please scan your voter ID card to verify your identity
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Make sure the card is clearly visible and all details are readable
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  We'll extract your voter information securely to complete your registration
                </div>
                {/* In a real app, this would be your actual scanning component */}
                <Button variant="outline" onClick={simulateVoterCardScan}>
                  Simulate Scan
                </Button>
              </div>
            )}

            {/* Step 5: User Details */}
            {currentStep === SignupStep.USER_DETAILS && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={userDetails.name} disabled className="bg-muted" />
                  <p className="text-xs text-muted-foreground">Name as shown on your voter ID (not editable)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="voterId">Voter ID</Label>
                  <Input id="voterId" value={userDetails.voterId} disabled className="bg-muted" />
                  <p className="text-xs text-muted-foreground">
                    Your unique voter identification number (not editable)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input id="dob" value={userDetails.dob} disabled className="bg-muted" />
                  <p className="text-xs text-muted-foreground">Date of birth from your voter ID (not editable)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={userDetails.address}
                    onChange={(e) => setUserDetails({ ...userDetails, address: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">You can edit this if the scanned address is incorrect</p>
                </div>
              </div>
            )}

            {/* Step 6: Completion */}
            {currentStep === SignupStep.COMPLETE && (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="rounded-full bg-green-100 dark:bg-green-900 p-4">
                    <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Registration Successful!</h3>
                  <p className="text-muted-foreground">
                    Your account has been created and your identity has been verified.
                  </p>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            {currentStep === SignupStep.MOBILE_NUMBER && (
              <Button onClick={handleMobileSubmit} className="w-full">
                Continue
              </Button>
            )}

            {currentStep === SignupStep.OTP_METHOD && (
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
                <Button variant="ghost" onClick={() => setCurrentStep(SignupStep.MOBILE_NUMBER)} className="w-full">
                  Back
                </Button>
              </>
            )}

            {currentStep === SignupStep.OTP_VERIFICATION && (
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
                <Button variant="ghost" onClick={() => setCurrentStep(SignupStep.OTP_METHOD)} className="w-full">
                  Back
                </Button>
              </>
            )}

            {currentStep === SignupStep.VOTER_CARD_SCAN && (
              <Button variant="ghost" onClick={() => setCurrentStep(SignupStep.OTP_VERIFICATION)} className="w-full">
                Back
              </Button>
            )}

            {currentStep === SignupStep.USER_DETAILS && (
              <>
                <Button onClick={handleCompleteRegistration} className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Completing...
                    </>
                  ) : (
                    "Complete Registration"
                  )}
                </Button>
                <Button variant="ghost" onClick={() => setCurrentStep(SignupStep.VOTER_CARD_SCAN)} className="w-full">
                  Back
                </Button>
              </>
            )}

            {currentStep === SignupStep.COMPLETE && (
              <Button onClick={proceedToVerification} className="w-full gap-2">
                Proceed to Verification <ArrowRight className="h-4 w-4" />
              </Button>
            )}

            {currentStep !== SignupStep.COMPLETE && (
              <div className="text-center w-full mt-2">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="text-primary hover:underline">
                    Login
                  </Link>
                </p>
              </div>
            )}
          </CardFooter>
        </Card>
      </main>
      {showTelegramSetup && <TelegramSetupModal isOpen={showTelegramSetup} onClose={handleTelegramSetupComplete} />}
    </div>
  )
}

