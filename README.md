# SpendSight — Free AI Spend Audit for Startups

SpendSight is a free web tool that audits your startup's AI tool spending — Cursor, Claude, ChatGPT, GitHub Copilot, and more — and surfaces specific, finance-defensible savings recommendations. It's a lead-generation asset for [Credex](https://credex.rocks), which sells discounted AI infrastructure credits.

## Screenshots

> _Add 3+ screenshots or a Loom/YouTube link after deployment._

- `/audit` — Multi-tool spend input form with auto-calculated spend per seat
- `/audit/results` — Hero savings block, per-tool recommendations, AI summary, email capture
- `/share/[id]` — Public shareable audit with Open Graph previews

**Live URL:** `https://your-deployment-url.vercel.app`

---

## Quick Start

### Prerequisites

- Node.js 20+
- Docker + Docker Compose (for PostgreSQL)
- A Gemini API key (for AI summaries — falls back gracefully without one)
- A Resend API key (for transactional emails — optional)

### Install & Run Locally

```bash
# 1. Clone and install
git clone https://github.com/yourusername/ai-spend-audit
cd ai-spend-audit
npm install

# 2. Set environment variables
cp .env.example .env.local
# Edit .env.local with your keys

# 3. Start PostgreSQL via Docker
docker-compose up -d

# 4. Run DB migrations
node scripts/migrate.js

# 5. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Run Tests

```bash
npm test
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel
# Set env vars in Vercel dashboard
# Use any managed Postgres (Neon, Supabase, Railway) for DATABASE_URL
```

---

## Decisions

**1. Next.js App Router over separate frontend/backend**
Collocating API routes with the UI eliminates a deployment unit, simplifies environment variable handling, and enables server-rendered OG metadata for shareable URLs. The trade-off: Next.js is heavier than a pure SPA; acceptable given the lead-gen nature of this tool where SEO matters.

**2. PostgreSQL over Supabase/Firebase**
Raw Postgres via Docker gives full control over schema, indices, and query patterns during development, with a clean migration path to managed Postgres (Neon, Railway) in production. Supabase's client SDK adds abstraction without meaningful benefit for a tool this size.

**3. Deterministic audit logic — no AI in the engine**
The audit engine is pure rule-based TypeScript. Using an LLM for the math would introduce non-determinism, latency, and hallucination risk on dollar amounts. AI is used exactly once — for the personalized summary paragraph — where creativity adds value and inaccuracy has low cost.

**4. Form state in localStorage, audit result in sessionStorage**
`localStorage` persists form inputs across reloads (good UX for multi-session editing). `sessionStorage` holds the audit result temporarily for the results page without hitting the DB again — it clears on tab close, which is fine since the canonical result lives in the DB with a shareId.

**5. Honeypot + DB-backed rate limiting over hCaptcha**
hCaptcha introduces friction for legitimate users on a tool where conversion rate is the north star metric. A honeypot field catches most bots; DB-backed rate limiting (10 audits/IP/hour) caps abuse without annoying real users. This is documented as a deliberate trade-off — higher sophistication attacks would warrant hCaptcha.