'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheckIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  HomeIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useRecovery } from '@/hooks/use-recovery';
import { CountdownTimer } from '@/components/recovery/countdown-timer';

export default function ReclaimPage() {
  const router = useRouter();
  const [canReclaim, setCanReclaim] = useState(false);
  const [isReclaiming, setIsReclaiming] = useState(false);

  const { recoveryState, checkRecoveryStatus, reclaimWallet, cancelRecovery, loading } = useRecovery();

  useEffect(() => {
    // Check recovery status on mount
    checkRecoveryStatus();
  }, [checkRecoveryStatus]);

  const handleReclaim = async () => {
    try {
      setIsReclaiming(true);
      await reclaimWallet();
      toast.success('Wallet reclaimed successfully!');
      router.push('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to reclaim wallet');
      setIsReclaiming(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel the recovery? This will reset the waiting period.')) {
      return;
    }

    try {
      await cancelRecovery();
      toast.success('Recovery cancelled');
      router.push('/signin');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to cancel recovery');
    }
  };

  const handleCountdownComplete = () => {
    setCanReclaim(true);
  };

  // Show loading state while checking recovery status
  if (loading && recoveryState.status === 'none') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-sm text-muted-foreground">Checking recovery status...</p>
        </div>
      </div>
    );
  }

  // If no recovery in progress, redirect
  if (recoveryState.status === 'none') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <AlertTriangleIcon className="w-12 h-12 mx-auto text-orange-500" />
            <div>
              <h3 className="text-lg font-semibold">No Recovery in Progress</h3>
              <p className="text-sm text-muted-foreground mt-2">
                You don't have any pending wallet recovery
              </p>
            </div>
            <Link href="/recover">
              <Button className="w-full">Initiate Recovery</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/20">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-2xl relative">
        {/* Main Card */}
        <Card className="border-none shadow-2xl bg-card/80 backdrop-blur-xl">
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center">
              <ShieldCheckIcon className="w-8 h-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">
                {canReclaim || recoveryState.status === 'ready' ? 'Recovery Ready' : 'Recovery in Progress'}
              </CardTitle>
              <CardDescription className="mt-2">
                {canReclaim || recoveryState.status === 'ready'
                  ? 'You can now reclaim your wallet with your new passkey'
                  : 'Your wallet recovery has been initiated'}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Status Banner */}
            <div
              className={`p-6 rounded-2xl border ${
                canReclaim || recoveryState.status === 'ready'
                  ? 'bg-green-500/5 border-green-500/20'
                  : 'bg-blue-500/5 border-blue-500/20'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {canReclaim || recoveryState.status === 'ready' ? (
                    <CheckCircleIcon className="w-8 h-8 text-green-500" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {canReclaim || recoveryState.status === 'ready'
                        ? 'Waiting Period Complete'
                        : 'Security Waiting Period'}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {canReclaim || recoveryState.status === 'ready'
                        ? 'The security waiting period has elapsed. You can now reclaim your wallet.'
                        : 'This waiting period protects your wallet from unauthorized recovery attempts.'}
                    </p>
                  </div>
                  {recoveryState.walletAddress && (
                    <div className="mt-3 p-3 rounded-lg bg-background/50">
                      <p className="text-xs text-muted-foreground mb-1">Wallet Address</p>
                      <p className="font-mono text-sm break-all">{recoveryState.walletAddress}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Countdown Timer */}
            {!canReclaim && recoveryState.status === 'pending' && recoveryState.completionTime && (
              <div className="p-6 rounded-2xl bg-muted/30">
                <CountdownTimer
                  targetTimestamp={recoveryState.completionTime}
                  onComplete={handleCountdownComplete}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {(canReclaim || recoveryState.status === 'ready') && (
                <Button
                  onClick={handleReclaim}
                  className="w-full h-14 text-lg gap-2"
                  disabled={isReclaiming}
                  size="lg"
                >
                  {isReclaiming ? (
                    <>
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Reclaiming Wallet...
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="w-5 h-5" />
                      Reclaim Wallet
                    </>
                  )}
                </Button>
              )}

              {recoveryState.status === 'pending' && (
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="w-full h-12 gap-2"
                  disabled={loading || isReclaiming}
                >
                  <AlertTriangleIcon className="w-4 h-4" />
                  Cancel Recovery
                </Button>
              )}

              {(canReclaim || recoveryState.status === 'ready') && (
                <Link href="/signin">
                  <Button variant="ghost" className="w-full gap-2">
                    <HomeIcon className="w-4 h-4" />
                    Back to Sign In
                  </Button>
                </Link>
              )}
            </div>

            {/* Info Box */}
            <div className="p-4 rounded-xl bg-muted/30 border text-sm text-muted-foreground">
              <p className="leading-relaxed">
                <strong className="text-foreground">Security Note:</strong> The recovery waiting period is a critical 
                security feature. It gives you time to cancel unauthorized recovery attempts and keeps your wallet safe.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
