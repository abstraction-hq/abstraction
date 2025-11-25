"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import {
  MoonIcon,
  SunIcon,
  MonitorIcon,
  CheckIcon,
  MailIcon,
  MessageSquareIcon,
  KeyIcon,
  GlobeIcon,
  ShieldCheckIcon,
  BellIcon,
  UserIcon,
  LogOutIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RecoveryPasswordSection } from "@/components/dashboard/recovery-password-section"


export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [language, setLanguage] = useState("en")
  const [emailNotifications, setEmailNotifications] = useState(false)
  const [telegramNotifications, setTelegramNotifications] = useState(false)
  const [email, setEmail] = useState("")
  const [telegramUsername, setTelegramUsername] = useState("")
  const [recoveryEmail, setRecoveryEmail] = useState("")

  const handleSaveNotifications = () => {
    toast.success("Notification settings saved successfully")
  }

  const handleSaveRecovery = () => {
    toast.success("Recovery email updated successfully")
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your preferences, security, and notifications.</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 h-auto w-full md:w-auto grid grid-cols-3 md:inline-flex">
          <TabsTrigger value="general" className="h-9 px-2 md:px-6 gap-2 text-xs md:text-sm rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
             <UserIcon className="size-3 md:size-4" /> <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="h-9 px-2 md:px-6 gap-2 text-xs md:text-sm rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
             <ShieldCheckIcon className="size-3 md:size-4" /> <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="h-9 px-2 md:px-6 gap-2 text-xs md:text-sm rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
             <BellIcon className="size-3 md:size-4" /> <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
           <div className="grid gap-6 md:grid-cols-2">
             {/* Appearance */}
             <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
               <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                    <MonitorIcon className="size-5 text-primary" /> Appearance
                 </CardTitle>
                 <CardDescription>Customize how your wallet looks</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                 <div className="space-y-3">
                   <Label>Theme</Label>
                   <div className="grid grid-cols-3 gap-3">
                     <Button
                       variant={theme === "light" ? "default" : "outline"}
                       className="justify-start h-auto py-3 flex-col gap-2"
                       onClick={() => setTheme("light")}
                     >
                       <SunIcon className="size-6" />
                       Light
                     </Button>
                     <Button
                       variant={theme === "dark" ? "default" : "outline"}
                       className="justify-start h-auto py-3 flex-col gap-2"
                       onClick={() => setTheme("dark")}
                     >
                       <MoonIcon className="size-6" />
                       Dark
                     </Button>
                     <Button
                       variant={theme === "system" ? "default" : "outline"}
                       className="justify-start h-auto py-3 flex-col gap-2"
                       onClick={() => setTheme("system")}
                     >
                       <MonitorIcon className="size-6" />
                       System
                     </Button>
                   </div>
                 </div>
               </CardContent>
             </Card>

             {/* Language */}
             <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
               <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                    <GlobeIcon className="size-5 text-primary" /> Language
                 </CardTitle>
                 <CardDescription>Choose your preferred language</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                 <div className="space-y-2">
                   <Label htmlFor="language">Display Language</Label>
                   <Select value={language} onValueChange={setLanguage}>
                     <SelectTrigger id="language" className="h-11">
                       <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="en">English</SelectItem>
                       <SelectItem value="es">Español</SelectItem>
                       <SelectItem value="fr">Français</SelectItem>
                       <SelectItem value="de">Deutsch</SelectItem>
                       <SelectItem value="ja">日本語</SelectItem>
                       <SelectItem value="zh">中文</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
               </CardContent>
             </Card>
           </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
           <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
             <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  <ShieldCheckIcon className="size-5 text-primary" /> Security & Recovery
               </CardTitle>
               <CardDescription>Manage your wallet security and recovery options</CardDescription>
             </CardHeader>
             <CardContent className="space-y-6">
               <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/30">
                 <div className="space-y-0.5">
                   <div className="flex items-center gap-2">
                      <Label className="text-base">Passkey Authentication</Label>
                      <Badge variant="secondary" className="gap-1 bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20">
                        <KeyIcon className="size-3" />
                        Active
                      </Badge>
                   </div>
                   <p className="text-sm text-muted-foreground">Your wallet is secured with biometric passkey</p>
                 </div>
                 <Button variant="outline">Manage</Button>
               </div>

               <Separator />

               <div className="space-y-4">
                 <div className="space-y-1">
                    <Label htmlFor="recovery-email">Recovery Email</Label>
                    <p className="text-sm text-muted-foreground">
                      Add a recovery email to restore access if you lose your passkey
                    </p>
                 </div>
                 <div className="flex gap-3">
                   <Input
                     id="recovery-email"
                     type="email"
                     placeholder="your.email@example.com"
                     value={recoveryEmail}
                     onChange={(e) => setRecoveryEmail(e.target.value)}
                     className="h-11"
                   />
                   <Button onClick={handleSaveRecovery} className="h-11 px-6">Save</Button>
                 </div>
               </div>
             </CardContent>
           </Card>

            {/* Recovery Password Card */}
            <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <KeyIcon className="size-5 text-primary" /> Recovery Password
                </CardTitle>
                <CardDescription>
                  Set a password to recover your wallet if you lose access to your passkey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecoveryPasswordSection />
              </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
           <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
             <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  <BellIcon className="size-5 text-primary" /> Notification Preferences
               </CardTitle>
               <CardDescription>Configure how you receive wallet notifications</CardDescription>
             </CardHeader>
             <CardContent className="space-y-8">
               {/* Email Notifications */}
               <div className="space-y-4">
                 <div className="flex items-center justify-between">
                   <div className="space-y-0.5">
                     <div className="flex items-center gap-2">
                       <MailIcon className="size-4 text-muted-foreground" />
                       <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
                     </div>
                     <p className="text-sm text-muted-foreground">Receive transaction alerts via email</p>
                   </div>
                   <Switch id="email-notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                 </div>

                 {emailNotifications && (
                   <div className="pl-6 border-l-2 border-muted ml-2">
                     <div className="space-y-2">
                       <Label htmlFor="email">Email Address</Label>
                       <Input
                         id="email"
                         type="email"
                         placeholder="your.email@example.com"
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                         className="max-w-md"
                       />
                     </div>
                   </div>
                 )}
               </div>

               <Separator />

               {/* Telegram Notifications */}
               <div className="space-y-4">
                 <div className="flex items-center justify-between">
                   <div className="space-y-0.5">
                     <div className="flex items-center gap-2">
                       <MessageSquareIcon className="size-4 text-muted-foreground" />
                       <Label htmlFor="telegram-notifications" className="text-base">Telegram Notifications</Label>
                     </div>
                     <p className="text-sm text-muted-foreground">Get instant alerts on Telegram</p>
                   </div>
                   <Switch
                     id="telegram-notifications"
                     checked={telegramNotifications}
                     onCheckedChange={setTelegramNotifications}
                   />
                 </div>

                 {telegramNotifications && (
                   <div className="pl-6 border-l-2 border-muted ml-2">
                     <div className="space-y-2">
                       <Label htmlFor="telegram">Telegram Username</Label>
                       <Input
                         id="telegram"
                         type="text"
                         placeholder="@username"
                         value={telegramUsername}
                         onChange={(e) => setTelegramUsername(e.target.value)}
                         className="max-w-md"
                       />
                       <p className="text-xs text-muted-foreground">
                         Start a chat with @AbstractionWalletBot to receive notifications
                       </p>
                     </div>
                   </div>
                 )}
               </div>

               <div className="pt-4">
                  <Button onClick={handleSaveNotifications} className="w-full md:w-auto">
                    Save Notification Settings
                  </Button>
               </div>
             </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
