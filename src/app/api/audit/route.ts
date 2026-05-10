import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { runAuditEngine } from '@/lib/audit-engine';
import { generateAiSummary } from '@/lib/ai-summary';
import { query } from '@/lib/db';
import { checkRateLimit, hashIp, validateHoneypot } from '@/lib/rate-limit';
import { nanoid } from 'nanoid';


const ToolInputSchema = z.object({
  toolId: z.enum([
    'cursor', 'github_copilot', 'claude', 'chatgpt',
    'anthropic_api', 'openai_api', 'gemini', 'windsurf',
  ]),
  plan: z.string().min(1),
  monthlySpend: z.number().min(0).max(100000),
  seats: z.number().min(1).max(10000),
});

const AuditRequestSchema = z.object({
  tools: z.array(ToolInputSchema).min(1).max(20),
  teamSize: z.number().min(1).max(100000),
  useCase: z.enum(['coding', 'writing', 'data', 'research', 'mixed']),
  honeypot: z.string().optional(), // must be empty
});

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? req.headers.get('x-real-ip')
    ?? '127.0.0.1';

  const rateCheck = await checkRateLimit(ip, 'audit');
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: 'Too many audits from this IP. Try again in an hour.' },
      { status: 429 }
    );
  }

  // Parse & validate
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = AuditRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { honeypot, ...formInput } = parsed.data;

  // Honeypot check
  if (!validateHoneypot(honeypot)) {
    // Silently accept but don't process (bot detected)
    return NextResponse.json({ shareId: nanoid(10), totalMonthlySavings: 0 });
  }

  // Run audit engine
  const auditResult = runAuditEngine(formInput);

  // Generate AI summary (with fallback) 
  const aiSummary = await generateAiSummary(formInput, auditResult);
  auditResult.aiSummary = aiSummary;

  // Persist to DB 
  const shareId = nanoid(10);
  const ipHash = hashIp(ip);

  try {
    await query(
      `INSERT INTO audits
         (share_id, tools_input, audit_result, ai_summary,
          total_monthly_savings, total_annual_savings,
          use_case, team_size, ip_hash)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        shareId,
        JSON.stringify(formInput),
        JSON.stringify(auditResult),
        aiSummary,
        auditResult.totalMonthlySavings,
        auditResult.totalAnnualSavings,
        formInput.useCase,
        formInput.teamSize,
        ipHash,
      ]
    );
    auditResult.shareId = shareId;
  } catch (dbErr) {
    // Non-fatal: return result without shareId
    console.error('DB insert failed:', dbErr);
  }

  return NextResponse.json({
    ...auditResult,
    shareId,
  });
}
