"use client"

import { useState, useEffect } from "react"
import { Check, ChevronRight, Shield, Lock, FileCheck, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface SecureVoteRecordingProps {
  ballotId: string
  ballotType: "electronic" | "paper"
  onRecordingComplete: (transactionId: string) => void
}

interface VoteTransaction {
  id: string
  timestamp: string
  ballotId: string
  blockchainHash: string
  confirmations: number
}

export function SecureVoteRecording({ ballotId, ballotType, onRecordingComplete }: SecureVoteRecordingProps) {
  const [recordingStage, setRecordingStage] = useState<
    "encrypting" | "validating" | "recording" | "confirming" | "complete"
  >("encrypting")
  const [progress, setProgress] = useState(0)
  const [transaction, setTransaction] = useState<VoteTransaction | null>(null)

  useEffect(() => {
    // Simulate the vote recording process
    let timer: NodeJS.Timeout

    if (recordingStage === "encrypting") {
      simulateStage("encrypting", 2000, "validating")
    } else if (recordingStage === "validating") {
      simulateStage("validating", 3000, "recording")
    } else if (recordingStage === "recording") {
      simulateStage("recording", 4000, "confirming")
    } else if (recordingStage === "confirming") {
      simulateStage("confirming", 3000, "complete")
    } else if (recordingStage === "complete") {
      // Create transaction data
      const txn: VoteTransaction = {
        id: "tx_" + Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        ballotId: ballotId,
        blockchainHash:
          "0x" + Array.from({ length: 64 }, () => "0123456789abcdef"[Math.floor(Math.random() * 16)]).join(""),
        confirmations: Math.floor(Math.random() * 10) + 3,
      }
      setTransaction(txn)
      onRecordingComplete(txn.id)
    }

    function simulateStage(stage: string, duration: number, nextStage: any) {
      const interval = 50
      const steps = duration / interval
      let currentProgress = 0

      timer = setInterval(() => {
        currentProgress += 100 / steps
        if (currentProgress >= 100) {
          clearInterval(timer)
          setProgress(0)
          setRecordingStage(nextStage)
        } else {
          setProgress(currentProgress)
        }
      }, interval)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [recordingStage, ballotId, onRecordingComplete])

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case "encrypting":
        return <Lock className="h-5 w-5" />
      case "validating":
        return <FileCheck className="h-5 w-5" />
      case "recording":
        return <Shield className="h-5 w-5" />
      case "confirming":
        return <Clock className="h-5 w-5" />
      case "complete":
        return <Check className="h-5 w-5" />
      default:
        return null
    }
  }

  const getStageTitle = (stage: string) => {
    switch (stage) {
      case "encrypting":
        return "Encrypting Vote"
      case "validating":
        return "Validating Ballot"
      case "recording":
        return "Recording on Blockchain"
      case "confirming":
        return "Confirming Transaction"
      case "complete":
        return "Vote Securely Recorded"
      default:
        return ""
    }
  }

  const getStageDescription = (stage: string) => {
    switch (stage) {
      case "encrypting":
        return "Your vote is being encrypted to ensure privacy..."
      case "validating":
        return "Verifying ballot integrity and eligibility..."
      case "recording":
        return "Securely recording your vote on the blockchain..."
      case "confirming":
        return "Waiting for network confirmation..."
      case "complete":
        return "Your vote has been securely recorded and cannot be altered."
      default:
        return ""
    }
  }

  const renderProcessingStage = () => {
    return (
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {getStageIcon(recordingStage)}
            <h3 className="text-lg font-medium">{getStageTitle(recordingStage)}</h3>
          </div>
          <p className="text-sm text-muted-foreground">{getStageDescription(recordingStage)}</p>
          <Progress value={progress} className="w-full" />
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Process Steps:</h4>
          <div className="space-y-2">
            {["encrypting", "validating", "recording", "confirming", "complete"].map((stage, index) => (
              <div
                key={stage}
                className={`flex items-center gap-3 p-2 rounded-md ${
                  recordingStage === stage
                    ? "bg-primary/10 text-primary"
                    : ["complete", "confirming", "recording", "validating"].indexOf(recordingStage) >=
                        ["complete", "confirming", "recording", "validating"].indexOf(stage as any)
                      ? "text-muted-foreground line-through"
                      : "text-muted-foreground"
                }`}
              >
                <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-muted">
                  {index + 1}
                </div>
                <span className="capitalize">{stage}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderCompleteStage = () => {
    if (!transaction) return null

    return (
      <div className="space-y-6">
        <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 p-4 rounded-md flex items-start gap-3">
          <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-green-800 dark:text-green-300 mb-1">Vote Successfully Recorded</h3>
            <p className="text-sm text-green-700 dark:text-green-400">
              Your vote has been securely recorded on the blockchain and cannot be altered.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Transaction Details</h3>
            <div className="bg-muted p-4 rounded-md">
              <div className="grid grid-cols-[1fr_2fr] gap-2 text-sm">
                <div className="font-medium">Transaction ID:</div>
                <div className="truncate">{transaction.id}</div>

                <div className="font-medium">Timestamp:</div>
                <div>{new Date(transaction.timestamp).toLocaleString()}</div>

                <div className="font-medium">Ballot ID:</div>
                <div>{transaction.ballotId}</div>

                <div className="font-medium">Confirmations:</div>
                <div>{transaction.confirmations}</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Blockchain Hash</h3>
            <div className="bg-muted p-4 rounded-md">
              <p className="text-xs font-mono break-all">{transaction.blockchainHash}</p>
            </div>
          </div>

          <div className="flex items-center justify-between bg-primary/10 p-3 rounded-md">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Immutable Record</span>
            </div>
            <Badge variant="outline" className="bg-primary/20">
              Verified
            </Badge>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Secure Vote Recording
        </CardTitle>
        <CardDescription>Your vote is being securely recorded on the blockchain</CardDescription>
      </CardHeader>
      <CardContent>{recordingStage === "complete" ? renderCompleteStage() : renderProcessingStage()}</CardContent>
      <CardFooter className="flex justify-end">
        {recordingStage === "complete" && (
          <Button className="gap-2">
            Finish
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

