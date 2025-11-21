"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowUpRight, ArrowDownLeft, ArrowRightLeft, TrendingUp, TrendingDown, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useSmartAccount } from "@/hooks/useSmartAccount"
import { useTokenBalances } from "@/hooks/use-token-balance"
import { formatUnits, parseUnits, zeroAddress } from "viem"

// Mock data
const mockTokens = [
  {
    id: 1,
    symbol: "ETH",
    name: "Ethereum",
    balance: "2.5",
    value: "$4,250.00",
    change: "+5.2%",
    changePositive: true,
    icon: "/ethereum-abstract.png",
  },
  {
    id: 2,
    symbol: "USDC",
    name: "USD Coin",
    balance: "1,500.00",
    value: "$1,500.00",
    change: "+0.1%",
    changePositive: true,
    icon: "/usdc-coins.png",
  },
  {
    id: 3,
    symbol: "MATIC",
    name: "Polygon",
    balance: "850.00",
    value: "$680.00",
    change: "-2.3%",
    changePositive: false,
    icon: "/abstract-polygon.png",
  },
  {
    id: 4,
    symbol: "ARB",
    name: "Arbitrum",
    balance: "320.00",
    value: "$384.00",
    change: "+8.1%",
    changePositive: true,
    icon: "/arbitrum-abstract.png",
  },
]

const mockTransactions = [
  {
    id: 1,
    type: "send",
    token: "ETH",
    amount: "-0.5",
    value: "-$850.00",
    to: "0x742d...4e8a",
    timestamp: "2 hours ago",
    status: "completed",
  },
  {
    id: 2,
    type: "receive",
    token: "USDC",
    amount: "+500.00",
    value: "+$500.00",
    from: "0x9f3c...2b1d",
    timestamp: "5 hours ago",
    status: "completed",
  },
  {
    id: 3,
    type: "swap",
    token: "MATIC",
    amount: "200.00 → 0.1 ETH",
    value: "$160.00",
    timestamp: "1 day ago",
    status: "completed",
  },
  {
    id: 4,
    type: "send",
    token: "ARB",
    amount: "-50.00",
    value: "-$60.00",
    to: "0x1a2b...9c8d",
    timestamp: "2 days ago",
    status: "completed",
  },
  {
    id: 5,
    type: "receive",
    token: "ETH",
    amount: "+1.0",
    value: "+$1,700.00",
    from: "0x5e6f...3a4b",
    timestamp: "3 days ago",
    status: "completed",
  },
]

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

export default function DashboardPage() {
  const { balances } = useTokenBalances("0x2239ECcB0d91c0C648b36b967Bb1ef38C5b2B13D")
  
  const balanceChange = "+12.5%"

  console.log("Token Balances:", balances)

  const totalUsdBalance = balances.reduce((acc, token) => acc + (token.balanceInUsd || 0), 0)

  return (
    <div className="flex flex-col gap-6">
      {/* Balance Overview */}
      <Card>
        <CardHeader>
          <CardDescription>Total Balance</CardDescription>
          <div className="flex items-end justify-between">
            <CardTitle className="text-4xl font-bold">{formatUSD(totalUsdBalance.toString())}</CardTitle>
            <div className="flex items-center gap-2">
              <Button size="sm" asChild>
                <Link href="/dashboard/send">
                  <ArrowUpRight className="size-4" />
                  Send
                </Link>
              </Button>
              <Button size="sm" variant="outline" className="bg-transparent">
                <ArrowDownLeft className="size-4" />
                Receive
              </Button>
              <Button size="sm" variant="outline" className="bg-transparent">
                <ArrowRightLeft className="size-4" />
                Swap
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm">
            <Badge variant={balanceChange.startsWith("+") ? "default" : "destructive"} className="gap-1">
              {balanceChange.startsWith("+") ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
              {balanceChange}
            </Badge>
            <span className="text-muted-foreground">from last month</span>
          </div>
        </CardContent>
      </Card>

      {/* Tokens & History */}
      <Tabs defaultValue="tokens" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="tokens">Tokens</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="tokens" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Assets</CardTitle>
              <CardDescription>Manage your crypto tokens across all networks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {balances.map((token) => (
                  <div
                    key={token.address}
                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="size-10">
                        <AvatarImage src={token.logoURI || "/placeholder.svg"} alt={token.name} />
                        <AvatarFallback>{token.symbol.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{token.symbol}</p>
                          <Badge variant="outline" className="text-xs">
                            {token.name}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatDecimal(formatUnits(token.balance || 0n, token.decimals), 5)} {token.symbol}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatUSD(String(token.balanceInUsd) || "0")}</p>
                      <p
                        className={`text-sm ${true ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                      >
                        {12.5 > 0 ? `+${12.5}%` : `-12.5%`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>View all your recent transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex size-10 items-center justify-center rounded-full ${
                          tx.type === "send"
                            ? "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400"
                            : tx.type === "receive"
                              ? "bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400"
                              : "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
                        }`}
                      >
                        {tx.type === "send" && <ArrowUpRight className="size-5" />}
                        {tx.type === "receive" && <ArrowDownLeft className="size-5" />}
                        {tx.type === "swap" && <ArrowRightLeft className="size-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold capitalize">{tx.type}</p>
                          <Badge variant="outline" className="text-xs">
                            {tx.token}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {tx.type === "send" && `To ${tx.to}`}
                          {tx.type === "receive" && `From ${tx.from}`}
                          {tx.type === "swap" && tx.amount}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${
                          tx.type === "send"
                            ? "text-red-600 dark:text-red-400"
                            : tx.type === "receive"
                              ? "text-green-600 dark:text-green-400"
                              : "text-foreground"
                        }`}
                      >
                        {tx.type !== "swap" ? tx.amount : tx.value}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{tx.timestamp}</span>
                        <Button variant="ghost" size="icon" className="size-4 hover:bg-transparent">
                          <ExternalLink className="size-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

