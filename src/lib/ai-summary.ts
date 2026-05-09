import OpenAI from 'openai';
import type { AuditFormInput, AuditResult, UseCase } from '@/types';

const client = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
});

const USE_CASE_LABELS: Record<UseCase, string> = {
  coding: 'software engineering / coding',
  writing: 'content writing and communication',
  data: 'data analysis and processing',
  research: 'research and knowledge work',
  mixed: 'a mix of use cases across the team',
};

function buildPrompt(input: AuditFormInput, result: AuditResult): string {
  const toolsList = result.recommendations
    .map(
      (r) =>
        `- ${r.toolName} (${r.currentPlan}): $${r.currentSpend}/mo → ${
          r.recommendedAction === 'already_optimal'
            ? 'already optimal'
            : `save $${r.monthlySavings}/mo by ${r.recommendedAction.replace(/_/g, ' ')}`
        }`
    )
    .join('\n');

  return `You are a concise, CFO-level analyst writing a personalized AI spend audit summary.

Context:
- Team size: ${input.teamSize} people
- Primary use case: ${USE_CASE_LABELS[input.useCase]}
- Current total AI spend: $${result.totalCurrentSpend}/month
- Total identified savings: $${result.totalMonthlySavings}/month ($${result.totalAnnualSavings}/year)

Tool breakdown:
${toolsList}

Write a ~100-word paragraph addressed directly to the user ("you"/"your team"). Be specific, use the actual tool names and dollar amounts. Be honest — if some tools are already optimized, say so. End with one concrete next step. Do NOT use bullet points. Do NOT use headers. Write in plain paragraph form.`;
}

function buildFallbackSummary(input: AuditFormInput, result: AuditResult): string {
  const { totalMonthlySavings, totalAnnualSavings, totalCurrentSpend, savingsTier } = result;

  if (savingsTier === 'optimal') {
    return `Your team of ${input.teamSize} is spending $${totalCurrentSpend}/month on AI tools with a solid ${USE_CASE_LABELS[input.useCase]} focus. Based on current plans and seat counts, your stack looks well-optimized — no obvious overspend was identified. That said, AI tool pricing changes frequently. Set a calendar reminder to re-audit every quarter, especially if your team size or primary use cases shift.`;
  }

  const biggestWin = result.recommendations
    .filter((r) => r.recommendedAction !== 'already_optimal')
    .sort((a, b) => b.monthlySavings - a.monthlySavings)[0];

  return `Your team of ${input.teamSize} is currently spending $${totalCurrentSpend}/month on AI tools for ${USE_CASE_LABELS[input.useCase]}. This audit identified $${totalMonthlySavings}/month in savings — $${totalAnnualSavings}/year — without materially reducing capability. ${biggestWin ? `The biggest opportunity is ${biggestWin.toolName}: ${biggestWin.reasoning}` : ''} Review each recommendation below and prioritize by savings impact. The changes are low-risk and most can be made without any engineering changes.`;
}

export async function generateAiSummary(
  input: AuditFormInput,
  result: AuditResult
): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY not set — using fallback summary');
    return buildFallbackSummary(input, result);
  }

  try {
    const response = await client.chat.completions.create({
      model: 'gemini-1.5-pro',
      max_tokens: 250,
      messages: [
        {
          role: 'user',
          content: buildPrompt(input, result),
        },
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      return content.trim();
    }

    return buildFallbackSummary(input, result);
  } catch (error) {
    // Graceful fallback - API outage, rate limit, etc.
    console.error('AI summary generation failed, using fallback:', error);
    return buildFallbackSummary(input, result);
  }
}
