// src/app/api/leads/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { query, queryOne } from '@/lib/db';
import { sendAuditConfirmationEmail } from '@/lib/email';
import { checkRateLimit, validateHoneypot } from '@/lib/rate-limit';

const LeadSchema = z.object({
  auditShareId: z.string().min(1).max(20),
  email: z.string().email(),
  companyName: z.string().max(100).optional(),
  role: z.string().max(100).optional(),
  teamSize: z.number().min(1).max(100000).optional(),
  honeypot: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? req.headers.get('x-real-ip')
    ?? '127.0.0.1';

  const rateCheck = await checkRateLimit(ip, 'lead');
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = LeadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { auditShareId, email, companyName, role, teamSize, honeypot } = parsed.data;

  if (!validateHoneypot(honeypot)) {
    return NextResponse.json({ success: true }); // silent bot drop
  }

  // Look up the audit
  const audit = await queryOne<{
    id: string;
    total_monthly_savings: string;
    total_annual_savings: string;
  }>(
    'SELECT id, total_monthly_savings, total_annual_savings FROM audits WHERE share_id = $1',
    [auditShareId]
  );

  if (!audit) {
    return NextResponse.json({ error: 'Audit not found' }, { status: 404 });
  }

  const monthlySavings = parseFloat(audit.total_monthly_savings);
  const annualSavings = parseFloat(audit.total_annual_savings);
  const highValue = monthlySavings > 500;

  try {
    // Upsert lead (don't create duplicates for same email + audit)
    const [lead] = await query<{ id: string }>(
      `INSERT INTO leads
         (audit_id, email, company_name, role, team_size, monthly_savings, high_value)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT DO NOTHING
       RETURNING id`,
      [audit.id, email, companyName ?? null, role ?? null, teamSize ?? null, monthlySavings, highValue]
    );

    if (lead) {
      // Mark audit as email-captured
      await query('UPDATE audits SET email_captured = TRUE WHERE id = $1', [audit.id]);

      // Send confirmation email (non-blocking failure)
      sendAuditConfirmationEmail({
        to: email,
        shareId: auditShareId,
        totalMonthlySavings: monthlySavings,
        totalAnnualSavings: annualSavings,
        highValue,
        companyName,
      }).catch((err) => console.error('Email send error (non-fatal):', err));
    }

    return NextResponse.json({
      success: true,
      highValue,
      message: highValue
        ? 'A Credex advisor will reach out within 1–2 business days.'
        : 'Audit report sent to your email.',
    });
  } catch (err) {
    console.error('Lead capture error:', err);
    return NextResponse.json(
      { error: 'Failed to save. Please try again.' },
      { status: 500 }
    );
  }
}