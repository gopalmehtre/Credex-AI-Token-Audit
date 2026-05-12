import type {
  AuditFormInput,
  AuditResult,
  RecommendationType,
  ToolId,
  ToolInput,
  ToolRecommendation,
  UseCase,
} from '@/types';
import { PRICING_DATA, getPlan } from './pricing-data';

//Main entry point

export function runAuditEngine(input: AuditFormInput): AuditResult {
  const recommendations: ToolRecommendation[] = input.tools.map((toolInput) =>
    evaluateTool(toolInput, input.teamSize, input.useCase)
  );

  const totalMonthlySavings = recommendations.reduce((sum, r) => sum + r.monthlySavings, 0);
  const totalAnnualSavings = totalMonthlySavings * 12;
  const totalCurrentSpend = recommendations.reduce((sum, r) => sum + r.currentSpend, 0);
  const totalProjectedSpend = recommendations.reduce((sum, r) => sum + r.projectedSpend, 0);

  const savingsTier =
    totalMonthlySavings > 500
      ? 'high'
      : totalMonthlySavings > 100
        ? 'medium'
        : totalMonthlySavings > 0
          ? 'low'
          : 'optimal';

  return {
    recommendations,
    totalMonthlySavings: round2(totalMonthlySavings),
    totalAnnualSavings: round2(totalAnnualSavings),
    totalCurrentSpend: round2(totalCurrentSpend),
    totalProjectedSpend: round2(totalProjectedSpend),
    savingsTier,
  };
}

//Per-tool evaluator

function evaluateTool(
  toolInput: ToolInput,
  teamSize: number,
  useCase: UseCase
): ToolRecommendation {
  const toolData = PRICING_DATA[toolInput.toolId];
  const currentPlan = getPlan(toolInput.toolId, toolInput.plan);
  const toolName = toolData?.name ?? toolInput.toolId;
  const currentSpend = toolInput.monthlySpend;
  const seats = toolInput.seats;

  // API tools: spend is user-entered, analyze by usage pattern
  if (toolInput.toolId === 'anthropic_api' || toolInput.toolId === 'openai_api') {
    return evaluateApiTool(toolInput, teamSize, useCase);
  }

  if (!currentPlan || !toolData) {
    return makeOptimalRec(toolInput, toolName);
  }

  const perSeatCost = currentSpend / Math.max(seats, 1);

  //Rule 1: Seats vs team size mismatch
  if (seats > teamSize * 1.25) {
    const idealSeats = teamSize;
    const idealSpend = currentPlan.pricePerUserPerMonth * idealSeats;
    const savings = currentSpend - idealSpend;
    if (savings > 5) {
      return {
        toolId: toolInput.toolId,
        toolName,
        currentPlan: currentPlan.name,
        currentSpend,
        recommendedAction: 'reduce_seats',
        recommendedPlan: currentPlan.name,
        projectedSpend: round2(idealSpend),
        monthlySavings: round2(savings),
        annualSavings: round2(savings * 12),
        reasoning: `You're paying for ${seats} seats but your team has ${teamSize} people. Removing ${seats - teamSize} unused seat(s) at $${currentPlan.pricePerUserPerMonth}/seat saves $${round2(savings)}/mo with zero capability loss.`,
        confidence: 'high',
      };
    }
  }

  // Rule 2: Plan too heavy for team size
  const downgradePlan = findDowngrade(toolInput.toolId, toolInput.plan, seats, useCase);
  if (downgradePlan) {
    const projectedSpend = downgradePlan.pricePerUserPerMonth * seats;
    const savings = currentSpend - projectedSpend;
    if (savings > 5) {
      return {
        toolId: toolInput.toolId,
        toolName,
        currentPlan: currentPlan.name,
        currentSpend,
        recommendedAction: 'downgrade_plan',
        recommendedPlan: downgradePlan.name,
        projectedSpend: round2(projectedSpend),
        monthlySavings: round2(savings),
        annualSavings: round2(savings * 12),
        reasoning: buildDowngradeReasoning(toolInput, currentPlan.name, downgradePlan.name, savings, seats, teamSize),
        confidence: 'medium',
      };
    }
  }

  //Rule 3: Switch to cheaper alternative
  const altRec = findCheaperAlternative(toolInput, teamSize, useCase, currentSpend);
  if (altRec) return altRec;

  //Rule 4: Credits opportunity (high spend threshold)
  if (currentSpend >= 200) {
    return {
      toolId: toolInput.toolId,
      toolName,
      currentPlan: currentPlan.name,
      currentSpend,
      recommendedAction: 'buy_via_credits',
      recommendedPlan: currentPlan.name,
      projectedSpend: round2(currentSpend * 0.7), // conservative 30% discount estimate
      monthlySavings: round2(currentSpend * 0.3),
      annualSavings: round2(currentSpend * 0.3 * 12),
      reasoning: `At $${currentSpend}/mo you qualify for discounted credits. Credex sources ${toolName} credits from companies that over-forecasted, typically at 20–35% below retail. Your exact discount depends on current inventory.`,
      confidence: 'medium',
    };
  }

  //No savings found
  return makeOptimalRec(toolInput, toolName, currentPlan?.name);
}

