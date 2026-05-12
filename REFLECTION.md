# REFLECTION.md

## 1. Hardest Bug — The Seat Auto-Calculation on API Tools

The most frustrating bug of the week was subtle: when users changed the seat count on any tool, the `monthlySpend` field auto-updated to `seats × plan.pricePerUserPerMonth`. This is correct for seat-based tools (Cursor Pro: 5 seats → $100/mo). But Anthropic API and OpenAI API are token-billed — users enter their actual invoice amount, and auto-updating that amount when they changed "number of users" was silently overwriting real numbers with meaningless ones.

**Hypotheses I formed:**
1. Is the issue in the ToolRow component's `handleSeatsChange` function? (Yes, but not the full picture)
2. Is the issue that API tools shouldn't have a "seats" field at all? (No — team size is relevant for the per-person spend analysis)
3. Is the issue that the `isApiTool` flag isn't being passed to the auto-update logic? (Yes — this was it)

**What I tried:**
First I added a console.log to verify the value was being overwritten (it was). Then I traced the update chain: `handleSeatsChange` → called `onChange` with `monthlySpend: plan.pricePerUserPerMonth * seats` → this was wrong for API tools. The fix was a one-line conditional: `monthlySpend: isApiTool ? tool.monthlySpend : autoSpend`. 

**Why it was hard:** The bug was invisible in the happy path (most users don't have API tools), and the wrong value looked plausible (a small dollar amount). I only caught it when testing with an Anthropic API entry of $800/mo — after adjusting seats, it reset to $0.

---

## 2. A Decision I Reversed — LLM-Powered Audit Recommendations

On Day 1, I planned to use Claude to evaluate whether each tool was right-sized. The plan: send the user's full tool list + team size + use case to the API and get back structured JSON recommendations. It felt elegant — one API call, personalized reasoning, no hard-coded rules to maintain.

I reversed this on Day 2, after writing the first draft of the prompt.

**What made me reverse it:**
Three things. First, I realized the prompt would need to include all 8 tools' pricing to get accurate math — and if I'm sending pricing data to the model, I might as well just run the math myself deterministically. Second, non-determinism is dangerous on money: if two users with identical inputs get different recommendations, one of them is wrong, and I can't explain which. Third, the assignment explicitly said "knowing when not to use AI is part of the test." The rule-based engine is faster, auditable, source-cited, and correct. The LLM adds nothing to the math and risks adding hallucinated savings.

The AI stayed in one place: the personalized summary paragraph. There, creativity and natural language actually add value over a template.

---

## 3. What I'd Build in Week 2

**The benchmark feature.** This came directly from user interview #2 (Priya). She didn't just want to know her absolute spend — she wanted to know if her $120/engineer/month was high or low for a 28-person Series A. The current tool can't answer that.

Week 2 plan: after every audit is completed and stored, compute aggregate statistics by company stage (inferred from team size) and use case. Surface a "your team spends $X/engineer/month on AI — teams your size average $Y" line on the results page. This requires enough audit volume to be statistically meaningful (~200+ audits), but it's the feature most likely to make the results page screenshot-worthy and shareable.

Second priority: **Enhanced data visualizations** for the results page. While the current text-based hierarchy works well, adding interactive charts showing current vs. projected spend over time would make the ROI case even stronger for finance teams.

---

## 4. How I Used AI Tools

**Claude (claude.ai):** Used for first drafts of the documentation files (GTM, ECONOMICS, LANDING_COPY). I'd write a rough bullet outline, ask Claude to draft the full section, then rewrite substantially. Claude's first draft of ECONOMICS was vague TAM hand-waving — I had to replace most of it with real funnel math after the Priya interview. Also used for debugging TypeScript type errors in the `pg` query wrappers — it was right about 80% of the time, wrong 20%.

**Antigravity:** Used for the component files. The autocomplete was useful for repetitive patterns (the form field structure, the `cn()` class compositions). I did not trust it for the audit engine logic — it kept suggesting to add `Math.floor` where I needed `Math.round`, and once generated a savings calculation that was off by a factor of 12 (annualizing monthly savings instead of multiplying by 12, then annualizing again).

**One specific AI error I caught:** When writing the `findCheaperAlternative` function, Antigravity suggested using `filter().sort()[0]` but returned the *most expensive* plan instead of the cheapest — it sorted ascending but I needed the first element of ascending, which is the minimum. The suggestion was `sort((a, b) => b.pricePerUserPerMonth - a.pricePerUserPerMonth)` — descending — which would have recommended the most expensive alternative. Caught it by running the test suite.

**What I didn't trust AI with:** The pricing data. Every number was manually verified against official vendor pages. An LLM confidently giving me a wrong price for Cursor Business would have broken the entire audit engine's credibility.

---

## 5. Self-Rating

**Discipline: 8/10**
Committed on 6 of 7 days with meaningful progress. Day 3 ran long on the form UX because I got into polishing details before the core was complete. Should have shipped ugly and iterated.

**Code quality: 7/10**
The audit engine is clean, well-tested, and readable. The component layer has some prop drilling that would need a context refactor at scale. The API routes handle errors but could be more granular about error types.

**Design sense: 8/10**
The dark theme with lime green accent is distinctive and appropriate for a financial/technical tool. The results page hierarchy (savings hero → AI summary → per-tool breakdown) communicates well. The one weakness: mobile layout for the ToolRow component is compressed and requires horizontal scrolling on very small screens.

**Problem-solving: 8/10**
The seat bug was found and fixed quickly. The decision to use deterministic rules instead of LLM was the right call and I recognized it early. The rate limiting approach (DB-backed vs Redis) was a deliberate trade-off, not an oversight.

**Entrepreneurial thinking: 7/10**
The user interviews were genuine and changed the product in concrete ways. The GTM plan is specific (named subreddits, exact DM approach, viral loop mechanism). The weakness: I didn't think hard enough about the Credex handoff — what happens after a consultation is booked? That's the revenue moment, and it's entirely outside the tool. I documented it but didn't design for it.
