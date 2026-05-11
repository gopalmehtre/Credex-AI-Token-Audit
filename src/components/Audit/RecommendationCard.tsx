'use client';

import type { ToolRecommendation } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { TrendingDown, ArrowRight, CheckCircle2, AlertTriangle, Zap, RefreshCw } from 'lucide-react';

interface Props {
  recommendation: ToolRecommendation;
  index: number;
}

const ACTION_CONFIG = {
  downgrade_plan: {
    label: 'Downgrade plan',
    icon: TrendingDown,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10 border-amber-400/20',
  },
  switch_tool: {
    label: 'Switch tool',
    icon: RefreshCw,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10 border-blue-400/20',
  },
  reduce_seats: {
    label: 'Remove unused seats',
    icon: TrendingDown,
    color: 'text-orange-400',
    bg: 'bg-orange-400/10 border-orange-400/20',
  },
  buy_via_credits: {
    label: 'Buy via discounted credits',
    icon: Zap,
    color: 'text-lime-300',
    bg: 'bg-lime-300/10 border-lime-300/20',
  },
  already_optimal: {
    label: 'Already optimal',
    icon: CheckCircle2,
    color: 'text-green-400',
    bg: 'bg-green-400/10 border-green-400/20',
  },
};

const CONFIDENCE_LABEL: Record<string, string> = {
  high: 'High confidence',
  medium: 'Medium confidence',
  low: 'Indicative',
};

export default function RecommendationCard({ recommendation: rec, index }: Props) {
  const config = ACTION_CONFIG[rec.recommendedAction];
  const Icon = config.icon;
  const hasNoSavings = rec.recommendedAction === 'already_optimal';

  return (
    <div
      className={cn(
        'bg-ink-900 border rounded-xl p-5 transition-all duration-300',
        hasNoSavings ? 'border-ink-800' : 'border-ink-700 hover:border-ink-600',
      )}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">

        {/* Tool name + action badge */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-3">
            <h3 className="font-semibold text-white text-base">{rec.toolName}</h3>
            <span className={cn(
              'inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border',
              config.bg, config.color
            )}>
              <Icon className="w-3 h-3" />
              {config.label}
            </span>
            <span className="text-ink-600 text-xs font-mono ml-auto">
              {CONFIDENCE_LABEL[rec.confidence]}
            </span>
          </div>

          {/* Spend flow */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <div className="flex flex-col">
              <span className="text-ink-500 text-xs">Current</span>
              <span className="font-mono font-semibold text-ink-200 text-sm">
                {formatCurrency(rec.currentSpend)}/mo
              </span>
              <span className="text-ink-600 text-xs">{rec.currentPlan}</span>
            </div>

            {!hasNoSavings && (
              <>
                <ArrowRight className="w-4 h-4 text-ink-600 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-ink-500 text-xs">
                    {rec.recommendedPlan ?? rec.recommendedTool ?? 'Recommended'}
                  </span>
                  <span className="font-mono font-semibold text-lime-300 text-sm">
                    {formatCurrency(rec.projectedSpend)}/mo
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Reasoning */}
          <p className="text-ink-400 text-sm leading-relaxed">{rec.reasoning}</p>
        </div>

        {/* Savings callout */}
        {!hasNoSavings && rec.monthlySavings > 0 && (
          <div className="flex-shrink-0 bg-lime-300/8 border border-lime-300/15 rounded-xl p-4 text-center min-w-[130px]">
            <p className="text-lime-300 font-display font-bold text-2xl leading-none">
              {formatCurrency(rec.monthlySavings)}
            </p>
            <p className="text-lime-300/60 text-xs mt-1">/month saved</p>
            <div className="mt-2 pt-2 border-t border-lime-300/10">
              <p className="text-lime-300/80 text-xs font-semibold">
                {formatCurrency(rec.annualSavings)}/yr
              </p>
            </div>
          </div>
        )}

        {hasNoSavings && (
          <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-green-400/10">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
          </div>
        )}
      </div>
    </div>
  );
}
