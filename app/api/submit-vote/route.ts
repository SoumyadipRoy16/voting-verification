import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ballotId, candidateId } = body

    if (!ballotId || !candidateId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    
    // Verify ballot exists and hasn't been used
    const voter = await db.collection("voters").findOne({ ballotNumber: ballotId })
    
    if (!voter) {
      return NextResponse.json(
        { success: false, error: "Invalid ballot ID" },
        { status: 400 }
      )
    }
    
    if (voter.hasVoted) {
      return NextResponse.json(
        { success: false, error: "Ballot has already been used" },
        { status: 400 }
      )
    }
    
    // Generate receipt ID for vote tracking
    const receiptId = generateReceiptId()
    
    // Record the vote without linking to voter identity
    await db.collection("votes").insertOne({
      candidateId,
      timestamp: new Date(),
      receiptId
    })
    
    // Mark ballot as used
    await db.collection("voters").updateOne(
      { ballotNumber: ballotId },
      { $set: { hasVoted: true, voteTimestamp: new Date() } }
    )

    return NextResponse.json({
      success: true,
      message: "Vote successfully recorded",
      receiptId,
    })
  } catch (error) {
    console.error("Error processing vote submission:", error)
    return NextResponse.json(
      { success: false, error: "Failed to process vote submission" },
      { status: 500 }
    )
  }
}

function generateReceiptId() {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 6)
  return "RC" + timestamp + random
}