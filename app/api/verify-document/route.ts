import { type NextRequest, NextResponse } from "next/server"
import { createHash } from "crypto"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { imageData } = body

    if (!imageData) {
      return NextResponse.json({ success: false, error: "No image data provided" }, { status: 400 })
    }

    const documentVerificationResult = await processDocumentVerification(imageData)

    if (!documentVerificationResult.success || !documentVerificationResult.data) {
      return NextResponse.json(
        { success: false, error: documentVerificationResult.error || "Verification failed" },
        { status: 400 }
      )
    }

    // Now we're sure data exists
    const { name, voterId } = documentVerificationResult.data
    const hashedVoterId = hashData(voterId)
    const hashedName = hashData(name)
    const ballotNumber = generateBallotNumber()

    const { db } = await connectToDatabase()
    
    // Check if voter has already been registered
    const existingVoter = await db.collection("voters").findOne({ hashedVoterId })
    if (existingVoter) {
      return NextResponse.json(
        { success: false, error: "Voter already registered" },
        { status: 400 }
      )
    }

    // Store voter data securely
    await db.collection("voters").insertOne({
      hashedVoterId,
      hashedName,
      ballotNumber,
      timestamp: new Date(),
      hasVoted: false
    })

    return NextResponse.json({
      success: true,
      documentType: "voter_card",
      data: {
        name,
        voterId,
        ballotNumber,
      },
    })
  } catch (error) {
    console.error("Error processing document verification:", error)
    return NextResponse.json(
      { success: false, error: "Failed to process document verification" },
      { status: 500 }
    )
  }
}

// Define proper types for document verification
interface VerificationResult {
  success: boolean;
  data?: {
    name: string;
    voterId: string;
  };
  error?: string;
}

async function processDocumentVerification(imageData: string): Promise<VerificationResult> {
  try {
    // Replace this with actual ML model API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock successful verification result
    return {
      success: true,
      data: {
        name: "John Doe",
        voterId: "VT" + Math.floor(Math.random() * 10000000).toString().padStart(7, "0"),
      },
    }
  } catch (error) {
    return {
      success: false,
      error: "Document verification failed"
    }
  }
}

function hashData(data: string) {
  return createHash("sha256").update(data).digest("hex")
}

function generateBallotNumber() {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return "BL" + timestamp + random
}