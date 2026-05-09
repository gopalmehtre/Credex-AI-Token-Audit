# Day 1 - 2025-05-08
**Hours worked:** 4

## What I did:
Read the assignment brief twice end to end before touching any code. Set up Next.js 14 with TypeScript, Tailwind, and App Router. Created Docker Compose for PostgreSQL and wrote the full DB schema audits, leads, and rate_limits tables with indexes. Spent significant time on `pricing data.ts` manually pulled current numbers from all 8 vendor pricing pages (Cursor, GitHub Copilot, Claude, ChatGPT, Anthropic API, OpenAI API, Gemini, Windsurf) and documented every source URL in `PRICING_DATA.md`. This felt slow but the entire audit engine's credibility depends on accurate inputs so I did not rush it.

## What I learned:
Windsurf's pricing page recently dropped the "Codeium" branding almost entirely several third party blog posts still show old pricing. Always go directly to the official pricing page. Also learned that Claude Team has a 5 seat minimum which is an important audit rule: anyone on Team with fewer than 5 seats should be on Pro.

## Blockers / what I'm stuck on:
Debating App Router vs Pages Router. App Router is newer and server components make OG metadata generation for share pages much cleaner. Going with App Router the generateMetadata API is exactly what I need for the shareable audit URLs.

## Plan for tomorrow:
Build the entire audit engine in `src/lib/audit engine.ts`. Pure TypeScript, no DB calls, no AI. Write tests alongside the logic.

---

## Day 2 — 2025-05-09
 
**Hours worked:** 5
 
**What I did:**
Built the full audit engine — all 4 rule types (seat reduction, plan downgrade, switch tool, buy via credits) for all 8 tools. The tool-specific downgrade rules took longest: each tool has different thresholds (Cursor Business makes sense at 10+ seats, ChatGPT Enterprise only makes sense at 150+ seats, etc). Wrote 10 tests covering all major paths — all pass. Did first user interview: Rohan K., CTO at an 11-person fintech startup, 14 minutes over video call. His line — "if you showed me a page that said here's the exact seat waste and here's how to fix it, I'd act on that in 30 minutes" — confirmed the core product hypothesis.
 
**What I learned:**
Tried briefly making the audit recommendations LLM-powered. Abandoned it after writing the first prompt draft. The problem: if I have to send pricing data to the model to get accurate math, I might as well just run the math deterministically. Non-determinism on dollar amounts is a trust killer. Deterministic rules + source citations is the only defensible approach. AI stays in one place: the summary paragraph.
 
**Blockers / what I'm stuck on:**
The "switch tool" threshold is tricky. Too aggressive and it recommends switching constantly. Too conservative and it misses real savings. Settled on requiring >20% savings AND >$10/mo absolute minimum. May revisit after more user feedback.
 
**Plan for tomorrow:**
Build the full form UI — ToolRow, TeamSettings, AuditForm — and wire up the `/api/audit` route.
 
---

## Note
Please note that I started this assignment a day late due to unavoidable overlaps with my university final exams and my final year project presentation. I want to be completely transparent about my timeline, and I sincerely appreciate your understanding.