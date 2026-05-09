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

## Note
Please note that I started this assignment a day late due to unavoidable overlaps with my university final exams and my final year project presentation. I want to be completely transparent about my timeline, and I sincerely appreciate your understanding.