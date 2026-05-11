'use client';

import { useState } from 'react';
import { X, Loader2, Mail, Building2, Briefcase } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';

interface Props {
  shareId: string;
  monthlySavings: number;
  highValue: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function LeadCaptureModal({
  shareId,
  monthlySavings,
  highValue,
  onClose,
  onSuccess,
}: Props) {
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubmitting(true);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auditShareId: shareId,
          email,
          companyName: companyName || undefined,
          role: role || undefined,
          honeypot: '',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? 'Failed to save. Try again.');
      }

      toast.success('Report sent! Check your inbox.');
      onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative z-10 bg-ink-900 border border-ink-700 rounded-2xl w-full max-w-md p-7 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-ink-500 hover:text-ink-200 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          {highValue ? (
            <>
              <div className="w-10 h-10 rounded-xl bg-lime-300/10 border border-lime-300/20 flex items-center justify-center mb-4">
                <span className="text-lime-300 text-lg">💰</span>
              </div>
              <h2 className="font-display font-bold text-2xl text-white mb-2">
                Get your full report
              </h2>
              <p className="text-ink-400 text-sm leading-relaxed">
                We identified{' '}
                <span className="text-lime-300 font-semibold">{formatCurrency(monthlySavings)}/month</span>{' '}
                in savings. Enter your email to receive the full report — and a Credex advisor will
                reach out about discounted AI credits that could save you even more.
              </p>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-xl bg-ink-800 flex items-center justify-center mb-4">
                <Mail className="w-5 h-5 text-ink-400" />
              </div>
              <h2 className="font-display font-bold text-2xl text-white mb-2">
                Save your audit
              </h2>
              <p className="text-ink-400 text-sm leading-relaxed">
                Get the full report in your inbox, plus notifications when new savings
                opportunities apply to your stack.
              </p>
            </>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-ink-400 text-sm mb-1.5">
              Work email <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="input-base pl-9"
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="company" className="block text-ink-400 text-sm mb-1.5">
              Company <span className="text-ink-600 text-xs">(optional)</span>
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
              <input
                id="company"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Acme Inc."
                className="input-base pl-9"
              />
            </div>
          </div>

          <div>
            <label htmlFor="role" className="block text-ink-400 text-sm mb-1.5">
              Role <span className="text-ink-600 text-xs">(optional)</span>
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
              <input
                id="role"
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Engineering Manager"
                className="input-base pl-9"
              />
            </div>
          </div>

          {/* Honeypot */}
          <input
            type="text"
            name="phone_number"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute opacity-0 pointer-events-none w-0 h-0"
          />

          <button
            type="submit"
            disabled={submitting || !email}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending…
              </>
            ) : (
              'Send my report'
            )}
          </button>

          <p className="text-ink-600 text-xs text-center">
            No spam. Unsubscribe anytime. Credex may reach out for high-savings cases.
          </p>
        </form>
      </div>
    </div>
  );
}
