"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Shield, Camera, FileCheck, AlertTriangle, ArrowRight, CheckCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function VerificationInstructionsPage() {
  const [activeTab, setActiveTab] = useState("instructions")
  const router = useRouter()
  
  const proceedToVerification = () => {
    router.push("/verify")
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
          <CardTitle className="text-2xl">Voter Card Verification</CardTitle>
          <CardDescription>
            Learn how to verify your identity using your voter card
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="instructions">Instructions</TabsTrigger>
              <TabsTrigger value="examples">Card Examples</TabsTrigger>
              <TabsTrigger value="tips">Scanning Tips</TabsTrigger>
            </TabsList>
            
            <TabsContent value="instructions" className="space-y-6">
              <div className="rounded-lg bg-muted p-6">
                <h3 className="text-lg font-medium mb-4">Verification Process</h3>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center">
                      <Camera className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="font-medium">1. Scan Your Card</h4>
                    <p className="text-sm text-muted-foreground">
                      Position your voter card in front of your camera when prompted
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center">
                      <FileCheck className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="font-medium">2. Verify Identity</h4>
                    <p className="text-sm text-muted-foreground">
                      Our system securely verifies your voter information
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="font-medium">3. Receive Ballot</h4>
                    <p className="text-sm text-muted-foreground">
                      Upon successful verification, you'll receive your ballot number
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Important Information</h3>
                <ul className="space-y-2">
                  <li className="flex gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Your identity information is securely hashed and cannot be tracked by third parties</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Only official voter cards will be accepted by the system</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>The entire process typically takes less than 30 seconds</span>
                  </li>
                  <li className="flex gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                    <span>Ensure your voter card is not damaged and all information is clearly visible</span>
                  </li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="examples" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Standard Voter Card</h3>
                  <div className="rounded-lg border overflow-hidden">
                    <Image
                      src="/assets/voter-card-example.png"
                      alt="Standard voter card example"
                      width={400}
                      height={250}
                      className="w-full"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    The standard voter card contains your photo, full name, and voter ID number.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Digital Voter ID</h3>
                  <div className="rounded-lg border overflow-hidden">
                    <Image
                      src="/assets/digital-voter-id-example.png"
                      alt="Digital voter ID example"
                      width={400}
                      height={250}
                      className="w-full"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Digital voter IDs are also accepted and contain the same verification elements.
                  </p>
                </div>
              </div>
              
              <div className="bg-muted rounded-lg p-4">
                <h3 className="text-lg font-medium mb-2">Key Elements</h3>
                <p className="mb-4">Our system will look for these key elements on your voter card:</p>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="bg-background rounded p-3">
                    <h4 className="font-medium mb-1">Photo</h4>
                    <p className="text-sm text-muted-foreground">Used to verify the card belongs to you</p>
                  </div>
                  <div className="bg-background rounded p-3">
                    <h4 className="font-medium mb-1">Full Name</h4>
                    <p className="text-sm text-muted-foreground">Matches against voter registration database</p>
                  </div>
                  <div className="bg-background rounded p-3">
                    <h4 className="font-medium mb-1">Voter ID Number</h4>
                    <p className="text-sm text-muted-foreground">Unique identifier for your voter record</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="tips" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">For Best Results</h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex gap-3 items-start">
                    <div className="rounded-full bg-green-100 dark:bg-green-900 p-2 mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium">Good Lighting</p>
                      <p className="text-sm text-muted-foreground">
                        Ensure your card is well-lit without glare or shadows
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <div className="rounded-full bg-green-100 dark:bg-green-900 p-2 mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium">Proper Framing</p>
                      <p className="text-sm text-muted-foreground">
                        Position the entire card within the camera frame
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <div className="rounded-full bg-green-100 dark:bg-green-900 p-2 mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium">Hold Steady</p>
                      <p className="text-sm text-muted-foreground">
                        Keep your hand steady when capturing the image
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <div className="rounded-full bg-green-100 dark:bg-green-900 p-2 mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium">Clean Surface</p>
                      <p className="text-sm text-muted-foreground">
                        Ensure your card is clean and free from smudges
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium mb-2">Good Example</h4>
                    <div className="rounded-lg border overflow-hidden">
                      <Image
                        src="/assets/good-scan-example.png"
                        alt="Good scan example"
                        width={400}
                        height={250}
                        className="w-full"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Card is well-lit, properly framed, and all information is clearly visible
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Poor Example</h4>
                    <div className="rounded-lg border overflow-hidden">
                      <Image
                        src="/assets/poor-scan-example.png"
                        alt="Poor scan example"
                        width={400}
                        height={250}
                        className="w-full"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Card is poorly lit, at an angle, and information is difficult to read
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row gap-3">
          <Button onClick={proceedToVerification} className="w-full sm:w-auto gap-2">
            Proceed to Verification <ArrowRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
