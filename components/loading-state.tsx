'use client';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function LoadingState() {
  return (
    <div className="flex justify-start">
      <Card className="w-full max-w-md border-border bg-card p-6">
        <div className="space-y-4">
          {/* Scanning header */}
          <div className="flex items-center gap-3">
            <div className="relative h-8 w-8">
              <svg
                className="absolute inset-0 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="12" cy="12" r="10" className="stroke-muted-foreground/20" strokeWidth="2" />
                <path
                  d="M12 2a10 10 0 0 1 8.66 5"
                  className="stroke-primary"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="flex-1">
              <Skeleton className="h-5 w-24" />
            </div>
          </div>

          {/* URL display skeleton */}
          <div className="space-y-2 rounded-lg bg-muted/30 p-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>

          {/* Confidence bar skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-2 w-full rounded-full" />
          </div>

          {/* Details skeleton */}
          <div className="space-y-2 border-t border-border pt-3">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-36" />
          </div>
        </div>
      </Card>
    </div>
  );
}
