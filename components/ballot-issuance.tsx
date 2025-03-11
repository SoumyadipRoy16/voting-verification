"use client"

import { useState } from "react"
import { Check, ChevronRight, FileText, Printer, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { DocumentData } from "./document-scanner"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface BallotIssuanceProps {
  voterData: DocumentData
  onBallotIssued: (ballotId: string, method: "electronic" | "paper") => void
}

interface Election {
  id: string
  title: string
  date: string
  type: string
}

interface Precinct {
  id: string
  name: string
  address: string
  elections: Election[]
}

export function BallotIssuance({ voterData, onBallotIssued }: BallotIssuanceProps) {
  const [issuanceMethod, setIssuanceMethod] = useState<"electronic" | "paper">("electronic")
  const [isIssuing, setIsIssuing] = useState(false)
  const [isIssued, setIsIssued] = useState(false)
  const [ballotId, setBallotId] = useState<string | null>(null)

  // Mock voter precinct data - in a real app, this would come from a database lookup
  const voterPrecinct: Precinct = {
    id: "precinct_12345",
    name: "Central District 5",
    address: "123 Democracy Ave, Voteville, ST 12345",
    elections: [
      {
        id: "election_1",
        title: "2024 General Election",
        date: "November 5, 2024",
        type: "general",
      },
      {
        id: "election_2",
        title: "City Council Special Election",
        date: "November 5, 2024",
        type: "local",
      },
    ],
  }

  const issueBallot = () => {
    setIsIssuing(true)

    // Simulate ballot issuance process
    setTimeout(() => {
      const newBallotId = "ballot_" + Math.random().toString(36).substr(2, 9)
      setBallotId(newBallotId)
      setIsIssued(true)
      setIsIssuing(false)
      onBallotIssued(newBallotId, issuanceMethod)
    }, 2000)
  }

  const renderVoterInformation = () => {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Voter Information</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="font-medium">Name:</div>
            <div>{voterData.fullName}</div>

            <div className="font-medium">Address:</div>
            <div>{voterData.address}</div>

            <div className="font-medium">ID Number:</div>
            <div>{voterData.documentNumber}</div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Precinct Information</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="font-medium">Precinct:</div>
            <div>{voterPrecinct.name}</div>

            <div className="font-medium">Polling Location:</div>
            <div>{voterPrecinct.address}</div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Available Elections</h3>
          <div className="space-y-2">
            {voterPrecinct.elections.map((election) => (
              <div key={election.id} className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
                <div>
                  <div className="font-medium">{election.title}</div>
                  <div className="text-xs text-muted-foreground">{election.date}</div>
                </div>
                <Badge variant="outline" className="capitalize">
                  {election.type}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderElectronicBallot = () => {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          An electronic ballot will be issued to you. You can cast your vote on one of our secure voting terminals.
        </p>

        <div className="bg-muted/50 p-4 rounded-md">
          <h3 className="font-medium mb-2">Electronic Ballot Benefits:</h3>
          <ul className="space-y-1 text-sm">
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Faster voting process</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Accessibility features for voters with disabilities</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Immediate confirmation of your vote</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Prevents accidental invalid votes</span>
            </li>
          </ul>
        </div>

        <div className="flex items-center justify-center p-6 border-2 border-dashed border-muted-foreground/20 rounded-md">
          <FileText className="h-16 w-16 text-primary/50" />
        </div>
      </div>
    )
  }

  const renderPaperBallot = () => {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          A paper ballot will be printed for you. You can mark your choices and submit it at the ballot box.
        </p>

        <div className="bg-muted/50 p-4 rounded-md">
          <h3 className="font-medium mb-2">Paper Ballot Benefits:</h3>
          <ul className="space-y-1 text-sm">
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Physical record of your vote</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>No technical knowledge required</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Verifiable paper audit trail</span>
            </li>
          </ul>
        </div>

        <div className="flex items-center justify-center p-6 border-2 border-dashed border-muted-foreground/20 rounded-md">
          <Printer className="h-16 w-16 text-primary/50" />
        </div>
      </div>
    )
  }

  const renderIssuedBallot = () => {
    return (
      <div className="space-y-4">
        <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 p-4 rounded-md flex items-start gap-3">
          <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-green-800 dark:text-green-300 mb-1">Ballot Successfully Issued</h3>
            <p className="text-sm text-green-700 dark:text-green-400">
              Your ballot has been {issuanceMethod === "electronic" ? "issued electronically" : "printed"} and is ready
              for use.
            </p>
          </div>
        </div>

        <div className="bg-muted p-4 rounded-md">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="font-medium">Ballot ID:</div>
            <div>{ballotId}</div>

            <div className="font-medium">Issued On:</div>
            <div>{new Date().toLocaleString()}</div>

            <div className="font-medium">Ballot Type:</div>
            <div className="capitalize">{issuanceMethod}</div>

            <div className="font-medium">Elections:</div>
            <div>{voterPrecinct.elections.length}</div>
          </div>
        </div>

        {issuanceMethod === "electronic" ? (
          <div className="flex justify-center">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Download QR Code
            </Button>
          </div>
        ) : (
          <p className="text-sm text-center text-muted-foreground">
            Please collect your printed ballot from the printer and proceed to a voting booth.
          </p>
        )}
      </div>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Ballot Issuance</CardTitle>
        <CardDescription>Review your information and choose your ballot type</CardDescription>
      </CardHeader>
      <CardContent>
        {isIssued ? (
          renderIssuedBallot()
        ) : (
          <>
            {renderVoterInformation()}

            <Separator className="my-6" />

            <h3 className="text-sm font-medium mb-4">Select Ballot Type</h3>

            <Tabs
              defaultValue="electronic"
              onValueChange={(value) => setIssuanceMethod(value as "electronic" | "paper")}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="electronic">Electronic</TabsTrigger>
                <TabsTrigger value="paper">Paper</TabsTrigger>
              </TabsList>
              <TabsContent value="electronic" className="mt-0">
                {renderElectronicBallot()}
              </TabsContent>
              <TabsContent value="paper" className="mt-0">
                {renderPaperBallot()}
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        {!isIssued ? (
          <Button onClick={issueBallot} disabled={isIssuing} className="gap-2">
            {isIssuing ? "Issuing..." : "Issue Ballot"}
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button className="gap-2">
            Continue to Voting
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

