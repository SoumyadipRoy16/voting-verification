"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Shield, Camera, RefreshCw, Check, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

enum ScanningState {
  READY = "ready",
  SCANNING = "scanning",
  PROCESSING = "processing",
  SUCCESS = "success",
  ERROR = "error",
}

export default function VoterCardScannerPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const mobileNumber = searchParams.get("mobile") || ""
  const otpMethod = searchParams.get("method") || ""

  const [scanState, setScanState] = useState<ScanningState>(ScanningState.READY)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [scanResult, setScanResult] = useState<{
    name: string
    voterId: string
    dob: string
    address: string
  } | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Start camera for scanning
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      setScanState(ScanningState.SCANNING)
    } catch (err) {
      setError("Unable to access camera. Please ensure camera permissions are granted.")
      setScanState(ScanningState.ERROR)
      console.error("Camera access error:", err)
    }
  }

  // Capture image from camera
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d")
      if (context) {
        // Set canvas dimensions to match video
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight

        // Draw video frame to canvas
        context.drawImage(videoRef.current, 0, 0)

        // Get image data as base64
        const imageData = canvasRef.current.toDataURL("image/jpeg")

        // Process the image
        processImage(imageData)
      }
    }
  }

  // Process captured image
  const processImage = async (imageData: string) => {
    // Stop the camera stream
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
    }

    setScanState(ScanningState.PROCESSING)

    // Simulate progress updates
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval)
          return prev
        }
        return prev + 10
      })
    }, 300)

    try {
      // In a real application, you would send the image data to your backend for processing
      // For this demo, we'll simulate a successful scan after a delay
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Simulate scan result
      const mockResult = {
        name: "John Michael Doe",
        voterId: "VID" + Math.floor(10000000 + Math.random() * 90000000),
        dob: "15/08/1985",
        address: "123 Democracy Avenue, Civic District, State - 560001",
      }

      clearInterval(interval)
      setProgress(100)
      setScanResult(mockResult)
      setScanState(ScanningState.SUCCESS)
    } catch (err) {
      clearInterval(interval)
      setError("Failed to process voter card. Please try again.")
      setScanState(ScanningState.ERROR)
      console.error("Processing error:", err)
    }
  }

  // Handle retry
  const handleRetry = () => {
    setError(null)
    setProgress(0)
    setScanResult(null)
    setScanState(ScanningState.READY)
  }

  // Handle continue after successful scan
  const handleContinue = () => {
    if (scanResult) {
      // In a real app, you would pass this data to the next step
      // For now, let's simulate passing via search params
      const params = new URLSearchParams({
        mobile: mobileNumber,
        name: scanResult.name,
        voterId: scanResult.voterId,
        dob: scanResult.dob,
        address: scanResult.address,
      })

      router.push(`/auth/complete-registration?${params.toString()}`)
    }
  }

  // Clean up camera resources when component unmounts
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

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
            <CardTitle className="text-2xl">Scan Voter ID Card</CardTitle>
            <CardDescription>We need to scan your voter ID card to verify your identity</CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {scanState === ScanningState.READY && (
              <div className="text-center space-y-4">
                <div className="rounded-md border-2 border-dashed p-8 flex flex-col items-center justify-center">
                  <Camera className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">Ready to scan your voter ID card</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Position your card within the frame and ensure it's clearly visible
                </p>
              </div>
            )}

            {scanState === ScanningState.SCANNING && (
              <div className="space-y-4">
                <div className="relative aspect-video rounded-md overflow-hidden border-2 border-dashed">
                  <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 border-4 border-primary/50 rounded-md pointer-events-none"></div>
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  Position your voter ID card within the frame and hold steady
                </p>
              </div>
            )}

            {scanState === ScanningState.PROCESSING && (
              <div className="space-y-6 py-4">
                <div className="flex justify-center">
                  <RefreshCw className="h-12 w-12 text-primary animate-spin" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processing your voter card</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </div>
            )}

            {scanState === ScanningState.SUCCESS && scanResult && (
              <div className="space-y-4">
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-green-100 dark:bg-green-900 p-3">
                    <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>

                <div className="space-y-3 bg-muted/50 rounded-md p-4">
                  <div>
                    <p className="text-sm font-medium">Name</p>
                    <p>{scanResult.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Voter ID</p>
                    <p>{scanResult.voterId}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Date of Birth</p>
                    <p>{scanResult.dob}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Address</p>
                    <p>{scanResult.address}</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  We've successfully scanned your voter ID card. Please verify the information above.
                </p>
              </div>
            )}

            {scanState === ScanningState.ERROR && (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="rounded-full bg-red-100 dark:bg-red-900 p-3">
                    <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                </div>
                <p className="text-muted-foreground">
                  There was a problem scanning your voter ID card. Please try again.
                </p>
              </div>
            )}

            {/* Hidden canvas for image processing */}
            <canvas ref={canvasRef} className="hidden" />
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-3">
            {scanState === ScanningState.READY && (
              <Button onClick={startCamera} className="w-full">
                Start Camera
              </Button>
            )}

            {scanState === ScanningState.SCANNING && (
              <Button onClick={captureImage} className="w-full">
                Capture
              </Button>
            )}

            {scanState === ScanningState.SUCCESS && (
              <Button onClick={handleContinue} className="w-full">
                Continue
              </Button>
            )}

            {(scanState === ScanningState.ERROR || scanState === ScanningState.SUCCESS) && (
              <Button variant="outline" onClick={handleRetry} className="w-full">
                Try Again
              </Button>
            )}
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

w