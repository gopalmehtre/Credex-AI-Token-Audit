# ECONOMICS.md

## What's a Converted Lead Worth to Credex?

Credex sells discounted AI infrastructure credits. A "converted lead" is someone who books a consultation and then purchases a credit package.

**Reasoning:**

- Average startup AI spend identified in audits: ~$800/mo (based on 5-15 person team across 3-5 tools)
- Credex discount margin: ~25-35% below retail
- Typical first purchase: 3-6 months of credits upfront (customers want to lock in the discount)
- Average deal size: $800 × 4 months × 30% margin = **$960 gross profit per converted customer**
- Retention: customers who buy credits renew ~70% of the time (switching cost is near-zero but discount is meaningful)
- LTV estimate (12-month): $960 first purchase + 0.7 × $960 renewal = **~$1,632 LTV per customer**

Conservative figure used for unit economics below: **$1,000 LTV per converted customer.**

---

## CAC by Channel

| Channel | Effort (hrs/week) | Audits Generated | Email Capture Rate | Consultation Rate | Purchase Rate | CAC |
|---------|-------------------|------------------|--------------------|-------------------|---------------|-----|
| Hacker News (organic) | 2 | 500/post | 25% | 8% | 20% | $0 cash, ~$40 time |
| Reddit (organic) | 3 | 150/post | 20% | 6% | 20% | $0 cash, ~$60 time |
| X cold DMs | 4 | 30/week | 15% | 10% | 25% | $0 cash, ~$80 time |
| Credex existing customers | 1 (email) | 50/send | 40% | 20% | 35% | ~$5 (email cost) |
| Shareable audit URLs (viral) | 0 | Variable | 20% | 5% | 20% | $0 |

**Blended CAC estimate for first 100 customers: ~$50 (all-in time + minimal tool costs)**

This is unusually low because the product itself is the acquisition channel — the audit result is valuable enough that people share it, and sharing brings more users.

---

## Conversion Funnel Math

Working backwards from the purchase:

```
10,000 visitors
  → 2,000 audits completed (20% start-to-finish rate)
  → 500 email captures (25% of completers)
  → 100 consultation bookings (20% of email captures — only high-value leads are prompted)
  → 25 credit purchases (25% close rate from consultation)

25 customers × $1,000 LTV = $25,000 revenue from 10,000 visitors
Revenue per visitor: $2.50
```

**The conversion funnel that makes this work:**
- Audit completion rate must stay >15%. If the form is too long, nobody finishes.
- Email capture rate must stay >20%. If value isn't shown clearly before the gate, it collapses.
- Consultation booking must target only genuinely high-value leads (>$500/mo savings). Booking rate from that subset is much higher than the raw average.

---

## What Would Have to Be True for $1M ARR in 18 Months?

$1M ARR = ~$83k/month in recurring revenue.

At $1,000 LTV and 70% renewal rate, "recurring" means keeping customers on a 6-month credit renewal cycle.

**Math:**
- Need ~600 active customers paying ~$1,400/year (6-month deal × 2)
- At 25% monthly churn on Credex relationships (customers find alternative suppliers), need to acquire ~150 new customers/month by month 18
- At 0.25% conversion rate (visitors → customer), need ~60,000 visitors/month

**What has to be true:**
1. **Viral loop works.** Each shared audit brings back at least 0.3 new audit completions. At 25 conversions/10k visitors, 3% of completers share — needs to be 8%+.
2. **Credex closes deals efficiently.** The consultation → purchase rate must stay ≥25%. This requires Credex sales motion, not just the tool.
3. **Inventory stays available.** Credex needs consistent supply of discounted credits. If supply dries up, the business breaks regardless of lead volume.
4. **SEO compounds.** "AI spend audit" as a keyword category is relatively new. If SpendSight ranks for comparison queries by month 6, organic traffic compounds without incremental marketing spend.

**Rough sensitivity table:**

| Visitors/mo | Audit Rate | Email Rate | Consult Rate | Close Rate | Customers/mo | ARR at 18mo |
|-------------|------------|------------|--------------|------------|--------------|-------------|
| 10,000 | 20% | 25% | 20% | 25% | 25 | ~$300k |
| 30,000 | 20% | 25% | 20% | 25% | 75 | ~$900k |
| 40,000 | 20% | 25% | 20% | 25% | 100 | **~$1.2M** |

Getting to 40k visitors/month in 18 months requires: a successful HN launch, consistent Reddit presence, SEO traction on comparison queries, and the viral share loop working as designed. Ambitious but not implausible for a genuinely useful free tool in a category with real pain.