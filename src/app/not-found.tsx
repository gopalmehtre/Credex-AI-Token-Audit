import Link from 'next/link';
import { TrendingDown } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="font-mono text-lime-300/40 text-7xl font-bold mb-6">404</p>
        <h1 className="font-display font-bold text-3xl text-white mb-3">Page not found</h1>
        <p className="text-ink-400 mb-8">
          This page doesn&apos;t exist. Head back to run your free AI spend audit.
        </p>
        <Link href="/" className="btn-primary inline-flex items-center gap-2">
          <TrendingDown className="w-4 h-4" />
          Back to SpendSight
        </Link>
      </div>
    </div>
  );
}
