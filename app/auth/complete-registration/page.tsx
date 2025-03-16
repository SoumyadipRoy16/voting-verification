"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Shield, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function CompleteRegistrationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [formData, setFormData] = useState({
    name: searchParams.get("name") || "",
    voterId: searchParams.get("voterId") || "",
    dob: searchParams.get("dob") || "",
    address: searchParams.get("address") || "",
    mobileNumber: searchParams.get("mobile") || "",
  })

  const [isRegistering, setIsRegistering] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Validate the form data
  const validateForm = () => {
    if (!formData.name.trim()) return "Name is required"
    if (!formData.voterId.trim()) return "Voter ID is required"
    if (!formData.dob.trim()) return "Date of Birth is required"
    if (!formData.address.trim()) return "Address is required"
    return null
  }

  // Handle form submission
  const handleSubmit = async () => {
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsRegistering(true)
    setError(null)

    try {
      // In a real application, you would call your API to register the user
      // For this demo, we'll simulate a successful registration
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate successful registration
      setIsComplete(true)
    } catch (err) {
      setError("Failed to complete registration. Please try again.")
      console.error("Registration error:", err)
    } finally {
      setIsRegistering(false)
    }
  }

  // Proceed to verification after registration
  const proceedToVerification = () => {
    router.push("/verify")
  }

  // If we don't have required parameters, redirect to signup
  useEffect(() => {
    if (!searchParams.get("name") || !searchParams.get("voterId")) {
      router.push("/auth/signup")
    }
  }, [searchParams, router])

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
            <CardTitle className="text-2xl">
              {isComplete ? "Registration Complete" : "Complete Your Registration"}
            </CardTitle>
            <CardDescription>
              {isComplete
                ? "Your account has been successfully created"
                : "Please verify the information extracted from your voter ID card"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!isComplete ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={formData.name} disabled className="bg-muted" />
                  <p className="text-xs text-muted-foreground">Name as shown on your voter ID (not editable)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="voterId">Voter ID</Label>
                  <Input id="voterId" value={formData.voterId} disabled className="bg-muted" />
                  <p className="text-xs text-muted-foreground">
                    Your unique voter identification number (not editable)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input id="dob" value={formData.dob} disabled className="bg-muted" />
                  <p className="text-xs text-muted-foreground">Date of birth from your voter ID (not editable)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">You can edit this if the scanned address is incorrect</p>
                </div>
              </div>
            ) : (
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

          <CardFooter>
            {!isComplete ? (
              <Button onClick={handleSubmit} disabled={isRegistering} className="w-full">
                {isRegistering ? "Registering..." : "Complete Registration"}
              </Button>
            ) : (
              <Button onClick={proceedToVerification} className="w-full">
                Proceed to Verification
              </Button>
            )}
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

