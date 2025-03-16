"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TelegramSetupGuide } from "@/components/telegram-setup-guide"

interface TelegramSetupModalProps {
  isOpen: boolean
  onClose: () => void
}

export function TelegramSetupModal({ isOpen, onClose }: TelegramSetupModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set Up Telegram Verification</DialogTitle>
          <DialogDescription>
            You need to connect your phone number with our Telegram bot to receive verification codes
          </DialogDescription>
        </DialogHeader>
        <TelegramSetupGuide />
      </DialogContent>
    </Dialog>
  )
}

