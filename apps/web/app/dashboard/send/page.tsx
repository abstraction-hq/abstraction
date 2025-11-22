"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Send, Wallet, CheckCircle2, ArrowRight, Info, ChevronDown, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Mock tokens for selection
const tokens = [
  { id: "eth", symbol: "ETH", name: "Ethereum", balance: "2.5", price: 2450.50, icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png" },
  { id: "usdc", symbol: "USDC", name: "USD Coin", balance: "1500.00", price: 1.00, icon: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png" },
  { id: "matic", symbol: "MATIC", name: "Polygon", balance: "850.00", price: 0.85, icon: "https://cryptologos.cc/logos/polygon-matic-logo.png" },
  { id: "arb", symbol: "ARB", name: "Arbitrum", balance: "320.00", price: 1.12, icon: "https://cryptologos.cc/logos/arbitrum-arb-logo.png" },
]

export default function SendPage() {
  const router = useRouter()
  const [step, setStep] = useState<"input" | "confirm" | "success">("input")
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    recipient: "",
    amount: "",
    token: "eth",
  })

  const selectedToken = tokens.find((t) => t.id === formData.token) || tokens[0]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleMaxAmount = () => {
    handleInputChange("amount", selectedToken.balance)
  }

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.recipient || !formData.amount) return
    setStep("confirm")
  }

  const handleSend = async () => {
    setIsLoading(true)
    // Simulate transaction delay
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    setStep("success")
  }

  const resetForm = () => {
    setFormData({ recipient: "", amount: "", token: "eth" })
    setStep("input")
  }

  // Calculate fiat value
  const fiatValue = formData.amount ? (parseFloat(formData.amount) * selectedToken.price).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : "$0.00"

  return (
    <div className="max-w-md mx-auto py-8 px-4">
      {/* Header Navigation */}
      <div className="mb-6 flex items-center">
        <Button variant="ghost" size="icon" asChild className="mr-2 rounded-full hover:bg-muted">
          <Link href="/dashboard">
            <ArrowLeft className="size-5" />
          </Link>
        </Button>
        <h1 className="text-xl font-bold">Send Assets</h1>
      </div>

      <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm ring-1 ring-border/50">
        {step === "input" && (
          <form onSubmit={handleReview}>
            <CardContent className="pt-6 space-y-6">
              
              {/* Amount Input Section */}
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold ml-1">Amount</Label>
                <div className="relative bg-muted/30 rounded-2xl border border-transparent focus-within:border-primary/20 focus-within:bg-muted/50 transition-all p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => handleInputChange("amount", e.target.value)}
                      className="text-4xl font-bold bg-transparent border-none shadow-none p-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/50 w-full"
                      step="any"
                      min="0"
                      autoFocus
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground font-medium">{fiatValue}</span>
                    <div className="flex items-center gap-2">
                       <Button 
                        type="button" 
                        variant="secondary" 
                        size="xs" 
                        onClick={handleMaxAmount}
                        className="h-6 text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 border-none"
                      >
                        MAX
                      </Button>
                      <Select value={formData.token} onValueChange={(value) => handleInputChange("token", value)}>
                        <SelectTrigger className="h-8 w-fit gap-2 border-none bg-background shadow-sm rounded-full px-3 focus:ring-0">
                          <div className="flex items-center gap-2">
                            {/* Fallback icon if image fails or for mock */}
                            <div className="size-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                                {selectedToken.symbol[0]}
                            </div>
                            <span className="font-semibold text-sm">{selectedToken.symbol}</span>
                          </div>
                        </SelectTrigger>
                        <SelectContent align="end">
                          {tokens.map((token) => (
                            <SelectItem key={token.id} value={token.id}>
                              <div className="flex items-center justify-between w-[200px] gap-2">
                                <div className="flex items-center gap-2">
                                  <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                      {token.symbol[0]}
                                  </div>
                                  <div className="flex flex-col items-start text-xs">
                                    <span className="font-semibold">{token.symbol}</span>
                                    <span className="text-muted-foreground">{token.name}</span>
                                  </div>
                                </div>
                                <span className="text-xs font-mono">{token.balance}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end px-1">
                   <span className="text-xs text-muted-foreground">Balance: {selectedToken.balance} {selectedToken.symbol}</span>
                </div>
              </div>

              {/* Recipient Input Section */}
              <div className="space-y-2">
                <Label htmlFor="recipient" className="text-muted-foreground text-xs uppercase tracking-wider font-semibold ml-1">Recipient</Label>
                <div className="relative">
                  <Input
                    id="recipient"
                    placeholder="0x..."
                    value={formData.recipient}
                    onChange={(e) => handleInputChange("recipient", e.target.value)}
                    className="pl-10 h-12 font-mono bg-muted/30 border-transparent focus-visible:bg-background focus-visible:border-primary/20 transition-all rounded-xl"
                  />
                  <Wallet className="absolute left-3 top-3.5 size-5 text-muted-foreground/70" />
                </div>
              </div>

            </CardContent>
            <CardFooter className="pb-6 pt-2">
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold rounded-xl shadow-md shadow-primary/20" 
                size="lg"
                disabled={!formData.amount || !formData.recipient}
              >
                Review Transaction
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </CardFooter>
          </form>
        )}

        {step === "confirm" && (
          <>
            <CardHeader className="pb-2">
              <CardTitle className="text-center text-xl">Review Transaction</CardTitle>
              <CardDescription className="text-center">Double check the details below</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
              
              <div className="flex flex-col items-center py-4 space-y-2">
                 <div className="text-4xl font-bold tracking-tight">
                    {formData.amount} <span className="text-2xl text-muted-foreground font-medium">{selectedToken.symbol}</span>
                 </div>
                 <Badge variant="outline" className="px-3 py-1 text-sm font-normal bg-muted/50">
                    {fiatValue}
                 </Badge>
              </div>

              <div className="space-y-4 rounded-2xl border bg-muted/20 p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">To</span>
                  <div className="flex items-center gap-2">
                    <div className="size-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
                    <span className="font-mono text-sm font-medium truncate max-w-[140px]">{formData.recipient}</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Network</span>
                  <div className="flex items-center gap-2">
                     <div className="size-2 rounded-full bg-green-500" />
                     <span className="text-sm font-medium">Ethereum Mainnet</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                     <span className="text-sm text-muted-foreground">Network Fee</span>
                     <Info className="size-3 text-muted-foreground" />
                  </div>
                  <div className="text-right">
                     <div className="text-sm font-medium">~0.0004 ETH</div>
                     <div className="text-xs text-muted-foreground">$0.85</div>
                  </div>
                </div>
              </div>

            </CardContent>
            <CardFooter className="flex gap-3 pb-6">
              <Button variant="outline" className="flex-1 h-12 rounded-xl border-transparent bg-muted/50 hover:bg-muted" onClick={() => setStep("input")}>
                Back
              </Button>
              <Button className="flex-[2] h-12 rounded-xl shadow-lg shadow-primary/20" onClick={handleSend} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 size-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 size-5" />
                    Confirm Send
                  </>
                )}
              </Button>
            </CardFooter>
          </>
        )}

        {step === "success" && (
          <div className="text-center py-6">
            <CardContent className="space-y-6 pt-2">
              <div className="flex justify-center">
                <div className="relative">
                   <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse" />
                   <div className="relative rounded-full bg-green-100 p-4 dark:bg-green-900/30">
                     <CheckCircle2 className="size-16 text-green-600 dark:text-green-400" />
                   </div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Transaction Sent!</h3>
                <p className="text-muted-foreground max-w-[260px] mx-auto">
                  Your transaction has been successfully submitted to the network.
                </p>
              </div>
              
              <div className="rounded-xl border p-4 bg-muted/30 text-left space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-medium">{formData.amount} {selectedToken.symbol}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Recipient</span>
                  <span className="font-mono text-xs truncate max-w-[180px]">{formData.recipient}</span>
                </div>
              </div>

              <Button variant="link" className="text-primary h-auto p-0" asChild>
                 <Link href="#" target="_blank">View on Block Explorer</Link>
              </Button>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 pb-6">
              <Button className="w-full h-12 rounded-xl" onClick={resetForm}>
                Send Another
              </Button>
              <Button variant="ghost" className="w-full h-12 rounded-xl" asChild>
                <Link href="/dashboard">Return to Dashboard</Link>
              </Button>
            </CardFooter>
          </div>
        )}
      </Card>
    </div>
  )
}
