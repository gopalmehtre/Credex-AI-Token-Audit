# METRICS.md

## North Star Metric

**Qualified leads generated per week** — defined as email captures from audits showing ≥$100/month in savings.

**Why this and not something else:**

- "Audits completed" is vanity — plenty of people will run the tool and bounce without capturing meaningful intent.
- "Emails captured" overcounts — someone who captures a report showing $0 savings is not a Credex lead.
- "Consultations booked" is too late in the funnel to use as a day-to-day signal.
- Qualified leads (real savings + email) directly predicts Credex revenue and reflects whether both the tool AND the audit logic are working.

**Target:** 25 qualified leads/week by end of month 1, 100/week by month 3.

---

## Three Input Metrics

**1. Audit completion rate** (audits submitted / landing page visits)

Target: ≥20%. If this drops below 15%, the form has too much friction or the headline isn't converting. This is the first lever — everything downstream depends on people finishing the audit.

**2. Email capture rate** (emails captured / audits completed)

Target: ≥25%. The value shown on the results page must be compelling enough to warrant an email. If this drops, either the savings are too low on average (pricing data problem) or the email gate is too prominent (UX problem).

**3. Share rate** (public share URL created or copied / audits completed)

Target: ≥8%. The viral loop only works if people share results. A shared audit is the best distribution — it shows real numbers to a relevant audience. If this is low, the share prompt needs to be more prominent or the results page needs to be more screenshot-worthy.

---

## What to Instrument First

In order of implementation priority:

1. **Audit completion funnel** — track drop-offs at each step of the form (tool added, team size set, submit clicked, API returned, results viewed). Identify where the form loses people.

2. **Results page engagement** — time on page, scroll depth, which recommendation cards are expanded. If users aren't reading the recommendations, the format isn't landing.

3. **Email capture flow** — modal open rate, submission rate, failure rate. A high modal-open + low submit rate means the form is too long or asks for too much.

4. **Share URL clicks** — how many people click links shared via the public URL. This tells you if the share link actually brings back traffic (i.e., if the viral loop has any signal).

5. **Returning visitors** — did anyone come back to run a second audit? High return rate would suggest teams are using it as an ongoing tool, not a one-off.

---

## Pivot Trigger

If **email capture rate drops below 10% over a 7-day rolling average with ≥50 audits completed**, something is structurally wrong.

This would mean fewer than 1 in 10 people who see the results care enough to give an email. The two most likely causes:

1. **Savings are too low** — the audit engine is too conservative and not surfacing real waste. Fix: loosen thresholds, add more alternative tool suggestions.
2. **Trust is broken** — recommendations seem wrong to users. Fix: add confidence indicators, cite sources inline, add "how we calculated this" expandable sections.

At that point, the lead-gen hypothesis fails regardless of traffic volume. The right move is to interview 5 people who completed an audit and did not capture — not to run more traffic.
