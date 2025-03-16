"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { QrCode, ExternalLink, Loader2 } from "lucide-react"

interface TelegramInstructions {
  step1: string
  step2: string
  step3: string
  step4: string
  botLink: string
}

export function TelegramSetupGuide() {
  const [instructions, setInstructions] = useState<TelegramInstructions | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchInstructions() {
      try {
        const response = await fetch("/api/auth/telegram-instructions")
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to load Telegram setup instructions")
        }

        setInstructions(data.instructions)
      } catch (err) {
        console.error("Error fetching Telegram instructions:", err)
        setError(err instanceof Error ? err.message : "Failed to load instructions")
      } finally {
        setIsLoading(false)
      }
    }

    fetchInstructions()
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 flex justify-center items-center min-h-[200px]">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </CardContent>
      </Card>
    )
  }

  if (error || !instructions) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Telegram Setup</CardTitle>
          <CardDescription>There was a problem loading the setup instructions</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {error || "Telegram bot information is not available. Please try again later."}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Telegram Setup Guide</CardTitle>
        <CardDescription>Follow these steps to receive verification codes via Telegram</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-primary/10 p-4">
            <QrCode className="h-10 w-10 text-primary" />
          </div>
        </div>

        <ol className="list-decimal pl-5 space-y-3">
          <li className="text-sm">
            <span className="font-medium">{instructions.step1}</span>
          </li>
          <li className="text-sm">
            <span className="font-medium">{instructions.step2}</span>
          </li>
          <li className="text-sm">
            <span className="font-medium">{instructions.step3}</span>
          </li>
          <li className="text-sm">
            <span className="font-medium">{instructions.step4}</span>
          </li>
        </ol>
      </CardContent>
      <CardFooter>
        <Button className="w-full gap-2" onClick={() => window.open(instructions.botLink, "_blank")}>
          Open Telegram Bot <ExternalLink className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

