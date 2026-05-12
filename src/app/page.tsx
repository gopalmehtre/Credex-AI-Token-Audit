import Link from 'next/link';
import { ArrowRight, TrendingDown, Zap, Shield, Share2 } from 'lucide-react';

const FEATURES = [
  {
    icon: TrendingDown,
    title: 'Instant spend analysis',
    body: 'Input your current tools and plans. Get a per-tool breakdown of where you\'re overpaying and what to do about it.',
  },
  {
    icon: Zap,
    title: 'AI-personalized summary',
    body: 'A concise, CFO-level paragraph written specifically for your stack, team size, and primary use case.',
  },
  {
    icon: Shield,
    title: 'Defensible math',
    body: 'Every recommendation traces to official vendor pricing. A finance person should read it and agree.',
  },
  {
    icon: Share2,
    title: 'Shareable reports',
    body: 'Each audit gets a unique URL. Send it to your team, your accountant, or post it on Hacker News.',
  },
];

const TOOLS = [
  'Cursor', 'GitHub Copilot', 'Claude', 'ChatGPT',
  'Anthropic API', 'OpenAI API', 'Gemini', 'Windsurf',
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-ink-950 relative overflow-hidden">
      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(200,241,53,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(200,241,53,0.03) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }}
      />

      {/* Glow orbs */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-lime-300/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] bg-lime-300/3 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10">
        {/* Nav */}
        <nav className="flex items-center justify-between max-w-6xl mx-auto px-6 py-5">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-lime-300 flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-ink-950" strokeWidth={2.5} />
            </span>
            <span className="font-display font-bold text-white text-lg tracking-tight">SpendSight</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-ink-400 text-sm hidden sm:block">By</span>
            <a
              href="https://credex.rocks"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-300 text-sm hover:text-lime-300 transition-colors font-medium"
            >
              Credex ↗
            </a>
          </div>
        </nav>

        {/* Hero */}
        <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-lime-300/10 border border-lime-300/20 rounded-full px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-lime-300 animate-pulse" />
            <span className="text-lime-300 text-xs font-medium tracking-wide uppercase">Free AI spend audit</span>
          </div>

          <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.05] mb-6">
            Stop overpaying for
            <br />
            <span className="text-gradient-lime">AI tools</span>
          </h1>

          <p className="text-ink-300 text-xl leading-relaxed max-w-2xl mx-auto mb-10">
            Most startups pay 30% more than they need to on Cursor, ChatGPT, Claude, and Copilot.
            Get a plain-English audit in 2 minutes — free, no login required.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/audit" className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2 justify-center">
              Audit my AI spend
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#how-it-works"
              className="btn-secondary text-lg px-8 py-4 inline-flex items-center justify-center"
            >
              How it works
            </a>
          </div>

          {/* Tool badges */}
          <div className="flex flex-wrap justify-center gap-2 mt-12">
            {TOOLS.map((tool) => (
              <span
                key={tool}
                className="bg-ink-900 border border-ink-800 text-ink-400 text-xs font-mono px-3 py-1.5 rounded-md"
              >
                {tool}
              </span>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="max-w-5xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <h2 className="font-display font-bold text-3xl text-white mb-3">How it works</h2>
            <p className="text-ink-400">Three steps, two minutes, zero fluff.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Enter your tools', body: 'Tell us what you\'re paying for each AI tool, which plan, and how many seats.' },
              { step: '02', title: 'Get your audit', body: 'The engine checks every tool against the right plan for your team size and use case.' },
              { step: '03', title: 'Take action', body: 'Share the report, capture the savings, or book a Credex consultation for bigger discounts.' },
            ].map(({ step, title, body }) => (
              <div key={step} className="card relative overflow-hidden group hover:border-lime-300/30 transition-colors">
                <span className="font-display font-black text-6xl text-ink-800 absolute -top-2 -right-1 select-none group-hover:text-lime-300/10 transition-colors">
                  {step}
                </span>
                <h3 className="font-semibold text-white text-lg mb-2 relative">{title}</h3>
                <p className="text-ink-400 text-sm leading-relaxed relative">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="max-w-5xl mx-auto px-6 py-10 pb-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="card-hover group">
                <div className="w-9 h-9 rounded-lg bg-lime-300/10 border border-lime-300/20 flex items-center justify-center mb-4 group-hover:bg-lime-300/15 transition-colors">
                  <Icon className="w-4 h-4 text-lime-300" />
                </div>
                <h3 className="font-semibold text-white text-sm mb-2">{title}</h3>
                <p className="text-ink-400 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Social proof / CTA */}
        <section className="max-w-3xl mx-auto px-6 pb-28 text-center">
          <div className="bg-ink-900 border border-ink-800 rounded-2xl p-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-lime-300/5 via-transparent to-transparent" />
            <div className="relative">
              <p className="font-display font-bold text-3xl text-white mb-3">
                The average startup saves <span className="text-lime-300">$340/mo</span>
              </p>
              <p className="text-ink-400 mb-8">
                On a 10-person engineering team paying retail for Cursor Business + ChatGPT Team.
                The math isn&apos;t hard — it just takes 2 minutes to check.
              </p>
              <Link href="/audit" className="btn-primary text-base px-7 py-3 inline-flex items-center gap-2">
                Start free audit
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-ink-900 py-8">
          <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-lime-300 flex items-center justify-center">
                <TrendingDown className="w-3 h-3 text-ink-950" strokeWidth={2.5} />
              </span>
              <span className="text-ink-500 text-sm">SpendSight by <a href="https://credex.rocks" className="hover:text-lime-300 transition-colors">Credex</a></span>
            </div>
            <p className="text-ink-600 text-xs">
              Pricing data verified weekly from official vendor pages · Not financial advice
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
