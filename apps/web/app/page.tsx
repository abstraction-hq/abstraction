import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShieldCheckIcon, KeyIcon, ZapIcon, LockIcon, ArrowRightIcon, WalletIcon, TrendingUp, Github } from 'lucide-react'
import { AntigravityBackground } from '@/components/ui/background'

export default function LandingPage() {
  return (
    <div className="min-h-screen relative">
      <AntigravityBackground />
      {/* Header */}
      <header className="border-b bg-background/40 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center size-10 rounded-lg bg-primary text-primary-foreground">
              <WalletIcon className="size-6" />
            </div>
            <span className="text-xl font-bold">Openpass Wallet</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#security" className="text-sm font-medium hover:text-primary transition-colors">
              Security
            </Link>
            <Link href="#about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <Badge variant="secondary" className="text-sm">
            Bank-Grade Security &bull; Account Abstraction
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance">
            Store, Save, and Earn with <span className="text-primary">Bank-Grade Security</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            The first crypto wallet with <strong>Password Recovery</strong>. No seed phrases, no anxiety. Just secure, simple, and powerful asset management.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link href="/signup">
                Start Earning Now
                <ArrowRightIcon className="ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
              <Link href="#features">Explore Features</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Why Choose Openpass Wallet?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the next generation of crypto security with features designed for everyone
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center size-12 rounded-lg bg-primary/10 text-primary mb-4">
                  <WalletIcon className="size-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Store & Save</h3>
                <p className="text-muted-foreground">
                  Securely store your digital assets with bank-grade encryption. Your savings, protected by the best technology.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center size-12 rounded-lg bg-chart-3/10 text-chart-3 mb-4">
                  <TrendingUp className="size-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Earn Yield</h3>
                <p className="text-muted-foreground">
                  Put your crypto to work. Earn passive income on your assets directly from your wallet with verified protocols.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center size-12 rounded-lg bg-accent/10 text-accent mb-4">
                  <ShieldCheckIcon className="size-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Password Recovery</h3>
                <p className="text-muted-foreground">
                  <strong>First in the world.</strong> Forget your password? No problem. Recover your account without needing a seed phrase.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center size-12 rounded-lg bg-chart-4/10 text-chart-4 mb-4">
                  <KeyIcon className="size-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Passkey Security</h3>
                <p className="text-muted-foreground">
                  Login with your face or fingerprint. No more passwords to remember, just secure biometric authentication.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center size-12 rounded-lg bg-chart-5/10 text-chart-5 mb-4">
                  <LockIcon className="size-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Bank-Grade Protection</h3>
                <p className="text-muted-foreground">
                  Built on Account Abstraction smart contracts, audited by top firms to ensure your funds are always safe.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center size-12 rounded-lg bg-primary/10 text-primary mb-4">
                  <Github className="size-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Fully Open Source</h3>
                <p className="text-muted-foreground">
                  Transparency is key. Our code is fully open source and verifiable by anyone. Built by the community, for the community.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="secondary">Bank-Grade Security</Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Your Assets, Protected by the Best
              </h2>
              <p className="text-lg text-muted-foreground">
                Openpass Wallet combines account abstraction with passkey technology to create the most secure and user-friendly crypto wallet experience.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="flex items-center justify-center size-6 rounded-full bg-primary/10 text-primary mt-0.5">
                    <ShieldCheckIcon className="size-4" />
                  </div>
                  <div>
                    <p className="font-medium">Hardware-Level Security</p>
                    <p className="text-sm text-muted-foreground">Passkeys leverage your device's secure enclave (FaceID, TouchID) for maximum protection.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex items-center justify-center size-6 rounded-full bg-primary/10 text-primary mt-0.5">
                    <ShieldCheckIcon className="size-4" />
                  </div>
                  <div>
                    <p className="font-medium">Smart Contract Audited</p>
                    <p className="text-sm text-muted-foreground">Our account abstraction contracts are audited by leading security firms.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex items-center justify-center size-6 rounded-full bg-primary/10 text-primary mt-0.5">
                    <ShieldCheckIcon className="size-4" />
                  </div>
                  <div>
                    <p className="font-medium">Social Recovery</p>
                    <p className="text-sm text-muted-foreground">Recover your wallet through trusted guardians if you lose access. Never lose your funds again.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 via-accent/20 to-chart-3/20 p-8 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                  <ShieldCheckIcon className="size-48 text-primary relative z-10" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Ready to Experience the Future?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of users who have already made the switch to secure, passwordless crypto management.
          </p>
          <Button size="lg" asChild>
            <Link href="/signup">
              Create Your Wallet Now
              <ArrowRightIcon className="ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center size-8 rounded-lg bg-primary text-primary-foreground">
                  <WalletIcon className="size-5" />
                </div>
                <span className="font-bold">Openpass Wallet</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The next generation of crypto wallets, powered by account abstraction and passkeys.
              </p>
              <div className="flex gap-4">
                <Link href="https://github.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Github className="size-5" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="#security" className="hover:text-foreground transition-colors">Security</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Roadmap</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Documentation</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">API Reference</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Support</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#about" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Openpass Wallet. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
