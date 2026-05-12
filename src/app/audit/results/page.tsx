// src/app/audit/results/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AuditResult, AuditFormInput } from '@/types';
import AuditResultsView from '@/components/Audit/AuditResultsView';
import { TrendingDown, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<AuditResult | null>(null);
  const [formInput, setFormInput] = useState<AuditFormInput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load saved audit from sessionStorage (set by form on submit)
    const savedResult = sessionStorage.getItem('auditResult');
    const savedInput = sessionStorage.getItem('auditInput');

    if (!savedResult || !savedInput) {
      router.replace('/audit');
      return;
    }

    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResult(JSON.parse(savedResult));
      setFormInput(JSON.parse(savedInput));
    } catch {
      setError('Failed to load audit results.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ink-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-lime-300 animate-spin mx-auto mb-4" />
          <p className="text-ink-400">Loading your audit…</p>
        </div>
      </div>
    );
  }

  if (error || !result || !formInput) {
    return (
      <div className="min-h-screen bg-ink-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error ?? 'Something went wrong.'}</p>
          <Link href="/audit" className="btn-primary">Start over</Link>
        </div>
      </div>
    );
  }

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
        <nav className="flex items-center justify-between max-w-5xl mx-auto px-6 py-5 border-b border-ink-900">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="w-7 h-7 rounded-lg bg-lime-300 flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-ink-950" strokeWidth={2.5} />
            </span>
            <span className="font-display font-bold text-white text-lg tracking-tight">SpendSight</span>
          </Link>
          <Link href="/audit" className="text-ink-400 text-sm hover:text-lime-300 transition-colors">
            ← Edit inputs
          </Link>
        </nav>

        <AuditResultsView result={result} formInput={formInput} />
      </div>
    </div>
  );
}