//API tool analysis

function evaluateApiTool(
  toolInput: ToolInput,
  teamSize: number,
  useCase: UseCase
): ToolRecommendation {
  const isAnthropic = toolInput.toolId === 'anthropic_api';
  const toolName = isAnthropic ? 'Anthropic API' : 'OpenAI API';
  const currentSpend = toolInput.monthlySpend;

  // High API spend → check if managed plan covers needs cheaper
  const perPersonSpend = currentSpend / Math.max(teamSize, 1);

  if (perPersonSpend > 40 && (useCase === 'writing' || useCase === 'research')) {
    // A managed Claude Pro or ChatGPT Plus seat is $20–30/user and likely covers their usage
    const altTool = isAnthropic ? 'claude' : 'chatgpt';
    const altName = isAnthropic ? 'Claude Pro' : 'ChatGPT Plus';
    const altPrice = 20; // per user
    const projectedSpend = altPrice * teamSize;
    const savings = currentSpend - projectedSpend;

    if (savings > 0) {
      return {
        toolId: toolInput.toolId,
        toolName,
        currentPlan: 'API Pay-as-you-go',
        currentSpend,
        recommendedAction: 'switch_tool',
        recommendedTool: altName,
        projectedSpend: round2(projectedSpend),
        monthlySavings: round2(savings),
        annualSavings: round2(savings * 12),
        reasoning: `Your team spends $${round2(perPersonSpend)}/person/mo on ${toolName} primarily for ${useCase}. ${altName} at $${altPrice}/user/mo includes a generous usage quota that likely covers this — API billing is only cheaper when usage is variable or automation-heavy.`,
        confidence: 'medium',
      };
    }
  }

  // Credits opportunity at high absolute spend
  if (currentSpend >= 500) {
    return {
      toolId: toolInput.toolId,
      toolName,
      currentPlan: 'API Pay-as-you-go',
      currentSpend,
      recommendedAction: 'buy_via_credits',
      projectedSpend: round2(currentSpend * 0.72),
      monthlySavings: round2(currentSpend * 0.28),
      annualSavings: round2(currentSpend * 0.28 * 12),
      reasoning: `At $${currentSpend}/mo in API spend you are an ideal candidate for prepaid credits. Credex sources pre-paid API credit blocks at 25–35% below pay-as-you-go rates from companies that over-provisioned. No change to your integration required.`,
      confidence: 'high',
    };
  }

  return makeOptimalRec(toolInput, toolName, 'API Pay-as-you-go');
}

//Helpers

function findDowngrade(
  toolId: ToolId,
  currentPlanId: string,
  seats: number,
  useCase: UseCase
) {
  const toolData = PRICING_DATA[toolId];
  if (!toolData) return null;
  const currentPlan = getPlan(toolId, currentPlanId);
  if (!currentPlan) return null;

  // Specific rules per tool
  if (toolId === 'cursor') {
    if (currentPlanId === 'business' && seats < 10) {
      return getPlan(toolId, 'pro');
    }
    if (currentPlanId === 'enterprise' && seats < 20) {
      return getPlan(toolId, 'business');
    }
  }

  if (toolId === 'github_copilot') {
    if (currentPlanId === 'enterprise' && (useCase === 'coding') && seats < 50) {
      return getPlan(toolId, 'business');
    }
  }

  if (toolId === 'claude') {
    if (currentPlanId === 'max_20x' && seats === 1) {
      return getPlan(toolId, 'max_5x');
    }
    if (currentPlanId === 'enterprise' && seats < 10) {
      return getPlan(toolId, 'team');
    }
    if (currentPlanId === 'team' && seats < 5) {
      return getPlan(toolId, 'pro');
    }
  }

  if (toolId === 'chatgpt') {
    if (currentPlanId === 'enterprise' && seats < 150) {
      return getPlan(toolId, 'team');
    }
    if (currentPlanId === 'team' && seats < 2) {
      return getPlan(toolId, 'plus');
    }
  }

  if (toolId === 'gemini') {
    if (currentPlanId === 'api_pay_as_you_go' && useCase !== 'coding' && useCase !== 'data') {
      return getPlan(toolId, 'advanced');
    }
  }

  if (toolId === 'windsurf') {
    if (currentPlanId === 'teams' && seats < 2) {
      return getPlan(toolId, 'pro');
    }
  }

  return null;
}

