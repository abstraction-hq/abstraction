"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Send, History, Settings, LogOut, Wallet, ArrowRightLeft, TrendingUp } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { useSmartAccount } from "@/hooks/useSmartAccount"

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useSmartAccount()

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Wallet className="size-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">Abstraction</span>
        </Link>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Wallet</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard"}>
                  <Link href="/dashboard">
                    <LayoutDashboard />
                    <span>Overview</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard/send"}>
                  <Link href="/dashboard/send">
                    <Send />
                    <span>Send Assets</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard/swap"}>
                  <Link href="/dashboard/swap">
                    <ArrowRightLeft />
                    <span>Swap</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard/earn"}>
                  <Link href="/dashboard/earn">
                    <TrendingUp />
                    <span>Earn</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard/settings"}>
                  <Link href="/dashboard/settings">
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
          <Avatar className="size-8">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-sm font-medium">User</span>
            <span className="truncate text-xs text-muted-foreground">0x1234...5678</span>
          </div>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-muted-foreground hover:text-destructive" 
          onClick={() => {
            logout()
            router.push("/signin")
          }}
        >
          <LogOut className="mr-2 size-4" />
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
