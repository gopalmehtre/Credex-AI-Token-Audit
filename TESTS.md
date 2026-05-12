# TESTS.md

All automated tests are in `__tests__/audit-engine.test.ts`.

## How to Run

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

## Test Inventory

| File | Test Name | What It Covers |
|------|-----------|----------------|
| `audit-engine.test.ts` | Seat reduction — seats > teamSize × 1.25 | Detects when a team is paying for more seats than it has members; verifies correct savings calculation |
| `audit-engine.test.ts` | Plan downgrade — Cursor Business → Pro | Verifies that Cursor Business is recommended to downgrade to Pro for <10 seats; checks projected spend and savings math |
| `audit-engine.test.ts` | Plan downgrade — Claude Team → Pro | Verifies Claude Team downgrades to Pro for <5 seats |
| `audit-engine.test.ts` | Already optimal — GitHub Copilot Individual | Confirms that a perfectly-sized single-seat plan returns `already_optimal` with $0 savings |
| `audit-engine.test.ts` | API credits recommendation — Anthropic API ≥$500 | Verifies that high API spend (≥$500/mo) triggers a `buy_via_credits` recommendation with high confidence |
| `audit-engine.test.ts` | Aggregate totals — multi-tool | Confirms `totalCurrentSpend`, `totalMonthlySavings`, and `totalAnnualSavings` are correctly summed across 2 tools |
| `audit-engine.test.ts` | Savings tier — high (>$500) | Verifies tier classification: `savings > 500` → `'high'` |
| `audit-engine.test.ts` | Savings tier — optimal ($0) | Verifies tier classification: `savings = 0` → `'optimal'` |
| `audit-engine.test.ts` | ChatGPT Enterprise → Team downgrade | Verifies that <150 seats on ChatGPT Enterprise triggers a Team downgrade recommendation |
| `audit-engine.test.ts` | round2 utility | Unit tests for the rounding helper used in all money calculations |

## Notes

- Tests run against the real `runAuditEngine` function with no mocks — they test business logic end-to-end.
- Database and API calls are not involved in any test (audit engine is pure functions).
- To test the API routes, use the deployed URL or run `npm run dev` and hit the endpoints manually.
