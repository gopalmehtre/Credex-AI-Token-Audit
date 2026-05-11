'use client';

import { ExternalLink, Zap } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface Props {
  monthlySavings: number;
}

export default function CredexPromo({ monthlySavings }: Props) {
  return (
    <div className="relative bg-gradient-to-br from-lime-300/10 via-lime-300/5 to-transparent border border-lime-300/25 rounded-2xl p-7 overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-lime-300/8 rounded-full blur-[60px] pointer-events-none" />

      <div className="relative flex flex-col sm:flex-row items-start gap-5">
        <div className="w-12 h-12 rounded-xl bg-lime-300/15 border border-lime-300/30 flex items-center justify-center flex-shrink-0">
          <Zap className="w-6 h-6 text-lime-300" />
        </div>

        <div className="flex-1">
          <p className="text-xs text-lime-300/70 font-medium uppercase tracking-wide mb-1">
            Unlock more savings with Credex
          </p>
          <h3 className="font-display font-bold text-xl text-white mb-2">
            Capture the other 30% with discounted credits
          </h3>
          <p className="text-ink-300 text-sm leading-relaxed mb-4">
            Beyond plan optimization, Credex sources pre-paid AI credits — Cursor, Claude,
            ChatGPT Enterprise — from companies that over-forecasted. Typically 20–35% below
            retail, same tools, no integration changes needed.
          </p>
          <p className="text-ink-400 text-sm mb-5">
            At your current savings rate, discounted credits could be worth an additional{' '}
            <span className="text-lime-300 font-semibold">
              {formatCurrency(Math.round(monthlySavings * 0.3 * 12))}/year
            </span>{' '}
            on top of what you already save from plan optimization.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="https://credex.rocks"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex items-center gap-2 text-sm px-5 py-2.5"
            >
              Book a Credex consultation
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://credex.rocks"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary flex items-center gap-2 text-sm px-5 py-2.5"
            >
              Learn how it works
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
