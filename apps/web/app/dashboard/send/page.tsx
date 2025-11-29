"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Send, Wallet, CheckCircle2, ArrowRight, Info, ChevronDown, Loader2 } from "lucide-react"
import { Address, Call, encodeFunctionData, erc20Abi, formatUnits, isAddress, parseUnits, zeroAddress } from "viem"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useTokenBalances, TokenBalance } from "@/hooks/use-token-balance"
import { useSmartAccount } from "@/hooks/use-smart-account"

export default function SendPage() {
  const { config, estimateTransaction, sendTransaction } = useSmartAccount()
  const smartAccount = config?.account
  const { balances, isLoading: isBalancesLoading } = useTokenBalances(smartAccount?.address)

  const [step, setStep] = useState<"input" | "confirm" | "success">("input")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [gasLimits, setGasLimits] = useState<{
    preVerificationGas: bigint;
    verificationGasLimit: bigint;
    callGasLimit: bigint;
  } | null>(null)
  const [gasPriceState, setGasPriceState] = useState<{
    maxFeePerGas?: bigint;
    maxPriorityFeePerGas?: bigint;
    gasPrice?: bigint;
  } | null>(null)
  const [isEstimating, setIsEstimating] = useState(false)
  const [formData, setFormData] = useState({
    recipient: "",
    amount: "",
    token: "",
  })

  // Set default token when balances are loaded
  useEffect(() => {
    const defaultToken = balances[0]
    if (defaultToken && !formData.token) {
      setFormData(prev => ({ ...prev, token: defaultToken.address }))
    }
  }, [balances, formData.token])

  const selectedToken = balances.find((t) => t.address === formData.token) || (balances.length > 0 ? balances[0] : undefined)

  // Estimate gas when entering confirm step
  useEffect(() => {
    const estimateGas = async () => {
      if (step !== "confirm" || !formData.recipient || !formData.amount || !selectedToken) return

      setIsEstimating(true)
      try {
        let call: Call
        if (formData.token == zeroAddress) {
          call = {
            to: formData.recipient as Address,
            value: BigInt(parseUnits(formData.amount, selectedToken.decimals)),
            data: "0x",
          }
        } else {
          call = {
            to: formData.token as Address,
            data: encodeFunctionData({
              abi: erc20Abi,
              functionName: "transfer",
              args: [
                formData.recipient as Address,
                BigInt(parseUnits(formData.amount, selectedToken.decimals)),
              ],
            })
          }
        }
        const gas = await estimateTransaction([call])
        const gasPrice = await config?.client.estimateFeesPerGas()

        if (!gasPrice) {
          throw new Error("Failed to estimate gas price")
        }

        setGasLimits({
          preVerificationGas: gas.preVerificationGas,
          verificationGasLimit: gas.verificationGasLimit,
          callGasLimit: gas.callGasLimit
        })
        setGasPriceState({
          maxFeePerGas: gasPrice.maxFeePerGas,
          maxPriorityFeePerGas: gasPrice.maxPriorityFeePerGas,
          gasPrice: (gasPrice as any).gasPrice
        })
      } catch (e) {
        console.error("Gas estimation failed:", e)
        setError("Failed to estimate gas. Please try again.")
        setGasLimits(null)
        setGasPriceState(null)
      } finally {
        setIsEstimating(false)
      }
    }

    estimateGas()
  }, [step, formData, selectedToken, estimateTransaction, config])

  const gasFee = useMemo(() => {
    if (!gasLimits || !gasPriceState) return null
    const totalGasLimit = gasLimits.preVerificationGas + gasLimits.verificationGasLimit + gasLimits.callGasLimit
    const feePerGas = gasPriceState.maxFeePerGas || gasPriceState.gasPrice || 0n
    return totalGasLimit * (feePerGas + (gasPriceState.maxPriorityFeePerGas || 0n))
  }, [gasLimits, gasPriceState])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (field === "amount" || field === "recipient") setError(null)
  }

  const handleMaxAmount = () => {
    if (selectedToken) {
      handleInputChange("amount", formatUnits(selectedToken.balance || 0n, selectedToken.decimals))
    }
  }

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.recipient || !formData.amount || !selectedToken) return

    if (!isAddress(formData.recipient)) {
      setError("Invalid recipient address")
      return
    }

    try {
      const amount = parseUnits(formData.amount, selectedToken.decimals)
      if (amount > (selectedToken.balance || 0n)) {
        setError("Insufficient balance")
        return
      }
    } catch (e) {
      setError("Invalid amount")
      return
    }

    setError(null) // Clear any previous errors
    setStep("confirm")
  }

  const handleSend = async () => {
    if (!selectedToken || !gasLimits || !gasPriceState) return

    setIsLoading(true)
    setError(null)
    try {
      console.log("Sending transaction...", formData)

      let call: Call
      if (formData.token == zeroAddress) {
        call = {
          to: formData.recipient as Address,
          value: BigInt(parseUnits(formData.amount, selectedToken.decimals)),
          data: "0x",
        }
      } else {
        call = {
          to: formData.token as Address,
          data: encodeFunctionData({
            abi: erc20Abi,
            functionName: "transfer",
            args: [
              formData.recipient as Address,
              BigInt(parseUnits(formData.amount, selectedToken.decimals)),
            ],
          })
        }
      }

      const hash = await sendTransaction([call], {
        ...gasLimits,
        ...gasPriceState
      })

      console.log("Transaction sent:", hash)
      setStep("success")
    } catch (e) {
      console.error("Failed to send transaction:", e)
      setError("Failed to send transaction. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({ recipient: "", amount: "", token: balances[0]?.address || "" })
    setStep("input")
    setError(null)
  }

  // Calculate fiat value
  const fiatValue = formData.amount && selectedToken && selectedToken.balanceInUsd
    ? (parseFloat(formData.amount) * (selectedToken.balanceInUsd / parseFloat(formatUnits(selectedToken.balance || 0n, selectedToken.decimals) || "1"))).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    : "$0.00"

  // Helper to get token price (approximate from balanceInUsd / balance)
  const getTokenPrice = (token: TokenBalance) => {
    const balance = parseFloat(formatUnits(token.balance || 0n, token.decimals))
    if (balance === 0) return 0
    return (token.balanceInUsd || 0) / balance
  }

  const ethToken = balances.find(t => t.symbol === "ETH")
  const ethPrice = ethToken ? getTokenPrice(ethToken) : 0
  const gasFeeInUsd = gasFee ? (parseFloat(formatUnits(gasFee, 18)) * ethPrice).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : "$0.00"

  if (isBalancesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto py-8 px-4">
      {/* Header Navigation */}
      <div className="mb-6 flex items-center">
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
                      className="text-4xl font-bold bg-transparent border-none shadow-none p-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/50 w-full dark:bg-transparent"
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
                        size="sm"
                        onClick={handleMaxAmount}
                        className="h-6 text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 border-none"
                      >
                        MAX
                      </Button>
                      {selectedToken && (
                        <Select value={formData.token} onValueChange={(value) => handleInputChange("token", value)}>
                          <SelectTrigger className="h-8 w-fit gap-2 border-none bg-background shadow-sm rounded-full px-3 focus:ring-0">
                            <div className="flex items-center gap-2">
                              {selectedToken.logoURI ? (
                                <img src={selectedToken.logoURI} alt={selectedToken.symbol} className="size-5 rounded-full" />
                              ) : (
                                <div className="size-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                                  {selectedToken.symbol[0]}
                                </div>
                              )}
                              <span className="font-semibold text-sm">{selectedToken.symbol}</span>
                            </div>
                          </SelectTrigger>
                          <SelectContent align="end">
                            {balances.map((token) => (
                              <SelectItem key={token.address} value={token.address}>
                                <div className="flex items-center justify-between w-[200px] gap-2">
                                  <div className="flex items-center gap-2">
                                    {token.logoURI ? (
                                      <img src={token.logoURI} alt={token.symbol} className="size-6 rounded-full" />
                                    ) : (
                                      <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                        {token.symbol[0]}
                                      </div>
                                    )}
                                    <div className="flex flex-col items-start text-xs">
                                      <span className="font-semibold">{token.symbol}</span>
                                      <span className="text-muted-foreground">{token.name}</span>
                                    </div>
                                  </div>
                                  <span className="text-xs font-mono">
                                    {parseFloat(formatUnits(token.balance || 0n, token.decimals)).toFixed(4)}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between px-1">
                  {error && (
                    <span className="text-xs text-red-500 font-medium animate-in fade-in slide-in-from-top-1">
                      {error}
                    </span>
                  )}
                  <span className={cn("text-xs text-muted-foreground ml-auto", error && "text-red-500")}>
                    Balance: {selectedToken ? formatUnits(selectedToken.balance || 0n, selectedToken.decimals) : "0"} {selectedToken?.symbol}
                  </span>
                </div>
              </div>

              {/* Recipient Input Section */}
              <div className="space-y-2">
                <Label htmlFor="recipient" className="text-muted-foreground text-xs uppercase tracking-wider font-semibold ml-1">Recipient</Label>
                <div className="relative bg-muted/30 rounded-2xl border border-transparent focus-within:border-primary/20 focus-within:bg-muted/50 transition-all">
                  <Input
                    id="recipient"
                    placeholder="0x..."
                    value={formData.recipient}
                    onChange={(e) => handleInputChange("recipient", e.target.value)}
                    className="pl-10 h-12 font-mono bg-transparent border-none shadow-none focus-visible:ring-0 w-full dark:bg-transparent"
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
                disabled={!formData.amount || !formData.recipient || !selectedToken}
              >
                Review Transaction
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </CardFooter>
          </form>
        )}

        {step === "confirm" && selectedToken && (
          <>
            <CardHeader className="pb-2">
              <CardTitle className="text-center text-xl">Review Transaction</CardTitle>
              <CardDescription className="text-center">Double check the details below</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">

              <div className="flex flex-col items-center py-4 space-y-2">
                <div className="text-4xl font-bold tracking-tight">
                  {(() => {
                    if (!formData.amount) return "0"
                    const [integer, decimal] = formData.amount.split(".")
                    if (!decimal) return integer
                    return `${integer}.${decimal.slice(0, 6)}`
                  })()} <span className="text-2xl text-muted-foreground font-medium">{selectedToken.symbol}</span>
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
                    {isEstimating ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="size-3 animate-spin text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Estimating...</span>
                      </div>
                    ) : (
                      <>
                        <div className="text-sm font-medium">
                          {gasFee ? `~${formatUnits(gasFee, 18).slice(0, 8)} ETH` : "Failed to estimate"}
                        </div>
                        <div className="text-xs text-muted-foreground">{gasFeeInUsd}</div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {error && (
                <div className="text-sm text-red-500 font-medium text-center animate-in fade-in slide-in-from-top-1">
                  {error}
                </div>
              )}

            </CardContent>
            <CardFooter className="flex gap-3 pb-6">
              <Button variant="outline" className="flex-1 h-12 rounded-xl border-transparent bg-muted/50 hover:bg-muted" onClick={() => {
                setStep("input")
                setError(null)
              }}>
                Back
              </Button>
              <Button className="flex-[2] h-12 rounded-xl shadow-lg shadow-primary/20" onClick={handleSend} disabled={isLoading || isEstimating || !gasFee}>
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

        {step === "success" && selectedToken && (
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
