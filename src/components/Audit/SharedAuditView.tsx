'use client';
import Link from 'next/link';
import type { ShareableAudit } from '@/types';
import { formatCurrency, SAVINGS_COLORS, getSavingsLabel } from '@/lib/utils';
import RecommendationCard from './RecommendationCard';
import CredexPromo from './CredexPromo';
import { TrendingDown, ArrowRight, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  audit: ShareableAudit;
}

const USE_CASE_LABELS: Record<string, string> = {
  coding: 'Software Engineering',
  writing: 'Content Writing',
  data: 'Data / Analytics',
  research: 'Research',
  mixed: 'Mixed Use Cases',
};

export default function SharedAuditView({ audit }: Props) {
  const savingsColors = SAVINGS_COLORS[audit.savingsTier as keyof typeof SAVINGS_COLORS] ?? SAVINGS_COLORS.medium;
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied!');
    } catch {
      toast.error('Copy failed.');
    }
  };

  return (
    <div className="min-h-screen bg-ink-950 relative">
      <div
        className="fixed inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `linear-gradient(rgba(200,241,53,0.02) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(200,241,53,0.02) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }}
      />

      <div className="relative z-10">
        {/* Nav */}
        <nav className="flex items-center justify-between max-w-4xl mx-auto px-6 py-5 border-b border-ink-900">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="w-7 h-7 rounded-lg bg-lime-300 flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-ink-950" strokeWidth={2.5} />
            </span>
            <span className="font-display font-bold text-white text-lg tracking-tight">SpendSight</span>
          </Link>
          <button onClick={handleShare} className="btn-secondary flex items-center gap-2 text-sm py-2">
            <Share2 className="w-3.5 h-3.5" />
            Copy link
          </button>
        </nav>

        <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
          {/* Context banner */}
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="bg-ink-900 border border-ink-800 px-3 py-1.5 rounded-full text-ink-400">
              Team of <span className="text-ink-200 font-medium">{audit.teamSize}</span>
            </span>
            <span className="bg-ink-900 border border-ink-800 px-3 py-1.5 rounded-full text-ink-400">
              {USE_CASE_LABELS[audit.useCase] ?? audit.useCase}
            </span>
            <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${savingsColors.bg} ${savingsColors.text} ${savingsColors.border}`}>
              {getSavingsLabel(audit.savingsTier)}
            </span>
          </div>

          {/* Hero */}
          <div className="bg-ink-900 border border-ink-800 rounded-2xl p-8">
            {audit.totalMonthlySavings > 0 ? (
              <>
                <p className="text-ink-500 text-sm mb-2">Potential savings identified</p>
                <h1 className="font-display font-black text-5xl text-white mb-1">
                  {formatCurrency(audit.totalMonthlySavings)}
                  <span className="text-ink-500 font-body font-normal text-xl">/mo</span>
                </h1>
                <p className="text-lime-300 text-xl font-semibold">
                  {formatCurrency(audit.totalAnnualSavings)} per year
                </p>
              </>
            ) : (
              <h1 className="font-display font-bold text-3xl text-white">
                AI stack is well-optimized ✓
              </h1>
            )}
          </div>

          {/* AI Summary */}
          {audit.aiSummary && (
            <div className="bg-ink-900 border border-lime-300/20 rounded-xl p-6">
              <p className="text-xs text-lime-300/70 font-medium uppercase tracking-wide mb-3">
                AI Analysis
              </p>
              <p className="text-ink-300 leading-relaxed">{audit.aiSummary}</p>
            </div>
          )}

          {/* Credex promo */}
          {audit.totalMonthlySavings > 500 && (
            <CredexPromo monthlySavings={audit.totalMonthlySavings} />
          )}

          {/* Recommendations */}
          <div>
            <h2 className="font-display font-bold text-xl text-white mb-4">Recommendations</h2>
            <div className="space-y-4">
              {audit.recommendations
                .sort((a, b) => b.monthlySavings - a.monthlySavings)
                .map((rec, i) => (
                  <RecommendationCard key={rec.toolId} recommendation={rec} index={i} />
                ))}
            </div>
          </div>

          {/* CTA to run own audit */}
          <div className="bg-ink-900 border border-ink-800 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-white mb-1">Run your own audit</p>
              <p className="text-ink-400 text-sm">Free, no login required. Takes 2 minutes.</p>
            </div>
            <Link href="/audit" className="btn-primary flex items-center gap-2 flex-shrink-0">
              Audit my spend
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <p className="text-ink-700 text-xs text-center pb-8">
            Public view — identifying details removed · SpendSight by Credex
          </p>
        </div>
      </div>
    </div>
  );
}
