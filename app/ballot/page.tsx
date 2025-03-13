"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Shield, CheckCircle, AlertTriangle, ArrowLeft, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Candidate {
  id: string
  name: string
  party: string
}

interface Election {
  id: string
  title: string
  candidates: Candidate[]
}

export default function BallotPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const ballotId = searchParams.get("id")
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Mock election data - in a real app, this would come from an API
  const electionData: Election = {
    id: "election-2024",
    title: "2024 General Election",
    candidates: [
      { id: "cand-1", name: "Jane Smith", party: "Progressive Party" },
      { id: "cand-2", name: "Robert Johnson", party: "Conservative Party" },
      { id: "cand-3", name: "Maria Garcia", party: "Liberty Party" },
      { id: "cand-4", name: "David Chen", party: "Reform Party" },
    ],
  }

  // Validate ballot ID on page load
  useEffect(() => {
    if (!ballotId) {
      setError("Invalid ballot ID. Please return to verification.")
    }
  }, [ballotId])

  // Handle vote submission
  const submitVote = async () => {
    if (!selectedCandidate) {
      setError("Please select a candidate before submitting your vote.")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // In a real application, this would be an API call to record the vote
      // The vote would be stored securely with the ballot ID (not the voter's identity)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate successful submission
      setIsSubmitted(true)
    } catch (err) {
      console.error("Error submitting vote:", err)
      setError("Failed to submit your vote. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle print receipt
  const printReceipt = () => {
    window.print()
  }

  // Return to home
  const returnToHome = () => {
    router.push("/")
  }

  if (error && !ballotId) {
    return (
      <div className="container max-w-4xl py-8 md:py-12">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">VoteVerify</span>
          </div>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Ballot Error</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Invalid Ballot</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/verify")} className="w-full sm:w-auto">
              Return to Verification
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-8 md:py-12">
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">VoteVerify</span>
        </div>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Official Ballot</CardTitle>
          <CardDescription>
            {isSubmitted ? "Your vote has been recorded securely." : "Select your candidate and submit your vote."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {!isSubmitted ? (
            <div className="space-y-6">
              <div className="bg-muted rounded-lg p-4 flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Ballot ID</p>
                  <p className="font-medium">{ballotId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Election</p>
                  <p className="font-medium">{electionData.title}</p>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div>
                <h3 className="text-lg font-medium mb-4">Select Your Candidate:</h3>
                <RadioGroup value={selectedCandidate || ""} onValueChange={setSelectedCandidate}>
                  <div className="space-y-4">
                    {electionData.candidates.map((candidate) => (
                      <div key={candidate.id} className="flex items-center space-x-2 rounded-md border p-4">
                        <RadioGroupItem value={candidate.id} id={candidate.id} />
                        <Label htmlFor={candidate.id} className="flex-1 cursor-pointer">
                          <div>
                            <p className="font-medium">{candidate.name}</p>
                            <p className="text-sm text-muted-foreground">{candidate.party}</p>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="rounded-full bg-green-100 dark:bg-green-900 p-4">
                  <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">Vote Successfully Recorded</h3>
                <p className="text-muted-foreground mb-4">Thank you for participating in the democratic process.</p>
              </div>

              <div className="bg-muted rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Ballot ID</p>
                  <p className="font-medium">{ballotId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Election</p>
                  <p className="font-medium">{electionData.title}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Timestamp</p>
                  <p className="font-medium">{new Date().toLocaleString()}</p>
                </div>
              </div>

              <div className="print:hidden bg-blue-50 dark:bg-blue-950 rounded-lg p-4">
                <p className="text-sm">
                  Your vote has been securely recorded. For your privacy, your identity is not linked to your vote
                  choice. You may print this receipt as proof of voting.
                </p>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3">
          {!isSubmitted ? (
            <>
              <Button onClick={submitVote} disabled={!selectedCandidate || isSubmitting} className="w-full sm:w-auto">
                {isSubmitting ? "Submitting..." : "Submit Vote"}
              </Button>
              <Button variant="outline" onClick={() => router.push("/verify")} className="w-full sm:w-auto gap-2">
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
            </>
          ) : (
            <>
              <Button onClick={printReceipt} className="w-full sm:w-auto gap-2 print:hidden">
                <Printer className="h-4 w-4" /> Print Receipt
              </Button>
              <Button variant="outline" onClick={returnToHome} className="w-full sm:w-auto print:hidden">
                Return to Home
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

