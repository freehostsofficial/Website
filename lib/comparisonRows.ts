import { type Host } from './cache';
import { parseCPUValue, parseMemoryToMB } from './parseSpecs';

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function computeRating(host: Host): number {
  const total = (host.approvals || 0) + (host.disapprovals || 0);
  if (total === 0) return -1; // sentinel for "N/A"
  return ((host.approvals || 0) / total) * 100;
}

export function formatRating(host: Host): string {
  const r = computeRating(host);
  return r === -1 ? 'N/A' : `${Math.round(r)}%`;
}

export function findBestIndex(values: number[]): number {
  // Returns the index of the maximum value; -1 if all values are 0 or negative
  const max = Math.max(...values);
  if (max <= 0) return -1;
  return values.indexOf(max);
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
    getValue: (h) => {
      if (h.ramMB && h.ramMB > 0) {
        return h.ramMB >= 1024
          ? `${(h.ramMB / 1024).toFixed(1)}GB`
          : `${Math.round(h.ramMB)}MB`;
      }
      return h.ram || 'Unknown';
    },
    getNumeric: (h) => parseMemoryToMB(h.ram, h.ramMB),
  },
  {
    label: 'Storage',
    getValue: (h) => {
      if (h.diskMB && h.diskMB > 0) {
        return h.diskMB >= 1024
          ? `${(h.diskMB / 1024).toFixed(1)}GB`
          : `${Math.round(h.diskMB)}MB`;
      }
      return h.disk || 'Unknown';
    },
    getNumeric: (h) => parseMemoryToMB(h.disk, h.diskMB),
  },
  {
    label: 'Targets',
    getValue: (h) =>
      (h.targets || []).length > 0 ? h.targets.join(', ') : 'Unknown',
  },
  {
    label: 'Languages',
    getValue: (h) =>
      (h.locale || []).length > 0 ? h.locale.join(', ') : 'Unknown',
  },
  {
    label: 'Rating',
    getValue: (h) => formatRating(h),
    getNumeric: (h) => computeRating(h),
  },
];
