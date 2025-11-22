"use client"

import { useState } from "react"
import { 
  ArrowRightLeftIcon, 
  WalletIcon, 
  TrendingUpIcon, 
  ClockIcon, 
  ZapIcon, 
  ShieldCheckIcon, 
  InfoIcon,
  ChevronRightIcon,
  SearchIcon,
  FilterIcon
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

export default function EarnPage() {
  const [amount, setAmount] = useState("")
  
  return (
    <div className="max-w-5xl mx-auto space-y-8 py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Earn Yield</h1>
          <p className="text-muted-foreground mt-1">Deposit your assets into secure, audited protocols to earn APY.</p>
        </div>
        <div className="flex items-center gap-2">
           <Select defaultValue="ethereum">
            <SelectTrigger className="w-[160px] bg-background">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-green-500" />
                <SelectValue placeholder="Select Network" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ethereum">Ethereum</SelectItem>
              <SelectItem value="polygon">Polygon</SelectItem>
              <SelectItem value="arbitrum">Arbitrum</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="opportunities" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 h-auto w-full md:w-auto grid grid-cols-3 md:inline-flex">
          <TabsTrigger value="opportunities" className="h-9 px-2 md:px-6 text-xs md:text-sm rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">Opportunities</TabsTrigger>
          <TabsTrigger value="portfolio" className="h-9 px-2 md:px-6 text-xs md:text-sm rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">My Portfolio</TabsTrigger>
          <TabsTrigger value="activity" className="h-9 px-2 md:px-6 text-xs md:text-sm rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="opportunities" className="space-y-6">
          
          {/* Featured Opportunity */}
          <div className="grid md:grid-cols-3 gap-6">
             <Card className="md:col-span-2 border-none shadow-lg bg-gradient-to-br from-blue-600 to-indigo-700 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <CardHeader>
                  <div className="flex justify-between items-start">
                     <Badge className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-md">Featured Strategy</Badge>
                     <TrendingUpIcon className="text-white/80 size-6" />
                  </div>
                  <CardTitle className="text-3xl mt-2">Yearn USDT Vault</CardTitle>
                  <CardDescription className="text-blue-100 text-lg">Automated yield farming strategy for stablecoins.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-4 mt-4">
                   <div>
                      <div className="text-blue-200 text-sm font-medium">APY</div>
                      <div className="text-3xl font-bold">6.42%</div>
                   </div>
                   <div>
                      <div className="text-blue-200 text-sm font-medium">TVL</div>
                      <div className="text-xl font-semibold">$12.5M</div>
                   </div>
                   <div>
                      <div className="text-blue-200 text-sm font-medium">Risk</div>
                      <div className="text-xl font-semibold flex items-center gap-1">
                        <ShieldCheckIcon className="size-4" /> Low
                      </div>
                   </div>
                </CardContent>
                <CardFooter>
                   <Button variant="secondary" className="w-full sm:w-auto font-semibold" size="lg">
                      Deposit Now <ArrowRightLeftIcon className="ml-2 size-4" />
                   </Button>
                </CardFooter>
             </Card>

             <Card className="flex flex-col justify-center items-center text-center p-6 bg-muted/30 border-dashed">
                <div className="p-4 bg-background rounded-full shadow-sm mb-4">
                   <ZapIcon className="size-8 text-yellow-500" />
                </div>
                <h3 className="font-semibold text-lg">Boost Your Yield</h3>
                <p className="text-muted-foreground text-sm mt-2 mb-6">Stake your governance tokens to increase your APY by up to 2.5x.</p>
                <Button variant="outline">Learn More</Button>
             </Card>
          </div>

          {/* List of Vaults */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
               <h2 className="text-xl font-semibold">All Vaults</h2>
               <div className="flex gap-2">
                  <div className="relative">
                     <SearchIcon className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                     <Input placeholder="Search..." className="pl-9 w-[200px] h-9" />
                  </div>
                  <Button variant="outline" size="icon" className="h-9 w-9">
                     <FilterIcon className="size-4" />
                  </Button>
               </div>
            </div>

            <Card>
               <div className="divide-y">
                  {[1, 2, 3].map((i) => (
                     <div key={i} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-4">
                           <div className="flex -space-x-2">
                              <Avatar className="border-2 border-background size-10">
                                 <AvatarImage src="https://cryptologos.cc/logos/ethereum-eth-logo.png" />
                                 <AvatarFallback>ETH</AvatarFallback>
                              </Avatar>
                              <Avatar className="border-2 border-background size-10">
                                 <AvatarImage src="https://cryptologos.cc/logos/lido-dao-ldo-logo.png" />
                                 <AvatarFallback>LDO</AvatarFallback>
                              </Avatar>
                           </div>
                           <div>
                              <div className="font-semibold">stETH / ETH</div>
                              <div className="text-sm text-muted-foreground">Curve Finance</div>
                           </div>
                        </div>
                        <div className="grid grid-cols-3 gap-8 sm:gap-12 text-left sm:text-right flex-1 sm:flex-none">
                           <div>
                              <div className="text-xs text-muted-foreground sm:hidden">APY</div>
                              <div className="font-bold text-green-600">4.8%</div>
                           </div>
                           <div>
                              <div className="text-xs text-muted-foreground sm:hidden">TVL</div>
                              <div className="font-medium">$450M</div>
                           </div>
                           <div>
                              <div className="text-xs text-muted-foreground sm:hidden">My Balance</div>
                              <div className="font-medium text-muted-foreground">-</div>
                           </div>
                        </div>
                        <Button size="sm">Deposit</Button>
                     </div>
                  ))}
               </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="portfolio">
          <Card>
             <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                <div className="p-4 rounded-full bg-muted">
                   <WalletIcon className="size-10 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                   <h3 className="text-xl font-semibold">No Active Deposits</h3>
                   <p className="text-muted-foreground max-w-[300px] mx-auto">
                      You don't have any active deposits yet. Explore opportunities to start earning yield.
                   </p>
                </div>
                <Button onClick={() => document.querySelector('[value="opportunities"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }))}>
                   Explore Opportunities
                </Button>
             </div>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
           <Card>
             <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                <div className="p-4 rounded-full bg-muted">
                   <ClockIcon className="size-10 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                   <h3 className="text-xl font-semibold">No Activity Yet</h3>
                   <p className="text-muted-foreground max-w-[300px] mx-auto">
                      Your transaction history will appear here.
                   </p>
                </div>
             </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
