"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowUpRight, ArrowDownLeft, ArrowRightLeft, TrendingUp, TrendingDown, ExternalLink, Plus, Wallet, Info, Loader2 } from "lucide-react"
import Link from "next/link"
import { useTokenBalances } from "@/hooks/use-token-balance"
import { useTransactions } from "@/hooks/use-transactions"
import { useSmartAccount } from "@/hooks/use-smart-account"
import { formatUnits } from "viem"
import { ReceiveModal } from "@/components/dashboard/receive-modal"
import { useState, useMemo, useEffect } from "react"

const formatDecimal = (v: string, max = 6) => {
  if (!v) return "";
  const cleaned = v.replace(/[^0-9.]/g, "");
  const [head, ...rest] = cleaned.split(".");
  const dec = rest.join("");
  return dec ? `${head}.${dec.slice(0, max)}` : head;
};

const formatUSD = (usd?: string) => {
  if (!usd) return "";
  const n = Number(usd);
  if (Number.isNaN(n)) return "";
  return n >= 1000
    ? `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    : `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
};

const formatTimestamp = (timestamp: Date) => {
  const now = new Date();
  const diff = now.getTime() - new Date(timestamp).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
};

export default function DashboardPage() {
  const { config, sendTransaction, estimateTransaction } = useSmartAccount();
  const walletAddress = config?.account?.address;

  const { balances, isLoading: balancesLoading } = useTokenBalances(walletAddress);
  const { transactions, isLoading: transactionsLoading } = useTransactions(walletAddress, 10);

  const [receiveModalOpen, setReceiveModalOpen] = useState(false)
  const [isAccountCreated, setIsAccountCreated] = useState(true)
  const [isDeploying, setIsDeploying] = useState(false)

  // Deploy Modal State
  const [deployModalOpen, setDeployModalOpen] = useState(false)
  const [deployGasFee, setDeployGasFee] = useState<bigint | null>(null)
  const [isEstimatingDeploy, setIsEstimatingDeploy] = useState(false)
  const [deployGasLimits, setDeployGasLimits] = useState<{
    preVerificationGas: bigint;
    verificationGasLimit: bigint;
    callGasLimit: bigint;
  } | null>(null)
  const [deployGasPriceState, setDeployGasPriceState] = useState<{
    maxFeePerGas?: bigint;
    maxPriorityFeePerGas?: bigint;
    gasPrice?: bigint;
  } | null>(null)

  const balanceChange = "+12.5%"
  const balanceChangeValue = parseFloat(balanceChange)
  const isPositiveChange = balanceChangeValue >= 0

  const totalUsdBalance = useMemo(() => {
    return balances.reduce((acc, token) => acc + (token.balanceInUsd || 0), 0)
  }, [balances])

  const assetAllocation = useMemo(() => {
    const eth = balances
      .filter(t => t.symbol === "ETH" || t.symbol === "WETH")
      .reduce((acc, t) => acc + (t.balanceInUsd || 0), 0)

    const stable = balances
      .filter(t => ["USDC", "USDT", "DAI", "FDUSD", "USDe"].includes(t.symbol))
      .reduce((acc, t) => acc + (t.balanceInUsd || 0), 0)

    const other = totalUsdBalance - eth - stable

    const data = [
      { label: "ETH", value: totalUsdBalance > 0 ? (eth / totalUsdBalance) * 100 : 0, color: "bg-blue-500" },
      { label: "Stablecoins", value: totalUsdBalance > 0 ? (stable / totalUsdBalance) * 100 : 0, color: "bg-green-500" },
      { label: "Others", value: totalUsdBalance > 0 ? (other / totalUsdBalance) * 100 : 0, color: "bg-purple-500" }
    ]

    return data.sort((a, b) => b.value - a.value)
  }, [balances, totalUsdBalance])

  useEffect(() => {
    const checkAccountCreated = async () => {
      if (!walletAddress || !config) return
      const code = await config.client.getCode({
        address: walletAddress,
      })
      if (!code) {
        setIsAccountCreated(false)
      } else {
        setIsAccountCreated(true)
      }
    }
    checkAccountCreated()
  }, [walletAddress, config])

  // Helper to get ETH price
  const ethToken = balances.find(t => t.symbol === "ETH")
  const ethPrice = useMemo(() => {
    if (!ethToken) return 0
    const balance = parseFloat(formatUnits(ethToken.balance || 0n, ethToken.decimals))
    if (balance === 0) return 0
    return (ethToken.balanceInUsd || 0) / balance
  }, [ethToken])

  const handleDeployClick = async () => {
    if (!walletAddress) return
    setDeployModalOpen(true)
    setIsEstimatingDeploy(true)

    try {
      const call = {
        to: walletAddress,
        value: 0n,
        data: "0x" as `0x`
      }

      const gas = await estimateTransaction([call])
      const gasPrice = await config?.client.estimateFeesPerGas()

      if (!gasPrice) throw new Error("Failed to get gas price")

      setDeployGasLimits({
        preVerificationGas: gas.preVerificationGas,
        verificationGasLimit: gas.verificationGasLimit,
        callGasLimit: gas.callGasLimit
      })

      setDeployGasPriceState({
        maxFeePerGas: gasPrice.maxFeePerGas,
        maxPriorityFeePerGas: gasPrice.maxPriorityFeePerGas,
        gasPrice: (gasPrice as any).gasPrice
      })

      const totalGasLimit = gas.preVerificationGas + gas.verificationGasLimit + gas.callGasLimit
      const feePerGas = gasPrice.maxFeePerGas || (gasPrice as any).gasPrice || 0n
      const estimatedFee = totalGasLimit * (feePerGas + (gasPrice.maxPriorityFeePerGas || 0n))

      setDeployGasFee(estimatedFee)
    } catch (e) {
      console.error("Failed to estimate deploy gas:", e)
      setDeployGasFee(null)
    } finally {
      setIsEstimatingDeploy(false)
    }
  }

  const confirmDeploy = async () => {
    if (!walletAddress || !deployGasLimits || !deployGasPriceState) return
    setIsDeploying(true)
    try {
      const hash = await sendTransaction([{
        to: walletAddress,
        value: 0n,
        data: "0x"
      }], {
        ...deployGasLimits,
        ...deployGasPriceState
      })
      console.log("Deploy transaction sent:", hash)
      setDeployModalOpen(false)
      // Wait for a bit or poll for receipt (simplified for now)
      await new Promise(resolve => setTimeout(resolve, 5000))
      setIsAccountCreated(true)
    } catch (e) {
      console.error("Failed to deploy account:", e)
    } finally {
      setIsDeploying(false)
    }
  }

  const deployFeeInUsd = deployGasFee
    ? (parseFloat(formatUnits(deployGasFee, 18)) * ethPrice).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    : "$0.00"

  const hasInsufficientEth = useMemo(() => {
    if (!deployGasFee || !ethToken) return false
    return deployGasFee > (ethToken.balance || 0n)
  }, [deployGasFee, ethToken])

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-8 px-4">
      {!isAccountCreated && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500">
              <Info className="size-5" />
            </div>
            <div>
              <h3 className="font-semibold text-yellow-500">Account Not Deployed</h3>
              <p className="text-sm text-yellow-500/80">Your smart account hasn't been deployed to the network yet.</p>
            </div>
          </div>
          <Button
            onClick={handleDeployClick}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
          >
            Deploy Account
          </Button>
        </div>
      )}

      <Dialog open={deployModalOpen} onOpenChange={setDeployModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deploy Smart Account</DialogTitle>
            <DialogDescription>
              Deploy your smart account to the blockchain to start using it. This requires a one-time network fee.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg border">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Info className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Estimated Cost</p>
                  <p className="text-xs text-muted-foreground">Network Fee</p>
                </div>
              </div>
              <div className="text-right">
                {isEstimatingDeploy ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="size-3 animate-spin text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Estimating...</span>
                  </div>
                ) : (
                  <>
                    <p className="font-semibold">{deployGasFee ? `${formatUnits(deployGasFee, 18).slice(0, 8)} ETH` : "Failed to estimate"}</p>
                    <p className="text-xs text-muted-foreground">{deployFeeInUsd}</p>
                  </>
                )}
              </div>
            </div>

            {hasInsufficientEth && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                <Info className="size-4 shrink-0" />
                <p>Insufficient ETH balance to cover the network fee.</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeployModalOpen(false)}>Cancel</Button>
            <Button
              onClick={confirmDeploy}
              disabled={isDeploying || isEstimatingDeploy || !deployGasFee || hasInsufficientEth}
            >
              {isDeploying ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Deploying...
                </>
              ) : (
                "Confirm Deploy"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hero Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className={`col-span-2 border-none shadow-xl bg-gradient-to-br from-primary/90 to-primary/70 text-primary-foreground overflow-hidden relative`}>
          <div className="absolute top-0 right-0 p-24 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <CardHeader className="pb-2">
            <CardDescription className="text-primary-foreground/80 font-medium">Total Balance</CardDescription>
            <CardTitle className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight break-all">{formatUSD(totalUsdBalance.toString())}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm mb-6">
              {/* <Badge
                variant="secondary"
                className={`${isPositiveChange
                  ? 'bg-green-500 text-green-100'
                  : 'bg-red-500 text-red-100'
                  } border-none backdrop-blur-md gap-1 px-2 py-0.5`}
              >
                {isPositiveChange ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                {balanceChange}
              </Badge>
              <span className="text-primary-foreground/70">from last month</span> */}
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <Button size="sm" variant="secondary" className="w-full font-semibold shadow-sm sm:h-11 sm:px-8" asChild>
                <Link href="/dashboard/send">
                  <ArrowUpRight className="mr-1 sm:mr-2 size-3 sm:size-4" />
                  Send
                </Link>
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="w-full font-semibold shadow-sm bg-white/10 hover:bg-white/20 text-white border-none backdrop-blur-sm sm:h-11 sm:px-8"
                onClick={() => setReceiveModalOpen(true)}
              >
                <ArrowDownLeft className="mr-1 sm:mr-2 size-3 sm:size-4" />
                Receive
              </Button>
              <Button size="sm" variant="secondary" className="w-full font-semibold shadow-sm bg-white/10 hover:bg-white/20 text-white border-none backdrop-blur-sm sm:h-11 sm:px-8" asChild>
                <Link href="/dashboard/swap">
                  <ArrowRightLeft className="mr-1 sm:mr-2 size-3 sm:size-4" />
                  Swap
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 lg:col-span-1 flex flex-col justify-center p-6 border-none shadow-lg bg-card/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Asset Allocation</h3>
            <Button variant="ghost" size="icon" className="size-8 rounded-full">
              <ExternalLink className="size-4 text-muted-foreground" />
            </Button>
          </div>

          <div className="space-y-6 w-full">
            {/* Progress Bar */}
            <div className="h-4 w-full rounded-full flex overflow-hidden bg-muted/30">
              {assetAllocation.map((item) => (
                item.value > 0 && <div key={item.label} className={`h-full ${item.color}`} style={{ width: `${item.value}%` }} />
              ))}
              {totalUsdBalance === 0 && <div className="h-full w-full bg-muted" />}
            </div>

            {/* Legend */}
            <div className="space-y-3">
              {assetAllocation.map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`size-3 rounded-full ${item.color}`} />
                    <span className="text-muted-foreground">{item.label}</span>
                  </div>
                  <span className="font-semibold">{item.value.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Tokens & History */}
      <Tabs defaultValue="tokens" className="w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4 sm:gap-0">
          <TabsList className="bg-muted/50 p-1 h-11 w-full sm:w-auto grid grid-cols-2 sm:flex">
            <TabsTrigger value="tokens" className="h-9 px-6 rounded-md">Assets</TabsTrigger>
            <TabsTrigger value="history" className="h-9 px-6 rounded-md">History</TabsTrigger>
          </TabsList>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground w-full sm:w-auto justify-start sm:justify-center">
            <Plus className="mr-2 size-4" /> Add Token
          </Button>
        </div>

        <TabsContent value="tokens" className="space-y-4">
          {balancesLoading ? (
            <div className="flex items-center justify-center p-12">
              <div className="flex flex-col items-center gap-3">
                <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground">Loading assets...</p>
              </div>
            </div>
          ) : balances.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="size-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <Wallet className="size-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">No Assets Found</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Your wallet doesn't have any tokens yet. Start by receiving some tokens.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {balances.map((token) => (
                <div
                  key={token.address}
                  className="group flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-muted/30 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                    <Avatar className="size-10 sm:size-12 border-2 border-background shadow-sm shrink-0">
                      <AvatarImage src={token.logoURI || "/placeholder.svg"} alt={token.name} />
                      <AvatarFallback className="font-bold">{token.symbol.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-base sm:text-lg truncate">{token.symbol}</p>
                        <Badge variant="outline" className="text-[10px] h-5 px-1.5 font-normal text-muted-foreground hidden sm:inline-flex">
                          {token.name}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground font-medium truncate">
                        {formatDecimal(formatUnits(token.balance || 0n, token.decimals), 5)} {token.symbol}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <p className="font-bold text-base sm:text-lg">{formatUSD(String(token.balanceInUsd) || "0")}</p>
                    {/* <div className="flex items-center justify-end gap-1">
                      {12.5 > 0 ? <TrendingUp className="size-3 text-green-500" /> : <TrendingDown className="size-3 text-red-500" />}
                      <p
                        className={`text-sm font-medium ${true ? "text-green-500" : "text-red-500"}`}
                      >
                        {12.5 > 0 ? `+${12.5}%` : `-12.5%`}
                      </p>
                    </div> */}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card className="border-none shadow-sm bg-transparent">
            <CardContent className="p-0">
              {transactionsLoading ? (
                <div className="flex items-center justify-center p-12">
                  <div className="flex flex-col items-center gap-3">
                    <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-muted-foreground">Loading transactions...</p>
                  </div>
                </div>
              ) : transactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <div className="size-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                    <Wallet className="size-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">No Transactions Yet</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Your transaction history will appear here once you start using your wallet.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.map((tx) => (
                    <div
                      key={tx._id}
                      className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                        <div
                          className={`flex size-10 items-center justify-center rounded-full shadow-sm shrink-0 ${tx.success
                            ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                            }`}
                        >
                          <ArrowUpRight className="size-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold capitalize text-base">
                            {tx.success ? 'Transaction' : 'Failed'}
                          </p>
                          <p className="text-sm text-muted-foreground truncate font-mono">
                            {tx.txHash.slice(0, 10)}...{tx.txHash.slice(-8)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-2">
                        <p className="font-bold text-sm">
                          Block #{tx.blockNumber}
                        </p>
                        <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground font-medium">
                          <span>{formatTimestamp(tx.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Receive Modal */}
      <ReceiveModal
        open={receiveModalOpen}
        onOpenChange={setReceiveModalOpen}
        address={walletAddress}
      />
    </div>
  )
}
