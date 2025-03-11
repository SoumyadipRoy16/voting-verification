"use client"

import { useState } from "react"
import { DocumentScanner, type DocumentData } from "@/components/document-scanner"
import { BiometricVerification } from "@/components/biometric-verification"
import { BallotIssuance } from "@/components/ballot-issuance"
import { SecureVoteRecording } from "@/components/secure-vote-recording"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Steps, Step } from "@/components/ui/steps"

export default function VerificationPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [documentData, setDocumentData] = useState<DocumentData | null>(null)
  const [isVerified, setIsVerified] = useState(false)
  const [ballotId, setBallotId] = useState<string | null>(null)
  const [ballotType, setBallotType] = useState<"electronic" | "paper">("electronic")
  const [transactionId, setTransactionId] = useState<string | null>(null)

  const handleScanComplete = (data: DocumentData) => {
    setDocumentData(data)
    if (data.isValid) {
      setCurrentStep(2)
    }
  }

  const handleVerificationComplete = (success: boolean) => {
    setIsVerified(success)
    if (success) {
      setCurrentStep(3)
    }
  }

  const handleBallotIssued = (id: string, type: "electronic" | "paper") => {
    setBallotId(id)
    setBallotType(type)
    setCurrentStep(4)
  }

  const handleRecordingComplete = (id: string) => {
    setTransactionId(id)
  }

  return (
    <div className="container max-w-4xl py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Voter Verification System</h1>
        <p className="text-muted-foreground">Complete the verification process to cast your vote</p>
      </div>

      <div className="mb-8">
        <Steps currentStep={currentStep} className="mb-8">
          <Step title="ID Verification" description="Scan your government ID" />
          <Step title="Biometric Confirmation" description="Verify your identity" />
          <Step title="Ballot Issuance" description="Receive your ballot" />
          <Step title="Secure Recording" description="Cast your vote" />
        </Steps>
      </div>

      <div className="space-y-8">
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 1: ID Verification</CardTitle>
              <CardDescription>Scan your government-issued ID to begin the verification process</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="id" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="id">ID Card</TabsTrigger>
                  <TabsTrigger value="passport">Passport</TabsTrigger>
                  <TabsTrigger value="driver_license">Driver's License</TabsTrigger>
                </TabsList>
                <TabsContent value="id">
                  <DocumentScanner onScanComplete={handleScanComplete} documentType="id" />
                </TabsContent>
                <TabsContent value="passport">
                  <DocumentScanner onScanComplete={handleScanComplete} documentType="passport" />
                </TabsContent>
                <TabsContent value="driver_license">
                  <DocumentScanner onScanComplete={handleScanComplete} documentType="driver_license" />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && documentData && (
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Biometric Verification</CardTitle>
              <CardDescription>Confirm your identity using biometric verification</CardDescription>
            </CardHeader>
            <CardContent>
              <BiometricVerification documentData={documentData} onVerificationComplete={handleVerificationComplete} />
            </CardContent>
          </Card>
        )}

        {currentStep === 3 && documentData && (
          <Card>
            <CardHeader>
              <CardTitle>Step 3: Ballot Issuance</CardTitle>
              <CardDescription>Review your information and receive your ballot</CardDescription>
            </CardHeader>
            <CardContent>
              <BallotIssuance voterData={documentData} onBallotIssued={handleBallotIssued} />
            </CardContent>
          </Card>
        )}

        {currentStep === 4 && ballotId && (
          <Card>
            <CardHeader>
              <CardTitle>Step 4: Secure Vote Recording</CardTitle>
              <CardDescription>Your vote is being securely recorded on the blockchain</CardDescription>
            </CardHeader>
            <CardContent>
              <SecureVoteRecording
                ballotId={ballotId}
                ballotType={ballotType}
                onRecordingComplete={handleRecordingComplete}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

