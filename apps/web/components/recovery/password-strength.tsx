'use client';

import { useEffect, useState } from 'react';
import type { RecoveryPasswordStrength } from '@/hooks/use-recovery';

interface PasswordStrengthProps {
  password: string;
  strength: RecoveryPasswordStrength;
}

export function PasswordStrength({ password, strength }: PasswordStrengthProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !password) return null;

  const getStrengthColor = () => {
    if (strength.score <= 1) return 'bg-red-500';
    if (strength.score === 2) return 'bg-orange-500';
    if (strength.score === 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthLabel = () => {
    if (strength.score <= 1) return 'Weak';
    if (strength.score === 2) return 'Fair';
    if (strength.score === 3) return 'Good';
    return 'Strong';
  };

  const getStrengthTextColor = () => {
    if (strength.score <= 1) return 'text-red-500';
    if (strength.score === 2) return 'text-orange-500';
    if (strength.score === 3) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Strength Meter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Password Strength</span>
          <span className={`font-medium ${getStrengthTextColor()}`}>
            {getStrengthLabel()}
          </span>
        </div>
        
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ease-out ${getStrengthColor()}`}
            style={{ width: `${(strength.score / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Feedback List */}
      {strength.feedback.length > 0 && (
        <div className="space-y-1.5">
          {strength.feedback.map((feedback, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-xs text-muted-foreground animate-in fade-in slide-in-from-left-1 duration-200"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
              <span>{feedback}</span>
            </div>
          ))}
        </div>
      )}

      {/* Success Message */}
      {strength.isValid && (
        <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 animate-in fade-in slide-in-from-bottom-1 duration-300">
          <svg
            className="w-4 h-4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-medium">Password meets all requirements</span>
        </div>
      )}
    </div>
  );
}
