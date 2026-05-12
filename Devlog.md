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

## Day 3 — 2025-05-11
 
**Hours worked:** 5
 
**What I did:**
Built AuditForm, ToolRow, and TeamSettings components. The trickiest part was the auto-calculation of monthly spend (seats × plan price) — it needs to update live as the user adjusts seats, but must NOT auto-update for API tools like Anthropic API and OpenAI API where the user enters their actual invoice amount. Hit a bug here: the `isApiTool` flag wasn't being passed into the seats change handler, so changing seats on an API tool was silently overwriting the user's entered spend with a meaningless calculated value. Caught it while testing with an $800/mo Anthropic API entry. Fixed with a one-line conditional. Wired up `/api/audit` with Zod validation, rate limiting, honeypot, and AI summary generation. Full flow works end-to-end. Did second user interview: Priya M., EM at a 28-person Series A, 11 minutes. Her key insight: she wants the report as an artifact to take to her CFO, not just a number to act on herself. Changed the tier-based framing accordingly.
 
**What I learned:**
The auto-populate of monthly spend as users adjust seats makes the form feel alive and reduces input errors significantly. Without it users enter rough guesses. With it, the math is always correct as long as the plan price is accurate — which brings it back to pricing data quality.
 
**Blockers / what I'm stuck on:**
Gemini API summary generation adds ~3 seconds to the audit response time. Acceptable for MVP but would move to async/background job before scaling. Documented the upgrade path in ARCHITECTURE.md.
 
**Plan for tomorrow:**
Build the results page — this is the most important page in the product. It's what gets screenshotted and shared.
 
---

## Day 4 — 2025-05-12
 
**Hours worked:** 6
 
**What I did:**
Built AuditResultsView, RecommendationCard, LeadCaptureModal, CredexPromo, and SharedAuditView components. Results page took the longest — getting the hero savings block hierarchy right (savings number → annual equivalent → percentage reduction → spend comparison bar) without it feeling like a dashboard. Built the shareable audit URL system: each audit gets a `nanoid(10)` share ID stored in the DB, the public `/share/[shareId]` page strips PII and renders with full OG/Twitter metadata. Built the `/api/og` route for dynamic Open Graph images using Next.js ImageResponse. Did third user interview: Marcus T., solo technical founder, 18 minutes. He had Claude Pro AND ChatGPT Plus running simultaneously, using them by feel for different tasks, genuinely uncertain if he was wasting $20/month. Confirmed that honest "you're spending well" results are as valuable as high-savings results — added the explicit optimal verdict copy.
 
**What I learned:**
The CredexPromo component needs to feel earned. Showing it for a $20/mo savings result feels like bait-and-switch and kills trust. Gating it strictly at >$500/mo means every person who sees it genuinely has a reason to book a consultation. The constraint actually makes the promo more effective.
 
**Blockers / what I'm stuck on:**
The CI pipeline needs the postgres service container configured correctly in GitHub Actions. Setting that up tomorrow alongside the documentation push.
 
**Plan for tomorrow:**
Write all 12 required documentation files, set up GitHub Actions CI, deploy to Vercel, run Lighthouse.
 
---

## Day 5 — Final Deployment & Polish
 
**Hours worked:** 5
 
**What I did:**
- **Final Debugging:** Squashed the last few critical bugs blocking production. Fixed a local Docker port collision that was masking the DB, upgraded dynamic routing parameters (`params`) to properly handle Next.js 15+ async Promises, and resolved a pesky React hydration mismatch on the `/audit` form caused by `localStorage` initializations and browser extension injections by moving the form to a dynamic, client-only wrapper.
- **AI Refinement:** Fixed an issue where the Gemini AI summary was prematurely truncating its output mid-sentence by completely removing the `max_tokens` constraint, allowing it to natively fulfill the prompt instructions.
- **Testing:** Added the missing Jest test runner to `package.json` and verified that 100% of the core audit engine logic tests pass cleanly.
- **Documentation:** Wrote all 12 documentation files: README, ARCHITECTURE (with Mermaid system diagram), PRICING_DATA, PROMPTS, TESTS, DEVLOG, REFLECTION, GTM, ECONOMICS, USER_INTERVIEWS, LANDING_COPY, METRICS. 
- **CI/CD & Deployment:** Set up `.github/workflows/ci.yml` — postgres service container, lint, `tsc --noEmit`, tests, build. All green on first push after a minor TypeScript config fix. Deployed to Vercel with Neon managed Postgres for production. 
- **Audit:** Ran Lighthouse: Performance 91, Accessibility 94, Best Practices 95. Two accessibility fixes needed: missing `aria-label` on icon-only buttons and insufficient contrast on `text-ink-600` elements against the dark background. Fixed both. 
- **Completion:** Did a full end-to-end test: landing → form → audit → results → email capture → share URL → public page. Everything works. Submitted the Google Form.
 
**What I learned:**
Writing ECONOMICS.md forced me to do the funnel math properly instead of describing it vaguely. The real insight was that the tool only needs to convert 0.25% of visitors to customers to hit $1M ARR — but that requires 40k visitors/month, which means the viral share loop has to actually work. That's a testable hypothesis, not a given. Additionally, the Next.js 15+ async/await changes on dynamic route `params` are strict, and resolving server/client hydration mismatches when relying on `localStorage` requires very deliberate architectural separation.
 
**Blockers / what I'm stuck on:**
Nothing blocking — the project is successfully submitted!


## Note
Please note that I started this assignment a day late due to unavoidable overlaps with my university final exams and my final year project presentation. I want to be completely transparent about my timeline, and I sincerely appreciate your understanding.