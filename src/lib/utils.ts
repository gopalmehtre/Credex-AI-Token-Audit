// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, compact = false): string {
  if (compact && Math.abs(amount) >= 1000) {
    return `$${(amount / 1000).toFixed(1)}k`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercent(numerator: number, denominator: number): string {
  if (denominator === 0) return '0%';
  return `${Math.round((numerator / denominator) * 100)}%`;
}

export const SAVINGS_COLORS = {
  high: { bg: 'bg-lime-300/10', text: 'text-lime-300', border: 'border-lime-300/20' },
  medium: { bg: 'bg-amber-400/10', text: 'text-amber-400', border: 'border-amber-400/20' },
  low: { bg: 'bg-blue-400/10', text: 'text-blue-400', border: 'border-blue-400/20' },
  optimal: { bg: 'bg-green-400/10', text: 'text-green-400', border: 'border-green-400/20' },
};

export function getSavingsLabel(tier: string): string {
  const labels: Record<string, string> = {
    high: 'High savings potential',
    medium: 'Moderate savings potential',
    low: 'Small savings found',
    optimal: 'Stack is well-optimized',
  };
  return labels[tier] ?? tier;
}