'use client';

import Link from 'next/link';
import { X, GitCompare, ArrowRight } from 'lucide-react';
import { useComparison } from '../contexts/ComparisonContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ComparisonPanel() {
  const { selection, removeHost, clearAll } = useComparison();

  if (selection.length === 0) return null;

  const canCompare = selection.length >= 2;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-lg max-w-[calc(100vw-2rem)]">
      <div className="flex items-center gap-2 shrink-0">
        <GitCompare size={15} className="text-accent" />
        <span className="text-sm font-medium whitespace-nowrap">
          {canCompare ? `Comparing ${selection.length} hosts` : 'Add 1 more host to compare'}
        </span>
      </div>
      <div className="flex items-center gap-1.5 overflow-x-auto">
        {selection.map((host) => (
          <Badge key={host.id} variant="secondary" className="gap-1.5 pr-1 text-xs whitespace-nowrap">
            <span className="flex size-4 items-center justify-center rounded-full bg-accent/20 text-[10px] font-bold text-accent">
              {host.name.charAt(0).toUpperCase()}
            </span>
            {host.name}
            <button type="button" onClick={() => removeHost(host.id)} aria-label={`Remove ${host.name}`} className="ml-0.5 hover:text-destructive">
              <X size={11} />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {canCompare && (
          <Link href="/compare">
            <Button size="xs">
              Compare now <ArrowRight size={13} />
            </Button>
          </Link>
        )}
        <Button variant="ghost" size="xs" onClick={clearAll}>Clear</Button>
      </div>
    </div>
  );
}
