"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Shield, FileWarning, ArrowRight, RefreshCw, CheckCircle, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

enum VerificationStep {
  INITIAL = "initial",
  SCANNING = "scanning",
  CAPTURED = "captured",
  PROCESSING = "processing",
  ERROR = "error",
  SUCCESS = "success",
}

export default function VerificationPage() {
  const [step, setStep] = useState<VerificationStep>(VerificationStep.INITIAL)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [voterData, setVoterData] = useState<{
    name: string | null
    voterId: string | null
    ballotNumber: string | null
  }>({
    name: null,
    voterId: null,
    ballotNumber: null,
  })
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()

  // Handle camera stream
  const startCamera = async () => {
    try {
      // Stop any existing camera stream first
      stopCamera()
      
      setStep(VerificationStep.SCANNING)

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        // Ensure video plays after setting srcObject
        await videoRef.current.play().catch((e) => console.error("Error playing video:", e))
        setCameraActive(true)
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setError("Unable to access camera. Please ensure camera permissions are granted.")
      setStep(VerificationStep.ERROR)
      throw err
    }
  }

  // Capture image from camera
  const captureImage = () => {
    if (videoRef.current && canvasRef.current && cameraActive) {
      const context = canvasRef.current.getContext("2d")
      if (context) {
        // Set canvas dimensions to match video
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight

        // Save the context state
        context.save()
        
        // Flip the image horizontally to correct the mirror effect
        context.translate(canvasRef.current.width, 0)
        context.scale(-1, 1)
        
        // Draw video frame to canvas (flipped)
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
        
        // Restore the context state
        context.restore()

        // Get image data as base64
        const imageData = canvasRef.current.toDataURL("image/jpeg")
        setCapturedImage(imageData)

        // Stop camera stream - important to do this before changing state
        stopCamera()
        
        // Update state to show captured image
        setStep(VerificationStep.CAPTURED)
      }
    }
  }

  // Explicitly stop the camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      const tracks = stream.getTracks()
      
      tracks.forEach((track) => {
        track.stop()
      })
      
      videoRef.current.srcObject = null
      setCameraActive(false)
    }
  }

  // Process captured image with document scanning model
  const processImage = async () => {
    setStep(VerificationStep.PROCESSING)

    // Simulate progress for demo purposes
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + 10
      })
    }, 500)

    try {
      // Simulating API call delay
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Mock response - in production, this would come from your API
      const mockResponse = {
        success: true,
        documentType: "voter_card",
        data: {
          name: "John Doe",
          voterId:
            "VT" +
            Math.floor(Math.random() * 10000000)
              .toString()
              .padStart(7, "0"),
          ballotNumber:
            "BL" +
            Math.floor(Math.random() * 1000000)
              .toString()
              .padStart(6, "0"),
        },
      }

      clearInterval(progressInterval)
      setProgress(100)

      if (mockResponse.success && mockResponse.documentType === "voter_card") {
        setVoterData({
          name: mockResponse.data.name,
          voterId: mockResponse.data.voterId,
          ballotNumber: mockResponse.data.ballotNumber,
        })

        // In production, you would store the hashed voter data in MongoDB here
        setTimeout(() => {
          setStep(VerificationStep.SUCCESS)
        }, 500)
      } else {
        setError("Invalid document type. Please scan a valid voter card.")
        setStep(VerificationStep.ERROR)
      }
    } catch (err) {
      clearInterval(progressInterval)
      console.error("Error processing image:", err)
      setError("Failed to process the document. Please try again.")
      setStep(VerificationStep.ERROR)
    }
  }

  // Reset the verification process
  const resetVerification = () => {
    // Make sure camera is stopped first
    stopCamera()
    
    setStep(VerificationStep.INITIAL)
    setError(null)
    setProgress(0)
    setCapturedImage(null)
    setVoterData({
      name: null,
      voterId: null,
      ballotNumber: null,
    })
  }

  // Retake photo
  const retakePhoto = () => {
    setCapturedImage(null)
    startCamera()
  }

  // Proceed to ballot issuance
  const proceedToBallot = () => {
    router.push(`/ballot?id=${voterData.ballotNumber}`)
  }

  // Ensure the camera is stopped when component unmounts or changes steps
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])
  
  // Don't auto-start camera, wait for user to click button
  // Remove the useEffect that was previously auto-starting the camera

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
          <CardTitle className="text-2xl">Voter Verification</CardTitle>
          <CardDescription>Please scan your voter card to verify your identity and receive your ballot</CardDescription>
        </CardHeader>

        <CardContent>
          {step === VerificationStep.INITIAL && (
            <div className="text-center space-y-6">
              <div className="rounded-lg bg-muted p-8 flex justify-center">
                <Image
                  src="/assets/voter-sample.png"
                  alt="Example voter card"
                  width={300}
                  height={200}
                  className="rounded-md"
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Instructions:</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Position your voter card within the camera frame</li>
                  <li>Ensure good lighting and a clear view of the card</li>
                  <li>Hold steady while the system scans your card</li>
                  <li>Wait for verification to complete</li>
                </ul>
              </div>
            </div>
          )}

          {step === VerificationStep.SCANNING && (
            <div className="space-y-4">
              <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-dashed border-muted-foreground/50">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="absolute inset-0 w-full h-full object-cover" 
                  style={{ transform: "scaleX(-1)" }} // Mirror the video feed
                />
                <div className="absolute inset-0 pointer-events-none border-4 border-primary/50 rounded-lg"></div>
              </div>
              <p className="text-center text-muted-foreground">
                Position your voter card within the frame and click "Capture"
              </p>
            </div>
          )}

          {step === VerificationStep.CAPTURED && (
            <div className="space-y-4">
              <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-solid border-primary">
                {capturedImage && (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <img 
                      src={capturedImage} 
                      alt="Captured voter card" 
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                )}
              </div>
              <p className="text-center text-muted-foreground">
                Please confirm the image is clear and readable
              </p>
            </div>
          )}

          {step === VerificationStep.PROCESSING && (
            <div className="space-y-6 py-4">
              <div className="flex justify-center">
                <div className="rounded-full bg-primary/10 p-4">
                  <RefreshCw className="h-12 w-12 text-primary animate-spin" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Processing document</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              <p className="text-center text-muted-foreground">Please wait while we verify your voter card...</p>
            </div>
          )}

          {step === VerificationStep.ERROR && (
            <div className="space-y-6">
              <Alert variant="destructive">
                <FileWarning className="h-4 w-4" />
                <AlertTitle>Verification Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              <div className="rounded-lg bg-muted p-8 flex justify-center">
                <Image
                  src="/assets/verification-error.png"
                  alt="Verification error"
                  width={250}
                  height={200}
                  className="rounded-md"
                />
              </div>
            </div>
          )}

          {step === VerificationStep.SUCCESS && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="rounded-full bg-green-100 dark:bg-green-900 p-4">
                  <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">Verification Successful</h3>
                <p className="text-muted-foreground mb-4">Your identity has been verified and your ballot is ready.</p>
              </div>
              <div className="bg-muted rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Voter Name</p>
                  <p className="font-medium">{voterData.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Voter ID</p>
                  <p className="font-medium">{voterData.voterId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ballot Number</p>
                  <p className="font-medium">{voterData.ballotNumber}</p>
                </div>
              </div>
            </div>
          )}

          {/* Hidden canvas for image capture */}
          <canvas ref={canvasRef} className="hidden" />
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3">
          {step === VerificationStep.INITIAL && (
            <Button onClick={startCamera} className="w-full sm:w-auto">
              Start Camera
            </Button>
          )}

          {step === VerificationStep.SCANNING && (
            <>
              <Button onClick={captureImage} className="w-full sm:w-auto gap-2">
                <Camera className="h-4 w-4 mr-1" /> Capture
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  stopCamera();
                  resetVerification();
                }} 
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
            </>
          )}

          {step === VerificationStep.CAPTURED && (
            <>
              <Button onClick={processImage} className="w-full sm:w-auto">
                Confirm & Proceed
              </Button>
              <Button variant="outline" onClick={retakePhoto} className="w-full sm:w-auto">
                Retake Photo
              </Button>
            </>
          )}

          {step === VerificationStep.ERROR && (
            <Button onClick={resetVerification} className="w-full sm:w-auto">
              Try Again
            </Button>
          )}

          {step === VerificationStep.SUCCESS && (
            <>
              <Button onClick={proceedToBallot} className="w-full sm:w-auto gap-2">
                Proceed to Ballot <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={resetVerification} className="w-full sm:w-auto">
                Start Over
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}