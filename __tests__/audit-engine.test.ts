import { runAuditEngine, round2 } from '@/lib/audit-engine';
import type { AuditFormInput } from '@/types';

// Test 1: Seat overpayment detection
describe('runAuditEngine — seat reduction', () => {
  it('recommends reducing seats when seats > teamSize by >25%', () => {
    const input: AuditFormInput = {
      tools: [
        {
          toolId: 'cursor',
          plan: 'pro',
          monthlySpend: 200, // 10 seats × $20
          seats: 10,
        },
      ],
      teamSize: 5, // only 5 people
      useCase: 'coding',
    };

    const result = runAuditEngine(input);
    const rec = result.recommendations[0];

    expect(rec.recommendedAction).toBe('reduce_seats');
    expect(rec.monthlySavings).toBeGreaterThan(0);
    expect(rec.monthlySavings).toBe(100); // 5 seats × $20
    expect(rec.annualSavings).toBe(1200);
  });
});

//  Test 2: Plan downgrade — Cursor Business Pro
describe('runAuditEngine — plan downgrade', () => {
  it('recommends Cursor Pro when Business is used with <10 seats', () => {
    const input: AuditFormInput = {
      tools: [
        {
          toolId: 'cursor',
          plan: 'business',
          monthlySpend: 200, // 5 seats × $40
          seats: 5,
        },
      ],
      teamSize: 5,
      useCase: 'coding',
    };

    const result = runAuditEngine(input);
    const rec = result.recommendations[0];

    expect(rec.recommendedAction).toBe('downgrade_plan');
    expect(rec.recommendedPlan).toBe('Pro');
    expect(rec.projectedSpend).toBe(100); // 5 × $20
    expect(rec.monthlySavings).toBe(100);
  });

  it('recommends Claude Pro when Team is used with <5 seats', () => {
    const input: AuditFormInput = {
      tools: [
        {
          toolId: 'claude',
          plan: 'team',
          monthlySpend: 60, // 2 seats × $30
          seats: 2,
        },
      ],
      teamSize: 2,
      useCase: 'writing',
    };

    const result = runAuditEngine(input);
    const rec = result.recommendations[0];

    expect(rec.recommendedAction).toBe('downgrade_plan');
    expect(rec.recommendedPlan).toBe('Pro');
    expect(rec.monthlySavings).toBe(20); // $60 → $40 (2 × $20)
  });
});

// Test 3: Already-optimal detection
describe('runAuditEngine — already optimal', () => {
  it('marks a well-sized plan as already_optimal', () => {
    const input: AuditFormInput = {
      tools: [
        {
          toolId: 'github_copilot',
          plan: 'individual',
          monthlySpend: 10,
          seats: 1,
        },
      ],
      teamSize: 1,
      useCase: 'coding',
    };

    const result = runAuditEngine(input);
    const rec = result.recommendations[0];

    expect(rec.recommendedAction).toBe('already_optimal');
    expect(rec.monthlySavings).toBe(0);
    expect(rec.annualSavings).toBe(0);
  });
});

// Test 4: API tool — high spend triggers credits recommendation
describe('runAuditEngine — API credits recommendation', () => {
  it('recommends Credex credits for Anthropic API spend ≥$500', () => {
    const input: AuditFormInput = {
      tools: [
        {
          toolId: 'anthropic_api',
          plan: 'pay_as_you_go',
          monthlySpend: 1200,
          seats: 1,
        },
      ],
      teamSize: 5,
      useCase: 'coding',
    };

    const result = runAuditEngine(input);
    const rec = result.recommendations[0];

    expect(rec.recommendedAction).toBe('buy_via_credits');
    expect(rec.monthlySavings).toBeGreaterThan(0);
    expect(rec.confidence).toBe('high');
  });
});

//  Test 5: Aggregate totals are correct 
describe('runAuditEngine — aggregate totals', () => {
  it('correctly sums monthly and annual savings across multiple tools', () => {
    const input: AuditFormInput = {
      tools: [
        {
          toolId: 'cursor',
          plan: 'business',
          monthlySpend: 200, // 5 × $40, should downgrade to Pro: saves $100
          seats: 5,
        },
        {
          toolId: 'github_copilot',
          plan: 'individual',
          monthlySpend: 10, // already optimal
          seats: 1,
        },
      ],
      teamSize: 5,
      useCase: 'coding',
    };

    const result = runAuditEngine(input);

    expect(result.totalCurrentSpend).toBe(210);
    expect(result.totalMonthlySavings).toBeGreaterThan(0);
    expect(result.totalAnnualSavings).toBe(round2(result.totalMonthlySavings * 12));
    expect(result.recommendations).toHaveLength(2);
  });
});

// Test 6: Savings tier classification
describe('runAuditEngine — savings tier', () => {
  it('classifies >$500/mo savings as high tier', () => {
    const input: AuditFormInput = {
      tools: [
        {
          toolId: 'anthropic_api',
          plan: 'pay_as_you_go',
          monthlySpend: 2000,
          seats: 1,
        },
      ],
      teamSize: 10,
      useCase: 'coding',
    };

    const result = runAuditEngine(input);
    expect(result.savingsTier).toBe('high');
  });

  it('classifies 0 savings as optimal', () => {
    const input: AuditFormInput = {
      tools: [
        {
          toolId: 'github_copilot',
          plan: 'individual',
          monthlySpend: 10,
          seats: 1,
        },
      ],
      teamSize: 1,
      useCase: 'coding',
    };

    const result = runAuditEngine(input);
    expect(result.savingsTier).toBe('optimal');
  });
});

// Test 7: ChatGPT enterprise → team downgrade
describe('runAuditEngine — chatgpt enterprise downgrade', () => {
  it('recommends Team plan for <150 seats on ChatGPT Enterprise', () => {
    const input: AuditFormInput = {
      tools: [
        {
          toolId: 'chatgpt',
          plan: 'enterprise',
          monthlySpend: 600, // 10 × $60
          seats: 10,
        },
      ],
      teamSize: 10,
      useCase: 'mixed',
    };

    const result = runAuditEngine(input);
    const rec = result.recommendations[0];

    expect(rec.recommendedAction).toBe('downgrade_plan');
    expect(rec.recommendedPlan).toBe('Team');
    expect(rec.projectedSpend).toBe(300); // 10 × $30
    expect(rec.monthlySavings).toBe(300);
  });
});

//  Test 8: round2 utility 
describe('round2 utility', () => {
  it('rounds to 2 decimal places correctly', () => {
    expect(round2(1.006)).toBe(1.01);
    expect(round2(100)).toBe(100);
    expect(round2(33.333333)).toBe(33.33);
    expect(round2(0)).toBe(0);
    expect(round2(99.999)).toBe(100);
    expect(round2(1.234)).toBe(1.23);
    expect(round2(0.125)).toBe(0.13);
  });
});

