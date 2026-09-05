import { type Host } from './hosts';
import { parseCPUValue, parseMemoryToMB } from './parseSpecs';
import { ramDisplay, diskDisplay } from './specs';
import { getLanguageName } from './getLanguageName';
import { extractLocations, hasSubstantiveFreePlan } from './hostContent';

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function computeRating(host: Host): number {
  const total = (host.approvals || 0) + (host.disapprovals || 0);
  if (total === 0) return -1; // sentinel for "N/A"
  return ((host.approvals || 0) / total) * 100;
}

export function formatRating(host: Host): string {
  const rating = computeRating(host);
  return rating < 0 ? 'N/A' : `${Math.round(rating)}%`;
}

export function findBestIndex(values: number[]): number {
  // Returns the index of the maximum value; -1 if all values are 0, negative,
  // or non-finite (Infinity = "Unlimited" never auto-wins a highlight).
  const finite = values.map((v) => (Number.isFinite(v) ? v : -1));
  const max = Math.max(...finite);
  if (max <= 0) return -1;
  return finite.indexOf(max);
}

// ─── Row definitions ──────────────────────────────────────────────────────────

export interface Row {
  label: string;
  getValue: (host: Host) => string;
  getNumeric?: (host: Host) => number;
}

export const ROWS: Row[] = [
  {
    label: 'Status',
    getValue: (h) => h.status || 'Unknown',
  },
  {
    label: 'Type',
    getValue: (h) => h.type || 'Unknown',
  },
  {
    label: 'CPU',
    getValue: (h) => h.cpu || 'Unknown',
    getNumeric: (h) => parseCPUValue(h.cpu),
  },
  {
    label: 'RAM',
    getValue: (h) => ramDisplay(h),
    getNumeric: (h) => parseMemoryToMB(h.ram, h.ramMB),
  },
  {
    label: 'Storage',
    getValue: (h) => diskDisplay(h),
    getNumeric: (h) => parseMemoryToMB(h.disk, h.diskMB),
  },
  {
    label: 'Targets',
    getValue: (h) => {
      const parts = (h.targets ?? []).flatMap((t) => String(t).split(',').map((p) => p.trim())).filter(Boolean);
      const unique = [...new Set(parts)];
      return unique.length > 0 ? unique.join(', ') : 'Unknown';
    },
  },
  {
    label: 'Languages',
    getValue: (h) => {
      const parts = [...new Set((h.locale ?? []).map((l) => getLanguageName(String(l).trim())).filter(Boolean))];
      return parts.length > 0 ? parts.join(', ') : 'Unknown';
    },
  },
  {
    label: 'Server locations',
    getValue: (h) => {
      const locs = extractLocations(h.info);
      return locs.length > 0 ? locs.join(', ') : '—';
    },
  },
  {
    label: 'Free plan',
    getValue: (h) => {
      if (!hasSubstantiveFreePlan(h.free_plan)) return '—';
      const firstLine = (h.free_plan as string).split(/\r?\n/).map((l) => l.trim()).filter(Boolean)[0] ?? '';
      return firstLine.length > 80 ? `${firstLine.slice(0, 77).trim()}…` : firstLine;
    },
  },
  {
    label: 'Listed since',
    getValue: (h) => {
      const ts = h.created_at ? Date.parse(h.created_at) : NaN;
      return Number.isFinite(ts) ? String(new Date(ts).getFullYear()) : '—';
    },
  },
  {
    label: 'Rating',
    getValue: (h) => formatRating(h),
    getNumeric: (h) => computeRating(h),
  },
];
