import { Metadata } from 'next';
import AuditForm from '@/components/form/AuditForm';
import { TrendingDown } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Audit Your AI Spend — SpendSight',
  description: 'Enter your AI tools and get an instant spend audit with savings recommendations.',
};

export default function AuditPage() {
  return (
    <div className="min-h-screen bg-ink-950 relative">
      {/* Background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage: `linear-gradient(rgba(200,241,53,0.02) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(200,241,53,0.02) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }}
      />
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-lime-300/4 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10">
        {/* Nav */}
        <nav className="flex items-center justify-between max-w-5xl mx-auto px-6 py-5 border-b border-ink-900">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="w-7 h-7 rounded-lg bg-lime-300 flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-ink-950" strokeWidth={2.5} />
            </span>
            <span className="font-display font-bold text-white text-lg tracking-tight">SpendSight</span>
          </Link>
          <span className="text-ink-500 text-sm font-mono">Step 1 of 2</span>
        </nav>

        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="mb-10">
            <h1 className="font-display font-black text-4xl text-white mb-3">
              What are you paying for?
            </h1>
            <p className="text-ink-400 text-lg">
              Add every AI tool your team pays for. Be specific — inaccurate inputs mean inaccurate savings.
            </p>
          </div>

          <AuditForm />
        </div>
      </div>
    </div>
  );
}