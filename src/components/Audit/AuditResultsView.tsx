'use client';

import { useState } from 'react';
import type { AuditFormInput, AuditResult } from '@/types';
import { formatCurrency, SAVINGS_COLORS, getSavingsLabel } from '@/lib/utils';
import RecommendationCard from './RecommendationCard';
import LeadCaptureModal from './LeadCaptureModal';
import CredexPromo from './CredexPromo';
import { Share2, Download, Mail, CheckCircle2, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  result: AuditResult;
  formInput: AuditFormInput;
}

export default function AuditResultsView({ result, formInput }: Props) {
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);

  const savingsColors = SAVINGS_COLORS[result.savingsTier];
  const shareUrl = result.shareId
    ? `${window.location.origin}/share/${result.shareId}`
    : null;

  const handleShare = async () => {
    if (!shareUrl) {
      toast.error('Share link not available.');
      return;
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Share link copied to clipboard!');
    } catch {
      toast.error('Could not copy link. ' + shareUrl);
    }
  };

  const savingsPct = result.totalCurrentSpend > 0
    ? Math.round((result.totalMonthlySavings / result.totalCurrentSpend) * 100)
    : 0;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">

      {/* Hero Savings Block */}
      <div className="relative bg-ink-900 border border-ink-800 rounded-2xl p-8 overflow-hidden">
        {/* Background glow */}
        {result.totalMonthlySavings > 0 && (
          <div className="absolute top-0 right-0 w-80 h-80 bg-lime-300/5 rounded-full blur-[80px] pointer-events-none" />
        )}

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div>
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-4 border ${savingsColors.bg} ${savingsColors.text} ${savingsColors.border}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {getSavingsLabel(result.savingsTier)}
            </div>

            {result.totalMonthlySavings > 0 ? (
              <>
                <h1 className="font-display font-black text-5xl text-white mb-2 leading-none">
                  {formatCurrency(result.totalMonthlySavings)}
                  <span className="text-ink-400 font-body font-normal text-xl">/mo</span>
                </h1>
                <p className="text-lime-300 text-xl font-semibold mb-1">
                  {formatCurrency(result.totalAnnualSavings)} per year
                </p>
                <p className="text-ink-400 text-sm">
                  {savingsPct}% reduction from your current{' '}
                  <span className="text-ink-300">{formatCurrency(result.totalCurrentSpend)}/mo</span> bill
                </p>
              </>
            ) : (
              <>
                <h1 className="font-display font-black text-4xl text-white mb-3">
                  Your stack is well-optimized ✓
                </h1>
                <p className="text-ink-400 text-lg">
                  No major savings identified for your current setup.
                  Re-audit when your team or usage changes.
                </p>
              </>
            )}
          </div>

          {/* Spend comparison mini chart */}
          {result.totalMonthlySavings > 0 && (
            <div className="bg-ink-950 rounded-xl p-5 min-w-[200px]">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-ink-500 mb-1">
                    <span>Current</span>
                    <span className="font-mono">{formatCurrency(result.totalCurrentSpend)}</span>
                  </div>
                  <div className="h-2 bg-ink-800 rounded-full">
                    <div className="h-2 bg-red-500/60 rounded-full w-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-ink-500 mb-1">
                    <span>Optimized</span>
                    <span className="font-mono">{formatCurrency(result.totalProjectedSpend)}</span>
                  </div>
                  <div className="h-2 bg-ink-800 rounded-full">
                    <div
                      className="h-2 bg-lime-300/70 rounded-full"
                      style={{ width: `${100 - savingsPct}%` }}
                    />
                  </div>
                </div>
              </div>
              <p className="text-lime-300 text-xs font-semibold mt-3 text-center">
                {savingsPct}% savings potential
              </p>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="relative flex flex-wrap gap-3 mt-8">
          {!leadCaptured ? (
            <button
              onClick={() => setShowLeadModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Email me this report
            </button>
          ) : (
            <div className="flex items-center gap-2 text-green-400 text-sm font-medium px-4 py-2 bg-green-400/10 border border-green-400/20 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
              Report sent to your inbox
            </div>
          )}

          {shareUrl && (
            <button onClick={handleShare} className="btn-secondary flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Copy share link
            </button>
          )}
        </div>
      </div>

      {/*Credex Promo (high value only)*/}
      {result.savingsTier === 'high' && (
        <CredexPromo monthlySavings={result.totalMonthlySavings} />
      )}

      {/*AI Summary*/}
      {result.aiSummary && (
        <div className="bg-ink-900 border border-lime-300/20 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-5 h-5 rounded bg-lime-300/10 flex items-center justify-center">
              <span className="text-lime-300 text-xs">AI</span>
            </span>
            <span className="text-lime-300 text-xs font-medium uppercase tracking-wide">Personalized summary</span>
          </div>
          <p className="text-ink-300 leading-relaxed text-[15px]">{result.aiSummary}</p>
        </div>
      )}

      {/* Per-tool Breakdown  */}
      <div>
        <h2 className="font-display font-bold text-2xl text-white mb-5">
          Tool-by-tool breakdown
        </h2>
        <div className="space-y-4">
          {result.recommendations
            .sort((a, b) => b.monthlySavings - a.monthlySavings)
            .map((rec, i) => (
              <RecommendationCard key={rec.toolId} recommendation={rec} index={i} />
            ))}
        </div>
      </div>

      {/*Low savings / optimal notice*/}
      {(result.savingsTier === 'low' || result.savingsTier === 'optimal') && (
        <div className="bg-ink-900 border border-ink-800 rounded-xl p-6 flex items-start gap-4">
          <TrendingDown className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-white font-semibold mb-1">You&apos;re spending well</p>
            <p className="text-ink-400 text-sm leading-relaxed">
              Your current stack looks right-sized. Sign up below to get notified when pricing changes
              or new alternatives emerge for your specific tools.
            </p>
            {!leadCaptured && (
              <button
                onClick={() => setShowLeadModal(true)}
                className="mt-3 text-lime-300 text-sm font-medium hover:underline"
              >
                Notify me when optimizations apply →
              </button>
            )}
          </div>
        </div>
      )}

      {/*  Footer note */}
      <p className="text-ink-600 text-xs text-center pb-8">
        Pricing data verified from official vendor pages · Last updated May 2026 ·
        Recommendations are based on plan structures, not usage telemetry.
      </p>

      {/*  Lead Capture Modal */}
      {showLeadModal && result.shareId && (
        <LeadCaptureModal
          shareId={result.shareId}
          monthlySavings={result.totalMonthlySavings}
          highValue={result.savingsTier === 'high'}
          onClose={() => setShowLeadModal(false)}
          onSuccess={() => {
            setLeadCaptured(true);
            setShowLeadModal(false);
          }}
        />
      )}
    </div>
  );
}
