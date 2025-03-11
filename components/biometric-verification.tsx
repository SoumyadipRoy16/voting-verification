"use client"

import { useState, useRef, useEffect } from "react"
import { Fingerprint, Camera, Scan, Check, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { DocumentData } from "./document-scanner"

interface BiometricVerificationProps {
  documentData: DocumentData
  onVerificationComplete: (success: boolean) => void
}

export function BiometricVerification({ documentData, onVerificationComplete }: BiometricVerificationProps) {
  const [activeMethod, setActiveMethod] = useState<"fingerprint" | "facial">("fingerprint")
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [isVerified, setIsVerified] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (activeMethod === "facial" && isScanning) {
      startCamera()
    } else {
      stopCamera()
    }

    return () => {
      stopCamera()
    }
  }, [activeMethod, isScanning])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setError("Could not access camera. Please check permissions or try fingerprint verification instead.")
      setIsScanning(false)
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      const tracks = stream.getTracks()

      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
  }

  const startVerification = () => {
    setIsScanning(true)
    setScanProgress(0)
    setError(null)
    setIsVerified(null)

    // Simulate biometric verification with progress updates
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        const newProgress = prev + 5
        if (newProgress >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            // 90% success rate for demo purposes
            const success = Math.random() > 0.1
            setIsVerified(success)
            setIsScanning(false)
            onVerificationComplete(success)
          }, 500)
        }
        return newProgress
      })
    }, 100)
  }

  const resetVerification = () => {
    setIsScanning(false)
    setScanProgress(0)
    setIsVerified(null)
    setError(null)
  }

  const renderFingerprintScanner = () => {
    return (
      <div className="flex flex-col items-center">
        <div className="relative w-48 h-48 mb-6">
          <div
            className={`absolute inset-0 rounded-full border-2 ${isScanning ? "border-primary animate-pulse" : "border-muted-foreground"}`}
          >
            <Fingerprint className="w-full h-full p-6 text-muted-foreground" />
          </div>
          {isScanning && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full animate-scan-fingerprint">
                <div className="h-1 bg-primary/50 w-full rounded-full"></div>
              </div>
            </div>
          )}
        </div>

        {!isScanning && isVerified === null && (
          <p className="text-center text-muted-foreground mb-6">
            Place your finger on the scanner to verify your identity
          </p>
        )}

        {!isScanning && (
          <Button onClick={startVerification} disabled={isScanning} className="gap-2">
            <Scan className="h-4 w-4" />
            {isVerified === null ? "Start Scan" : "Try Again"}
          </Button>
        )}
      </div>
    )
  }

  const renderFacialScanner = () => {
    return (
      <div className="flex flex-col items-center">
        <div className="relative w-64 h-64 mb-6 rounded-lg overflow-hidden border-2 border-muted">
          {isScanning ? (
            <>
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <div className="absolute inset-0 pointer-events-none">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-primary rounded-full relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-full animate-scan-face">
                        <div className="h-1 bg-primary/50 w-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <Camera className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {!isScanning && isVerified === null && (
          <p className="text-center text-muted-foreground mb-6">Position your face in the center of the frame</p>
        )}

        {!isScanning && (
          <Button onClick={startVerification} disabled={isScanning} className="gap-2">
            <Scan className="h-4 w-4" />
            {isVerified === null ? "Start Scan" : "Try Again"}
          </Button>
        )}
      </div>
    )
  }

  const renderScanningState = () => {
    return (
      <div className="flex flex-col items-center">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <h3 className="text-lg font-semibold mb-2">Verifying Your Identity</h3>
        <p className="text-sm text-muted-foreground mb-4">Please remain still during the verification process...</p>
        <Progress value={scanProgress} className="w-full max-w-xs mb-2" />
        <p className="text-xs text-muted-foreground">{scanProgress}%</p>
      </div>
    )
  }

  const renderResultState = () => {
    if (isVerified === null) return null

    return (
      <div className="w-full">
        <Alert variant={isVerified ? "default" : "destructive"} className="mb-4">
          {isVerified ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertTitle>{isVerified ? "Verification Successful" : "Verification Failed"}</AlertTitle>
          <AlertDescription>
            {isVerified
              ? `Hello ${documentData.fullName}, your identity has been verified.`
              : "We couldn't verify your identity. Please try again or use a different verification method."}
          </AlertDescription>
        </Alert>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={resetVerification}>
            Try Again
          </Button>
          {isVerified && <Button>Continue</Button>}
        </div>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Biometric Verification</CardTitle>
        <CardDescription>Verify your identity to continue with the voting process</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isVerified !== null ? (
          renderResultState()
        ) : isScanning ? (
          renderScanningState()
        ) : (
          <Tabs
            defaultValue="fingerprint"
            onValueChange={(value) => setActiveMethod(value as "fingerprint" | "facial")}
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="fingerprint">Fingerprint</TabsTrigger>
              <TabsTrigger value="facial">Facial Recognition</TabsTrigger>
            </TabsList>
            <TabsContent value="fingerprint" className="mt-0">
              {renderFingerprintScanner()}
            </TabsContent>
            <TabsContent value="facial" className="mt-0">
              {renderFacialScanner()}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}