function findCheaperAlternative(
  toolInput: ToolInput,
  teamSize: number,
  useCase: UseCase,
  currentSpend: number
): ToolRecommendation | null {
  const toolData = PRICING_DATA[toolInput.toolId];
  if (!toolData || toolData.alternatives.length === 0) return null;

  for (const altId of toolData.alternatives) {
    const altTool = PRICING_DATA[altId];
    if (!altTool) continue;

    // Find the best-fit plan for this use case
    const bestAltPlan = altTool.plans
      .filter((p) => p.bestFor.includes(useCase) || p.bestFor.includes('mixed'))
      .sort((a, b) => a.pricePerUserPerMonth - b.pricePerUserPerMonth)[0];

    if (!bestAltPlan) continue;

    const altSpend = bestAltPlan.pricePerUserPerMonth * toolInput.seats;
    const savings = currentSpend - altSpend;

    // Only recommend if savings > 20% and > $10/mo absolute
    if (savings > currentSpend * 0.2 && savings > 10) {
      const currentPlan = getPlan(toolInput.toolId, toolInput.plan);
      return {
        toolId: toolInput.toolId,
        toolName: toolData.name,
        currentPlan: currentPlan?.name ?? toolInput.plan,
        currentSpend,
        recommendedAction: 'switch_tool',
        recommendedTool: `${altTool.name} ${bestAltPlan.name}`,
        projectedSpend: round2(altSpend),
        monthlySavings: round2(savings),
        annualSavings: round2(savings * 12),
        reasoning: buildSwitchReasoning(toolData.name, altTool.name, bestAltPlan.name, savings, useCase),
        confidence: 'medium',
      };
    }
  }

  return null;
}

function buildDowngradeReasoning(
  toolInput: ToolInput,
  fromPlan: string,
  toPlan: string,
  savings: number,
  seats: number,
  teamSize: number
): string {
  const toolName = PRICING_DATA[toolInput.toolId]?.name ?? toolInput.toolId;

  const contextMap: Partial<Record<ToolId, string>> = {
    cursor: `The ${toPlan} plan includes unlimited completions and 500 fast requests/month — the ${fromPlan} tier adds SSO and admin controls only worth the premium for 10+ person engineering teams.`,
    github_copilot: `The ${fromPlan} tier's custom model fine-tuning and knowledge bases add value only for large org deployments. ${toPlan} covers all practical coding assistant needs at ${seats} seats.`,
    claude: `At ${seats} seat(s), the ${toPlan} plan's usage limits are sufficient. The ${fromPlan} tier is priced for teams that need higher quotas or compliance controls.`,
    chatgpt: `With ${seats} users, ${toPlan} handles your workload. The ${fromPlan} plan's minimum seat requirements and premium pricing are designed for large enterprise deployments.`,
  };

  return contextMap[toolInput.toolId] ??
    `Downgrading from ${fromPlan} to ${toPlan} for ${seats} users saves $${round2(savings)}/mo. The feature difference primarily affects teams 3× your size.`;
}

function buildSwitchReasoning(
  fromTool: string,
  toTool: string,
  toPlan: string,
  savings: number,
  useCase: UseCase
): string {
  const useCaseLabel: Record<UseCase, string> = {
    coding: 'code generation',
    writing: 'writing assistance',
    data: 'data analysis',
    research: 'research',
    mixed: 'general AI assistance',
  };

  return `For ${useCaseLabel[useCase]}, ${toTool} ${toPlan} delivers comparable output quality at significantly lower cost. The $${round2(savings)}/mo difference reflects pricing strategy, not capability gap for this use case.`;
}

function makeOptimalRec(
  toolInput: ToolInput,
  toolName: string,
  planName?: string
): ToolRecommendation {
  return {
    toolId: toolInput.toolId,
    toolName,
    currentPlan: planName ?? toolInput.plan,
    currentSpend: toolInput.monthlySpend,
    recommendedAction: 'already_optimal',
    projectedSpend: toolInput.monthlySpend,
    monthlySavings: 0,
    annualSavings: 0,
    reasoning: `Your current plan is well-matched to your team size and use case. No immediate savings opportunity identified.`,
    confidence: 'high',
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

//Utility exports for tests

export { findDowngrade, findCheaperAlternative, round2 };