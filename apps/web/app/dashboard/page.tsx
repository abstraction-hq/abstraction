"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowUpRight, ArrowDownLeft, ArrowRightLeft, TrendingUp, TrendingDown, ExternalLink, Plus, Wallet } from "lucide-react"
import Link from "next/link"
import { useTokenBalances } from "@/hooks/use-token-balance"
import { formatUnits } from "viem"

// Mock data
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
  const totalUsdBalance = balances.reduce((acc, token) => acc + (token.balanceInUsd || 0), 0)

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-8 px-4">
      
      {/* Hero Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2 border-none shadow-xl bg-gradient-to-br from-primary/90 to-primary/70 text-primary-foreground overflow-hidden relative">
           <div className="absolute top-0 right-0 p-24 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
           <CardHeader className="pb-2">
             <CardDescription className="text-primary-foreground/80 font-medium">Total Balance</CardDescription>
             <CardTitle className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight break-all">{formatUSD(totalUsdBalance.toString())}</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="flex items-center gap-2 text-sm mb-6">
               <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-md gap-1 px-2 py-0.5">
                 <TrendingUp className="size-3" />
                 {balanceChange}
               </Badge>
               <span className="text-primary-foreground/70">from last month</span>
             </div>
             
             <div className="grid grid-cols-3 gap-2 sm:gap-3">
               <Button size="sm" variant="secondary" className="w-full font-semibold shadow-sm sm:h-11 sm:px-8" asChild>
                 <Link href="/dashboard/send">
                   <ArrowUpRight className="mr-1 sm:mr-2 size-3 sm:size-4" />
                   Send
                 </Link>
               </Button>
               <Button size="sm" variant="secondary" className="w-full font-semibold shadow-sm bg-white/10 hover:bg-white/20 text-white border-none backdrop-blur-sm sm:h-11 sm:px-8">
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
              <div className="h-4 w-full rounded-full flex overflow-hidden">
                 <div className="h-full bg-blue-500 w-[55%]" />
                 <div className="h-full bg-green-500 w-[30%]" />
                 <div className="h-full bg-purple-500 w-[15%]" />
              </div>

              {/* Legend */}
              <div className="space-y-3">
                 <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                       <div className="size-3 rounded-full bg-blue-500" />
                       <span className="text-muted-foreground">ETH</span>
                    </div>
                    <span className="font-semibold">55%</span>
                 </div>
                 <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                       <div className="size-3 rounded-full bg-green-500" />
                       <span className="text-muted-foreground">Stablecoins</span>
                    </div>
                    <span className="font-semibold">30%</span>
                 </div>
                 <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                       <div className="size-3 rounded-full bg-purple-500" />
                       <span className="text-muted-foreground">Others</span>
                    </div>
                    <span className="font-semibold">15%</span>
                 </div>
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
                   <div className="flex items-center justify-end gap-1">
                      {12.5 > 0 ? <TrendingUp className="size-3 text-green-500" /> : <TrendingDown className="size-3 text-red-500" />}
                      <p
                        className={`text-sm font-medium ${true ? "text-green-500" : "text-red-500"}`}
                      >
                        {12.5 > 0 ? `+${12.5}%` : `-12.5%`}
                      </p>
                   </div>
                 </div>
               </div>
             ))}
           </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
           <Card className="border-none shadow-sm bg-transparent">
             <CardContent className="p-0">
               <div className="space-y-3">
                 {mockTransactions.map((tx) => (
                   <div
                     key={tx.id}
                     className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-muted/30 transition-colors"
                   >
                     <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                       <div
                         className={`flex size-10 items-center justify-center rounded-full shadow-sm shrink-0 ${
                           tx.type === "send"
                             ? "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                             : tx.type === "receive"
                               ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                               : "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                         }`}
                       >
                         {tx.type === "send" && <ArrowUpRight className="size-5" />}
                         {tx.type === "receive" && <ArrowDownLeft className="size-5" />}
                         {tx.type === "swap" && <ArrowRightLeft className="size-5" />}
                       </div>
                       <div className="min-w-0">
                         <p className="font-semibold capitalize text-base">{tx.type}</p>
                         <p className="text-sm text-muted-foreground truncate">
                           {tx.type === "send" && `To ${tx.to}`}
                           {tx.type === "receive" && `From ${tx.from}`}
                           {tx.type === "swap" && tx.amount}
                         </p>
                       </div>
                     </div>
                     <div className="text-right shrink-0 ml-2">
                       <p
                         className={`font-bold ${
                           tx.type === "send"
                             ? "text-red-600 dark:text-red-400"
                             : tx.type === "receive"
                               ? "text-green-600 dark:text-green-400"
                               : "text-foreground"
                         }`}
                       >
                         {tx.type !== "swap" ? tx.amount : tx.value}
                       </p>
                       <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground font-medium">
                         <span>{tx.timestamp}</span>
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
