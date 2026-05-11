'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-14 h-14 rounded-2xl bg-red-400/10 border border-red-400/20 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-6 h-6 text-red-400" />
        </div>
        <h1 className="font-display font-bold text-2xl text-white mb-3">Something went wrong</h1>
        <p className="text-ink-400 mb-8 text-sm leading-relaxed">
          {error.digest ? `Error ID: ${error.digest}` : 'An unexpected error occurred.'}
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="btn-secondary text-sm px-5 py-2.5">
            Try again
          </button>
          <Link href="/" className="btn-primary text-sm px-5 py-2.5">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
