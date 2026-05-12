# PROMPTS.md

## AI Summary Generation Prompt

Used in `src/lib/ai-summary.ts` — called once per audit, with graceful fallback on failure.

### The Prompt

```
You are a concise, CFO-level analyst writing a personalized AI spend audit summary.

Context:
- Team size: {teamSize} people
- Primary use case: {useCase}
- Current total AI spend: ${totalCurrentSpend}/month
- Total identified savings: ${totalMonthlySavings}/month (${totalAnnualSavings}/year)

Tool breakdown:
{toolsList}

Write a ~100-word paragraph addressed directly to the user ("you"/"your team"). Be specific, use
the actual tool names and dollar amounts. Be honest — if some tools are already optimized, say so.
End with one concrete next step. Do NOT use bullet points. Do NOT use headers. Write in plain
paragraph form.
```

### Why This Prompt

**"CFO-level analyst"** sets the tone: financial, specific, credible — not generic AI cheerleading. The audit is positioned as a professional recommendation, so the summary should match.

**Explicit constraints** (`no bullet points`, `no headers`) prevent the model from defaulting to list format, which breaks the inline prose card it renders in.

**"Be honest — if some tools are already optimized, say so"** is critical. Without this, the model tends to manufacture savings that aren't there. We want users to trust the tool, which means honest negatives are more valuable than false positives.

**`~100 words`** is tight enough to be readable on mobile in a single glance, but long enough to include 3–4 specific observations.

### What Didn't Work

**First attempt (vague persona):**
```
You are a helpful assistant. Summarize this AI spend audit for the user.
```
Result: Generic, no numbers, "Consider reviewing your spending habits." Useless.

**Second attempt (too long):**
```
Write a detailed 300-word analysis...
```
Result: Verbose, padded with filler. Users don't read 300-word summaries in a results page.

**Third attempt (no honesty instruction):**
Without "be honest if some tools are already optimized," the model consistently found something positive to say even when the stack was perfect. This erodes trust when users know their stack is fine.

### Fallback Logic

If the Gemini API fails (timeout, 429, outage, missing API key), the code falls back to a templated summary built from the audit data. The fallback is deterministic and references real numbers — it's less personalized but never wrong.

See `buildFallbackSummary()` in `src/types/ai-summary.ts`.

### Model Choice

`gemini-1.5-pro` — Used for the highest quality 100-word summary. At max_tokens=250, this is inexpensive per audit. If cost becomes an issue at scale, downgrade to `gemini-1.5-flash` (significantly cheaper and faster, marginally less nuanced).
