"use client"

import { useState } from "react"
import { ArrowDownIcon, SettingsIcon, InfoIcon, ArrowRight, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const tokens = [
  { symbol: "ETH", name: "Ethereum", balance: "2.5", price: 2500, icon: "/ethereum-abstract.png" },
  { symbol: "USDC", name: "USD Coin", balance: "5000", price: 1, icon: "/usdc-coins.png" },
  { symbol: "MATIC", name: "Polygon", balance: "1500", price: 0.85, icon: "/abstract-polygon.png" },
  { symbol: "ARB", name: "Arbitrum", balance: "800", price: 1.2, icon: "/arbitrum-abstract.png" },
]

export default function SwapPage() {
  const [fromToken, setFromToken] = useState("ETH")
  const [toToken, setToToken] = useState("USDC")
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [slippage, setSlippage] = useState(0.5)
  const [isLoading, setIsLoading] = useState(false)

  const fromTokenData = tokens.find((t) => t.symbol === fromToken)
  const toTokenData = tokens.find((t) => t.symbol === toToken)

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value)
    if (value && fromTokenData && toTokenData) {
      const calculatedAmount = (Number.parseFloat(value) * fromTokenData.price) / toTokenData.price
      setToAmount(calculatedAmount.toFixed(6))
    } else {
      setToAmount("")
    }
  }

  const handleSwapTokens = () => {
    const tempToken = fromToken
    setFromToken(toToken)
    setToToken(tempToken)
    const tempAmount = fromAmount
    setFromAmount(toAmount)
    setToAmount(tempAmount)
  }

  const handleMaxAmount = () => {
    if (fromTokenData) {
      handleFromAmountChange(fromTokenData.balance)
    }
  }

  const handleSwap = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    setFromAmount("")
    setToAmount("")
  }

  const exchangeRate = fromTokenData && toTokenData ? (fromTokenData.price / toTokenData.price).toFixed(6) : "0"
  const estimatedGasFee = "0.0023"

  return (
    <>
    <div className="max-w-md mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Swap</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
              <SettingsIcon className="size-5" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Swap Settings</DialogTitle>
              <DialogDescription>Adjust your swap preferences</DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Slippage Tolerance</Label>
                  <span className="text-sm font-medium">{slippage}%</span>
                </div>
                <Slider
                  value={[slippage]}
                  onValueChange={(value) => setSlippage(value[0] as number)}
                  min={0.1}
                  max={5}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex gap-2">
                  {[0.5, 1, 3].map((val) => (
                    <Button 
                        key={val} 
                        variant={slippage === val ? "default" : "outline"} 
                        size="sm" 
                        onClick={() => setSlippage(val)}
                        className="flex-1"
                    >
                      {val}%
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm ring-1 ring-border/50 overflow-visible">
        <CardContent className="pt-6 space-y-1">
          
          {/* From Token Section */}
          <div className="relative bg-muted/30 rounded-2xl border border-transparent focus-within:border-primary/20 focus-within:bg-muted/50 transition-all p-4 space-y-3">
             <div className="flex justify-between text-xs font-medium text-muted-foreground">
                <span>From</span>
                <span>Balance: {fromTokenData?.balance}</span>
             </div>
             <div className="flex items-center gap-3">
                <Input
                  type="number"
                  placeholder="0.0"
                  value={fromAmount}
                  onChange={(e) => handleFromAmountChange(e.target.value)}
                  className="text-3xl font-bold bg-transparent border-none shadow-none p-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/30 w-full"
                />
                <Select value={fromToken} onValueChange={setFromToken}>
                  <SelectTrigger className="h-9 w-fit gap-2 border-none bg-background shadow-sm rounded-full px-3 focus:ring-0 min-w-[100px]">
                    <div className="flex items-center gap-2">
                      <div className="size-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                          {fromToken[0]}
                      </div>
                      <span className="font-semibold text-sm">{fromToken}</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent align="end">
                    {tokens.map((token) => (
                      <SelectItem key={token.symbol} value={token.symbol}>
                        <div className="flex items-center gap-2">
                          <span>{token.symbol}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                    ${fromAmount && fromTokenData ? (parseFloat(fromAmount) * fromTokenData.price).toFixed(2) : "0.00"}
                </span>
                <Button variant="ghost" size="icon" onClick={handleMaxAmount} className="h-auto p-0 text-xs text-primary hover:bg-transparent hover:text-primary/80">
                  MAX
                </Button>
             </div>
          </div>

          {/* Swap Button */}
          <div className="relative h-4 z-10">
             <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handleSwapTokens} 
                    className="rounded-full size-10 border-4 border-background shadow-sm bg-muted hover:bg-muted-foreground/10"
                >
                  <ArrowDownIcon className="size-4" />
                </Button>
             </div>
          </div>

          {/* To Token Section */}
          <div className="relative bg-muted/30 rounded-2xl border border-transparent focus-within:border-primary/20 focus-within:bg-muted/50 transition-all p-4 space-y-3">
             <div className="flex justify-between text-xs font-medium text-muted-foreground">
                <span>To</span>
                <span>Balance: {toTokenData?.balance}</span>
             </div>
             <div className="flex items-center gap-3">
                <Input
                  type="number"
                  placeholder="0.0"
                  value={toAmount}
                  readOnly
                  className="text-3xl font-bold bg-transparent border-none shadow-none p-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/30 w-full text-muted-foreground"
                />
                <Select value={toToken} onValueChange={setToToken}>
                  <SelectTrigger className="h-9 w-fit gap-2 border-none bg-background shadow-sm rounded-full px-3 focus:ring-0 min-w-[100px]">
                    <div className="flex items-center gap-2">
                      <div className="size-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                          {toToken[0]}
                      </div>
                      <span className="font-semibold text-sm">{toToken}</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent align="end">
                    {tokens.map((token) => (
                      <SelectItem key={token.symbol} value={token.symbol}>
                        <div className="flex items-center gap-2">
                          <span>{token.symbol}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                    ${toAmount && toTokenData ? (parseFloat(toAmount) * toTokenData.price).toFixed(2) : "0.00"}
                </span>
             </div>
          </div>

          {/* Details Accordion */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="details" className="border-none">
              <AccordionTrigger className="text-xs text-muted-foreground py-3 hover:no-underline">
                 <div className="flex items-center gap-1">
                    <InfoIcon className="size-3" />
                    <span>1 {fromToken} = {exchangeRate} {toToken}</span>
                 </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 text-xs text-muted-foreground px-1 pb-2">
                  <div className="flex justify-between">
                    <span>Network Fee</span>
                    <span>~${(parseFloat(estimatedGasFee) * 2500).toFixed(2)} ({estimatedGasFee} ETH)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price Impact</span>
                    <span className="text-green-500">~0.05%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Minimum Received</span>
                    <span>{(parseFloat(toAmount || "0") * (1 - slippage / 100)).toFixed(6)} {toToken}</span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

        </CardContent>
        <CardFooter className="pb-6">
          <Button 
            className="w-full h-12 text-base font-semibold rounded-xl shadow-lg shadow-primary/20" 
            size="lg" 
            disabled={!fromAmount || Number.parseFloat(fromAmount) <= 0 || isLoading}
            onClick={handleSwap}
          >
            {isLoading ? (
                <>
                    <RefreshCw className="mr-2 size-4 animate-spin" />
                    Swapping...
                </>
            ) : !fromAmount ? (
                "Enter Amount"
            ) : (
                "Swap Tokens"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
    </>
  )
}
