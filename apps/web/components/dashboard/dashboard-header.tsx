"use client"

import { Bell, Copy, Check, ChevronDown, Settings, LogOut, User, Moon, Sun, Search, X, Wallet } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useSmartAccount } from "@/hooks/useSmartAccount"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function DashboardHeader() {
  const router = useRouter()
  const { logout } = useSmartAccount()
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const config = useSmartAccount().config
  const fullAddress = config?.account.address || "0x"
  const address = fullAddress.slice(0, 6) + "..." + fullAddress.slice(-4)

  useEffect(() => {
    setMounted(true)
  }, [])

  const copyAddress = () => {
    navigator.clipboard.writeText(fullAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleLogout = () => {
    logout()
    router.push("/signin")
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center gap-4 border-b bg-background px-6">
      <SidebarTrigger className="hidden md:flex" />
      <div className="flex items-center gap-2 md:hidden">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Wallet className="size-5" />
        </div>
        <span className="text-lg font-bold tracking-tight">Abstraction</span>
      </div>
      
      {/* Mobile Search Overlay */}
      {isSearchOpen ? (
        <div className="absolute inset-0 z-50 flex items-center bg-background px-4 md:hidden">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tokens, pools..."
              className="w-full bg-muted/50 pl-9 pr-10"
              autoFocus
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full hover:bg-transparent"
              onClick={() => setIsSearchOpen(false)}
            >
              <X className="size-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold md:text-xl hidden sm:block">Dashboard</h1>
            
            {/* Desktop Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tokens, pools..."
                className="w-[200px] lg:w-[300px] bg-muted/50 pl-9"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Mobile Search Trigger */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="size-5 text-muted-foreground" />
            </Button>

            {/* Network Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hidden gap-2 md:flex bg-transparent">
                  <div className="size-2 rounded-full bg-green-500" />
                  <span>Ethereum</span>
                  <ChevronDown className="size-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Select Network</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2">
                  <div className="size-2 rounded-full bg-green-500" />
                  Ethereum
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <div className="size-2 rounded-full bg-purple-500" />
                  Polygon
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <div className="size-2 rounded-full bg-blue-500" />
                  Arbitrum
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Address Pill */}
            <div className="hidden items-center gap-2 rounded-full border bg-muted/50 px-3 py-1.5 text-sm md:flex">
              <span className="font-mono text-muted-foreground">{address}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full hover:bg-background"
                onClick={copyAddress}
              >
                {copied ? <Check className="size-3 text-green-500" /> : <Copy className="size-3 text-muted-foreground" />}
                <span className="sr-only">Copy address</span>
              </Button>
            </div>

            {/* Theme Toggle Button */}
            {mounted && (
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                <Sun className="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            )}

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="size-5 text-muted-foreground" />
              <span className="absolute top-2 right-2 size-2 rounded-full bg-primary" />
              <span className="sr-only">Notifications</span>
            </Button>

            {/* Account Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="size-8">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">My Account</p>
                    <p className="text-xs text-muted-foreground font-mono">{address}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 size-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 size-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 size-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}
    </header>
  )
}

