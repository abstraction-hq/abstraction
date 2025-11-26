"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, CheckCircle2, AlertTriangle } from "lucide-react"
import QRCodeSVG from "react-qr-code"
import { Address } from "viem"
import { useState } from "react"

interface ReceiveModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  address: Address | undefined
}

export function ReceiveModal({ open, onOpenChange, address }: ReceiveModalProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!address) return
    
    await navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!address) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Receive Funds</DialogTitle>
          <DialogDescription>
            Scan the QR code or copy your wallet address to receive funds
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-6 py-4">
          {/* QR Code */}
          <div className="p-4 bg-white rounded-xl shadow-sm border-2 border-muted">
            <QRCodeSVG 
              value={address} 
              size={200}
              level="H"
            />
          </div>

          {/* Wallet Address */}
          <div className="w-full space-y-3">
            <div className="flex items-center justify-between gap-2 p-3 rounded-lg bg-muted/50 border">
              <code className="text-xs sm:text-sm font-mono break-all flex-1">
                {address}
              </code>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 size-8"
                onClick={handleCopy}
              >
                {copied ? (
                  <CheckCircle2 className="size-4 text-green-500" />
                ) : (
                  <Copy className="size-4" />
                )}
              </Button>
            </div>

            {/* Network Warning */}
            <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
              <AlertTriangle className="size-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                  Important Notice
                </p>
                <p className="text-xs text-amber-800 dark:text-amber-200">
                  Only send assets on the <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-semibold">Ethereum Network</Badge> to this address. 
                  Sending assets from other networks may result in permanent loss of funds.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
