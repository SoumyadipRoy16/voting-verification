"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Camera, Upload, Check, AlertCircle, Loader2 } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

interface DocumentScannerProps {
  onScanComplete: (documentData: DocumentData) => void
  documentType?: "id" | "passport" | "driver_license"
  allowMultipleAttempts?: boolean
}

export interface DocumentData {
  id: string
  fullName: string
  dateOfBirth: string
  address: string
  documentType: string
  documentNumber: string
  expiryDate: string
  issuingAuthority: string
  imageUrl: string
  isValid: boolean
}

export function DocumentScanner({
  onScanComplete,
  documentType = "id",
  allowMultipleAttempts = true,
}: DocumentScannerProps) {
  const [captureMode, setCaptureMode] = useState<"camera" | "upload" | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [documentData, setDocumentData] = useState<DocumentData | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Start camera when capture mode is set to camera
  useEffect(() => {
    if (captureMode === "camera") {
      startCamera()
    } else {
      stopCamera()
    }

    return () => {
      stopCamera()
    }
  }, [captureMode])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setError("Could not access camera. Please check permissions or try uploading a document instead.")
      setCaptureMode("upload")
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

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        const imageDataUrl = canvas.toDataURL("image/jpeg")
        setCapturedImage(imageDataUrl)
        processDocument(imageDataUrl)
      }
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file) {
      const reader = new FileReader()

      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string
        setCapturedImage(imageDataUrl)
        processDocument(imageDataUrl)
      }

      reader.readAsDataURL(file)
    }
  }

  const processDocument = (imageDataUrl: string) => {
    setIsProcessing(true)
    setProcessingProgress(0)
    setError(null)

    // Simulate document processing with progress updates
    const interval = setInterval(() => {
      setProcessingProgress((prev) => {
        const newProgress = prev + 5
        if (newProgress >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            // Mock document data - in a real app, this would come from an OCR/document verification API
            const mockData: DocumentData = {
              id: "doc_" + Math.random().toString(36).substr(2, 9),
              fullName: documentType === "passport" ? "Jane A. Smith" : "John R. Doe",
              dateOfBirth: "1985-06-15",
              address: "123 Voting Street, Democracy City, DC 12345",
              documentType: documentType,
              documentNumber: "ID" + Math.floor(Math.random() * 10000000),
              expiryDate: "2028-12-31",
              issuingAuthority: "Department of State",
              imageUrl: imageDataUrl,
              isValid: Math.random() > 0.2, // 80% chance of being valid for demo purposes
            }

            setDocumentData(mockData)
            setIsProcessing(false)
            onScanComplete(mockData)
          }, 500)
        }
        return newProgress
      })
    }, 100)
  }

  const resetScanner = () => {
    setCapturedImage(null)
    setDocumentData(null)
    setError(null)
    setProcessingProgress(0)
    setIsProcessing(false)
  }

  const renderCaptureInterface = () => {
    if (captureMode === "camera") {
      return (
        <div className="relative w-full max-w-lg mx-auto">
          <div className="relative aspect-[3/2] overflow-hidden rounded-lg border-2 border-dashed border-primary/50">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <div className="absolute inset-0 pointer-events-none border-[3px] border-primary rounded-lg"></div>
          </div>
          <canvas ref={canvasRef} className="hidden" />
          <div className="mt-4 flex justify-center">
            <Button onClick={captureImage} className="gap-2">
              <Camera className="h-4 w-4" />
              Capture Document
            </Button>
          </div>
        </div>
      )
    } else if (captureMode === "upload") {
      return (
        <div className="w-full max-w-lg mx-auto">
          <div
            className="relative aspect-[3/2] flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary/50 p-6 cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
            <p className="text-xs text-muted-foreground">
              {documentType === "id" && "ID Card (JPG, PNG)"}
              {documentType === "passport" && "Passport (JPG, PNG)"}
              {documentType === "driver_license" && "Driver's License (JPG, PNG)"}
            </p>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          </div>
        </div>
      )
    } else {
      return (
        <div className="flex flex-col gap-4 w-full max-w-lg mx-auto">
          <Button variant="outline" size="lg" className="gap-2 h-20" onClick={() => setCaptureMode("camera")}>
            <Camera className="h-5 w-5" />
            Use Camera
          </Button>
          <Button variant="outline" size="lg" className="gap-2 h-20" onClick={() => setCaptureMode("upload")}>
            <Upload className="h-5 w-5" />
            Upload Document
          </Button>
        </div>
      )
    }
  }

  const renderProcessingState = () => {
    return (
      <div className="w-full max-w-lg mx-auto">
        <div className="aspect-[3/2] relative rounded-lg border overflow-hidden">
          {capturedImage && (
            <Image src={capturedImage || "/placeholder.svg"} alt="Captured document" fill className="object-cover" />
          )}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center p-6">
            <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
            <h3 className="text-lg font-semibold mb-2">Processing Document</h3>
            <p className="text-sm text-muted-foreground mb-4">Please wait while we verify your document...</p>
            <Progress value={processingProgress} className="w-full max-w-xs" />
          </div>
        </div>
      </div>
    )
  }

  const renderResultState = () => {
    if (!documentData) return null

    return (
      <div className="w-full max-w-lg mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {documentData.isValid ? (
                <>
                  <Check className="h-5 w-5 text-green-500" />
                  Document Verified
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  Verification Failed
                </>
              )}
            </CardTitle>
            <CardDescription>
              {documentData.isValid
                ? "Your document has been successfully verified."
                : "We couldn't verify your document. Please try again or use a different document."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-[3/2] relative rounded-lg border overflow-hidden mb-4">
              {capturedImage && (
                <Image
                  src={capturedImage || "/placeholder.svg"}
                  alt="Captured document"
                  fill
                  className="object-cover"
                />
              )}
            </div>

            {documentData.isValid && (
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div className="font-medium">Full Name:</div>
                  <div>{documentData.fullName}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="font-medium">Document Type:</div>
                  <div className="capitalize">{documentData.documentType.replace("_", " ")}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="font-medium">Document Number:</div>
                  <div>{documentData.documentNumber}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="font-medium">Date of Birth:</div>
                  <div>{documentData.dateOfBirth}</div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            {allowMultipleAttempts && (
              <Button variant="outline" onClick={resetScanner}>
                {documentData.isValid ? "Scan Another" : "Try Again"}
              </Button>
            )}
            {documentData.isValid && <Button>Continue</Button>}
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isProcessing ? renderProcessingState() : documentData ? renderResultState() : renderCaptureInterface()}
    </div>
  )
}

