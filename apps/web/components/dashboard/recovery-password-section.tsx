'use client';

import { useState } from 'react';
import { EyeIcon, EyeOffIcon, KeyRoundIcon, AlertCircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useRecovery } from '@/hooks/use-recovery';
import { PasswordStrength } from '@/components/recovery/password-strength';

export function RecoveryPasswordSection() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hasRecoveryPassword, setHasRecoveryPassword] = useState(false); // TODO: Check from contract

  const { setRecoveryPassword, loading, validatePasswordStrength } = useRecovery();
  const strength = validatePasswordStrength(password);

  const handleSave = async () => {
    if (!strength.isValid) {
      toast.error('Password does not meet requirements');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      await setRecoveryPassword(password);
      toast.success('Recovery password set successfully');
      setPassword('');
      setConfirmPassword('');
      setHasRecoveryPassword(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to set recovery password');
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Badge */}
      {hasRecoveryPassword ? (
        <div className="flex items-center gap-3 p-4 rounded-xl border bg-green-500/5 border-green-500/20">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <KeyRoundIcon className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">Recovery Password Active</span>
              <Badge variant="secondary" className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20">
                Enabled
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              You can recover your wallet if you lose your passkey
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3 p-4 rounded-xl border bg-orange-500/5 border-orange-500/20">
          <AlertCircleIcon className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <span className="font-medium text-sm">No Recovery Password Set</span>
            <p className="text-xs text-muted-foreground mt-0.5">
              Set a recovery password to regain access if you lose your device
            </p>
          </div>
        </div>
      )}

      {/* Password Input */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="recovery-password">
            {hasRecoveryPassword ? 'Update' : 'Set'} Recovery Password
          </Label>
          <div className="relative">
            <Input
              id="recovery-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 pr-10"
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
        </div>

        {/* Password Strength */}
        {password && <PasswordStrength password={password} strength={strength} />}

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-11 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOffIcon className="w-4 h-4" />
              ) : (
                <EyeIcon className="w-4 h-4" />
              )}
            </button>
          </div>
          {confirmPassword && password !== confirmPassword && (
            <p className="text-xs text-red-500 animate-in fade-in slide-in-from-top-1 duration-200">
              Passwords do not match
            </p>
          )}
        </div>
      </div>

      {/* Save Button */}
      <Button
        onClick={handleSave}
        disabled={!password || !confirmPassword || password !== confirmPassword || !strength.isValid || loading}
        className="w-full h-11"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
            Setting Password...
          </>
        ) : (
          <>{hasRecoveryPassword ? 'Update' : 'Set'} Recovery Password</>
        )}
      </Button>

      {/* Help Text */}
      <p className="text-xs text-muted-foreground text-center">
        This password is hashed and stored securely onchain. Never share it with anyone.
      </p>
    </div>
  );
}
