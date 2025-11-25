'use client';

import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  targetTimestamp: number; // Unix timestamp in seconds
  onComplete?: () => void;
}

export function CountdownTimer({ targetTimestamp, onComplete }: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = Math.floor(Date.now() / 1000);
      const remaining = targetTimestamp - now;
      
      if (remaining <= 0) {
        setTimeRemaining(0);
        if (!isComplete) {
          setIsComplete(true);
          onComplete?.();
        }
      } else {
        setTimeRemaining(remaining);
      }
    };

    // Initial calculation
    calculateTimeRemaining();

    // Update every second
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [targetTimestamp, isComplete, onComplete]);

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return { days, hours, minutes, seconds: secs };
  };

  const time = formatTime(timeRemaining);
  const progress = targetTimestamp > 0 
    ? Math.max(0, Math.min(100, ((Date.now() / 1000 - (targetTimestamp - timeRemaining)) / timeRemaining) * 100))
    : 0;

  if (isComplete) {
    return (
      <div className="text-center space-y-4 animate-in fade-in zoom-in-95 duration-500">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 text-green-500 animate-pulse">
          <svg
            className="w-8 h-8"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-green-600 dark:text-green-400">
            Recovery Ready!
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            You can now reclaim your wallet
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Display */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Days', value: time.days },
          { label: 'Hours', value: time.hours },
          { label: 'Minutes', value: time.minutes },
          { label: 'Seconds', value: time.seconds },
        ].map((unit, index) => (
          <div
            key={unit.label}
            className="bg-secondary/50 backdrop-blur-sm rounded-2xl p-4 text-center animate-in fade-in slide-in-from-bottom-3 duration-500"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="text-3xl font-bold tabular-nums">
              {unit.value.toString().padStart(2, '0')}
            </div>
            <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wide">
              {unit.label}
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Waiting Period</span>
          <span className="text-muted-foreground tabular-nums">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Estimated Completion */}
      <div className="text-center text-sm text-muted-foreground">
        Recovery available at{' '}
        <span className="font-medium text-foreground">
          {new Date(targetTimestamp * 1000).toLocaleString()}
        </span>
      </div>
    </div>
  );
}
