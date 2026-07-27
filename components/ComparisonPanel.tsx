'use client';

import Link from 'next/link';
import { X, GitCompare, ArrowRight } from 'lucide-react';
import { useComparison } from '../contexts/ComparisonContext';
import { Button } from '@/components/ui/button';

export default function ComparisonPanel() {
  const { selection, removeHost, clearAll } = useComparison();

  if (selection.length === 0) {
    return null;
  }

  const canCompare = selection.length >= 2;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-md shadow-[0_-8px_32px_rgba(0,0,0,0.4)] animate-in slide-in-from-bottom"
      role="region"
      aria-label="Host comparison tray"
    >
      <div className="mx-auto flex max-w-[1200px] items-center gap-4 px-4 py-2.5 sm:px-6">
        <div className="flex items-center gap-2">
          <GitCompare className="size-4 text-accent" />
          <span className="text-sm font-medium text-foreground">
            {canCompare
              ? `Comparing ${selection.length} hosts`
              : 'Add 1 more host to compare'}
          </span>
        </div>

        <div className="flex flex-1 items-center gap-2 overflow-x-auto">
          {selection.map((host) => (
            <div
              key={host.id}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-secondary/40 px-2.5 py-1 text-xs"
            >
              <span className="flex size-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-primary-foreground">
                {host.name.charAt(0).toUpperCase()}
              </span>
              <span className="max-w-[100px] truncate font-medium text-foreground sm:max-w-[120px]">
                {host.name}
              </span>
              <button
                type="button"
                onClick={() => removeHost(host.id)}
                className="ml-0.5 rounded-full p-0.5 text-muted-foreground hover:text-destructive"
                aria-label={`Remove ${host.name} from comparison`}
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
          {selection.length < 4 && Array.from({ length: Math.min(1, 4 - selection.length) }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-dashed border-border/50 px-2.5 py-1 text-xs text-muted-foreground/60"
            >
              <span className="flex size-5 items-center justify-center rounded-full bg-border text-[10px]">+</span>
              <span>Add a host</span>
            </div>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {canCompare && (
            <Button asChild size="sm">
              <Link href="/compare">
                Compare now
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          )}
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-destructive" onClick={clearAll}>
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}
