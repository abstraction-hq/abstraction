'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { EyeIcon, EyeOffIcon, KeyRoundIcon, ArrowLeftIcon, ShieldCheckIcon, ClockIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useRecovery } from '@/hooks/use-recovery';
import { createWebAuthnCredential } from 'viem/account-abstraction';

export default function RecoverPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'password' | 'passkey' | 'processing'>('password');
  const [newPasskeyId, setNewPasskeyId] = useState<string>('');

  const { initiateRecovery, loading } = useRecovery();

  const handlePasswordSubmit = async () => {
    if (!password) {
      toast.error('Please enter your recovery password');
      return;
    }

    try {
      // Move to passkey creation step
      setStep('passkey');
    } catch (error) {
      toast.error('Invalid recovery password');
    }
  };

  const handleCreatePasskey = async () => {
    try {
      setStep('processing');
      
      // Create new passkey
      const credential = await createWebAuthnCredential({
        name: 'Recovered Wallet',
      });

      setNewPasskeyId(credential.id);

      // Initiate recovery process
      await initiateRecovery(password, credential.id);

      toast.success('Recovery initiated successfully');
      router.push('/reclaim');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to initiate recovery');
      setStep('passkey');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/20">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Back Button */}
        <Link href="/signin">
          <Button variant="ghost" className="mb-4 gap-2">
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Sign In
          </Button>
        </Link>

        {/* Main Card */}
        <Card className="border-none shadow-2xl bg-card/80 backdrop-blur-xl">
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center">
              <ShieldCheckIcon className="w-8 h-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Recover Your Wallet</CardTitle>
              <CardDescription className="mt-2">
                Use your recovery password to regain access
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Password Step */}
            {step === 'password' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-2">
                  <Label htmlFor="recovery-password">Recovery Password</Label>
                  <div className="relative">
                    <Input
                      id="recovery-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your recovery password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                      className="h-12 pr-10"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOffIcon className="w-4 h-4" />
                      ) : (
                        <EyeIcon className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This is the password you set in your wallet settings
                  </p>
                </div>

                <Button
                  onClick={handlePasswordSubmit}
                  className="w-full h-12"
                  disabled={!password || loading}
                >
                  Continue
                </Button>
              </div>
            )}

            {/* Passkey Creation Step */}
            {step === 'passkey' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-4 p-4 rounded-xl bg-muted/50 border">
                  <div className="flex items-start gap-3">
                    <KeyRoundIcon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1 space-y-1">
                      <h4 className="font-medium text-sm">Create New Passkey</h4>
                      <p className="text-xs text-muted-foreground">
                        You'll need to create a new passkey to secure your recovered wallet
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
                  <div className="flex items-start gap-3">
                    <ClockIcon className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 space-y-1">
                      <h4 className="font-medium text-sm">Waiting Period</h4>
                      <p className="text-xs text-muted-foreground">
                        After creating your passkey, there will be a waiting period before you can reclaim your wallet. 
                        This security measure protects against unauthorized access.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleCreatePasskey}
                  className="w-full h-12"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    'Create New Passkey'
                  )}
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => setStep('password')}
                  className="w-full"
                  disabled={loading}
                >
                  Back
                </Button>
              </div>
            )}

            {/* Processing Step */}
            {step === 'processing' && (
              <div className="py-8 text-center space-y-4 animate-in fade-in zoom-in-95 duration-500">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
                <div>
                  <h4 className="font-medium">Initiating Recovery...</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Please wait while we process your request
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Help Text */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have a recovery password?{' '}
          <Link href="/signin" className="text-primary hover:underline">
            Try another method
          </Link>
        </p>
      </div>
    </div>
  );
}
